import React, { useState, useEffect } from 'react';
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
import { Loader2, RefreshCw, Heart, X, MapPin, Wifi, Clock } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import ProfileModal from '@/components/ProfileModal';
import { Badge } from '@/components/ui/badge';

const RouletteMatch = () => {
  const { toast } = useToast();
  const { currentUser, nearbyUsers, refreshNearbyUsers } = useUser();
  const { background } = useAmbient();
  const { 
    coords, 
    isTracking, 
    error: locationError, 
    permissionStatus,
    timeSinceUpdate
  } = useGeolocation({
    updateInterval: 10000, // Update every 10 seconds
    highAccuracy: true
  });
  
  const [isSpinning, setIsSpinning] = useState(false);
  const [matchResult, setMatchResult] = useState<any | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [maxDistance, setMaxDistance] = useState(1); // Default to 1 mile
  const [eligibleCount, setEligibleCount] = useState(0);
  const [criteria, setCriteria] = useState({
    ageRange: { min: 18, max: 50 },
    includeInterests: false,
    onlineOnly: true,
  });
  
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
      // Skip ourselves
      if (currentUser && user.id === currentUser.id) return false;
      
      // Filter by online status if needed
      if (criteria.onlineOnly && !user.isOnline) return false;
      
      // Filter by age range
      if (user.age < criteria.ageRange.min || user.age > criteria.ageRange.max) return false;
      
      // Filter by distance
      if (user.latitude && user.longitude && coords) {
        const distance = calculateDistance(
          coords.latitude, 
          coords.longitude, 
          user.latitude, 
          user.longitude
        );
        // Convert distance to miles (it's in kilometers by default)
        const distanceInMiles = distance * 0.621371;
        return distanceInMiles <= maxDistance;
      }
      
      return false;
    });
    
    // Add distance and last seen information to each user
    return filteredUsers.map(user => {
      let userWithDistance = { ...user };
      
      // Calculate distance
      if (user.latitude && user.longitude && coords) {
        const distance = calculateDistance(
          coords.latitude, 
          coords.longitude, 
          user.latitude, 
          user.longitude
        );
        // Convert distance to miles
        const distanceInMiles = distance * 0.621371;
        userWithDistance.distanceValue = distanceInMiles;
        userWithDistance.distanceText = formatDistance(distance);
      }
      
      // Calculate "last seen" time for location
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
    
    // Simulate spinning effect
    setTimeout(() => {
      // Select a random user from the eligible pool
      const randomUser = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
      setMatchResult(randomUser);
      setIsSpinning(false);
    }, 2000); // 2 seconds of "spinning"
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
    toast({
      title: "Match rejected",
      description: "Spin again to find a new match.",
    });
  };

  return (
    <div 
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: background }}
    >
      <Header />
      
      <div className="flex-1 p-6 pt-10 flex flex-col items-center justify-center pb-20">
        <h1 className="text-4xl mb-8 text-center font-medium">Match Roulette</h1>
        <p className="text-lg mb-12 text-center max-w-lg">
          Spin the roulette to find a random match within your selected distance and criteria
        </p>
        
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Criteria section */}
          <Card className="p-6 col-span-1">
            <h2 className="text-xl mb-4 font-medium">Match Criteria</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-md mb-2">Distance (miles)</h3>
                <Slider 
                  value={[maxDistance]} 
                  onValueChange={(value) => setMaxDistance(value[0])} 
                  max={5} 
                  step={0.1}
                  className="mb-1"
                />
                <p className="text-sm text-gray-500">{maxDistance.toFixed(1)} miles</p>
              </div>
              
              <div>
                <h3 className="text-md mb-2">Age Range</h3>
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
                <p className="text-sm text-gray-500">
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
            </div>
          </Card>
          
          {/* Roulette section */}
          <Card className="p-6 col-span-1 md:col-span-2 flex flex-col items-center justify-between">
            {isSpinning ? (
              <div className="flex flex-col items-center justify-center h-full py-10">
                <Loader2 className="h-24 w-24 animate-spin mb-4" />
                <p className="text-xl">Finding your match...</p>
              </div>
            ) : matchResult ? (
              <div className="flex flex-col items-center w-full">
                <div className="relative w-40 h-40 rounded-full overflow-hidden mb-4 border-4 border-primary">
                  <img 
                    src={matchResult.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
                    alt={matchResult.fullName}
                    className="w-full h-full object-cover"
                  />
                  {matchResult.isOnline && (
                    <div className="absolute bottom-1 right-1 bg-green-500 rounded-full w-6 h-6 border-2 border-white flex items-center justify-center">
                      <Wifi className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>
                
                <h2 className="text-2xl font-medium mb-1">{matchResult.fullName}</h2>
                <p className="text-gray-600 mb-2">{matchResult.age} years • {matchResult.job || 'Not specified'}</p>
                
                {/* Location and distance info */}
                <div className="flex gap-2 mb-4 items-center">
                  <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                    <MapPin className="h-3 w-3" />
                    <span>{matchResult.distanceText || "Nearby"}</span>
                  </Badge>
                  
                  {matchResult.lastSeen && (
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                      <Clock className="h-3 w-3" />
                      <span>Active {matchResult.lastSeen}</span>
                    </Badge>
                  )}
                </div>
                
                <div className="flex gap-4 mt-4">
                  <Button 
                    onClick={handleReject} 
                    variant="outline" 
                    className="rounded-full p-6" 
                    size="icon"
                  >
                    <X className="h-6 w-6" />
                  </Button>
                  <Button 
                    onClick={handleViewProfile} 
                    className="px-6 rounded-xl"
                  >
                    View Profile
                  </Button>
                  <Button 
                    onClick={handleStartVideoChat} 
                    variant="default" 
                    className="rounded-full p-6 bg-primary" 
                    size="icon"
                  >
                    <Heart className="h-6 w-6" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full py-10">
                {locationError ? (
                  <div className="mb-6 p-4 bg-red-50 rounded-lg text-center max-w-sm">
                    <p className="text-red-600 font-medium mb-2">Location Error</p>
                    <p className="text-sm text-red-500">{locationError}</p>
                    <Button 
                      onClick={() => window.location.reload()} 
                      variant="ghost" 
                      className="mt-2 text-xs"
                    >
                      Refresh permissions
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="relative w-32 h-32 rounded-full border-4 border-primary mb-8 flex items-center justify-center">
                      <RefreshCw className="h-12 w-12" />
                    </div>
                    <Button 
                      onClick={spinRoulette} 
                      size="lg" 
                      className="px-8 py-6 text-lg rounded-xl"
                      disabled={!coords || eligibleCount === 0}
                    >
                      Spin to Match
                    </Button>
                    
                    {coords ? (
                      <p className="text-sm mt-4 text-gray-500">
                        {eligibleCount} potential {eligibleCount === 1 ? 'match' : 'matches'} available with your criteria
                      </p>
                    ) : (
                      <p className="text-sm mt-4 text-gray-500">
                        Waiting for location data...
                      </p>
                    )}
                    
                    {isTracking && (
                      <Badge className="mt-2" variant="outline">
                        <MapPin className="h-3 w-3 mr-1" /> 
                        {timeSinceUpdate !== null 
                          ? `Location updated ${timeSinceUpdate}s ago` 
                          : 'Tracking location'}
                      </Badge>
                    )}
                  </>
                )}
              </div>
            )}
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