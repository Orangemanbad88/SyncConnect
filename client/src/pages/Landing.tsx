import { useEffect, useState } from 'react';
import { Link } from 'wouter';
import SyncLogo from '@/components/SyncLogo';
import TwinFlames from '@/components/TwinFlames';
import { Button } from '@/components/ui/button';

const Landing = () => {
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="h-screen w-full flex flex-col items-center justify-center transition-all duration-1000 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 40%, #252A33 70%, #1A1D23 100%)',
      }}
    >
      {/* Sign Up button in top-right corner */}
      <div className="absolute top-6 sm:top-8 right-6 sm:right-8 z-20">
        <Link href="/auth">
          <Button
            className="px-5 sm:px-6 py-2 sm:py-2.5 rounded-md text-xs sm:text-sm transition-all duration-300 hover:opacity-90"
            variant="outline"
            style={{
              borderColor: 'rgba(201, 169, 98, 0.4)',
              color: '#C9A962',
              fontFamily: "'Cinzel', serif",
              fontWeight: '600',
              letterSpacing: '0.1em',
              background: 'rgba(201, 169, 98, 0.08)',
            }}
          >
            Sign Up
          </Button>
        </Link>
      </div>

      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 opacity-30"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, rgba(201, 169, 98, 0.08) 0%, transparent 50%)',
          pointerEvents: 'none'
        }}
      />

      {/* Bottom gradient fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-48 opacity-60"
        style={{
          background: 'linear-gradient(to top, rgba(13, 15, 18, 0.9) 0%, transparent 100%)',
          pointerEvents: 'none'
        }}
      />

      {/* Subtle accent orbs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, rgba(201, 169, 98, 0.3) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full opacity-10"
           style={{ background: 'radial-gradient(circle, rgba(193, 119, 103, 0.3) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Main content */}
      <div className={`transform transition-all duration-1000 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} flex flex-col items-center`}>
        <div className="flex flex-col items-center relative">
          {/* Twin flames icon */}
          <div className="relative z-10 mb-6">
            <div className="absolute inset-0 rounded-full filter blur-2xl opacity-30"
                 style={{ background: 'radial-gradient(circle, rgba(201, 169, 98, 0.4) 0%, transparent 70%)' }} />
            <TwinFlames className="mx-auto w-28 h-28 sm:w-36 sm:h-36 relative z-20" />
          </div>

          {/* SYNC logo */}
          <SyncLogo className="w-72 h-auto mx-auto mb-4 max-w-full px-4 sm:px-0" />

          {/* Tagline */}
          <p
            className="text-sm sm:text-base tracking-widest uppercase opacity-60 mb-12"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: '#9CA3AF',
              letterSpacing: '0.25em'
            }}
          >
            Find Your Connection
          </p>
        </div>
      </div>

      {/* JOIN button */}
      <div className="absolute bottom-16 sm:bottom-20 left-0 right-0 flex justify-center">
        <Link href="/home">
          <Button
            className="px-10 py-3.5 sm:py-4 rounded-md transition-all duration-300 hover:scale-[1.02] text-sm sm:text-base"
            style={{
              background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 50%, #C9A962 100%)',
              border: 'none',
              color: '#0D0F12',
              boxShadow: '0 4px 20px rgba(201, 169, 98, 0.3), 0 2px 8px rgba(0, 0, 0, 0.3)',
              fontFamily: "'Cinzel', serif",
              fontWeight: '700',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Enter
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Landing;