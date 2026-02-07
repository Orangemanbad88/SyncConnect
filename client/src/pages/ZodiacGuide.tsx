import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Users, Briefcase, Sparkles, ChevronRight, Star } from 'lucide-react';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

// Zodiac sign data with descriptions
const ZODIAC_SIGNS = [
  {
    id: 'aries',
    name: 'Aries',
    symbol: '♈',
    dates: 'Mar 21 - Apr 19',
    element: 'Fire',
    ruling: 'Mars',
    quality: 'Cardinal',
    color: '#FF6B6B',
    traits: ['Bold', 'Ambitious', 'Energetic', 'Confident'],
    description: 'Natural-born leaders who dive headfirst into challenges. Aries brings passion and courage to everything they do, with an infectious enthusiasm that inspires others.',
    loveStyle: 'Direct and passionate. They pursue who they want with fierce determination and love the thrill of the chase.',
    friendStyle: 'Loyal ride-or-die friends who will defend you fiercely. They bring excitement and spontaneity to friendships.',
  },
  {
    id: 'taurus',
    name: 'Taurus',
    symbol: '♉',
    dates: 'Apr 20 - May 20',
    element: 'Earth',
    ruling: 'Venus',
    quality: 'Fixed',
    color: '#8B7355',
    traits: ['Reliable', 'Patient', 'Sensual', 'Devoted'],
    description: 'Grounded and dependable souls who appreciate life\'s finer pleasures. Taurus builds lasting foundations with patience and unwavering determination.',
    loveStyle: 'Slow and steady wins their heart. They show love through acts of service, physical affection, and creating a beautiful home.',
    friendStyle: 'The friend who remembers your favorite things. Loyal, consistent, and always there with practical support.',
  },
  {
    id: 'gemini',
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - Jun 20',
    element: 'Air',
    ruling: 'Mercury',
    quality: 'Mutable',
    color: '#FFD93D',
    traits: ['Curious', 'Adaptable', 'Witty', 'Expressive'],
    description: 'Quick-minded communicators who thrive on variety and intellectual stimulation. Gemini brings lightness and endless conversation to any situation.',
    loveStyle: 'Mental connection is everything. They need a partner who can match their wit and keep them intellectually engaged.',
    friendStyle: 'The social butterfly who knows everyone. Great at keeping conversations lively and connecting different friend groups.',
  },
  {
    id: 'cancer',
    name: 'Cancer',
    symbol: '♋',
    dates: 'Jun 21 - Jul 22',
    element: 'Water',
    ruling: 'Moon',
    quality: 'Cardinal',
    color: '#4FACFE',
    traits: ['Nurturing', 'Intuitive', 'Protective', 'Emotional'],
    description: 'Deeply empathetic souls with powerful intuition. Cancer creates emotional safety and nurtures those they love with fierce devotion.',
    loveStyle: 'Seeks deep emotional bonds. They love through nurturing, remembering small details, and creating a cozy sanctuary together.',
    friendStyle: 'The friend who becomes family. Always checking in, remembering important dates, and offering a shoulder to cry on.',
  },
  {
    id: 'leo',
    name: 'Leo',
    symbol: '♌',
    dates: 'Jul 23 - Aug 22',
    element: 'Fire',
    ruling: 'Sun',
    quality: 'Fixed',
    color: '#FF8E53',
    traits: ['Charismatic', 'Generous', 'Creative', 'Warm'],
    description: 'Radiant personalities who light up every room. Leo leads with heart, bringing warmth, creativity, and generous spirit wherever they go.',
    loveStyle: 'Grand romantic gestures and unwavering loyalty. They want to be adored but give that same devoted energy back tenfold.',
    friendStyle: 'The hype person everyone needs. Generous with compliments, always planning fun activities, fiercely protective.',
  },
  {
    id: 'virgo',
    name: 'Virgo',
    symbol: '♍',
    dates: 'Aug 23 - Sep 22',
    element: 'Earth',
    ruling: 'Mercury',
    quality: 'Mutable',
    color: '#C9A962',
    traits: ['Analytical', 'Helpful', 'Detail-oriented', 'Practical'],
    description: 'Thoughtful perfectionists who show love through acts of service. Virgo notices what others miss and works tirelessly to improve everything they touch.',
    loveStyle: 'Shows love through helping and improving your life. They pay attention to your needs before you even voice them.',
    friendStyle: 'The friend with the best advice. Always there to help you organize, plan, or solve problems practically.',
  },
  {
    id: 'libra',
    name: 'Libra',
    symbol: '♎',
    dates: 'Sep 23 - Oct 22',
    element: 'Air',
    ruling: 'Venus',
    quality: 'Cardinal',
    color: '#E0C3FC',
    traits: ['Diplomatic', 'Harmonious', 'Charming', 'Fair'],
    description: 'Natural peacemakers with an eye for beauty. Libra seeks balance in all things and creates harmony in relationships and environments.',
    loveStyle: 'Partnership-oriented romantics. They thrive in committed relationships and work hard to maintain peace and fairness.',
    friendStyle: 'The mediator and connector. Great at seeing all sides, introducing friends, and keeping group harmony.',
  },
  {
    id: 'scorpio',
    name: 'Scorpio',
    symbol: '♏',
    dates: 'Oct 23 - Nov 21',
    element: 'Water',
    ruling: 'Pluto',
    quality: 'Fixed',
    color: '#A855F7',
    traits: ['Intense', 'Passionate', 'Perceptive', 'Transformative'],
    description: 'Magnetic souls who dive deep into life\'s mysteries. Scorpio brings intensity, loyalty, and transformative power to everything they touch.',
    loveStyle: 'All or nothing intensity. They want soul-deep connection and will be fiercely loyal once trust is established.',
    friendStyle: 'The vault who keeps your secrets. Incredibly loyal, perceptive about your feelings, and always honest.',
  },
  {
    id: 'sagittarius',
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'Nov 22 - Dec 21',
    element: 'Fire',
    ruling: 'Jupiter',
    quality: 'Mutable',
    color: '#EC4899',
    traits: ['Adventurous', 'Optimistic', 'Philosophical', 'Free-spirited'],
    description: 'Eternal optimists and seekers of truth. Sagittarius expands horizons through adventure, humor, and philosophical exploration.',
    loveStyle: 'Needs freedom within partnership. They show love through shared adventures, humor, and honest communication.',
    friendStyle: 'The friend who plans the spontaneous trip. Always up for adventure, great at lifting spirits with humor.',
  },
  {
    id: 'capricorn',
    name: 'Capricorn',
    symbol: '♑',
    dates: 'Dec 22 - Jan 19',
    element: 'Earth',
    ruling: 'Saturn',
    quality: 'Cardinal',
    color: '#6B7280',
    traits: ['Ambitious', 'Disciplined', 'Responsible', 'Strategic'],
    description: 'Determined climbers who build empires with patience. Capricorn achieves through discipline, strategy, and unwavering commitment to their goals.',
    loveStyle: 'Takes relationships seriously as investments. They show love through providing, planning futures, and steady commitment.',
    friendStyle: 'The reliable friend with great advice. Will help you build your career and hold you accountable to your goals.',
  },
  {
    id: 'aquarius',
    name: 'Aquarius',
    symbol: '♒',
    dates: 'Jan 20 - Feb 18',
    element: 'Air',
    ruling: 'Uranus',
    quality: 'Fixed',
    color: '#00F2FE',
    traits: ['Innovative', 'Independent', 'Humanitarian', 'Original'],
    description: 'Visionary thinkers who march to their own beat. Aquarius brings progressive ideas and genuine care for humanity\'s future.',
    loveStyle: 'Needs intellectual connection and independence. They love through friendship first, then deep mental bonding.',
    friendStyle: 'The friend with unique perspectives. Great at accepting you as you are and introducing you to new ideas.',
  },
  {
    id: 'pisces',
    name: 'Pisces',
    symbol: '♓',
    dates: 'Feb 19 - Mar 20',
    element: 'Water',
    ruling: 'Neptune',
    quality: 'Mutable',
    color: '#8EC5FC',
    traits: ['Intuitive', 'Compassionate', 'Artistic', 'Dreamy'],
    description: 'Deeply empathic dreamers who feel everything. Pisces brings creativity, spiritual depth, and unconditional compassion to the world.',
    loveStyle: 'Romantic idealists who love deeply. They create magical, almost telepathic connections with partners.',
    friendStyle: 'The empath who truly gets you. Always there to listen without judgment and offer creative perspectives.',
  },
];

// Compatibility data - scores from 1-5 for different types
const COMPATIBILITY: Record<string, Record<string, { love: number; friendship: number; work: number }>> = {
  aries: {
    aries: { love: 3, friendship: 4, work: 3 },
    taurus: { love: 2, friendship: 3, work: 3 },
    gemini: { love: 4, friendship: 5, work: 4 },
    cancer: { love: 2, friendship: 3, work: 2 },
    leo: { love: 5, friendship: 5, work: 4 },
    virgo: { love: 2, friendship: 3, work: 4 },
    libra: { love: 4, friendship: 4, work: 3 },
    scorpio: { love: 3, friendship: 3, work: 3 },
    sagittarius: { love: 5, friendship: 5, work: 5 },
    capricorn: { love: 2, friendship: 3, work: 4 },
    aquarius: { love: 4, friendship: 5, work: 4 },
    pisces: { love: 3, friendship: 3, work: 2 },
  },
  taurus: {
    aries: { love: 2, friendship: 3, work: 3 },
    taurus: { love: 4, friendship: 4, work: 4 },
    gemini: { love: 2, friendship: 3, work: 3 },
    cancer: { love: 5, friendship: 5, work: 4 },
    leo: { love: 3, friendship: 3, work: 3 },
    virgo: { love: 5, friendship: 5, work: 5 },
    libra: { love: 3, friendship: 4, work: 3 },
    scorpio: { love: 4, friendship: 4, work: 4 },
    sagittarius: { love: 2, friendship: 3, work: 2 },
    capricorn: { love: 5, friendship: 5, work: 5 },
    aquarius: { love: 2, friendship: 3, work: 3 },
    pisces: { love: 5, friendship: 4, work: 4 },
  },
  gemini: {
    aries: { love: 4, friendship: 5, work: 4 },
    taurus: { love: 2, friendship: 3, work: 3 },
    gemini: { love: 4, friendship: 5, work: 4 },
    cancer: { love: 2, friendship: 3, work: 3 },
    leo: { love: 4, friendship: 5, work: 4 },
    virgo: { love: 3, friendship: 4, work: 4 },
    libra: { love: 5, friendship: 5, work: 5 },
    scorpio: { love: 2, friendship: 3, work: 3 },
    sagittarius: { love: 4, friendship: 5, work: 4 },
    capricorn: { love: 2, friendship: 3, work: 4 },
    aquarius: { love: 5, friendship: 5, work: 5 },
    pisces: { love: 3, friendship: 3, work: 3 },
  },
  cancer: {
    aries: { love: 2, friendship: 3, work: 2 },
    taurus: { love: 5, friendship: 5, work: 4 },
    gemini: { love: 2, friendship: 3, work: 3 },
    cancer: { love: 4, friendship: 5, work: 4 },
    leo: { love: 3, friendship: 4, work: 3 },
    virgo: { love: 5, friendship: 5, work: 5 },
    libra: { love: 3, friendship: 3, work: 3 },
    scorpio: { love: 5, friendship: 5, work: 5 },
    sagittarius: { love: 2, friendship: 3, work: 2 },
    capricorn: { love: 4, friendship: 4, work: 4 },
    aquarius: { love: 2, friendship: 3, work: 3 },
    pisces: { love: 5, friendship: 5, work: 5 },
  },
  leo: {
    aries: { love: 5, friendship: 5, work: 4 },
    taurus: { love: 3, friendship: 3, work: 3 },
    gemini: { love: 4, friendship: 5, work: 4 },
    cancer: { love: 3, friendship: 4, work: 3 },
    leo: { love: 3, friendship: 4, work: 3 },
    virgo: { love: 2, friendship: 3, work: 4 },
    libra: { love: 4, friendship: 5, work: 4 },
    scorpio: { love: 3, friendship: 3, work: 3 },
    sagittarius: { love: 5, friendship: 5, work: 5 },
    capricorn: { love: 2, friendship: 3, work: 4 },
    aquarius: { love: 3, friendship: 4, work: 4 },
    pisces: { love: 3, friendship: 4, work: 3 },
  },
  virgo: {
    aries: { love: 2, friendship: 3, work: 4 },
    taurus: { love: 5, friendship: 5, work: 5 },
    gemini: { love: 3, friendship: 4, work: 4 },
    cancer: { love: 5, friendship: 5, work: 5 },
    leo: { love: 2, friendship: 3, work: 4 },
    virgo: { love: 4, friendship: 4, work: 5 },
    libra: { love: 3, friendship: 4, work: 4 },
    scorpio: { love: 5, friendship: 5, work: 5 },
    sagittarius: { love: 2, friendship: 3, work: 3 },
    capricorn: { love: 5, friendship: 5, work: 5 },
    aquarius: { love: 2, friendship: 3, work: 4 },
    pisces: { love: 4, friendship: 4, work: 4 },
  },
  libra: {
    aries: { love: 4, friendship: 4, work: 3 },
    taurus: { love: 3, friendship: 4, work: 3 },
    gemini: { love: 5, friendship: 5, work: 5 },
    cancer: { love: 3, friendship: 3, work: 3 },
    leo: { love: 4, friendship: 5, work: 4 },
    virgo: { love: 3, friendship: 4, work: 4 },
    libra: { love: 4, friendship: 5, work: 4 },
    scorpio: { love: 3, friendship: 3, work: 3 },
    sagittarius: { love: 4, friendship: 5, work: 4 },
    capricorn: { love: 3, friendship: 3, work: 4 },
    aquarius: { love: 5, friendship: 5, work: 5 },
    pisces: { love: 3, friendship: 4, work: 3 },
  },
  scorpio: {
    aries: { love: 3, friendship: 3, work: 3 },
    taurus: { love: 4, friendship: 4, work: 4 },
    gemini: { love: 2, friendship: 3, work: 3 },
    cancer: { love: 5, friendship: 5, work: 5 },
    leo: { love: 3, friendship: 3, work: 3 },
    virgo: { love: 5, friendship: 5, work: 5 },
    libra: { love: 3, friendship: 3, work: 3 },
    scorpio: { love: 4, friendship: 4, work: 4 },
    sagittarius: { love: 3, friendship: 4, work: 3 },
    capricorn: { love: 5, friendship: 5, work: 5 },
    aquarius: { love: 2, friendship: 3, work: 3 },
    pisces: { love: 5, friendship: 5, work: 5 },
  },
  sagittarius: {
    aries: { love: 5, friendship: 5, work: 5 },
    taurus: { love: 2, friendship: 3, work: 2 },
    gemini: { love: 4, friendship: 5, work: 4 },
    cancer: { love: 2, friendship: 3, work: 2 },
    leo: { love: 5, friendship: 5, work: 5 },
    virgo: { love: 2, friendship: 3, work: 3 },
    libra: { love: 4, friendship: 5, work: 4 },
    scorpio: { love: 3, friendship: 4, work: 3 },
    sagittarius: { love: 4, friendship: 5, work: 4 },
    capricorn: { love: 2, friendship: 3, work: 3 },
    aquarius: { love: 5, friendship: 5, work: 5 },
    pisces: { love: 3, friendship: 4, work: 3 },
  },
  capricorn: {
    aries: { love: 2, friendship: 3, work: 4 },
    taurus: { love: 5, friendship: 5, work: 5 },
    gemini: { love: 2, friendship: 3, work: 4 },
    cancer: { love: 4, friendship: 4, work: 4 },
    leo: { love: 2, friendship: 3, work: 4 },
    virgo: { love: 5, friendship: 5, work: 5 },
    libra: { love: 3, friendship: 3, work: 4 },
    scorpio: { love: 5, friendship: 5, work: 5 },
    sagittarius: { love: 2, friendship: 3, work: 3 },
    capricorn: { love: 4, friendship: 4, work: 5 },
    aquarius: { love: 3, friendship: 4, work: 4 },
    pisces: { love: 4, friendship: 4, work: 4 },
  },
  aquarius: {
    aries: { love: 4, friendship: 5, work: 4 },
    taurus: { love: 2, friendship: 3, work: 3 },
    gemini: { love: 5, friendship: 5, work: 5 },
    cancer: { love: 2, friendship: 3, work: 3 },
    leo: { love: 3, friendship: 4, work: 4 },
    virgo: { love: 2, friendship: 3, work: 4 },
    libra: { love: 5, friendship: 5, work: 5 },
    scorpio: { love: 2, friendship: 3, work: 3 },
    sagittarius: { love: 5, friendship: 5, work: 5 },
    capricorn: { love: 3, friendship: 4, work: 4 },
    aquarius: { love: 4, friendship: 5, work: 4 },
    pisces: { love: 3, friendship: 4, work: 3 },
  },
  pisces: {
    aries: { love: 3, friendship: 3, work: 2 },
    taurus: { love: 5, friendship: 4, work: 4 },
    gemini: { love: 3, friendship: 3, work: 3 },
    cancer: { love: 5, friendship: 5, work: 5 },
    leo: { love: 3, friendship: 4, work: 3 },
    virgo: { love: 4, friendship: 4, work: 4 },
    libra: { love: 3, friendship: 4, work: 3 },
    scorpio: { love: 5, friendship: 5, work: 5 },
    sagittarius: { love: 3, friendship: 4, work: 3 },
    capricorn: { love: 4, friendship: 4, work: 4 },
    aquarius: { love: 3, friendship: 4, work: 3 },
    pisces: { love: 4, friendship: 5, work: 4 },
  },
};

const COMPATIBILITY_TYPES = [
  { id: 'love', label: 'Love', icon: Heart, color: '#FF6B6B' },
  { id: 'friendship', label: 'Friendship', icon: Users, color: '#4FACFE' },
  { id: 'work', label: 'Work', icon: Briefcase, color: '#C9A962' },
];

const ELEMENT_STYLES: Record<string, { bg: string; border: string }> = {
  Fire: { bg: 'rgba(255, 107, 107, 0.1)', border: 'rgba(255, 107, 107, 0.3)' },
  Earth: { bg: 'rgba(139, 115, 85, 0.1)', border: 'rgba(139, 115, 85, 0.3)' },
  Air: { bg: 'rgba(79, 172, 254, 0.1)', border: 'rgba(79, 172, 254, 0.3)' },
  Water: { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.3)' },
};

export default function ZodiacGuide() {
  const [selectedSign, setSelectedSign] = useState<typeof ZODIAC_SIGNS[0] | null>(null);
  const [compareSign, setCompareSign] = useState<typeof ZODIAC_SIGNS[0] | null>(null);
  const [activeType, setActiveType] = useState<'love' | 'friendship' | 'work'>('love');
  const [showScrollHint, setShowScrollHint] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const comparisonResultRef = useRef<HTMLDivElement>(null);

  // Hide scroll hint after user scrolls
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => {
      if (el.scrollLeft > 20) setShowScrollHint(false);
    };
    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll to comparison result when a compare sign is selected
  useEffect(() => {
    if (compareSign && comparisonResultRef.current) {
      comparisonResultRef.current.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [compareSign]);

  const getCompatibility = (sign1: string, sign2: string, type: 'love' | 'friendship' | 'work') => {
    return COMPATIBILITY[sign1]?.[sign2]?.[type] || 0;
  };

  const getCompatibilityLabel = (score: number) => {
    if (score >= 5) return 'Soulmates';
    if (score >= 4) return 'Excellent';
    if (score >= 3) return 'Good';
    if (score >= 2) return 'Challenging';
    return 'Difficult';
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 5) return '#22C55E';
    if (score >= 4) return '#C9A962';
    if (score >= 3) return '#4FACFE';
    if (score >= 2) return '#FF8E53';
    return '#FF6B6B';
  };

  // Get top 3 most compatible signs for the selected sign in the active type
  const getTopMatches = (signId: string, type: 'love' | 'friendship' | 'work') => {
    return ZODIAC_SIGNS
      .filter(s => s.id !== signId)
      .map(s => ({
        sign: s,
        score: getCompatibility(signId, s.id, type),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  };

  // Render score as filled/empty stars for better readability
  const ScoreStars = ({ score, color, size = 'sm' }: { score: number; color: string; size?: 'sm' | 'md' }) => {
    const starSize = size === 'md' ? 'w-3.5 h-3.5' : 'w-2.5 h-2.5';
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <Star
            key={i}
            className={starSize}
            style={{ color: i <= score ? color : 'rgba(255,255,255,0.15)' }}
            fill={i <= score ? color : 'none'}
          />
        ))}
      </div>
    );
  };

  return (
    <div
      className="min-h-screen flex flex-col pb-20"
      style={{ background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)' }}
    >
      <Header />

      <div className="flex-1 overflow-y-auto px-4 py-6">
        {/* Title */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl mb-2"
            style={{ fontFamily: "'Cinzel', serif", color: '#C9A962' }}
          >
            Zodiac Guide
          </h1>
          <p className="text-white/50 text-sm">Explore signs & compatibility</p>
        </div>

        {/* Sign Selector - Horizontal Scroll with hint */}
        <div className="mb-6 relative">
          <div
            ref={scrollRef}
            className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
          >
            {ZODIAC_SIGNS.map((sign) => (
              <motion.button
                key={sign.id}
                onClick={() => {
                  setSelectedSign(sign);
                  setCompareSign(null);
                }}
                whileTap={{ scale: 0.95 }}
                className={`flex-shrink-0 flex flex-col items-center p-3 rounded-2xl transition-all ${
                  selectedSign?.id === sign.id ? 'ring-2' : ''
                }`}
                style={{
                  background: selectedSign?.id === sign.id
                    ? `linear-gradient(135deg, ${sign.color}30 0%, ${sign.color}10 100%)`
                    : 'rgba(255,255,255,0.05)',
                  borderColor: sign.color,
                  ['--tw-ring-color' as string]: sign.color,
                  minWidth: '72px',
                }}
              >
                <span className="text-2xl mb-1">{sign.symbol}</span>
                <span
                  className="text-[11px] font-medium"
                  style={{ color: selectedSign?.id === sign.id ? sign.color : 'rgba(255,255,255,0.6)' }}
                >
                  {sign.name}
                </span>
              </motion.button>
            ))}
          </div>

          {/* Scroll fade hint */}
          {showScrollHint && (
            <div className="absolute right-0 top-0 bottom-3 w-12 pointer-events-none flex items-center justify-end"
              style={{ background: 'linear-gradient(to right, transparent, #0D0F12)' }}
            >
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ChevronRight className="w-5 h-5 text-white/40" />
              </motion.div>
            </div>
          )}
        </div>

        {/* Selected Sign Details */}
        <AnimatePresence mode="wait">
          {selectedSign && (
            <motion.div
              key={selectedSign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              {/* Sign Card */}
              <div
                className="p-5 rounded-2xl"
                style={{
                  background: ELEMENT_STYLES[selectedSign.element].bg,
                  border: `1px solid ${ELEMENT_STYLES[selectedSign.element].border}`,
                }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
                    style={{ background: `${selectedSign.color}20`, border: `1px solid ${selectedSign.color}40` }}
                  >
                    {selectedSign.symbol}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl text-white font-semibold" style={{ fontFamily: "'Cinzel', serif" }}>
                      {selectedSign.name}
                    </h2>
                    <p className="text-white/50 text-sm">{selectedSign.dates}</p>
                    <div className="flex gap-2 mt-2 flex-wrap">
                      <span
                        className="px-2 py-0.5 rounded-full text-xs"
                        style={{ background: `${selectedSign.color}30`, color: selectedSign.color }}
                      >
                        {selectedSign.element}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                        {selectedSign.quality}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/60">
                        ☿ {selectedSign.ruling}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Traits */}
                <div className="flex gap-2 mb-4 flex-wrap">
                  {selectedSign.traits.map((trait) => (
                    <span
                      key={trait}
                      className="px-3 py-1 rounded-full text-xs"
                      style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)' }}
                    >
                      {trait}
                    </span>
                  ))}
                </div>

                {/* Description */}
                <p className="text-white/70 text-sm leading-relaxed mb-4">
                  {selectedSign.description}
                </p>

                {/* Love & Friend Style */}
                <div className="space-y-3">
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(255, 107, 107, 0.1)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Heart className="w-4 h-4 text-red-400" />
                      <span className="text-xs text-red-400 font-medium">In Love</span>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">{selectedSign.loveStyle}</p>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(79, 172, 254, 0.1)' }}>
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-blue-400 font-medium">As a Friend</span>
                    </div>
                    <p className="text-white/60 text-xs leading-relaxed">{selectedSign.friendStyle}</p>
                  </div>
                </div>
              </div>

              {/* Compatibility Section */}
              <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="text-lg text-white mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                  Compatibility
                </h3>

                {/* Type Toggle */}
                <div className="flex gap-2 mb-4">
                  {COMPATIBILITY_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => setActiveType(type.id as 'love' | 'friendship' | 'work')}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all flex-1 justify-center ${
                          activeType === type.id ? '' : 'opacity-50'
                        }`}
                        style={{
                          background: activeType === type.id ? `${type.color}20` : 'rgba(255,255,255,0.05)',
                          border: `1px solid ${activeType === type.id ? type.color : 'transparent'}`,
                        }}
                      >
                        <Icon className="w-4 h-4" style={{ color: type.color }} />
                        <span className="text-xs font-medium" style={{ color: activeType === type.id ? type.color : 'rgba(255,255,255,0.5)' }}>
                          {type.label}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Top Matches Preview */}
                <div className="mb-4 p-3 rounded-xl" style={{ background: 'rgba(201, 169, 98, 0.06)', border: '1px solid rgba(201, 169, 98, 0.12)' }}>
                  <p className="text-[11px] text-[#C9A962] font-medium mb-2.5 uppercase tracking-wider">
                    Best {COMPATIBILITY_TYPES.find(t => t.id === activeType)?.label} Matches
                  </p>
                  <div className="flex gap-3">
                    {getTopMatches(selectedSign.id, activeType).map(({ sign, score }, i) => (
                      <button
                        key={sign.id}
                        onClick={() => setCompareSign(sign)}
                        className="flex-1 flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all hover:bg-white/5"
                        style={{
                          background: compareSign?.id === sign.id ? `${sign.color}15` : 'transparent',
                        }}
                      >
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-white/30 font-medium">#{i + 1}</span>
                        </div>
                        <span className="text-xl">{sign.symbol}</span>
                        <span className="text-[11px] text-white/60">{sign.name}</span>
                        <ScoreStars score={score} color={getCompatibilityColor(score)} />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Compare Sign Selector - 4 cols with names */}
                <p className="text-white/40 text-xs mb-3">Or tap any sign to compare:</p>
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {ZODIAC_SIGNS.map((sign) => {
                    const score = getCompatibility(selectedSign.id, sign.id, activeType);
                    const isSelected = compareSign?.id === sign.id;
                    const isSelf = sign.id === selectedSign.id;
                    return (
                      <motion.button
                        key={sign.id}
                        onClick={() => setCompareSign(sign)}
                        whileTap={{ scale: 0.95 }}
                        className={`p-2.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all ${
                          isSelected ? 'ring-2' : ''
                        } ${isSelf ? 'opacity-40' : ''}`}
                        style={{
                          background: isSelected ? `${sign.color}20` : 'rgba(255,255,255,0.05)',
                          ['--tw-ring-color' as string]: sign.color,
                        }}
                      >
                        <span className="text-xl">{sign.symbol}</span>
                        <span className="text-[10px] text-white/50">{sign.name}</span>
                        <ScoreStars score={score} color={getCompatibilityColor(score)} />
                      </motion.button>
                    );
                  })}
                </div>

                {/* Comparison Result */}
                <AnimatePresence>
                  {compareSign && (
                    <motion.div
                      ref={comparisonResultRef}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 rounded-xl"
                      style={{ background: 'rgba(255,255,255,0.05)' }}
                    >
                      {/* Header with both signs */}
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col items-center">
                            <span className="text-2xl">{selectedSign.symbol}</span>
                            <span className="text-[10px] text-white/50 mt-0.5">{selectedSign.name}</span>
                          </div>
                          <Sparkles className="w-4 h-4 text-[#C9A962]" />
                          <div className="flex flex-col items-center">
                            <span className="text-2xl">{compareSign.symbol}</span>
                            <span className="text-[10px] text-white/50 mt-0.5">{compareSign.name}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            className="text-2xl font-bold"
                            style={{ color: getCompatibilityColor(getCompatibility(selectedSign.id, compareSign.id, activeType)) }}
                          >
                            {getCompatibility(selectedSign.id, compareSign.id, activeType)}/5
                          </div>
                          <div
                            className="text-xs font-medium"
                            style={{ color: getCompatibilityColor(getCompatibility(selectedSign.id, compareSign.id, activeType)) }}
                          >
                            {getCompatibilityLabel(getCompatibility(selectedSign.id, compareSign.id, activeType))}
                          </div>
                        </div>
                      </div>

                      {/* Score bar visual */}
                      <div className="mb-4">
                        <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(getCompatibility(selectedSign.id, compareSign.id, activeType) / 5) * 100}%` }}
                            transition={{ duration: 0.6, ease: 'easeOut' }}
                            className="h-full rounded-full"
                            style={{ background: getCompatibilityColor(getCompatibility(selectedSign.id, compareSign.id, activeType)) }}
                          />
                        </div>
                      </div>

                      {/* All three types breakdown */}
                      <div className="grid grid-cols-3 gap-2">
                        {COMPATIBILITY_TYPES.map((type) => {
                          const score = getCompatibility(selectedSign.id, compareSign.id, type.id as 'love' | 'friendship' | 'work');
                          const Icon = type.icon;
                          return (
                            <div
                              key={type.id}
                              className="p-2.5 rounded-lg text-center"
                              style={{ background: `${type.color}10` }}
                            >
                              <Icon className="w-4 h-4 mx-auto mb-1" style={{ color: type.color }} />
                              <p className="text-[10px] text-white/40 mb-1">{type.label}</p>
                              <ScoreStars score={score} color={type.color} size="md" />
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State - More engaging */}
        {!selectedSign && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="text-5xl mb-4">✧</div>
            <p className="text-white/60 text-base mb-2">Tap your zodiac sign above</p>
            <p className="text-white/30 text-sm">to explore traits, love style & compatibility</p>
          </motion.div>
        )}
      </div>

      <BottomNavigation />
    </div>
  );
}
