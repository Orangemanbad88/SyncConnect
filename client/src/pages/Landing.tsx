import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import SyncLogo from '@/components/SyncLogo';
import TwinFlames from '@/components/TwinFlames';
import { Button } from '@/components/ui/button';
import { useAmbient } from '@/context/AmbientContext';
import { COLOR_SCHEMES } from '@/hooks/useAmbientColor';

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
        background: COLOR_SCHEMES.sunset.background,
        boxShadow: 'inset 0 0 100px rgba(255,255,255,0.15)'
      }}
    >
      {/* Sign Up button in top-left corner */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 z-20">
        <Link href="/auth">
          <Button 
            className="px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm transition-all duration-300 hover:opacity-90"
            variant="outline"
            style={{
              borderColor: COLOR_SCHEMES.sunset.highlight,
              borderBottomColor: COLOR_SCHEMES.sunset.text,
              borderRightColor: COLOR_SCHEMES.sunset.text,
              color: COLOR_SCHEMES.sunset.highlight,
              fontFamily: 'Georgia, serif',
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(65, 105, 225, 0.4)'
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
      
      {/* Blue accent rays at the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 opacity-40"
        style={{
          background: 'linear-gradient(to top, rgba(25,25,112,0.6) 0%, rgba(100,149,237,0.4) 30%, rgba(135,206,250,0.3) 60%, transparent 100%)',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Additional lighter blue accent at the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-36 opacity-30"
        style={{
          background: 'linear-gradient(to top, rgba(173,216,230,0.4) 0%, rgba(135,206,250,0.2) 50%, transparent 100%)',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Blue accent elements - now with lighter blues */}
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full opacity-25 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #87CEFA 0%, transparent 70%)' }}></div>
      <div className="absolute top-20 right-14 w-16 h-16 rounded-full opacity-20 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #ADD8E6 0%, transparent 70%)' }}></div>
      
      {/* Additional light blue glow element */}
      <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full opacity-15 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #B0E0E6 0%, transparent 80%)' }}></div>
      <div className="absolute bottom-1/3 left-4 w-24 h-24 rounded-full opacity-10 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #E0FFFF 0%, transparent 75%)' }}></div>
      
      <div className={`transform transition-all duration-1000 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} flex flex-col items-center`}>
        <div className="flex flex-col items-center relative">
          {/* Interconnected hearts positioned in the center above the logo */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
            {/* Add sunset glow effect around the twin flames with lighter blue accents */}
            <div className="absolute top-0 left-0 w-full h-full rounded-full filter blur-xl bg-gradient-to-b from-orange-500 via-red-600 to-indigo-400 opacity-60 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full filter blur-xl bg-gradient-to-r from-sky-300/40 to-transparent opacity-40 animate-pulse-slow"></div>
            <div className="absolute -top-5 -left-5 right-0 bottom-0 w-[calc(100%+10px)] h-[calc(100%+10px)] rounded-full filter blur-xl bg-gradient-to-t from-cyan-200/20 via-blue-300/10 to-transparent opacity-50 animate-pulse-slow"></div>
            <TwinFlames className="mx-auto w-32 h-32 sm:w-40 sm:h-40 relative z-20" />
          </div>
          
          <SyncLogo className="w-60 h-auto mx-auto mb-8 sm:mb-10 mt-16 sm:mt-24 max-w-full px-4 sm:px-0" />
          
          <div className="flex justify-center w-full relative px-4 sm:px-0 mt-16 sm:mt-20" style={{ maxWidth: '200px', margin: '0 auto' }}>
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-amber-600 rounded-full animate-pulse" style={{ transform: 'scale(1.2)' }}></div>
            <Button 
              onClick={() => setLocation('/home')}
              className="px-4 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow w-full text-sm sm:text-base landing-button"
              style={{ 
                background: 'linear-gradient(90deg, rgba(255, 140, 0, 0.98) 0%, rgba(255, 69, 0, 0.95) 50%, rgba(139, 0, 0, 0.9) 100%)',
                backdropFilter: 'blur(4px)',
                border: '2px solid rgba(255, 99, 71, 0.9)',
                borderTop: '2px solid rgba(255, 165, 0, 0.98)',
                borderBottom: '3px solid rgba(178, 34, 34, 0.9)',
                borderRadius: '999px',
                color: '#FFD700',
                boxShadow: `
                  0 4px 12px rgba(255, 69, 0, 0.7),
                  0 2px 4px rgba(178, 34, 34, 0.6),
                  0 0 20px rgba(65, 105, 225, 0.4),
                  inset 0 1px 3px rgba(255, 165, 0, 0.9),
                  inset 0 -1px 2px rgba(65, 105, 225, 0.5)
                `,
                fontFamily: 'Cinzel, serif',
                fontSize: '1rem',
                fontWeight: '600',
                fontStyle: 'italic',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                textShadow: `
                  0 1px 2px rgba(255, 255, 255, 0.9),
                  0 0 10px rgba(255, 215, 0, 1),
                  0 0 15px rgba(255, 140, 0, 0.7),
                  0 0 20px rgba(65, 105, 225, 0.6),
                  0 0 2px rgba(139, 0, 0, 0.7)
                `
              }}
            >
              <span className="inline-block font-semibold italic transform -skew-x-6" style={{ textShadow: '0 0 2px rgba(139, 0, 0, 0.8)' }}>ENTER</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;