import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  ChevronRight,
  ChevronLeft,
  Heart,
  Users,
  Sparkles,
  Camera,
  MapPin,
  Check,
  Calendar,
  Star
} from 'lucide-react';
import { Button } from '@/components/ui/button';

// Looking for options (Hinge-style + Friend)
const LOOKING_FOR_OPTIONS = [
  { id: 'life-partner', label: 'Life partner', icon: '💍', description: 'Someone to build a future with' },
  { id: 'long-term', label: 'Long-term relationship', icon: '❤️', description: 'A meaningful, committed relationship' },
  { id: 'long-term-open', label: 'Long-term, open to short', icon: '💜', description: 'Preferably long-term, but open to seeing where it goes' },
  { id: 'short-term-open', label: 'Short-term, open to long', icon: '💙', description: 'Something casual that could become more' },
  { id: 'short-term', label: 'Short-term fun', icon: '✨', description: 'Casual dating and good times' },
  { id: 'friends', label: 'New friends', icon: '🤝', description: 'Platonic connections and friendships' },
  { id: 'figuring-out', label: 'Figuring it out', icon: '🤔', description: 'Not sure yet, exploring my options' },
];

// Interest categories
const INTEREST_CATEGORIES = [
  {
    category: 'Activities',
    interests: ['Hiking', 'Yoga', 'Gaming', 'Cooking', 'Dancing', 'Photography', 'Travel', 'Fitness', 'Running', 'Swimming']
  },
  {
    category: 'Music',
    interests: ['Pop', 'Hip-Hop', 'Rock', 'Jazz', 'Electronic', 'R&B', 'Country', 'Classical', 'Indie', 'K-Pop']
  },
  {
    category: 'Entertainment',
    interests: ['Movies', 'TV Shows', 'Anime', 'Reading', 'Podcasts', 'Theater', 'Comedy', 'Art', 'Museums']
  },
  {
    category: 'Food & Drink',
    interests: ['Coffee', 'Wine', 'Craft Beer', 'Foodie', 'Vegan', 'Brunch', 'Sushi', 'Italian', 'Mexican']
  },
  {
    category: 'Lifestyle',
    interests: ['Dogs', 'Cats', 'Plants', 'Meditation', 'Spirituality', 'Volunteering', 'Fashion', 'Sustainability']
  },
];

// Zodiac data
const ZODIAC_SIGNS = [
  { sign: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'Fire' },
  { sign: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'Earth' },
  { sign: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'Air' },
  { sign: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'Water' },
  { sign: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'Fire' },
  { sign: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'Earth' },
  { sign: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'Air' },
  { sign: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'Water' },
  { sign: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'Fire' },
  { sign: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'Earth' },
  { sign: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'Air' },
  { sign: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'Water' },
];

const getZodiacFromDate = (month: number, day: number): typeof ZODIAC_SIGNS[0] | null => {
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return ZODIAC_SIGNS[0]; // Aries
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return ZODIAC_SIGNS[1]; // Taurus
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return ZODIAC_SIGNS[2]; // Gemini
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return ZODIAC_SIGNS[3]; // Cancer
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return ZODIAC_SIGNS[4]; // Leo
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return ZODIAC_SIGNS[5]; // Virgo
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return ZODIAC_SIGNS[6]; // Libra
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return ZODIAC_SIGNS[7]; // Scorpio
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return ZODIAC_SIGNS[8]; // Sagittarius
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return ZODIAC_SIGNS[9]; // Capricorn
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return ZODIAC_SIGNS[10]; // Aquarius
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return ZODIAC_SIGNS[11]; // Pisces
  return null;
};

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#FF6B6B',
  Earth: '#8B7355',
  Air: '#4FACFE',
  Water: '#A855F7',
};

// Sample profile photos for demo
const SAMPLE_PHOTOS = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
];

const STEPS = ['welcome', 'looking-for', 'photo', 'birthday', 'interests', 'location'] as const;
type Step = typeof STEPS[number];

export default function Onboarding() {
  const [, setLocation] = useLocation();
  const [currentStep, setCurrentStep] = useState<Step>('welcome');
  const [lookingFor, setLookingFor] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [birthMonth, setBirthMonth] = useState<number | null>(null);
  const [birthDay, setBirthDay] = useState<number | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [locationPermission, setLocationPermission] = useState<'pending' | 'granted' | 'denied'>('pending');

  const currentStepIndex = STEPS.indexOf(currentStep);
  const progress = ((currentStepIndex) / (STEPS.length - 1)) * 100;

  const zodiacSign = birthMonth && birthDay ? getZodiacFromDate(birthMonth, birthDay) : null;

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex]);
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  const requestLocation = async () => {
    try {
      const result = await navigator.geolocation.getCurrentPosition(
        () => setLocationPermission('granted'),
        () => setLocationPermission('denied')
      );
    } catch {
      setLocationPermission('denied');
    }
  };

  const finishOnboarding = () => {
    // In real app, save all data to backend
    console.log('Onboarding complete:', {
      lookingFor,
      selectedPhoto,
      birthMonth,
      birthDay,
      zodiacSign: zodiacSign?.sign,
      selectedInterests,
      locationPermission,
    });
    setLocation('/home');
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'welcome': return true;
      case 'looking-for': return lookingFor !== null;
      case 'photo': return selectedPhoto !== null;
      case 'birthday': return birthMonth !== null && birthDay !== null;
      case 'interests': return selectedInterests.length >= 3;
      case 'location': return true;
      default: return true;
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)' }}
    >
      {/* Progress Bar */}
      <div className="p-4">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #C9A962 0%, #D4A574 100%)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>Step {currentStepIndex + 1} of {STEPS.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Back Button */}
      {currentStepIndex > 0 && (
        <button
          onClick={goBack}
          className="absolute top-16 left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {currentStep === 'welcome' && (
            <motion.div
              key="welcome"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)' }}
              >
                <Sparkles className="w-12 h-12 text-white" />
              </motion.div>

              <h1
                className="text-3xl mb-4"
                style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}
              >
                Welcome to SYNC
              </h1>

              <p className="text-white/60 mb-8 max-w-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Let's set up your profile so you can start connecting with amazing people nearby.
              </p>

              <div className="space-y-4 text-left w-full max-w-sm">
                {[
                  { icon: Heart, text: 'Find meaningful connections' },
                  { icon: Users, text: 'Meet people through video chat' },
                  { icon: MapPin, text: 'Discover matches nearby' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-white/5"
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(201, 169, 98, 0.2)' }}
                    >
                      <item.icon className="w-5 h-5" style={{ color: '#C9A962' }} />
                    </div>
                    <span className="text-white/80">{item.text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Looking For Step */}
          {currentStep === 'looking-for' && (
            <motion.div
              key="looking-for"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2
                className="text-2xl mb-2 text-center"
                style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}
              >
                What are you looking for?
              </h2>
              <p className="text-white/50 text-center mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                This helps us find the right people for you
              </p>

              <div className="space-y-3">
                {LOOKING_FOR_OPTIONS.map((option) => (
                  <motion.button
                    key={option.id}
                    onClick={() => setLookingFor(option.id)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-2xl text-left transition-all ${
                      lookingFor === option.id
                        ? 'bg-gradient-to-r from-[#C9A962]/20 to-[#D4A574]/20 border-2 border-[#C9A962]'
                        : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{option.icon}</span>
                      <div className="flex-1">
                        <div className="text-white font-medium">{option.label}</div>
                        <div className="text-white/50 text-sm">{option.description}</div>
                      </div>
                      {lookingFor === option.id && (
                        <Check className="w-5 h-5" style={{ color: '#C9A962' }} />
                      )}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Photo Step */}
          {currentStep === 'photo' && (
            <motion.div
              key="photo"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2
                className="text-2xl mb-2 text-center"
                style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}
              >
                Add a profile photo
              </h2>
              <p className="text-white/50 text-center mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Choose a photo that shows your face clearly
              </p>

              {/* Main photo preview */}
              <div className="flex justify-center mb-8">
                <motion.div
                  className="relative w-40 h-40 rounded-full overflow-hidden"
                  style={{
                    border: selectedPhoto ? '4px solid #C9A962' : '4px dashed rgba(255,255,255,0.2)',
                    boxShadow: selectedPhoto ? '0 0 40px rgba(201, 169, 98, 0.4)' : 'none',
                  }}
                >
                  {selectedPhoto ? (
                    <img src={selectedPhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-white/5">
                      <Camera className="w-12 h-12 text-white/30" />
                    </div>
                  )}
                </motion.div>
              </div>

              {/* Photo options */}
              <p className="text-white/40 text-sm text-center mb-4">Select a demo photo:</p>
              <div className="grid grid-cols-3 gap-3">
                {SAMPLE_PHOTOS.map((photo, i) => (
                  <motion.button
                    key={i}
                    onClick={() => setSelectedPhoto(photo)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`aspect-square rounded-xl overflow-hidden ${
                      selectedPhoto === photo ? 'ring-2 ring-[#C9A962]' : ''
                    }`}
                  >
                    <img src={photo} alt={`Option ${i + 1}`} className="w-full h-full object-cover" />
                  </motion.button>
                ))}
              </div>

              <button className="w-full mt-6 p-4 rounded-xl bg-white/5 border-2 border-dashed border-white/20 text-white/60 hover:bg-white/10 transition-colors">
                <Camera className="w-5 h-5 inline mr-2" />
                Upload your own photo
              </button>
            </motion.div>
          )}

          {/* Birthday Step */}
          {currentStep === 'birthday' && (
            <motion.div
              key="birthday"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2
                className="text-2xl mb-2 text-center"
                style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}
              >
                When's your birthday?
              </h2>
              <p className="text-white/50 text-center mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                We'll calculate your zodiac sign
              </p>

              <div className="flex gap-4 justify-center mb-8">
                {/* Month selector */}
                <div className="flex-1 max-w-[150px]">
                  <label className="text-white/40 text-sm mb-2 block">Month</label>
                  <select
                    value={birthMonth || ''}
                    onChange={(e) => setBirthMonth(Number(e.target.value))}
                    className="w-full p-4 rounded-xl bg-white/10 text-white border-2 border-transparent focus:border-[#C9A962] outline-none"
                  >
                    <option value="">Select</option>
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Day selector */}
                <div className="flex-1 max-w-[150px]">
                  <label className="text-white/40 text-sm mb-2 block">Day</label>
                  <select
                    value={birthDay || ''}
                    onChange={(e) => setBirthDay(Number(e.target.value))}
                    className="w-full p-4 rounded-xl bg-white/10 text-white border-2 border-transparent focus:border-[#C9A962] outline-none"
                  >
                    <option value="">Select</option>
                    {Array.from({ length: 31 }, (_, i) => i + 1).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Zodiac result */}
              <AnimatePresence>
                {zodiacSign && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 rounded-2xl text-center"
                    style={{
                      background: `linear-gradient(135deg, ${ELEMENT_COLORS[zodiacSign.element]}20 0%, transparent 100%)`,
                      border: `2px solid ${ELEMENT_COLORS[zodiacSign.element]}40`,
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', delay: 0.1 }}
                      className="text-6xl mb-3"
                    >
                      {zodiacSign.symbol}
                    </motion.div>
                    <h3
                      className="text-2xl mb-1"
                      style={{ fontFamily: "'Cinzel', serif", color: ELEMENT_COLORS[zodiacSign.element] }}
                    >
                      {zodiacSign.sign}
                    </h3>
                    <p className="text-white/50 text-sm">{zodiacSign.dates}</p>
                    <div
                      className="inline-block mt-3 px-3 py-1 rounded-full text-xs"
                      style={{
                        background: `${ELEMENT_COLORS[zodiacSign.element]}20`,
                        color: ELEMENT_COLORS[zodiacSign.element],
                      }}
                    >
                      {zodiacSign.element} Sign
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}

          {/* Interests Step */}
          {currentStep === 'interests' && (
            <motion.div
              key="interests"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <h2
                className="text-2xl mb-2 text-center"
                style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}
              >
                What are you into?
              </h2>
              <p className="text-white/50 text-center mb-2" style={{ fontFamily: "'Barlow', sans-serif" }}>
                Select at least 3 interests
              </p>
              <p className="text-center mb-6">
                <span
                  className="px-3 py-1 rounded-full text-sm"
                  style={{
                    background: selectedInterests.length >= 3 ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)',
                    color: selectedInterests.length >= 3 ? '#22C55E' : 'rgba(255, 255, 255, 0.5)',
                  }}
                >
                  {selectedInterests.length} selected
                </span>
              </p>

              <div className="space-y-6">
                {INTEREST_CATEGORIES.map((category) => (
                  <div key={category.category}>
                    <h3 className="text-white/60 text-sm mb-3 uppercase tracking-wider">
                      {category.category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {category.interests.map((interest) => (
                        <motion.button
                          key={interest}
                          onClick={() => toggleInterest(interest)}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-sm transition-all ${
                            selectedInterests.includes(interest)
                              ? 'bg-gradient-to-r from-[#C9A962] to-[#D4A574] text-[#0D0F12] font-medium'
                              : 'bg-white/10 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          {interest}
                        </motion.button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Location Step */}
          {currentStep === 'location' && (
            <motion.div
              key="location"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex flex-col items-center justify-center h-full text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-24 h-24 rounded-full flex items-center justify-center mb-8"
                style={{
                  background: locationPermission === 'granted'
                    ? 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)'
                    : 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)'
                }}
              >
                <MapPin className="w-12 h-12 text-white" />
              </motion.div>

              <h2
                className="text-2xl mb-4"
                style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}
              >
                {locationPermission === 'granted' ? 'Location enabled!' : 'Enable location'}
              </h2>

              <p className="text-white/60 mb-8 max-w-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>
                {locationPermission === 'granted'
                  ? "Great! You'll now see people near you."
                  : "SYNC uses your location to show you people nearby. Your exact location is never shared."
                }
              </p>

              {locationPermission === 'pending' && (
                <Button
                  onClick={requestLocation}
                  className="px-8 py-6 rounded-full text-lg"
                  style={{
                    background: 'linear-gradient(135deg, #4FACFE 0%, #00F2FE 100%)',
                    color: 'white',
                  }}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Allow location access
                </Button>
              )}

              {locationPermission === 'granted' && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 text-green-500"
                >
                  <Check className="w-6 h-6" />
                  <span>Location access granted</span>
                </motion.div>
              )}

              {locationPermission === 'denied' && (
                <div className="text-white/50 text-sm">
                  <p className="mb-4">Location access was denied. You can still use the app, but some features may be limited.</p>
                  <button
                    onClick={() => setLocationPermission('pending')}
                    className="text-[#C9A962] underline"
                  >
                    Try again
                  </button>
                </div>
              )}

              {locationPermission !== 'pending' && (
                <p className="text-white/40 text-sm mt-6">
                  You can change this later in settings
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Navigation */}
      <div className="p-6 pt-0">
        <Button
          onClick={currentStep === 'location' ? finishOnboarding : goNext}
          disabled={!canProceed()}
          className="w-full py-6 rounded-full text-lg font-medium transition-all disabled:opacity-50"
          style={{
            background: canProceed()
              ? 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)'
              : 'rgba(255,255,255,0.1)',
            color: canProceed() ? '#0D0F12' : 'rgba(255,255,255,0.3)',
          }}
        >
          {currentStep === 'location' ? (
            <>
              <Sparkles className="w-5 h-5 mr-2" />
              Start exploring
            </>
          ) : (
            <>
              Continue
              <ChevronRight className="w-5 h-5 ml-2" />
            </>
          )}
        </Button>

        {currentStep !== 'welcome' && currentStep !== 'location' && (
          <button
            onClick={goNext}
            className="w-full mt-3 text-white/40 text-sm hover:text-white/60 transition-colors"
          >
            Skip for now
          </button>
        )}
      </div>
    </div>
  );
}
