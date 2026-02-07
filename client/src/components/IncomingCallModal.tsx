import { useEffect, useState } from 'react';
import { Phone, PhoneOff, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface IncomingCallModalProps {
  caller: {
    id: number;
    fullName: string;
    profileImage?: string;
    age?: number;
  } | null;
  onAccept: () => void;
  onReject: () => void;
}

const IncomingCallModal = ({ caller, onAccept, onReject }: IncomingCallModalProps) => {
  const [ringAnimation, setRingAnimation] = useState(true);

  useEffect(() => {
    // Play ringtone effect (visual pulsing)
    const interval = setInterval(() => {
      setRingAnimation(prev => !prev);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  if (!caller) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Background pulse effect */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${ringAnimation ? 'opacity-20' : 'opacity-10'}`}
        style={{
          background: 'radial-gradient(circle at center, rgba(34, 197, 94, 0.4) 0%, transparent 70%)'
        }}
      />

      <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 max-w-sm w-full mx-4 shadow-2xl border border-white/10">
        {/* Incoming call text */}
        <div className="text-center mb-6">
          <p className="text-green-400 text-sm font-medium tracking-wider uppercase animate-pulse">
            Incoming Video Call
          </p>
        </div>

        {/* Caller avatar with ring animation */}
        <div className="relative mx-auto w-32 h-32 mb-6">
          {/* Pulsing rings */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-green-500/50 transition-transform duration-500 ${
              ringAnimation ? 'scale-110 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full border-2 border-green-500/30 transition-transform duration-700 ${
              ringAnimation ? 'scale-125 opacity-0' : 'scale-100 opacity-50'
            }`}
          />
          <div
            className={`absolute inset-0 rounded-full border-2 border-green-500/20 transition-transform duration-1000 ${
              ringAnimation ? 'scale-150 opacity-0' : 'scale-100 opacity-30'
            }`}
          />

          {/* Avatar */}
          <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-green-500 shadow-lg shadow-green-500/30">
            {caller.profileImage ? (
              <img
                src={caller.profileImage}
                alt={caller.fullName}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                <User className="w-16 h-16 text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Caller info */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-1 font-almarai">
            {caller.fullName}
          </h2>
          {caller.age && (
            <p className="text-gray-400 text-sm">
              {caller.age} years old
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-center gap-6">
          {/* Reject button */}
          <Button
            onClick={onReject}
            className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/30 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <PhoneOff className="w-7 h-7" />
          </Button>

          {/* Accept button */}
          <Button
            onClick={onAccept}
            className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/30 transition-all duration-200 hover:scale-105 active:scale-95 animate-pulse"
          >
            <Phone className="w-7 h-7" />
          </Button>
        </div>

        {/* Hint text */}
        <p className="text-center text-gray-500 text-xs mt-6">
          Tap to accept or reject the call
        </p>
      </div>
    </div>
  );
};

export default IncomingCallModal;
