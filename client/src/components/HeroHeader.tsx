import React from 'react';
import SyncLogo from './SyncLogo';

interface HeroHeaderProps {
  opacity: number;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ opacity }) => {
  return (
    <div 
      className="absolute top-0 left-0 w-full bg-[var(--neutral-tan)] text-[var(--primary-coral)] shadow-lg z-10 transition-all duration-700 ease-in-out"
      style={{ 
        opacity: opacity,
        height: `${Math.max(200, 400 * opacity)}px` 
      }}
    >
      <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center h-full">
        <SyncLogo className="w-32 h-32 mb-6" />
        <h1 className="mt-6 text-6xl app-title text-[var(--primary-coral)] tracking-[0.25em]">
          S Y N C
        </h1>
        <p className="mt-6 text-2xl app-description text-[var(--primary-blue)] max-w-2xl text-center leading-relaxed">
          Connect with nearby people through live video chats
        </p>
      </div>
    </div>
  );
};

export default HeroHeader;