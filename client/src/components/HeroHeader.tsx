import React from 'react';
import SyncLogo from './SyncLogo';

interface HeroHeaderProps {
  opacity: number;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ opacity }) => {
  return (
    <div 
      className="absolute top-0 left-0 w-full bg-[#FEF3F2] text-[var(--primary-coral)] shadow-lg z-10 transition-all duration-700 ease-in-out"
      style={{ 
        opacity: opacity,
        height: `${Math.max(120, 300 * opacity)}px` 
      }}
    >
      <div className="container mx-auto px-6 py-8 flex flex-col items-center justify-center h-full">
        <SyncLogo className="w-24 h-24" />
        <h1 className="mt-4 text-5xl font-['Poppins'] font-bold text-[var(--primary-coral)] tracking-wider">
          S Y N C
        </h1>
        <p className="mt-3 text-xl text-[var(--primary-blue)] max-w-xl text-center">
          Connect with nearby people through live video chats
        </p>
      </div>
    </div>
  );
};

export default HeroHeader;