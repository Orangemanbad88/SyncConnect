import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import SyncLogo from '@/components/SyncLogo';
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
      className="h-screen w-full flex flex-col items-center justify-center transition-colors duration-1000"
      style={{ backgroundColor: 'var(--primary-salmon)' }}
    >
      <div className={`transform transition-all duration-1000 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <SyncLogo className="w-80 h-auto mx-auto mb-6" />
        
        <h2
          className="text-3xl font-medium mb-8 text-center"
          style={{ 
            color: 'white',
            fontFamily: 'Rubik, sans-serif' 
          }}
        >
          Your World
        </h2>
        
        <p 
          className="text-2xl font-light max-w-md mx-auto mb-12"
          style={{ 
            color: 'white',
            fontFamily: 'Rubik, sans-serif'
          }}
        >
          Connect with people nearby through spontaneous video chats
        </p>
        
        <Button 
          onClick={() => setLocation('/home')}
          className="px-10 py-6 rounded-full text-lg font-medium transition-transform hover:scale-105"
          style={{ 
            backgroundColor: 'var(--primary-blue)',
            color: 'white'
          }}
        >
          Get Started
        </Button>
      </div>
    </div>
  );
};

export default Landing;