import { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronUp, ChevronDown, MapPin, Video, Heart, Sparkles, Moon, X, Map, Eye, Wifi } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLocation } from 'wouter';
import TiltCard from './TiltCard';
import CompatibilityRing from './CompatibilityRing';
import MatchCelebration from './MatchCelebration';
import ZodiacCompatibility, { ZodiacBadge } from './ZodiacCompatibility';
import MiniMap from './MiniMap';

interface User {
  id: number;
  fullName: string;
  age: number;
  job?: string;
  bio?: string;
  profileImage?: string;
  isOnline?: boolean;
  zodiacSign?: string;
  distanceText?: string;
  isMatch?: boolean;
  isAvailableNow?: boolean;
  interests?: string[];
}

interface VerticalProfileCardsProps {
  users: User[];
  onStartVideoChat?: (user: User) => void;
  onViewProfile?: (user: User) => void;
  userCoords?: { latitude: number; longitude: number } | null;
}

// Zodiac signs with colors for styling
const ZODIAC_STYLES: Record<string, { color: string; gradient: string; glow: string }> = {
  aries: { color: '#FF6B6B', gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)', glow: 'rgba(255, 107, 107, 0.6)' },
  taurus: { color: '#8B7355', gradient: 'linear-gradient(135deg, #C9A962 0%, #8B7355 100%)', glow: 'rgba(139, 115, 85, 0.6)' },
  gemini: { color: '#FFD93D', gradient: 'linear-gradient(135deg, #FFD93D 0%, #FF8E53 100%)', glow: 'rgba(255, 217, 61, 0.6)' },
  cancer: { color: '#4FACFE', gradient: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)', glow: 'rgba(79, 172, 254, 0.6)' },
  leo: { color: '#FF8E53', gradient: 'linear-gradient(135deg, #FF8E53 0%, #FFD93D 100%)', glow: 'rgba(255, 142, 83, 0.6)' },
  virgo: { color: '#C9A962', gradient: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)', glow: 'rgba(201, 169, 98, 0.6)' },
  libra: { color: '#E0C3FC', gradient: 'linear-gradient(135deg, #E0C3FC 0%, #8EC5FC 100%)', glow: 'rgba(224, 195, 252, 0.6)' },
  scorpio: { color: '#A855F7', gradient: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)', glow: 'rgba(168, 85, 247, 0.6)' },
  sagittarius: { color: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899 0%, #A855F7 100%)', glow: 'rgba(236, 72, 153, 0.6)' },
  capricorn: { color: '#6B7280', gradient: 'linear-gradient(135deg, #6B7280 0%, #9CA3AF 100%)', glow: 'rgba(107, 114, 128, 0.6)' },
  aquarius: { color: '#00F2FE', gradient: 'linear-gradient(135deg, #00F2FE 0%, #4FACFE 100%)', glow: 'rgba(0, 242, 254, 0.6)' },
  pisces: { color: '#8EC5FC', gradient: 'linear-gradient(135deg, #8EC5FC 0%, #E0C3FC 100%)', glow: 'rgba(142, 197, 252, 0.6)' },
};

const ZODIAC_EMOJIS: Record<string, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
  libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

const ZODIAC_NAMES: Record<string, string> = {
  aries: 'Aries', taurus: 'Taurus', gemini: 'Gemini', cancer: 'Cancer', leo: 'Leo', virgo: 'Virgo',
  libra: 'Libra', scorpio: 'Scorpio', sagittarius: 'Sagittarius', capricorn: 'Capricorn', aquarius: 'Aquarius', pisces: 'Pisces',
};

// Generate a "compatibility score" based on user id (would be real algorithm in production)
const getCompatibilityScore = (userId: number) => {
  const seed = userId * 7 + 13;
  return 45 + (seed % 50); // Returns 45-94%
};

// Generate zodiac sign based on user id
const ZODIAC_SIGNS = ['aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo', 'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces'];
const getZodiacForUser = (userId: number) => {
  return ZODIAC_SIGNS[userId % ZODIAC_SIGNS.length];
};

export default function VerticalProfileCards({ users, onStartVideoChat, onViewProfile, userCoords }: VerticalProfileCardsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [showMatchCelebration, setShowMatchCelebration] = useState(false);
  const [showZodiacModal, setShowZodiacModal] = useState(false);
  const [showMiniMap, setShowMiniMap] = useState(false);
  const [flippedCardId, setFlippedCardId] = useState<number | null>(null);
  const [interestsCache, setInterestsCache] = useState<Record<number, string[]>>({});
  const [, setLocation] = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);

  const currentUser = users[currentIndex];
  const userZodiac = currentUser ? getZodiacForUser(currentUser.id) : 'leo';
  const zodiacStyle = ZODIAC_STYLES[userZodiac] || ZODIAC_STYLES.leo;
  const compatibilityScore = currentUser ? getCompatibilityScore(currentUser.id) : 0;
  const isFlipped = flippedCardId === currentUser?.id;

  // Lazy-fetch interests on first flip per user
  const fetchInterests = useCallback(async (userId: number) => {
    if (interestsCache[userId]) return;
    try {
      const res = await fetch(`/api/users/${userId}/interests`);
      if (res.ok) {
        const data = await res.json();
        const interests = Array.isArray(data) ? data.map((i: any) => i.name || i) : [];
        setInterestsCache(prev => ({ ...prev, [userId]: interests }));
      }
    } catch {
      // Silently fail - interests just won't show
    }
  }, [interestsCache]);

  const handleCardFlip = () => {
    if (!currentUser) return;
    if (isFlipped) {
      setFlippedCardId(null);
    } else {
      setFlippedCardId(currentUser.id);
      fetchInterests(currentUser.id);
    }
  };

  const goToNext = () => {
    if (isTransitioning || currentIndex >= users.length - 1) return;
    setFlippedCardId(null);
    setIsTransitioning(true);
    setCurrentIndex(prev => prev + 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const goToPrev = () => {
    if (isTransitioning || currentIndex <= 0) return;
    setFlippedCardId(null);
    setIsTransitioning(true);
    setCurrentIndex(prev => prev - 1);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  // Touch handlers for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null || isFlipped) return;
    const touchEnd = e.changedTouches[0].clientY;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
    setTouchStart(null);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'j') goToNext();
      if (e.key === 'ArrowUp' || e.key === 'k') goToPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isTransitioning]);

  // Mouse wheel
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelTimeout: NodeJS.Timeout;
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      clearTimeout(wheelTimeout);
      wheelTimeout = setTimeout(() => {
        if (e.deltaY > 30) goToNext();
        if (e.deltaY < -30) goToPrev();
      }, 50);
    };

    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [currentIndex, isTransitioning]);

  if (!users.length) {
    return (
      <div className="h-full flex items-center justify-center text-[#9CA3AF]">
        <p>No profiles to show</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative h-full w-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        background: 'linear-gradient(180deg, #0D0F12 0%, #1A1D23 100%)',
      }}
    >
      {/* Animated Zodiac Background */}
      <div
        className="absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse at 50% 40%, ${zodiacStyle.glow} 0%, transparent 60%)`,
          opacity: 0.4,
          animation: 'pulse 3s ease-in-out infinite',
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full opacity-40"
            style={{
              background: zodiacStyle.color,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 2}s`,
            }}
          />
        ))}
      </div>

      {/* Progress indicator */}
      <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
        {users.map((_, idx) => (
          <div
            key={idx}
            className="h-1 flex-1 rounded-full transition-all duration-300"
            style={{
              background: idx === currentIndex
                ? zodiacStyle.gradient
                : idx < currentIndex
                  ? 'rgba(255,255,255,0.5)'
                  : 'rgba(255,255,255,0.2)',
            }}
          />
        ))}
      </div>

      {/* Navigation hints */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-2">
        <button
          onClick={goToPrev}
          disabled={currentIndex === 0}
          className="p-2 rounded-full transition-all disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <ChevronUp className="w-5 h-5 text-white" />
        </button>
        <button
          onClick={goToNext}
          disabled={currentIndex === users.length - 1}
          className="p-2 rounded-full transition-all disabled:opacity-20"
          style={{ background: 'rgba(255,255,255,0.1)' }}
        >
          <ChevronDown className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Main Card — 3D Flip Container */}
      <div
        className={`absolute inset-0 transition-all duration-500 ${
          isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{ perspective: '1000px' }}
      >
        <div
          className="relative w-full h-full transition-transform duration-600"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            transition: 'transform 0.6s ease',
          }}
        >
          {/* ===== CARD FRONT ===== */}
          <div
            className="absolute inset-0 flex flex-col"
            style={{ backfaceVisibility: 'hidden' }}
          >
            {/* Profile Image with Zodiac Glow */}
            <div className="flex-1 relative flex items-center justify-center p-8 pt-16">
              <TiltCard
                className="relative cursor-pointer"
                maxTilt={10}
                scale={1.02}
                glareMaxOpacity={0.2}
                onClick={handleCardFlip}
              >
                {/* Zodiac glow rings */}
                <div
                  className="absolute -inset-4 rounded-full opacity-60 blur-xl"
                  style={{ background: zodiacStyle.gradient }}
                />
                <div
                  className="absolute -inset-2 rounded-full opacity-40 blur-md animate-pulse"
                  style={{ background: zodiacStyle.gradient }}
                />

                {/* Profile image - tap to flip */}
                <div
                  className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    border: `4px solid ${zodiacStyle.color}`,
                    boxShadow: `0 0 60px ${zodiacStyle.glow}, inset 0 0 30px rgba(0,0,0,0.3)`,
                  }}
                  onClick={handleCardFlip}
                >
                  <img
                    src={currentUser?.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'}
                    alt={currentUser?.fullName}
                    className="w-full h-full object-cover"
                  />

                  {/* Online indicator */}
                  {currentUser?.isOnline && (
                    <div
                      className="absolute bottom-4 right-4 w-6 h-6 rounded-full border-3"
                      style={{
                        background: '#22C55E',
                        borderColor: '#0D0F12',
                        boxShadow: '0 0 20px rgba(34, 197, 94, 0.8)',
                      }}
                    />
                  )}
                </div>

                {/* Zodiac sign badge */}
                <div
                  className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-medium flex items-center gap-2 cursor-help"
                  title={ZODIAC_NAMES[userZodiac]}
                  style={{
                    background: 'rgba(0,0,0,0.8)',
                    border: `1px solid ${zodiacStyle.color}`,
                    color: zodiacStyle.color,
                  }}
                >
                  <span>{ZODIAC_EMOJIS[userZodiac]}</span>
                  <span style={{ fontFamily: "'Barlow', sans-serif" }}>{ZODIAC_NAMES[userZodiac]}</span>
                </div>

                {/* Match badge */}
                {currentUser?.isMatch && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5"
                    style={{
                      background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)',
                      color: '#0D0F12',
                      boxShadow: '0 0 20px rgba(201, 169, 98, 0.6)',
                      fontFamily: "'Cinzel', serif",
                      letterSpacing: '0.1em',
                    }}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>MATCH</span>
                  </div>
                )}

                {/* Available Now badge */}
                {currentUser?.isAvailableNow && !currentUser?.isMatch && (
                  <div
                    className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1"
                    style={{
                      background: 'rgba(59, 130, 246, 0.9)',
                      color: '#fff',
                      boxShadow: '0 0 12px rgba(59, 130, 246, 0.5)',
                      fontFamily: "'Barlow', sans-serif",
                    }}
                  >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" strokeWidth="2"/><path strokeWidth="2" d="M12 6v6l4 2"/></svg>
                    <span>Available Now</span>
                  </div>
                )}
              </TiltCard>

              {/* Compatibility Ring - positioned to the side */}
              <div className="absolute right-8 top-1/2 -translate-y-1/2 hidden md:block">
                <CompatibilityRing
                  percentage={compatibilityScore}
                  size={100}
                  strokeWidth={6}
                  animated={!isTransitioning}
                />
              </div>

              {/* Mobile compatibility badge */}
              <div className="absolute top-20 right-4 md:hidden">
                <CompatibilityRing
                  percentage={compatibilityScore}
                  size={70}
                  strokeWidth={5}
                  animated={!isTransitioning}
                />
              </div>
            </div>

            {/* User Info */}
            <div className="p-6 pb-8">
              <div className="text-center mb-6 cursor-pointer" onClick={handleCardFlip}>
                <h2
                  className="text-3xl mb-1 hover:text-[#C9A962] transition-colors"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: '600',
                    color: '#E8E4DF',
                  }}
                >
                  {currentUser?.fullName}, {currentUser?.age}
                </h2>
                <p className="text-[#9CA3AF] mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {currentUser?.job || 'Creative Soul'}
                </p>
                <div className="flex items-center justify-center gap-3 flex-wrap">
                  {currentUser?.distanceText && (
                    <div className="flex items-center gap-2 text-sm text-[#6B7280]">
                      <MapPin className="w-4 h-4" />
                      <span>{currentUser.distanceText}</span>
                    </div>
                  )}
                  <ZodiacBadge sign={userZodiac} size="sm" />
                </div>
              </div>

              {/* Bio */}
              {currentUser?.bio && (
                <p
                  className="text-center text-[#9CA3AF] text-sm mb-6 max-w-md mx-auto line-clamp-2 cursor-pointer"
                  style={{ fontFamily: "'Barlow', sans-serif" }}
                  onClick={handleCardFlip}
                >
                  "{currentUser.bio}"
                </p>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                {/* Map button */}
                {userCoords && (
                  <Button
                    onClick={() => setShowMiniMap(true)}
                    className="w-12 h-12 rounded-full p-0 transition-all hover:scale-110"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '2px solid rgba(255,255,255,0.2)',
                    }}
                  >
                    <Map className="w-5 h-5 text-white" />
                  </Button>
                )}

                <Button
                  onClick={() => onViewProfile?.(currentUser)}
                  className="w-12 h-12 rounded-full p-0 transition-all hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Sparkles className="w-5 h-5 text-white" />
                </Button>

                <Button
                  onClick={() => setShowZodiacModal(true)}
                  className="w-12 h-12 rounded-full p-0 transition-all hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Moon className="w-5 h-5 text-white" />
                </Button>

                <Button
                  onClick={() => setLocation(`/video/${currentUser?.id}`)}
                  className="w-16 h-16 rounded-full p-0 transition-all hover:scale-110"
                  style={{
                    background: zodiacStyle.gradient,
                    boxShadow: `0 4px 30px ${zodiacStyle.glow}`,
                  }}
                >
                  <Video className="w-7 h-7 text-white" />
                </Button>

                <Button
                  onClick={() => {
                    setShowMatchCelebration(true);
                    onStartVideoChat?.(currentUser);
                  }}
                  className="w-12 h-12 rounded-full p-0 transition-all hover:scale-110"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '2px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Heart className="w-5 h-5 text-white" />
                </Button>
              </div>
            </div>
          </div>

          {/* ===== CARD BACK ===== */}
          <div
            className="absolute inset-0 flex flex-col cursor-pointer overflow-y-auto"
            style={{
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            onClick={handleCardFlip}
          >
            <div
              className="flex-1 flex flex-col p-6 pt-16"
              style={{
                background: 'linear-gradient(180deg, #0D0F12 0%, #1A1D23 100%)',
              }}
            >
              {/* Header: Name + Zodiac */}
              <div className="text-center mb-5">
                <h2
                  className="text-2xl mb-1"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: '600',
                    color: '#E8E4DF',
                  }}
                >
                  {currentUser?.fullName}, {currentUser?.age}
                </h2>
                <p className="text-[#9CA3AF] text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
                  {currentUser?.job || 'Creative Soul'}
                </p>
              </div>

              {/* Status row: Online + Distance */}
              <div className="flex items-center justify-center gap-4 mb-5">
                {currentUser?.isOnline && (
                  <div className="flex items-center gap-1.5 text-xs text-green-400">
                    <Wifi className="w-3 h-3" />
                    <span>Online now</span>
                  </div>
                )}
                {currentUser?.distanceText && (
                  <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
                    <MapPin className="w-3 h-3" />
                    <span>{currentUser.distanceText}</span>
                  </div>
                )}
              </div>

              {/* Zodiac + Compatibility */}
              <div
                className="flex items-center justify-center gap-4 mb-5 p-3 rounded-xl mx-auto"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: `1px solid ${zodiacStyle.color}30`,
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg">{ZODIAC_EMOJIS[userZodiac]}</span>
                  <span className="text-sm font-medium" style={{ color: zodiacStyle.color }}>
                    {ZODIAC_NAMES[userZodiac]}
                  </span>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="flex items-center gap-2">
                  <CompatibilityRing percentage={compatibilityScore} size={36} strokeWidth={3} animated={false} />
                  <span className="text-sm text-[#9CA3AF]">{compatibilityScore}% match</span>
                </div>
              </div>

              {/* Full Bio */}
              {currentUser?.bio && (
                <div className="mb-5">
                  <h3
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: zodiacStyle.color, fontFamily: "'Cinzel', serif" }}
                  >
                    About
                  </h3>
                  <p
                    className="text-[#9CA3AF] text-sm leading-relaxed"
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    "{currentUser.bio}"
                  </p>
                </div>
              )}

              {/* Interest Pills */}
              {(interestsCache[currentUser?.id] || currentUser?.interests) && (
                <div className="mb-5">
                  <h3
                    className="text-xs uppercase tracking-widest mb-2"
                    style={{ color: zodiacStyle.color, fontFamily: "'Cinzel', serif" }}
                  >
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(interestsCache[currentUser?.id] || currentUser?.interests || []).map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: `${zodiacStyle.color}18`,
                          border: `1px solid ${zodiacStyle.color}40`,
                          color: zodiacStyle.color,
                          fontFamily: "'Barlow', sans-serif",
                        }}
                      >
                        {interest}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Spacer */}
              <div className="flex-1" />

              {/* View Full Profile Button */}
              <div className="pb-8 pt-4">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setFlippedCardId(null);
                    onViewProfile?.(currentUser);
                  }}
                  className="w-full py-6 rounded-xl text-sm font-semibold tracking-wider uppercase"
                  style={{
                    background: zodiacStyle.gradient,
                    color: '#0D0F12',
                    boxShadow: `0 4px 20px ${zodiacStyle.glow}`,
                    fontFamily: "'Cinzel', serif",
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  View Full Profile
                </Button>

                <p className="text-center text-[#6B7280] text-xs mt-3">
                  Tap anywhere to flip back
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe hint */}
      <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-[#6B7280] text-xs flex items-center gap-2 animate-bounce">
        <ChevronUp className="w-4 h-4" />
        <span>Swipe to explore</span>
      </div>

      {/* Match Celebration */}
      <MatchCelebration
        isActive={showMatchCelebration}
        onComplete={() => setShowMatchCelebration(false)}
        duration={3500}
      />

      {/* Zodiac Compatibility Modal */}
      {showZodiacModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.85)' }}
          onClick={() => setShowZodiacModal(false)}
        >
          <div
            className="relative max-w-lg w-full animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setShowZodiacModal(false)}
              className="absolute -top-12 right-0 p-2 rounded-full transition-all hover:scale-110"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <X className="w-6 h-6 text-white" />
            </button>

            <ZodiacCompatibility
              userSign="leo"
              partnerSign={userZodiac}
              showDetails={true}
              size="lg"
              animated={true}
            />
          </div>
        </div>
      )}

      {/* Mini Map */}
      {showMiniMap && userCoords && (
        <MiniMap
          users={users}
          userCoords={userCoords}
          onClose={() => setShowMiniMap(false)}
          onUserSelect={(user) => {
            const index = users.findIndex(u => u.id === user.id);
            if (index !== -1) {
              setCurrentIndex(index);
              setShowMiniMap(false);
            }
          }}
        />
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) translateX(0); }
          25% { transform: translateY(-20px) translateX(10px); }
          50% { transform: translateY(-10px) translateX(-10px); }
          75% { transform: translateY(-30px) translateX(5px); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}
