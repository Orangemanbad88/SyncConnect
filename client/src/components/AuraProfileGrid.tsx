import { useState } from 'react';
import { Video, Star } from 'lucide-react';
import { useLocation } from 'wouter';

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
}

interface AuraProfileGridProps {
  users: User[];
  onViewProfile?: (user: User) => void;
}

// Zodiac signs with their properties
const ZODIAC_SIGNS = {
  aries: { emoji: '♈', name: 'Aries', element: 'fire', color: '#FF6B6B', dates: 'Mar 21 - Apr 19' },
  taurus: { emoji: '♉', name: 'Taurus', element: 'earth', color: '#8B7355', dates: 'Apr 20 - May 20' },
  gemini: { emoji: '♊', name: 'Gemini', element: 'air', color: '#FFD93D', dates: 'May 21 - Jun 20' },
  cancer: { emoji: '♋', name: 'Cancer', element: 'water', color: '#4FACFE', dates: 'Jun 21 - Jul 22' },
  leo: { emoji: '♌', name: 'Leo', element: 'fire', color: '#FF8E53', dates: 'Jul 23 - Aug 22' },
  virgo: { emoji: '♍', name: 'Virgo', element: 'earth', color: '#C9A962', dates: 'Aug 23 - Sep 22' },
  libra: { emoji: '♎', name: 'Libra', element: 'air', color: '#E0C3FC', dates: 'Sep 23 - Oct 22' },
  scorpio: { emoji: '♏', name: 'Scorpio', element: 'water', color: '#A855F7', dates: 'Oct 23 - Nov 21' },
  sagittarius: { emoji: '♐', name: 'Sagittarius', element: 'fire', color: '#EC4899', dates: 'Nov 22 - Dec 21' },
  capricorn: { emoji: '♑', name: 'Capricorn', element: 'earth', color: '#6B7280', dates: 'Dec 22 - Jan 19' },
  aquarius: { emoji: '♒', name: 'Aquarius', element: 'air', color: '#00F2FE', dates: 'Jan 20 - Feb 18' },
  pisces: { emoji: '♓', name: 'Pisces', element: 'water', color: '#8EC5FC', dates: 'Feb 19 - Mar 20' },
};

// Zodiac compatibility matrix (simplified)
const COMPATIBILITY: Record<string, Record<string, number>> = {
  aries: { aries: 70, taurus: 55, gemini: 85, cancer: 50, leo: 95, virgo: 55, libra: 75, scorpio: 60, sagittarius: 90, capricorn: 50, aquarius: 80, pisces: 65 },
  taurus: { aries: 55, taurus: 80, gemini: 60, cancer: 90, leo: 65, virgo: 95, libra: 70, scorpio: 85, sagittarius: 50, capricorn: 95, aquarius: 55, pisces: 85 },
  gemini: { aries: 85, taurus: 60, gemini: 75, cancer: 55, leo: 90, virgo: 65, libra: 95, scorpio: 50, sagittarius: 80, capricorn: 55, aquarius: 95, pisces: 60 },
  cancer: { aries: 50, taurus: 90, gemini: 55, cancer: 80, leo: 70, virgo: 85, libra: 55, scorpio: 95, sagittarius: 50, capricorn: 75, aquarius: 55, pisces: 95 },
  leo: { aries: 95, taurus: 65, gemini: 90, cancer: 70, leo: 80, virgo: 60, libra: 85, scorpio: 70, sagittarius: 95, capricorn: 55, aquarius: 75, pisces: 60 },
  virgo: { aries: 55, taurus: 95, gemini: 65, cancer: 85, leo: 60, virgo: 75, libra: 70, scorpio: 90, sagittarius: 55, capricorn: 95, aquarius: 60, pisces: 80 },
  libra: { aries: 75, taurus: 70, gemini: 95, cancer: 55, leo: 85, virgo: 70, libra: 80, scorpio: 65, sagittarius: 85, capricorn: 60, aquarius: 95, pisces: 65 },
  scorpio: { aries: 60, taurus: 85, gemini: 50, cancer: 95, leo: 70, virgo: 90, libra: 65, scorpio: 80, sagittarius: 60, capricorn: 85, aquarius: 55, pisces: 95 },
  sagittarius: { aries: 90, taurus: 50, gemini: 80, cancer: 50, leo: 95, virgo: 55, libra: 85, scorpio: 60, sagittarius: 80, capricorn: 55, aquarius: 90, pisces: 60 },
  capricorn: { aries: 50, taurus: 95, gemini: 55, cancer: 75, leo: 55, virgo: 95, libra: 60, scorpio: 85, sagittarius: 55, capricorn: 80, aquarius: 65, pisces: 80 },
  aquarius: { aries: 80, taurus: 55, gemini: 95, cancer: 55, leo: 75, virgo: 60, libra: 95, scorpio: 55, sagittarius: 90, capricorn: 65, aquarius: 80, pisces: 70 },
  pisces: { aries: 65, taurus: 85, gemini: 60, cancer: 95, leo: 60, virgo: 80, libra: 65, scorpio: 95, sagittarius: 60, capricorn: 80, aquarius: 70, pisces: 85 },
};

const getZodiacSign = (userId: number, userZodiac?: string): keyof typeof ZODIAC_SIGNS => {
  if (userZodiac && userZodiac.toLowerCase() in ZODIAC_SIGNS) {
    return userZodiac.toLowerCase() as keyof typeof ZODIAC_SIGNS;
  }
  const signs = Object.keys(ZODIAC_SIGNS) as (keyof typeof ZODIAC_SIGNS)[];
  return signs[userId % signs.length];
};

const getCompatibility = (sign1: string, sign2: string): number => {
  const s1 = sign1.toLowerCase();
  const s2 = sign2.toLowerCase();
  return COMPATIBILITY[s1]?.[s2] || 50;
};

// Current user's zodiac (would come from auth in real app)
const CURRENT_USER_ZODIAC = 'leo';

export default function AuraProfileGrid({ users, onViewProfile }: AuraProfileGridProps) {
  const [, setLocation] = useLocation();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'compatible'>('all');

  const getUsersWithZodiac = users.map(user => ({
    ...user,
    zodiac: getZodiacSign(user.id, user.zodiacSign),
    compatibility: getCompatibility(CURRENT_USER_ZODIAC, getZodiacSign(user.id, user.zodiacSign)),
  }));

  let filteredUsers = getUsersWithZodiac;

  // Filter by selected zodiac sign
  if (selectedFilter) {
    filteredUsers = filteredUsers.filter(user => user.zodiac === selectedFilter);
  }

  // Sort by compatibility if on compatible tab
  if (activeTab === 'compatible') {
    filteredUsers = [...filteredUsers].sort((a, b) => b.compatibility - a.compatibility);
  }

  if (!users.length) {
    return (
      <div className="h-full flex items-center justify-center text-[#9CA3AF]">
        <p>No profiles to show</p>
      </div>
    );
  }

  return (
    <div
      className="h-full overflow-y-auto pb-20"
      style={{
        background: 'linear-gradient(180deg, #0D0F12 0%, #1A1D23 100%)',
      }}
    >
      {/* Tab Switcher */}
      <div className="sticky top-0 z-20 px-2 pt-2" style={{ backgroundColor: 'rgba(13, 15, 18, 0.98)' }}>
        <div className="flex gap-1 mb-2">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
              activeTab === 'all'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                : 'bg-white/5 text-gray-400'
            }`}
          >
            All Signs
          </button>
          <button
            onClick={() => setActiveTab('compatible')}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-medium transition-all flex items-center justify-center gap-1 ${
              activeTab === 'compatible'
                ? 'bg-gradient-to-r from-pink-600 to-red-600 text-white'
                : 'bg-white/5 text-gray-400'
            }`}
          >
            <Star className="w-3 h-3" />
            Best Matches
          </button>
        </div>

        {/* Zodiac Filter Pills */}
        <div className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setSelectedFilter(null)}
            className="flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all"
            style={{
              background: !selectedFilter ? 'rgba(168, 85, 247, 0.3)' : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${!selectedFilter ? '#A855F7' : 'rgba(255, 255, 255, 0.1)'}`,
              color: !selectedFilter ? '#E0C3FC' : '#9CA3AF',
            }}
          >
            All
          </button>
          {Object.entries(ZODIAC_SIGNS).map(([key, sign]) => (
            <button
              key={key}
              onClick={() => setSelectedFilter(key)}
              title={`${sign.name} (${sign.dates})`}
              className="flex items-center gap-0.5 px-1.5 py-1 rounded-full text-[10px] font-medium whitespace-nowrap transition-all"
              style={{
                background: selectedFilter === key ? `${sign.color}30` : 'rgba(255, 255, 255, 0.05)',
                border: `1px solid ${selectedFilter === key ? sign.color : 'rgba(255, 255, 255, 0.1)'}`,
                color: selectedFilter === key ? sign.color : '#9CA3AF',
              }}
            >
              <span>{sign.emoji}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Your Zodiac Info */}
      {activeTab === 'compatible' && (
        <div className="mx-2 mb-2 p-2 rounded-lg" style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
          <div className="flex items-center gap-2">
            <span className="text-lg">{ZODIAC_SIGNS[CURRENT_USER_ZODIAC].emoji}</span>
            <div>
              <p className="text-[10px] text-gray-400">Your Sign</p>
              <p className="text-[12px] text-white font-medium">{ZODIAC_SIGNS[CURRENT_USER_ZODIAC].name}</p>
            </div>
          </div>
        </div>
      )}

      {/* Profile Grid */}
      <div className="grid grid-cols-4 gap-1.5 p-2">
        {filteredUsers.map((user) => {
          const zodiac = ZODIAC_SIGNS[user.zodiac];

          return (
            <div
              key={user.id}
              className="relative rounded-lg overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer"
              style={{
                background: 'rgba(26, 29, 35, 0.8)',
                border: `1px solid ${zodiac.color}30`,
              }}
              onClick={() => onViewProfile?.(user)}
            >
              {/* Zodiac Glow Background */}
              <div
                className="absolute inset-0 opacity-20"
                style={{
                  background: `radial-gradient(circle at 50% 30%, ${zodiac.color} 0%, transparent 70%)`,
                }}
              />

              {/* Profile Image */}
              <div className="relative aspect-[4/5]">
                <img
                  src={user.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop'}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />

                {/* Gradient Overlay */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(13, 15, 18, 0.95) 0%, rgba(13, 15, 18, 0.5) 40%, transparent 70%)',
                  }}
                />

                {/* Online Indicator */}
                {user.isOnline && (
                  <div
                    className="absolute top-2 right-2 w-2 h-2 rounded-full"
                    style={{
                      background: '#22C55E',
                      boxShadow: '0 0 8px rgba(34, 197, 94, 0.8)',
                    }}
                  />
                )}

                {/* Zodiac Badge */}
                <div
                  className="absolute top-2 left-2 px-1.5 py-0.5 rounded-full text-[8px] font-medium cursor-help"
                  title={`${zodiac.name} (${zodiac.dates})`}
                  style={{
                    background: 'rgba(0, 0, 0, 0.6)',
                    border: `1px solid ${zodiac.color}`,
                    color: zodiac.color,
                  }}
                >
                  {zodiac.emoji}
                </div>

                {/* Compatibility Score (only on compatible tab) */}
                {activeTab === 'compatible' && (
                  <div
                    className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold"
                    style={{
                      background: user.compatibility >= 80 ? '#22C55E' : user.compatibility >= 60 ? '#F59E0B' : '#6B7280',
                      color: 'white',
                      marginTop: user.isOnline ? '12px' : '0',
                    }}
                  >
                    {user.compatibility}
                  </div>
                )}

                {/* User Info */}
                <div className="absolute bottom-0 left-0 right-0 p-1.5 bg-gradient-to-t from-black/80 to-transparent">
                  <h3 className="text-white font-medium text-[10px] truncate">
                    {user.fullName.split(' ')[0]}, {user.age}
                  </h3>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State for Filter */}
      {filteredUsers.length === 0 && selectedFilter && (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <div className="text-4xl mb-3">
            {ZODIAC_SIGNS[selectedFilter as keyof typeof ZODIAC_SIGNS]?.emoji}
          </div>
          <p className="text-[#9CA3AF] text-sm text-center">
            No {ZODIAC_SIGNS[selectedFilter as keyof typeof ZODIAC_SIGNS]?.name} profiles nearby
          </p>
          <button
            onClick={() => setSelectedFilter(null)}
            className="mt-3 text-[#A855F7] text-xs underline"
          >
            Show all signs
          </button>
        </div>
      )}
    </div>
  );
}
