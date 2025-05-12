import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import SyncLogo from '@/components/SyncLogo';
import DynamicArrows from '@/components/DynamicArrows';
import { Button } from '@/components/ui/button';
import { useAmbient } from '@/context/AmbientContext';

const Landing = () => {
  const [, setLocation] = useLocation();
  const { background, highlight, text } = useAmbient();
  const [fadeIn, setFadeIn] = useState(false);
  
  useEffect(() => {
    // Trigger fade-in animation
    const timer = setTimeout(() => {
      setFadeIn(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div 
      className="h-screen w-full flex flex-col items-center justify-center transition-all duration-1000 overflow-hidden relative"
      style={{ 
        background: 'linear-gradient(135deg, #121212 0%, #1a1a1a 25%, #121212 50%, #0a0a0a 75%, #121212 100%)',
        boxShadow: 'inset 0 0 100px rgba(255,255,255,0.05)'
      }}
    >
      {/* Sign Up button in top-left corner */}
      <div className="absolute top-6 left-6 z-20">
        <Link href="/auth">
          <Button 
            className="px-4 py-2 rounded-full text-sm transition-all duration-300 hover:opacity-90"
            variant="outline"
            style={{
              borderColor: '#F87171',
              color: '#F87171',
              fontFamily: 'Georgia, serif',
            }}
          >
            Sign Up
          </Button>
        </Link>
      </div>
      {/* Glossy effect overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}
      ></div>
      
      <div className={`transform transition-all duration-1000 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} flex flex-col items-center`}>
        <div className="flex flex-col items-center relative">
          {/* Dynamic Arrows positioned in the center above the logo */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
            <DynamicArrows className="mx-auto w-40 h-40" />
          </div>
          
          <SyncLogo className="w-60 h-auto mx-auto mb-12 mt-24" />
          
          <div className="flex justify-center">
            <Button 
              onClick={() => setLocation('/home')}
              className="px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow"
              style={{ 
                background: 'linear-gradient(135deg, #F9FAFB 0%, #E5E7EB 50%, #D1D5DB 100%)',
                color: '#2563EB',
                boxShadow: `
                  0 4px 14px rgba(255, 255, 255, 0.8),
                  0 0 10px rgba(226, 232, 240, 0.7),
                  0 0 20px rgba(203, 213, 225, 0.6),
                  0 0 30px rgba(148, 163, 184, 0.4)
                `,
                fontFamily: 'Cinzel, serif',
                fontSize: '1.2rem',
                fontWeight: '600',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textShadow: `
                  0 0 5px rgba(255, 255, 255, 0.9),
                  0 0 8px rgba(59, 130, 246, 0.8),
                  0 0 12px rgba(59, 130, 246, 0.6),
                  0 0 16px rgba(96, 165, 250, 0.4)
                `
              }}
            >
              Come Vibe
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;