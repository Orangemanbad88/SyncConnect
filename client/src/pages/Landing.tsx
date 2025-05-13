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
              fontFamily: "'Righteous', cursive",
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(65, 105, 225, 0.4)'
            }}
          >
            <span className="righteous-header">Sign Up</span>
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
      
      {/* Dark blue to orange sunset gradient at the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-64 opacity-40"
        style={{
          background: 'linear-gradient(to top, rgba(25,53,84,0.6) 0%, rgba(46,63,106,0.5) 20%, rgba(106,124,191,0.4) 40%, rgba(255,142,102,0.3) 70%, rgba(255,107,66,0.2) 85%, transparent 100%)',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Ocean reflection gradient */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-36 opacity-30"
        style={{
          background: 'linear-gradient(to top, rgba(25,53,84,0.4) 0%, rgba(106,124,191,0.3) 40%, rgba(255,142,102,0.2) 70%, transparent 100%)',
          pointerEvents: 'none'
        }}
      ></div>
      
      {/* Accent elements matching the sunset photo colors */}
      <div className="absolute bottom-10 left-10 w-20 h-20 rounded-full opacity-25 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #6A7CBF 0%, transparent 70%)' }}></div>
      <div className="absolute top-20 right-14 w-16 h-16 rounded-full opacity-20 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #FF8E66 0%, transparent 70%)' }}></div>
      
      {/* Additional glow elements matching sunset photo */}
      <div className="absolute top-1/2 right-8 w-32 h-32 rounded-full opacity-15 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #2E3F6A 0%, transparent 80%)' }}></div>
      <div className="absolute bottom-1/3 left-4 w-24 h-24 rounded-full opacity-15 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #FF6B42 0%, transparent 75%)' }}></div>
      <div className="absolute top-1/4 left-16 w-28 h-28 rounded-full opacity-10 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #1B2A4A 0%, transparent 80%)' }}></div>
      <div className="absolute bottom-1/4 right-20 w-16 h-16 rounded-full opacity-15 animate-pulse-slow"
           style={{ background: 'radial-gradient(circle, #FF8E66 0%, transparent 70%)' }}></div>
      
      {/* Star-like elements in the sky */}
      <div className="absolute top-20 left-1/3 w-1 h-1 rounded-full bg-white opacity-70"></div>
      <div className="absolute top-16 left-1/4 w-1 h-1 rounded-full bg-white opacity-60"></div>
      <div className="absolute top-32 left-2/3 w-1 h-1 rounded-full bg-white opacity-70"></div>
      <div className="absolute top-24 right-1/4 w-1 h-1 rounded-full bg-white opacity-60"></div>
      
      {/* Main content */}
      <div className={`transform transition-all duration-1000 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} flex flex-col items-center`}>
        <div className="flex flex-col items-center relative">
          {/* Twin flames above the logo */}
          <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10">
            {/* Add glow around the twin flames matching sunset photo */}
            <div className="absolute top-0 left-0 w-full h-full rounded-full filter blur-xl opacity-60 animate-pulse" 
                 style={{ background: 'linear-gradient(to bottom, #0A1425, #FF8E66, #193554)' }}></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full filter blur-xl opacity-40 animate-pulse-slow"
                 style={{ background: 'linear-gradient(to right, rgba(46, 63, 106, 0.5), rgba(255, 107, 66, 0.4))' }}></div>
            <div className="absolute -top-5 -left-5 right-0 bottom-0 w-[calc(100%+10px)] h-[calc(100%+10px)] rounded-full filter blur-xl opacity-50 animate-pulse-slow"
                 style={{ background: 'linear-gradient(to top, rgba(255, 142, 102, 0.4), rgba(106, 124, 191, 0.3), transparent)' }}></div>
            <TwinFlames className="mx-auto w-32 h-32 sm:w-40 sm:h-40 relative z-20" />
          </div>
          
          {/* SYNC logo */}
          <SyncLogo className="w-60 h-auto mx-auto mb-8 sm:mb-10 mt-16 sm:mt-24 max-w-full px-4 sm:px-0" />
        </div>
      </div>
      
      {/* JOIN button positioned even higher */}
      <div className="absolute bottom-20 left-0 right-0 flex justify-center">
        <Button 
          onClick={() => setLocation('/home')}
          className="px-8 py-3 sm:py-4 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg animate-pulse-glow text-base landing-button"
          style={{ 
            background: 'linear-gradient(90deg, rgba(46, 63, 106, 0.95) 0%, rgba(106, 124, 191, 0.85) 50%, rgba(46, 63, 106, 0.95) 100%)',
            backdropFilter: 'blur(4px)',
            border: '2px solid rgba(106, 124, 191, 0.9)',
            borderTop: '2px solid rgba(136, 172, 224, 0.9)',
            borderBottom: '3px solid rgba(25, 53, 84, 0.9)',
            borderRadius: '999px',
            color: '#FFFFFF',
            boxShadow: `
              0 4px 12px rgba(255, 107, 66, 0.7),
              0 2px 4px rgba(25, 53, 84, 0.6),
              0 0 20px rgba(106, 124, 191, 0.5),
              inset 0 1px 3px rgba(255, 142, 102, 0.9),
              inset 0 -1px 2px rgba(106, 124, 191, 0.7)
            `,
            fontFamily: "'Righteous', cursive",
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            textShadow: `
              0 1px 2px rgba(255, 255, 255, 0.9),
              0 0 10px rgba(255, 215, 0, 0.8),
              0 0 15px rgba(255, 107, 66, 0.7),
              0 0 20px rgba(106, 124, 191, 0.6)
            `
          }}
        >
          <span className="inline-block transform tracking-wider righteous-header">JOIN</span>
        </Button>
      </div>
    </div>
  );
};

export default Landing;