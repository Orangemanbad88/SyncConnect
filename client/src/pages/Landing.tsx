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
      style={{ backgroundColor: 'var(--neutral-black)' }}
    >
      <div className={`transform transition-all duration-1000 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <SyncLogo className="w-40 h-40 mx-auto mb-8" />
      </div>
      
      <div className={`text-center transition-all duration-1000 delay-300 ease-out ${fadeIn ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <h1 
          className="text-7xl font-['Roboto'] font-black tracking-[0.05em] mb-2"
          style={{ color: 'var(--primary-blue)' }}
        >
          SYNC
        </h1>
        <h2
          className="text-3xl font-['Roboto'] font-light mb-8"
          style={{ color: 'var(--primary-blue)' }}
        >
          Your World
        </h2>
        
        <p 
          className="text-2xl font-['Roboto'] font-light max-w-md mx-auto mb-12"
          style={{ color: 'white' }}
        >
          Connect with people nearby through spontaneous video chats
        </p>
        
        <Button 
          onClick={() => setLocation('/home')}
          className="px-10 py-6 rounded-full text-lg font-medium transition-transform hover:scale-105"
          style={{ 
            backgroundColor: 'var(--primary-coral)',
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