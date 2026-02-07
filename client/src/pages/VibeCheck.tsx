import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'wouter';
import { Sparkles, Heart, X, Users, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';

// Vibe Check Questions - This or That style
const VIBE_QUESTIONS = [
  {
    id: 1,
    category: 'lifestyle',
    question: 'Your ideal weekend?',
    optionA: { label: 'Adventure outdoors', emoji: '🏔️' },
    optionB: { label: 'Cozy night in', emoji: '🛋️' },
  },
  {
    id: 2,
    category: 'social',
    question: 'At a party, you are...',
    optionA: { label: 'Life of the party', emoji: '🎉' },
    optionB: { label: 'Deep convos in corner', emoji: '💭' },
  },
  {
    id: 3,
    category: 'food',
    question: 'Morning ritual?',
    optionA: { label: 'Coffee first, always', emoji: '☕' },
    optionB: { label: 'Tea is superior', emoji: '🍵' },
  },
  {
    id: 4,
    category: 'time',
    question: 'You feel most alive...',
    optionA: { label: 'Early morning sunrise', emoji: '🌅' },
    optionB: { label: 'Late night vibes', emoji: '🌙' },
  },
  {
    id: 5,
    category: 'planning',
    question: 'Vacation style?',
    optionA: { label: 'Detailed itinerary', emoji: '📋' },
    optionB: { label: 'Go with the flow', emoji: '🌊' },
  },
  {
    id: 6,
    category: 'romance',
    question: 'First date energy?',
    optionA: { label: 'Fancy dinner', emoji: '🍷' },
    optionB: { label: 'Casual adventure', emoji: '🎢' },
  },
  {
    id: 7,
    category: 'communication',
    question: 'Texting style?',
    optionA: { label: 'Reply instantly', emoji: '⚡' },
    optionB: { label: 'Reply when ready', emoji: '🐢' },
  },
  {
    id: 8,
    category: 'conflict',
    question: 'After an argument...',
    optionA: { label: 'Talk it out now', emoji: '🗣️' },
    optionB: { label: 'Need space first', emoji: '🧘' },
  },
  {
    id: 9,
    category: 'entertainment',
    question: 'Movie night pick?',
    optionA: { label: 'Action/thriller', emoji: '💥' },
    optionB: { label: 'Rom-com/drama', emoji: '💕' },
  },
  {
    id: 10,
    category: 'lifestyle',
    question: 'Your happy place?',
    optionA: { label: 'Beach & ocean', emoji: '🏖️' },
    optionB: { label: 'Mountains & forest', emoji: '🌲' },
  },
];

// Fake matched users based on vibe
const VIBE_MATCHES = [
  { id: 1, fullName: 'Sophia Chen', age: 26, profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop', vibeMatch: 94, isOnline: true },
  { id: 2, fullName: 'Marcus Johnson', age: 29, profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop', vibeMatch: 87, isOnline: true },
  { id: 3, fullName: 'Emma Williams', age: 24, profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop', vibeMatch: 82, isOnline: false },
  { id: 4, fullName: 'James Rodriguez', age: 31, profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop', vibeMatch: 79, isOnline: true },
];

type Answer = 'A' | 'B' | null;

export default function VibeCheck() {
  const [, setLocation] = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>(new Array(VIBE_QUESTIONS.length).fill(null));
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  const question = VIBE_QUESTIONS[currentQuestion];
  const progress = ((currentQuestion + 1) / VIBE_QUESTIONS.length) * 100;
  const answeredCount = answers.filter(a => a !== null).length;

  const handleAnswer = (answer: Answer) => {
    if (isAnimating) return;

    setSelectedAnswer(answer);
    setIsAnimating(true);

    // Update answers
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = answer;
    setAnswers(newAnswers);

    // Move to next question or show results
    setTimeout(() => {
      if (currentQuestion < VIBE_QUESTIONS.length - 1) {
        setCurrentQuestion(prev => prev + 1);
        setSelectedAnswer(null);
      } else {
        setShowResults(true);
      }
      setIsAnimating(false);
    }, 600);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers(new Array(VIBE_QUESTIONS.length).fill(null));
    setShowResults(false);
    setSelectedAnswer(null);
  };

  if (showResults) {
    return (
      <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)' }}>
        <Header />

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)' }}
            >
              <Sparkles className="w-10 h-10 text-white" />
            </motion.div>
            <h1 className="text-2xl mb-2" style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}>
              Your Vibe Matches
            </h1>
            <p className="text-white/50">People who share your energy</p>
          </motion.div>

          {/* Matches */}
          <div className="space-y-4">
            {VIBE_MATCHES.map((match, i) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="p-4 rounded-2xl flex items-center gap-4"
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
                <div className="relative">
                  <img
                    src={match.profileImage}
                    alt={match.fullName}
                    className="w-16 h-16 rounded-full object-cover"
                    style={{ border: '2px solid #C9A962' }}
                  />
                  {match.isOnline && (
                    <div
                      className="absolute bottom-0 right-0 w-4 h-4 rounded-full border-2"
                      style={{ background: '#22C55E', borderColor: '#0D0F12' }}
                    />
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-white font-medium">{match.fullName}, {match.age}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div
                      className="h-2 rounded-full flex-1"
                      style={{ background: 'rgba(255,255,255,0.1)' }}
                    >
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${match.vibeMatch}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full"
                        style={{ background: 'linear-gradient(90deg, #C9A962 0%, #22C55E 100%)' }}
                      />
                    </div>
                    <span className="text-[#C9A962] text-sm font-bold">{match.vibeMatch}%</span>
                  </div>
                </div>

                <Button
                  onClick={() => setLocation(`/video/${match.id}`)}
                  disabled={!match.isOnline}
                  className="w-12 h-12 rounded-full p-0"
                  style={{
                    background: match.isOnline
                      ? 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)'
                      : 'rgba(255,255,255,0.1)',
                  }}
                >
                  <Zap className={`w-5 h-5 ${match.isOnline ? 'text-[#0D0F12]' : 'text-white/30'}`} />
                </Button>
              </motion.div>
            ))}
          </div>

          {/* Actions */}
          <div className="mt-8 space-y-3">
            <Button
              onClick={() => setLocation('/home')}
              className="w-full py-6 rounded-full"
              style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)', color: '#0D0F12' }}
            >
              <Users className="w-5 h-5 mr-2" />
              Browse All Profiles
            </Button>
            <Button
              onClick={resetQuiz}
              variant="outline"
              className="w-full py-6 rounded-full border-white/20 text-white hover:bg-white/10"
            >
              Retake Vibe Check
            </Button>
          </div>
        </div>

        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)' }}>
      <Header />

      {/* Progress */}
      <div className="px-4 py-3">
        <div className="h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #C9A962 0%, #D4A574 100%)' }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-xs text-white/40">
          <span>Question {currentQuestion + 1} of {VIBE_QUESTIONS.length}</span>
          <span>{answeredCount} answered</span>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="w-full max-w-md"
          >
            {/* Category badge */}
            <div className="text-center mb-4">
              <span
                className="px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                style={{ background: 'rgba(201, 169, 98, 0.2)', color: '#C9A962' }}
              >
                {question.category}
              </span>
            </div>

            {/* Question text */}
            <h2
              className="text-2xl text-center mb-10"
              style={{ fontFamily: "'Cinzel', serif", color: '#E8E4DF' }}
            >
              {question.question}
            </h2>

            {/* Options */}
            <div className="space-y-4">
              {/* Option A */}
              <motion.button
                onClick={() => handleAnswer('A')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-6 rounded-2xl text-left transition-all ${
                  selectedAnswer === 'A'
                    ? 'bg-gradient-to-r from-[#C9A962]/30 to-[#D4A574]/30 border-2 border-[#C9A962]'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{question.optionA.emoji}</span>
                  <span className="text-xl text-white font-medium">{question.optionA.label}</span>
                  {selectedAnswer === 'A' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Heart className="w-6 h-6 text-[#C9A962] fill-[#C9A962]" />
                    </motion.div>
                  )}
                </div>
              </motion.button>

              {/* VS divider */}
              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-white/30 text-sm font-bold">VS</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

              {/* Option B */}
              <motion.button
                onClick={() => handleAnswer('B')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full p-6 rounded-2xl text-left transition-all ${
                  selectedAnswer === 'B'
                    ? 'bg-gradient-to-r from-[#C9A962]/30 to-[#D4A574]/30 border-2 border-[#C9A962]'
                    : 'bg-white/5 border-2 border-transparent hover:bg-white/10'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl">{question.optionB.emoji}</span>
                  <span className="text-xl text-white font-medium">{question.optionB.label}</span>
                  {selectedAnswer === 'B' && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="ml-auto"
                    >
                      <Heart className="w-6 h-6 text-[#C9A962] fill-[#C9A962]" />
                    </motion.div>
                  )}
                </div>
              </motion.button>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Skip button */}
      <div className="p-6 pt-0">
        <button
          onClick={() => {
            if (currentQuestion < VIBE_QUESTIONS.length - 1) {
              setCurrentQuestion(prev => prev + 1);
            } else {
              setShowResults(true);
            }
          }}
          className="w-full text-white/40 text-sm hover:text-white/60 transition-colors"
        >
          Skip this question
        </button>
      </div>

      <BottomNavigation />
    </div>
  );
}
