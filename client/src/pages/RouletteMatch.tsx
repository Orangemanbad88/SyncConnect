import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useAmbient } from '@/context/AmbientContext';
import { calculateDistance, formatDistance } from '@/lib/mapUtils';
import { useGeolocation } from '@/hooks/useGeolocation';
import { Shuffle, Heart, X, MapPin, Wifi, Clock, Zap, Check } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileModal from '@/components/ProfileModal';
import CompatibilityRing from '@/components/CompatibilityRing';
import { Badge } from '@/components/ui/badge';
import { apiRequest } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';
import { getWsUrl } from '@/lib/capacitor';
import { useLocation } from 'wouter';

type InstantConnectState = 'idle' | 'sending' | 'waiting' | 'accepted' | 'declined' | 'expired';

const RouletteMatch = () => {
  const { toast } = useToast();
  const { currentUser, nearbyUsers, refreshNearbyUsers } = useUser();
  const { background } = useAmbient();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const {
    coords,
    isTracking,
    error: locationError,
    permissionStatus,
    timeSinceUpdate
  } = useGeolocation({
    updateInterval: 10000,
    highAccuracy: true
  });

  const [isSpinning, setIsSpinning] = useState(false);
  const [matchResult, setMatchResult] = useState<any | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [maxDistance, setMaxDistance] = useState(1);
  const [eligibleCount, setEligibleCount] = useState(0);
  const [criteria, setCriteria] = useState({
    ageRange: { min: 18, max: 50 },
    includeInterests: false,
    onlineOnly: true,
  });

  // Instant Connect state
  const [remainingInstantConnects, setRemainingInstantConnects] = useState(5);
  const [instantConnectState, setInstantConnectState] = useState<InstantConnectState>('idle');
  const [currentRoll, setCurrentRoll] = useState<any>(null);

  // Fetch instant connect status on mount
  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await apiRequest('GET', '/api/speed-roll/status');
        const data = await res.json();
        setRemainingInstantConnects(data.rollsRemaining);
      } catch {
        // Ignore - user may not be authenticated yet
      }
    };
    fetchStatus();
  }, []);

  // WebSocket listener for instant connect responses
  useEffect(() => {
    if (!user) return;

    const wsUrl = getWsUrl();
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: 'register', userId: user.id }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      switch (data.type) {
        case 'speed-roll-accepted':
          setInstantConnectState('accepted');
          setTimeout(() => {
            setLocation(`/video/${data.targetUser?.id || currentRoll?.targetUserId}`);
          }, 2000);
          break;
        case 'speed-roll-declined':
          setInstantConnectState('declined');
          break;
        case 'speed-roll-expired':
          setInstantConnectState('expired');
          // Refund the connect
          setRemainingInstantConnects(prev => Math.min(5, prev + 1));
          break;
      }
    };

    return () => ws.close();
  }, [user, currentRoll]);

  // Refresh nearby users when location changes or component mounts
  useEffect(() => {
    if (coords) {
      refreshNearbyUsers();
    }
  }, [coords, refreshNearbyUsers]);

  // Show location permission toast if needed
  useEffect(() => {
    if (permissionStatus === 'denied') {
      toast({
        title: "Location access denied",
        description: "Please enable location services to find nearby matches.",
        variant: "destructive"
      });
    }
  }, [permissionStatus, toast]);

  // Filter and enhance users based on current criteria
  const getEligibleUsers = () => {
    if (!coords) return [];

    const filteredUsers = nearbyUsers.filter(user => {
      if (currentUser && user.id === currentUser.id) return false;
      if (criteria.onlineOnly && !user.isOnline) return false;
      if (user.age < criteria.ageRange.min || user.age > criteria.ageRange.max) return false;

      if (user.latitude && user.longitude && coords) {
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          user.latitude,
          user.longitude
        );
        const distanceInMiles = distance * 0.621371;
        return distanceInMiles <= maxDistance;
      }

      return false;
    });

    return filteredUsers.map(user => {
      let userWithDistance = { ...user };

      if (user.latitude && user.longitude && coords) {
        const distance = calculateDistance(
          coords.latitude,
          coords.longitude,
          user.latitude,
          user.longitude
        );
        const distanceInMiles = distance * 0.621371;
        userWithDistance.distanceValue = distanceInMiles;
        userWithDistance.distanceText = formatDistance(distance);
      }

      if (user.locationTimestamp) {
        const seconds = Math.floor((Date.now() - user.locationTimestamp) / 1000);
        userWithDistance.locationAge = seconds;

        if (seconds < 60) {
          userWithDistance.lastSeen = 'just now';
        } else if (seconds < 3600) {
          userWithDistance.lastSeen = `${Math.floor(seconds / 60)} min ago`;
        } else if (seconds < 86400) {
          userWithDistance.lastSeen = `${Math.floor(seconds / 3600)} hr ago`;
        } else {
          userWithDistance.lastSeen = `${Math.floor(seconds / 86400)} days ago`;
        }
      }

      return userWithDistance;
    });
  };

  // Update eligible count when criteria or nearby users change
  useEffect(() => {
    const count = getEligibleUsers().length;
    setEligibleCount(count);
  }, [criteria, nearbyUsers, maxDistance, coords]);

  const spinRoulette = () => {
    const eligibleUsers = getEligibleUsers();

    if (!eligibleUsers.length) {
      toast({
        title: "No matches found",
        description: "Try adjusting your criteria or increasing the distance range.",
        variant: "destructive"
      });
      return;
    }

    setIsSpinning(true);
    setMatchResult(null);
    setInstantConnectState('idle');

    setTimeout(() => {
      const randomUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
      setMatchResult(randomUser);
      setIsSpinning(false);
    }, 2000);
  };

  const handleViewProfile = () => {
    setShowProfile(true);
  };

  const handleStartVideoChat = () => {
    toast({
      title: "Video chat invitation sent!",
      description: `${matchResult.fullName} will be notified of your request.`,
    });
  };

  const handleReject = () => {
    setMatchResult(null);
    setInstantConnectState('idle');
    toast({
      title: "Match rejected",
      description: "Spin again to find a new match.",
    });
  };

  const handleInstantConnect = async () => {
    if (!matchResult || remainingInstantConnects <= 0) return;

    setInstantConnectState('sending');

    try {
      const res = await apiRequest('POST', '/api/speed-roll', {
        targetUserId: matchResult.id,
      });
      const data = await res.json();

      setCurrentRoll(data.roll);
      setRemainingInstantConnects(data.remainingRolls);
      setInstantConnectState('waiting');
    } catch (error: any) {
      const errorData = error?.message ? { message: error.message } : await error?.json?.().catch(() => ({}));
      if (errorData?.rollsRemaining === 0) {
        setRemainingInstantConnects(0);
        setInstantConnectState('idle');
        toast({
          title: "No instant connects left",
          description: "You've used all 5 instant connects today.",
          variant: "destructive",
        });
      } else {
        setInstantConnectState('idle');
        toast({
          title: "Couldn't connect",
          description: "Something went wrong. Try again!",
          variant: "destructive",
        });
      }
    }
  };

  const resetInstantConnect = () => {
    setInstantConnectState('idle');
    setCurrentRoll(null);
  };

  // Generate a pseudo-random compatibility score from the match
  const getCompatibilityScore = () => {
    if (!matchResult) return 0;
    // Derive a stable score from the user id so it doesn't change on re-render
    const seed = typeof matchResult.id === 'number' ? matchResult.id : 50;
    return 60 + (seed * 7) % 35; // Range: 60-94
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)' }}
    >
      <Header />

      <div className="flex-1 p-6 pt-10 flex flex-col items-center justify-center pb-20">
        <h1
          className="text-4xl mb-2 text-center font-medium uppercase"
          style={{
            fontFamily: "'Cinzel', serif",
            letterSpacing: '0.15em',
            background: 'linear-gradient(to bottom, #C9A962 0%, #D4A574 50%, #C9A962 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 8px rgba(201, 169, 98, 0.5))',
            textShadow: '0 0 30px rgba(201, 169, 98, 0.3)',
          }}
        >
          Roll the Dice
        </h1>
        <p className="text-lg mb-4 text-center max-w-lg text-gray-400">
          Roll to find a match, then connect instantly via video
        </p>

        {/* Instant Connect counter */}
        <div className="flex items-center gap-2 mb-8">
          <Badge
            variant="outline"
            className="flex items-center gap-1.5 px-3 py-1.5 border-yellow-500/30 text-yellow-500"
          >
            <Zap className="h-3.5 w-3.5" fill="currentColor" />
            <span className="text-sm font-medium">{remainingInstantConnects} instant connects left today</span>
          </Badge>
        </div>

        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Criteria section */}
          <Card className="p-6 col-span-1 border-[#C9A962]/15 bg-white/[0.03] backdrop-blur-sm shadow-md">
            <h2
              className="text-xl mb-4 font-medium"
              style={{ fontFamily: "'Cinzel', serif", color: '#C9A962' }}
            >
              Match Criteria
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-md mb-2 text-gray-300">Distance (miles)</h3>
                <Slider
                  value={[maxDistance]}
                  onValueChange={(value) => setMaxDistance(value[0])}
                  max={5}
                  step={0.1}
                  className="mb-1"
                />
                <p className="text-sm text-gray-400">{maxDistance.toFixed(1)} miles</p>
              </div>

              <div>
                <h3 className="text-md mb-2 text-gray-300">Age Range</h3>
                <div className="flex items-center gap-4">
                  <Slider
                    value={[criteria.ageRange.min, criteria.ageRange.max]}
                    onValueChange={(value) => setCriteria({
                      ...criteria,
                      ageRange: { min: value[0], max: value[1] }
                    })}
                    min={18}
                    max={80}
                    step={1}
                    className="mb-1"
                  />
                </div>
                <p className="text-sm text-gray-400">
                  {criteria.ageRange.min} - {criteria.ageRange.max} years
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="online-only"
                  checked={criteria.onlineOnly}
                  onCheckedChange={(checked) => setCriteria({ ...criteria, onlineOnly: checked })}
                />
                <Label htmlFor="online-only">Online users only</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="include-interests"
                  checked={criteria.includeInterests}
                  onCheckedChange={(checked) =>
                    setCriteria({ ...criteria, includeInterests: checked as boolean })
                  }
                />
                <Label htmlFor="include-interests">Prioritize similar interests</Label>
              </div>

              {/* Eligible count badge */}
              <div className="pt-2 border-t border-[#C9A962]/10">
                <p className="text-sm text-gray-400">
                  <span style={{ color: '#C9A962' }} className="font-medium">{eligibleCount}</span>
                  {' '}eligible {eligibleCount === 1 ? 'match' : 'matches'}
                </p>
              </div>
            </div>
          </Card>

          {/* Roulette section */}
          <Card className="p-6 col-span-1 md:col-span-2 flex flex-col items-center justify-between border-[#C9A962]/15 bg-white/[0.03] backdrop-blur-sm shadow-md min-h-[400px]">
            <AnimatePresence mode="wait">
              {isSpinning ? (
                <motion.div
                  key="spinning"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-col items-center justify-center h-full py-10"
                >
                  <div className="relative w-32 h-32 mb-6">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 rounded-full border-4 border-transparent"
                      style={{ borderTopColor: '#C9A962', borderRightColor: 'rgba(201, 169, 98, 0.5)' }}
                    />
                    <div className="absolute inset-4 rounded-full bg-yellow-500/10 flex items-center justify-center">
                      <Shuffle className="w-12 h-12 text-yellow-500 animate-pulse" />
                    </div>
                  </div>
                  <h2
                    className="text-xl font-bold text-white mb-2"
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Finding your match...
                  </h2>
                  <p className="text-gray-400 text-sm">Analyzing compatibility</p>
                </motion.div>
              ) : matchResult ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center w-full"
                >
                  {/* Instant Connect overlay states */}
                  {instantConnectState === 'waiting' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0D0F12]/90 rounded-xl"
                    >
                      <div className="relative w-28 h-28 mb-6">
                        <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-yellow-500/50">
                          <img
                            src={matchResult.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                            alt={matchResult.fullName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute -bottom-2 -right-2">
                          <CompatibilityRing percentage={getCompatibilityScore()} size={50} strokeWidth={4} />
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-white mb-1">{matchResult.fullName}</h2>
                      <div className="flex items-center gap-2 text-gray-400 text-sm mt-4">
                        <Clock className="w-4 h-4 animate-pulse" />
                        <span>Waiting for response...</span>
                      </div>
                    </motion.div>
                  )}

                  {instantConnectState === 'accepted' && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0D0F12]/90 rounded-xl"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.5, repeat: 2 }}
                        className="w-24 h-24 rounded-full bg-green-500/20 flex items-center justify-center mb-6"
                      >
                        <Check className="w-12 h-12 text-green-500" />
                      </motion.div>
                      <h2 className="text-2xl font-bold text-white mb-2">Match Accepted!</h2>
                      <p className="text-gray-400 mb-4">Starting video call...</p>
                    </motion.div>
                  )}

                  {instantConnectState === 'declined' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0D0F12]/90 rounded-xl"
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-700/30 flex items-center justify-center mb-6">
                        <X className="w-10 h-10 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">They weren't ready</h2>
                      <p className="text-gray-400 text-sm mb-6">Don't worry, there are more people out there!</p>
                      <Button
                        onClick={resetInstantConnect}
                        className="px-8 py-6 rounded-full"
                        style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)', color: '#0D0F12' }}
                      >
                        Back to Match
                      </Button>
                    </motion.div>
                  )}

                  {instantConnectState === 'expired' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#0D0F12]/90 rounded-xl"
                    >
                      <div className="w-20 h-20 rounded-full bg-gray-700/30 flex items-center justify-center mb-6">
                        <Clock className="w-10 h-10 text-gray-400" />
                      </div>
                      <h2 className="text-xl font-bold text-white mb-2">No response</h2>
                      <p className="text-gray-400 text-sm mb-2">Connect refunded - try again!</p>
                      <Button
                        onClick={resetInstantConnect}
                        className="px-8 py-6 rounded-full mt-4"
                        style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)', color: '#0D0F12' }}
                      >
                        Back to Match
                      </Button>
                    </motion.div>
                  )}

                  {/* Profile photo with CompatibilityRing */}
                  <div className="relative mb-4">
                    <div
                      className="w-40 h-40 rounded-full overflow-hidden border-4"
                      style={{
                        borderColor: 'rgba(201, 169, 98, 0.5)',
                        boxShadow: '0 0 30px rgba(201, 169, 98, 0.25)'
                      }}
                    >
                      <img
                        src={matchResult.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                        alt={matchResult.fullName}
                        className="w-full h-full object-cover"
                      />
                      {matchResult.isOnline && (
                        <div className="absolute bottom-2 right-2 bg-green-500 rounded-full w-6 h-6 border-2 border-[#0D0F12] flex items-center justify-center">
                          <Wifi className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2">
                      <CompatibilityRing percentage={getCompatibilityScore()} size={50} strokeWidth={4} />
                    </div>
                  </div>

                  <h2 className="text-2xl font-medium mb-1 text-white">{matchResult.fullName}</h2>
                  <p className="text-gray-400 mb-2">{matchResult.age} years • {matchResult.job || 'Not specified'}</p>

                  {/* Location and distance info */}
                  <div className="flex gap-2 mb-4 items-center">
                    <Badge
                      variant="outline"
                      className="flex items-center gap-1 px-2 py-1 border-[#C9A962]/20 text-gray-300"
                    >
                      <MapPin className="h-3 w-3" style={{ color: '#C9A962' }} />
                      <span>{matchResult.distanceText || "Nearby"}</span>
                    </Badge>

                    {matchResult.lastSeen && (
                      <Badge
                        variant="outline"
                        className="flex items-center gap-1 px-2 py-1 border-[#C9A962]/20 text-gray-300"
                      >
                        <Clock className="h-3 w-3" style={{ color: '#C9A962' }} />
                        <span>Active {matchResult.lastSeen}</span>
                      </Badge>
                    )}
                  </div>

                  <div className="flex gap-4 mt-4">
                    {/* Reject button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleReject}
                      className="rounded-full w-14 h-14 flex items-center justify-center border border-gray-600 text-gray-400 hover:border-gray-400 transition-colors"
                    >
                      <X className="h-6 w-6" />
                    </motion.button>

                    {/* View Profile button */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleViewProfile}
                      className="px-6 rounded-xl text-[#0D0F12] font-medium flex items-center"
                      style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)' }}
                    >
                      View Profile
                    </motion.button>

                    {/* Instant Connect button */}
                    <motion.button
                      whileHover={{ scale: remainingInstantConnects > 0 ? 1.1 : 1 }}
                      whileTap={{ scale: remainingInstantConnects > 0 ? 0.9 : 1 }}
                      onClick={handleInstantConnect}
                      disabled={remainingInstantConnects <= 0 || instantConnectState !== 'idle'}
                      className="rounded-full w-14 h-14 flex items-center justify-center relative disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: remainingInstantConnects > 0
                          ? 'linear-gradient(135deg, #eab308 0%, #f59e0b 100%)'
                          : 'rgba(75, 85, 99, 0.3)',
                        boxShadow: remainingInstantConnects > 0
                          ? '0 0 20px rgba(234, 179, 8, 0.3)'
                          : 'none',
                      }}
                    >
                      <Zap className="h-6 w-6 text-[#0D0F12]" fill="currentColor" />
                      {/* Charge count badge */}
                      <span
                        className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                        style={{
                          background: remainingInstantConnects > 0 ? '#C9A962' : '#4B5563',
                          color: '#0D0F12',
                        }}
                      >
                        {remainingInstantConnects}
                      </span>
                    </motion.button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="flex flex-col items-center justify-center h-full py-10"
                >
                  {locationError ? (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-center max-w-sm">
                      <p className="text-red-400 font-medium mb-2">Location Error</p>
                      <p className="text-sm text-red-400/70">{locationError}</p>
                      <Button
                        onClick={() => window.location.reload()}
                        variant="ghost"
                        className="mt-2 text-xs text-gray-400"
                      >
                        Refresh permissions
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Glowing spin button */}
                      <motion.button
                        onClick={spinRoulette}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        disabled={!coords || eligibleCount === 0}
                        className="w-40 h-40 rounded-full flex items-center justify-center relative mb-8 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                          background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)',
                          boxShadow: '0 0 60px rgba(201, 169, 98, 0.3)',
                        }}
                      >
                        <div className="absolute inset-2 rounded-full bg-[#0D0F12] flex items-center justify-center">
                          <Shuffle className="w-16 h-16 text-yellow-500" />
                        </div>
                      </motion.button>

                      <p
                        className="text-lg font-medium text-white mb-2"
                        style={{ fontFamily: "'Cinzel', serif" }}
                      >
                        Spin to Match
                      </p>

                      {coords ? (
                        <p className="text-sm text-gray-400">
                          {eligibleCount} potential {eligibleCount === 1 ? 'match' : 'matches'} available
                        </p>
                      ) : (
                        <p className="text-sm text-gray-400">
                          Waiting for location data...
                        </p>
                      )}

                      {isTracking && (
                        <Badge
                          className="mt-3 border-[#C9A962]/20 text-gray-400"
                          variant="outline"
                        >
                          <MapPin className="h-3 w-3 mr-1" style={{ color: '#C9A962' }} />
                          {timeSinceUpdate !== null
                            ? `Location updated ${timeSinceUpdate}s ago`
                            : 'Tracking location'}
                        </Badge>
                      )}
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </div>

        {/* Profile Modal */}
        {showProfile && matchResult && (
          <ProfileModal
            user={matchResult}
            onClose={() => setShowProfile(false)}
            onStartVideoChat={handleStartVideoChat}
          />
        )}
      </div>

      <BottomNavigation />
    </div>
  );
};

export default RouletteMatch;
