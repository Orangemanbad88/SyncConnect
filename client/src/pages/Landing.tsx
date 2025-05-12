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
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
        <Link href="/auth">
          <Button 
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 hover:opacity-90"
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
            <DynamicArrows className="mx-auto w-32 h-32 sm:w-40 sm:h-40" />
          </div>
          
          <SyncLogo className="w-60 h-auto mx-auto mb-16 sm:mb-24 mt-16 sm:mt-24 max-w-full px-4 sm:px-0" />
          
          <div className="flex justify-center w-full relative px-4 sm:px-0" style={{ maxWidth: '200px', margin: '0 auto', transform: 'translateX(-5px)' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full animate-blue-glow" style={{ transform: 'scale(1.2)' }}></div>
            <Button 
              onClick={() => setLocation('/home')}
              className="px-4 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow w-full text-sm sm:text-base"
              style={{ 
                background: 'linear-gradient(90deg, rgba(180, 210, 255, 0.98) 0%, rgba(150, 190, 245, 0.95) 50%, rgba(120, 170, 245, 0.9) 100%)',
                backdropFilter: 'blur(4px)',
                border: '2px solid rgba(120, 170, 235, 0.9)',
                borderTop: '1px solid rgba(200, 225, 255, 0.95)',
                borderBottom: '3px solid rgba(80, 130, 210, 0.9)',
                borderRadius: '999px',
                color: '#05255e',
                boxShadow: `
                  0 4px 12px rgba(50, 100, 200, 0.6),
                  0 2px 4px rgba(30, 70, 160, 0.5),
                  inset 0 1px 3px rgba(220, 235, 255, 0.9),
                  inset 0 -1px 2px rgba(80, 130, 200, 0.7)
                `,
                fontFamily: 'Cinzel, serif',
                fontSize: '1rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textShadow: `
                  0 1px 1px rgba(255, 255, 255, 0.8),
                  0 0 8px rgba(160, 200, 255, 0.9),
                  0 0 15px rgba(50, 110, 210, 0.6),
                  0 0 20px rgba(40, 90, 190, 0.4)
                `
              }}
            >
              <span className="opacity-90 tracking-wide mr-1">Come</span> 
              <span className="inline-block">VIBE</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;