import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, RefreshCw, X, MessageCircle, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Spark Questions organized by category
const SPARK_QUESTIONS = {
  fun: [
    "What's the most spontaneous thing you've ever done?",
    "If you could have dinner with anyone, dead or alive, who would it be?",
    "What's your go-to karaoke song?",
    "What's the weirdest food combination you secretly love?",
    "If you won the lottery tomorrow, what's the first thing you'd do?",
    "What's your most unpopular opinion?",
    "What's the best concert you've ever been to?",
    "If you could instantly become an expert in something, what would it be?",
    "What's on your bucket list?",
    "What's your guilty pleasure TV show?",
  ],
  deep: [
    "What's something you've changed your mind about recently?",
    "What does your ideal life look like in 5 years?",
    "What's the best advice you've ever received?",
    "What's something you're proud of that you don't talk about much?",
    "What makes you feel most alive?",
    "What's a fear you'd love to overcome?",
    "What's a value you'd never compromise on?",
    "What's the most meaningful compliment you've received?",
    "What does success mean to you?",
    "What's something you wish more people knew about you?",
  ],
  flirty: [
    "What's your idea of a perfect date?",
    "What's the most romantic thing someone could do for you?",
    "What do you find most attractive in a person?",
    "What's your love language?",
    "Beach vacation or mountain getaway with your partner?",
    "What's a small gesture that means a lot to you?",
    "Morning cuddles or late night conversations?",
    "What song makes you think of romance?",
    "What's your biggest green flag in a relationship?",
    "Describe your ideal lazy Sunday with someone special.",
  ],
  quirky: [
    "Pineapple on pizza: yes or absolutely not?",
    "If you were a vegetable, which one would you be?",
    "What would your superpower be and why?",
    "If your life was a movie, what genre would it be?",
    "What's the strangest dream you remember?",
    "If you could only eat one cuisine forever, which one?",
    "What's the most useless talent you have?",
    "If animals could talk, which would be the rudest?",
    "What conspiracy theory do you low-key believe?",
    "Would you rather fight 100 duck-sized horses or 1 horse-sized duck?",
  ],
};

const CATEGORIES = [
  { id: 'fun', label: 'Fun', emoji: '🎉', color: '#FFD93D' },
  { id: 'deep', label: 'Deep', emoji: '💭', color: '#4FACFE' },
  { id: 'flirty', label: 'Flirty', emoji: '💕', color: '#FF6B6B' },
  { id: 'quirky', label: 'Quirky', emoji: '🦄', color: '#A855F7' },
];

interface SparkQuestionsProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectQuestion?: (question: string) => void;
  floating?: boolean; // If true, shows as floating button, if false shows full panel
}

export default function SparkQuestions({ isOpen, onClose, onSelectQuestion, floating = false }: SparkQuestionsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('fun');
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [usedQuestions, setUsedQuestions] = useState<Set<string>>(new Set());
  const [showPanel, setShowPanel] = useState(false);

  const category = CATEGORIES.find(c => c.id === selectedCategory)!;
  const questions = SPARK_QUESTIONS[selectedCategory as keyof typeof SPARK_QUESTIONS];

  const getRandomQuestion = () => {
    const availableQuestions = questions.filter(q => !usedQuestions.has(q));
    if (availableQuestions.length === 0) {
      // Reset if all questions used
      setUsedQuestions(new Set());
      return questions[Math.floor(Math.random() * questions.length)];
    }
    const newQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setUsedQuestions(prev => new Set([...Array.from(prev), newQuestion]));
    return newQuestion;
  };

  useEffect(() => {
    if (isOpen && !currentQuestion) {
      setCurrentQuestion(getRandomQuestion());
    }
  }, [isOpen]);

  const handleNewQuestion = () => {
    setCurrentQuestion(getRandomQuestion());
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setUsedQuestions(new Set());
    const newQuestions = SPARK_QUESTIONS[categoryId as keyof typeof SPARK_QUESTIONS];
    setCurrentQuestion(newQuestions[Math.floor(Math.random() * newQuestions.length)]);
  };

  // Floating button mode
  if (floating) {
    return (
      <>
        {/* Floating button */}
        <motion.button
          onClick={() => setShowPanel(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed bottom-24 right-4 w-14 h-14 rounded-full flex items-center justify-center z-30 shadow-lg"
          style={{
            background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)',
            boxShadow: '0 4px 20px rgba(201, 169, 98, 0.4)',
          }}
        >
          <Sparkles className="w-6 h-6 text-[#0D0F12]" />
        </motion.button>

        {/* Panel */}
        <AnimatePresence>
          {showPanel && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 flex items-end justify-center"
              onClick={() => setShowPanel(false)}
            >
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25 }}
                className="w-full max-w-lg rounded-t-3xl p-6 pb-10"
                style={{ background: 'linear-gradient(180deg, #1A1D23 0%, #0D0F12 100%)' }}
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5" style={{ color: '#C9A962' }} />
                    <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                      Spark Questions
                    </h3>
                  </div>
                  <button onClick={() => setShowPanel(false)} className="p-2 rounded-full bg-white/10">
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>

                {/* Categories */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                        selectedCategory === cat.id
                          ? 'text-[#0D0F12] font-medium'
                          : 'bg-white/10 text-white/70'
                      }`}
                      style={{
                        background: selectedCategory === cat.id ? cat.color : undefined,
                      }}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>

                {/* Question */}
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 rounded-2xl mb-6"
                  style={{ background: `${category.color}15`, border: `1px solid ${category.color}30` }}
                >
                  <p className="text-xl text-white text-center" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    "{currentQuestion}"
                  </p>
                </motion.div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    onClick={handleNewQuestion}
                    variant="outline"
                    className="flex-1 py-6 rounded-full border-white/20 text-white hover:bg-white/10"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    New Question
                  </Button>
                  <Button
                    onClick={() => {
                      onSelectQuestion?.(currentQuestion);
                      setShowPanel(false);
                    }}
                    className="flex-1 py-6 rounded-full"
                    style={{ background: category.color, color: '#0D0F12' }}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Use This
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </>
    );
  }

  // Full panel mode
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md rounded-3xl p-6"
        style={{ background: 'linear-gradient(180deg, #1A1D23 0%, #0D0F12 100%)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)' }}
            >
              <Sparkles className="w-5 h-5 text-[#0D0F12]" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Cinzel', serif" }}>
                Spark Question
              </h3>
              <p className="text-xs text-white/50">Break the ice together</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20">
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Categories */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'text-[#0D0F12] font-medium'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              style={{
                background: selectedCategory === cat.id ? cat.color : undefined,
              }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Question */}
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 rounded-2xl mb-6 min-h-[150px] flex items-center justify-center"
          style={{ background: `${category.color}15`, border: `1px solid ${category.color}40` }}
        >
          <p className="text-2xl text-white text-center leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>
            "{currentQuestion}"
          </p>
        </motion.div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={handleNewQuestion}
            variant="outline"
            className="flex-1 py-6 rounded-full border-white/20 text-white hover:bg-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Another
          </Button>
          <Button
            onClick={() => {
              onSelectQuestion?.(currentQuestion);
              handleNewQuestion();
            }}
            className="flex-1 py-6 rounded-full font-medium"
            style={{ background: category.color, color: '#0D0F12' }}
          >
            <Zap className="w-4 h-4 mr-2" />
            Ask This
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Mini version for showing current question in video chat
export function SparkQuestionBubble({ question, color = '#C9A962' }: { question: string; color?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.9 }}
      className="absolute top-4 left-4 right-4 p-4 rounded-2xl z-20"
      style={{ background: 'rgba(0,0,0,0.8)', border: `1px solid ${color}40` }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: `${color}30` }}
        >
          <Sparkles className="w-4 h-4" style={{ color }} />
        </div>
        <p className="text-white text-sm leading-relaxed">"{question}"</p>
      </div>
    </motion.div>
  );
}
