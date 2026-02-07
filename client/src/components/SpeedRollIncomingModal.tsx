import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, X, User, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface SpeedRollIncomingModalProps {
  rollId: number | null;
  fromUser: {
    id: number;
    fullName: string;
    profileImage?: string;
    age?: number;
    job?: string;
  } | null;
  compatibilityScore: number;
  onAccept: () => void;
  onDecline: () => void;
}

export default function SpeedRollIncomingModal({
  rollId,
  fromUser,
  compatibilityScore,
  onAccept,
  onDecline,
}: SpeedRollIncomingModalProps) {
  const [countdown, setCountdown] = useState(30);
  const [isResponding, setIsResponding] = useState(false);
  const { toast } = useToast();

  // Countdown timer
  useEffect(() => {
    if (!rollId || !fromUser) return;

    setCountdown(30);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [rollId, fromUser]);

  // Auto-dismiss when countdown hits 0
  useEffect(() => {
    if (countdown === 0 && rollId) {
      onDecline();
    }
  }, [countdown, rollId, onDecline]);

  if (!rollId || !fromUser) return null;

  const handleAccept = async () => {
    setIsResponding(true);
    try {
      await apiRequest('POST', `/api/speed-roll/${rollId}/respond`, { response: 'accepted' });
      onAccept();
    } catch {
      toast({ title: "Failed to accept", variant: "destructive" });
    } finally {
      setIsResponding(false);
    }
  };

  const handleDecline = async () => {
    setIsResponding(true);
    try {
      await apiRequest('POST', `/api/speed-roll/${rollId}/respond`, { response: 'declined' });
      onDecline();
    } catch {
      // Still dismiss
      onDecline();
    } finally {
      setIsResponding(false);
    }
  };

  const compatPercent = Math.round(compatibilityScore * 100);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      >
        {/* Background lightning effect */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: 'radial-gradient(circle at center, rgba(234, 179, 8, 0.4) 0%, transparent 70%)',
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />

        <motion.div
          initial={{ scale: 0.8, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 50 }}
          className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 max-w-sm w-full mx-4 border border-yellow-500/20"
        >
          {/* Speed Roll badge */}
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/30">
              <Zap className="w-4 h-4 text-yellow-500" fill="currentColor" />
              <span className="text-yellow-500 text-sm font-semibold tracking-wider uppercase">
                Speed Roll
              </span>
            </div>
          </div>

          {/* Countdown ring */}
          <div className="absolute top-4 right-4 flex items-center gap-1 text-gray-400">
            <Clock className="w-4 h-4" />
            <span className={`text-sm font-mono ${countdown <= 10 ? 'text-red-400' : ''}`}>
              {countdown}s
            </span>
          </div>

          {/* User avatar */}
          <div className="relative mx-auto w-28 h-28 mb-6">
            {/* Pulsing ring */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="absolute inset-0 rounded-full border-2 border-yellow-500/50"
            />

            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg shadow-yellow-500/20">
              {fromUser.profileImage ? (
                <img
                  src={fromUser.profileImage}
                  alt={fromUser.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <User className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
          </div>

          {/* User info */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">{fromUser.fullName}</h2>
            {fromUser.age && (
              <p className="text-gray-400 text-sm">
                {fromUser.age} years old {fromUser.job ? `· ${fromUser.job}` : ''}
              </p>
            )}
            <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
              <span className="text-yellow-500 text-sm font-medium">{compatPercent}% compatible</span>
            </div>
          </div>

          <p className="text-center text-gray-400 text-sm mb-6">
            wants to speed date with you!
          </p>

          {/* Action buttons */}
          <div className="flex gap-4">
            <Button
              onClick={handleDecline}
              disabled={isResponding}
              className="flex-1 py-6 rounded-full bg-gray-800 hover:bg-gray-700 text-white border border-gray-600"
            >
              <X className="w-5 h-5 mr-1" />
              Decline
            </Button>
            <Button
              onClick={handleAccept}
              disabled={isResponding}
              className="flex-1 py-6 rounded-full text-black font-semibold"
              style={{
                background: 'linear-gradient(135deg, #EAB308 0%, #F59E0B 100%)',
                boxShadow: '0 0 20px rgba(234, 179, 8, 0.3)',
              }}
            >
              <Zap className="w-5 h-5 mr-1" fill="currentColor" />
              Accept
            </Button>
          </div>

          {/* Countdown progress bar */}
          <div className="mt-6 h-1 bg-gray-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 30, ease: 'linear' }}
              className={`h-full rounded-full ${countdown <= 10 ? 'bg-red-500' : 'bg-yellow-500'}`}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
