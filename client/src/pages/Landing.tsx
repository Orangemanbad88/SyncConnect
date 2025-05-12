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
          
          <SyncLogo className="w-60 h-auto mx-auto mb-24 mt-24" />
          
          <div className="flex justify-center w-full" style={{ maxWidth: '200px', margin: '0 auto' }}>
            <Button 
              onClick={() => setLocation('/home')}
              className="px-4 py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow w-full"
              style={{ 
                background: 'linear-gradient(90deg, rgba(230, 240, 255, 0.95) 0%, rgba(200, 225, 255, 0.9) 50%, rgba(160, 200, 255, 0.85) 100%)',
                backdropFilter: 'blur(4px)',
                border: '2px solid rgba(170, 200, 235, 0.9)',
                borderTop: '1px solid rgba(235, 245, 255, 0.95)',
                borderBottom: '3px solid rgba(100, 150, 210, 0.8)',
                borderRadius: '999px',
                color: '#0a3178',
                boxShadow: `
                  0 4px 12px rgba(70, 130, 220, 0.5),
                  0 2px 4px rgba(40, 80, 180, 0.4),
                  inset 0 1px 3px rgba(245, 250, 255, 0.9),
                  inset 0 -1px 2px rgba(100, 150, 210, 0.6)
                `,
                fontFamily: 'Cinzel, serif',
                fontSize: '1rem',
                fontWeight: '700',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                textShadow: `
                  0 1px 1px rgba(255, 255, 255, 0.7),
                  0 0 8px rgba(200, 230, 255, 0.8),
                  0 0 15px rgba(70, 130, 220, 0.5),
                  0 0 20px rgba(60, 120, 210, 0.3)
                `
              }}
            >
              <span className="opacity-90 tracking-wide mr-1">Come</span> 
              <span className="relative inline-block">
                <span className="absolute -inset-1 blur-[1px] opacity-30 bg-blue-400 rounded-md"></span>
                <span className="relative z-10">VIBE</span>
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;