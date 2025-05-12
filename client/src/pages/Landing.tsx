import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import SyncLogo from '@/components/SyncLogo';
import ArrowLogo from '@/components/ArrowLogo';
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
      {/* Glossy effect overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none'
        }}
      ></div>
      <div className={`transform transition-all duration-1000 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <SyncLogo className="w-80 h-auto mx-auto mb-10" />
        
        <p 
          className="text-2xl font-semibold max-w-md mx-auto mb-16 tracking-wide font-barlow uppercase"
          style={{ 
            color: '#F5F5DC', // Cream color
            letterSpacing: '0.08em',
          }}
        >
          Your Instinct Connection
        </p>
        
        <div className="flex justify-center">
          <Button 
            onClick={() => setLocation('/home')}
            className="px-10 py-6 rounded-full text-lg font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg"
            style={{ 
              backgroundColor: 'var(--primary-blue)',
              color: 'white',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.4)'
            }}
          >
            Get Started
          </Button>
        </div>
        
        {/* Arrow logo at the bottom */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowLogo className="w-16 h-16" />
        </div>
      </div>
    </div>
  );
};

export default Landing;