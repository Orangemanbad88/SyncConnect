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
              className="px-10 py-6 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-lg hover:bg-blue-800"
              style={{ 
                backgroundColor: '#2563EB', // Darker blue
                color: 'white',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.5)',
                fontFamily: 'Georgia, serif',
                fontSize: '1.2rem',
                fontWeight: '400',
                letterSpacing: '0.1em',
                textTransform: 'uppercase'
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