import { useEffect, useState } from 'react';

interface ZodiacCompatibilityProps {
  userSign: string;
  partnerSign: string;
  showDetails?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

// Zodiac data with symbols, elements, and constellation patterns
const ZODIAC_DATA: Record<string, {
  symbol: string;
  element: 'fire' | 'earth' | 'air' | 'water';
  emoji: string;
  dates: string;
  constellation: [number, number][]; // x, y coordinates for stars
  connections: [number, number][]; // which stars connect
}> = {
  aries: {
    symbol: '♈',
    element: 'fire',
    emoji: '🐏',
    dates: 'Mar 21 - Apr 19',
    constellation: [[30, 20], [50, 35], [70, 25], [85, 45]],
    connections: [[0, 1], [1, 2], [2, 3]],
  },
  taurus: {
    symbol: '♉',
    element: 'earth',
    emoji: '🐂',
    dates: 'Apr 20 - May 20',
    constellation: [[20, 40], [35, 25], [50, 30], [65, 20], [80, 35], [50, 50]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]],
  },
  gemini: {
    symbol: '♊',
    element: 'air',
    emoji: '👯',
    dates: 'May 21 - Jun 20',
    constellation: [[25, 20], [25, 50], [25, 80], [75, 20], [75, 50], [75, 80], [50, 50]],
    connections: [[0, 1], [1, 2], [3, 4], [4, 5], [1, 6], [4, 6]],
  },
  cancer: {
    symbol: '♋',
    element: 'water',
    emoji: '🦀',
    dates: 'Jun 21 - Jul 22',
    constellation: [[30, 30], [50, 20], [70, 30], [60, 50], [40, 50], [50, 70]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 5], [5, 4], [4, 0]],
  },
  leo: {
    symbol: '♌',
    element: 'fire',
    emoji: '🦁',
    dates: 'Jul 23 - Aug 22',
    constellation: [[20, 60], [35, 40], [50, 30], [70, 35], [85, 50], [70, 65], [50, 75]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [3, 5], [5, 6], [6, 1]],
  },
  virgo: {
    symbol: '♍',
    element: 'earth',
    emoji: '👼',
    dates: 'Aug 23 - Sep 22',
    constellation: [[20, 30], [40, 20], [60, 25], [80, 40], [70, 60], [50, 70], [30, 60]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
  },
  libra: {
    symbol: '♎',
    element: 'air',
    emoji: '⚖️',
    dates: 'Sep 23 - Oct 22',
    constellation: [[20, 50], [40, 30], [60, 30], [80, 50], [50, 70]],
    connections: [[0, 1], [1, 2], [2, 3], [1, 4], [2, 4]],
  },
  scorpio: {
    symbol: '♏',
    element: 'water',
    emoji: '🦂',
    dates: 'Oct 23 - Nov 21',
    constellation: [[15, 50], [30, 40], [45, 45], [60, 40], [75, 50], [85, 35], [90, 25]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6]],
  },
  sagittarius: {
    symbol: '♐',
    element: 'fire',
    emoji: '🏹',
    dates: 'Nov 22 - Dec 21',
    constellation: [[20, 70], [40, 50], [60, 40], [80, 20], [50, 60], [70, 70]],
    connections: [[0, 1], [1, 2], [2, 3], [1, 4], [4, 5]],
  },
  capricorn: {
    symbol: '♑',
    element: 'earth',
    emoji: '🐐',
    dates: 'Dec 22 - Jan 19',
    constellation: [[20, 30], [40, 25], [60, 35], [75, 55], [60, 75], [40, 70], [25, 55]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 0]],
  },
  aquarius: {
    symbol: '♒',
    element: 'air',
    emoji: '🏺',
    dates: 'Jan 20 - Feb 18',
    constellation: [[15, 35], [35, 25], [55, 35], [75, 25], [85, 40], [30, 60], [50, 70], [70, 60]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [5, 6], [6, 7]],
  },
  pisces: {
    symbol: '♓',
    element: 'water',
    emoji: '🐟',
    dates: 'Feb 19 - Mar 20',
    constellation: [[20, 30], [35, 40], [50, 35], [65, 45], [80, 35], [50, 60], [35, 70], [65, 75]],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5], [5, 6], [5, 7]],
  },
};

// Compatibility matrix (simplified - in reality would be more nuanced)
const COMPATIBILITY: Record<string, Record<string, number>> = {
  aries: { aries: 70, taurus: 55, gemini: 85, cancer: 45, leo: 95, virgo: 50, libra: 75, scorpio: 60, sagittarius: 90, capricorn: 50, aquarius: 80, pisces: 65 },
  taurus: { aries: 55, taurus: 80, gemini: 45, cancer: 90, leo: 60, virgo: 95, libra: 70, scorpio: 85, sagittarius: 40, capricorn: 95, aquarius: 50, pisces: 85 },
  gemini: { aries: 85, taurus: 45, gemini: 75, cancer: 55, leo: 80, virgo: 60, libra: 90, scorpio: 50, sagittarius: 85, capricorn: 45, aquarius: 95, pisces: 55 },
  cancer: { aries: 45, taurus: 90, gemini: 55, cancer: 75, leo: 65, virgo: 80, libra: 50, scorpio: 95, sagittarius: 45, capricorn: 70, aquarius: 55, pisces: 95 },
  leo: { aries: 95, taurus: 60, gemini: 80, cancer: 65, leo: 75, virgo: 55, libra: 85, scorpio: 70, sagittarius: 95, capricorn: 55, aquarius: 70, pisces: 60 },
  virgo: { aries: 50, taurus: 95, gemini: 60, cancer: 80, leo: 55, virgo: 75, libra: 65, scorpio: 85, sagittarius: 50, capricorn: 95, aquarius: 55, pisces: 70 },
  libra: { aries: 75, taurus: 70, gemini: 90, cancer: 50, leo: 85, virgo: 65, libra: 80, scorpio: 70, sagittarius: 80, capricorn: 60, aquarius: 90, pisces: 65 },
  scorpio: { aries: 60, taurus: 85, gemini: 50, cancer: 95, leo: 70, virgo: 85, libra: 70, scorpio: 80, sagittarius: 55, capricorn: 80, aquarius: 60, pisces: 95 },
  sagittarius: { aries: 90, taurus: 40, gemini: 85, cancer: 45, leo: 95, virgo: 50, libra: 80, scorpio: 55, sagittarius: 80, capricorn: 50, aquarius: 85, pisces: 60 },
  capricorn: { aries: 50, taurus: 95, gemini: 45, cancer: 70, leo: 55, virgo: 95, libra: 60, scorpio: 80, sagittarius: 50, capricorn: 80, aquarius: 65, pisces: 75 },
  aquarius: { aries: 80, taurus: 50, gemini: 95, cancer: 55, leo: 70, virgo: 55, libra: 90, scorpio: 60, sagittarius: 85, capricorn: 65, aquarius: 75, pisces: 70 },
  pisces: { aries: 65, taurus: 85, gemini: 55, cancer: 95, leo: 60, virgo: 70, libra: 65, scorpio: 95, sagittarius: 60, capricorn: 75, aquarius: 70, pisces: 80 },
};

const ELEMENT_COLORS = {
  fire: { main: '#FF6B6B', glow: 'rgba(255, 107, 107, 0.5)' },
  earth: { main: '#C9A962', glow: 'rgba(201, 169, 98, 0.5)' },
  air: { main: '#A78BFA', glow: 'rgba(167, 139, 250, 0.5)' },
  water: { main: '#60A5FA', glow: 'rgba(96, 165, 250, 0.5)' },
};

const COMPATIBILITY_DESCRIPTIONS: Record<string, string> = {
  high: "Written in the stars ✨",
  good: "Strong cosmic connection 🌟",
  medium: "Intriguing potential 💫",
  low: "Opposites attract? 🌙",
};

export default function ZodiacCompatibility({
  userSign,
  partnerSign,
  showDetails = true,
  size = 'md',
  animated = true,
}: ZodiacCompatibilityProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [showStars, setShowStars] = useState(false);

  const userSignLower = userSign?.toLowerCase() || 'aries';
  const partnerSignLower = partnerSign?.toLowerCase() || 'leo';

  const userData = ZODIAC_DATA[userSignLower] || ZODIAC_DATA.aries;
  const partnerData = ZODIAC_DATA[partnerSignLower] || ZODIAC_DATA.leo;

  const compatibility = COMPATIBILITY[userSignLower]?.[partnerSignLower] || 50;

  const getDescription = (score: number) => {
    if (score >= 85) return COMPATIBILITY_DESCRIPTIONS.high;
    if (score >= 70) return COMPATIBILITY_DESCRIPTIONS.good;
    if (score >= 55) return COMPATIBILITY_DESCRIPTIONS.medium;
    return COMPATIBILITY_DESCRIPTIONS.low;
  };

  const userColor = ELEMENT_COLORS[userData.element];
  const partnerColor = ELEMENT_COLORS[partnerData.element];

  // Animate score
  useEffect(() => {
    if (!animated) {
      setAnimatedScore(compatibility);
      return;
    }

    setShowStars(true);
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setAnimatedScore(Math.round(compatibility * easeOut));

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [compatibility, animated]);

  const sizeClasses = {
    sm: { container: 'w-64', constellation: 60, text: 'text-sm' },
    md: { container: 'w-80', constellation: 80, text: 'text-base' },
    lg: { container: 'w-96', constellation: 100, text: 'text-lg' },
  };

  const sizeConfig = sizeClasses[size];

  // Render constellation
  const renderConstellation = (
    data: typeof ZODIAC_DATA.aries,
    color: string,
    flipX: boolean = false
  ) => {
    const size = sizeConfig.constellation;
    return (
      <svg width={size} height={size} viewBox="0 0 100 100" className="overflow-visible">
        <defs>
          <filter id={`star-glow-${color}`}>
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connection lines */}
        {data.connections.map(([from, to], i) => {
          const fromStar = data.constellation[from];
          const toStar = data.constellation[to];
          const x1 = flipX ? 100 - fromStar[0] : fromStar[0];
          const x2 = flipX ? 100 - toStar[0] : toStar[0];
          return (
            <line
              key={`line-${i}`}
              x1={x1}
              y1={fromStar[1]}
              x2={x2}
              y2={toStar[1]}
              stroke={color}
              strokeWidth="1"
              opacity="0.4"
              className={animated ? 'animate-pulse' : ''}
              style={{
                animationDelay: `${i * 0.1}s`,
              }}
            />
          );
        })}

        {/* Stars */}
        {data.constellation.map((pos, i) => {
          const x = flipX ? 100 - pos[0] : pos[0];
          return (
            <g key={`star-${i}`}>
              <circle
                cx={x}
                cy={pos[1]}
                r="3"
                fill={color}
                filter={`url(#star-glow-${color})`}
                className={animated ? 'animate-twinkle' : ''}
                style={{
                  animationDelay: `${i * 0.2}s`,
                }}
              />
              {/* Star sparkle */}
              <circle
                cx={x}
                cy={pos[1]}
                r="1.5"
                fill="white"
                opacity="0.8"
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <div
      className={`${sizeConfig.container} rounded-2xl p-6 relative overflow-hidden`}
      style={{
        background: 'linear-gradient(135deg, rgba(13, 15, 18, 0.95) 0%, rgba(26, 29, 35, 0.95) 100%)',
        border: '1px solid rgba(201, 169, 98, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
      }}
    >
      {/* Background stars */}
      {showStars && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.3 + Math.random() * 0.4,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Title */}
      <h3
        className="text-center mb-4 relative z-10"
        style={{
          fontFamily: "'Cinzel', serif",
          fontSize: size === 'lg' ? '1.25rem' : '1rem',
          color: '#C9A962',
          letterSpacing: '0.1em',
        }}
      >
        Cosmic Connection
      </h3>

      {/* Constellations */}
      <div className="flex justify-between items-center mb-4 relative z-10">
        {/* User constellation */}
        <div className="flex flex-col items-center">
          {renderConstellation(userData, userColor.main, false)}
          <div className="mt-2 text-center">
            <span className="text-2xl">{userData.symbol}</span>
            <p
              className="text-xs mt-1 capitalize"
              style={{ color: userColor.main, fontFamily: "'Barlow', sans-serif" }}
            >
              {userSignLower}
            </p>
          </div>
        </div>

        {/* Connection visualization */}
        <div className="flex-1 flex flex-col items-center mx-4">
          {/* Compatibility score */}
          <div
            className="text-4xl font-bold mb-1"
            style={{
              fontFamily: "'Cinzel', serif",
              background: `linear-gradient(135deg, ${userColor.main} 0%, ${partnerColor.main} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: `drop-shadow(0 0 10px ${userColor.glow})`,
            }}
          >
            {animatedScore}%
          </div>

          {/* Connection line with pulse */}
          <div className="w-full h-1 rounded-full overflow-hidden relative">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, ${userColor.main}, ${partnerColor.main})`,
                opacity: 0.3,
              }}
            />
            <div
              className="absolute inset-0 animate-pulse-slow"
              style={{
                background: `linear-gradient(90deg, ${userColor.main}, transparent 50%, ${partnerColor.main})`,
              }}
            />
          </div>

          {/* Elements */}
          <div className="flex items-center gap-2 mt-2 text-xs opacity-60">
            <span style={{ color: userColor.main }}>{userData.element}</span>
            <span className="text-[#6B7280]">×</span>
            <span style={{ color: partnerColor.main }}>{partnerData.element}</span>
          </div>
        </div>

        {/* Partner constellation */}
        <div className="flex flex-col items-center">
          {renderConstellation(partnerData, partnerColor.main, true)}
          <div className="mt-2 text-center">
            <span className="text-2xl">{partnerData.symbol}</span>
            <p
              className="text-xs mt-1 capitalize"
              style={{ color: partnerColor.main, fontFamily: "'Barlow', sans-serif" }}
            >
              {partnerSignLower}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      {showDetails && (
        <div className="text-center relative z-10">
          <p
            className={`${sizeConfig.text} mb-2`}
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: '#E8E4DF',
            }}
          >
            {getDescription(compatibility)}
          </p>
          <p className="text-xs text-[#6B7280]">
            {userData.dates} & {partnerData.dates}
          </p>
        </div>
      )}

      {/* Decorative corner elements */}
      <div
        className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 rounded-tl-lg opacity-30"
        style={{ borderColor: userColor.main }}
      />
      <div
        className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 rounded-br-lg opacity-30"
        style={{ borderColor: partnerColor.main }}
      />

      {/* CSS for animations */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

// Helper to get zodiac sign from date
export function getZodiacSign(date: Date): string {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
  return 'pisces';
}

// Quick badge version for compact display
export function ZodiacBadge({ sign, size = 'md' }: { sign: string; size?: 'sm' | 'md' }) {
  const signLower = sign?.toLowerCase() || 'aries';
  const data = ZODIAC_DATA[signLower] || ZODIAC_DATA.aries;
  const color = ELEMENT_COLORS[data.element];

  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full ${size === 'sm' ? 'text-xs' : 'text-sm'}`}
      style={{
        background: `${color.main}20`,
        border: `1px solid ${color.main}40`,
        color: color.main,
      }}
    >
      <span>{data.symbol}</span>
      <span className="capitalize" style={{ fontFamily: "'Barlow', sans-serif" }}>
        {signLower}
      </span>
    </div>
  );
}
