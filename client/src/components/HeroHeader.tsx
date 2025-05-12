import React from 'react';
import SyncLogo from './SyncLogo';

interface HeroHeaderProps {
  opacity: number;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ opacity }) => {
  return (
    <div 
      className="absolute top-0 left-0 w-full bg-white shadow-lg z-10 transition-opacity duration-300 ease-in-out"
      style={{ opacity: opacity }}
    >
      <div className="container mx-auto px-6 py-12 flex flex-col items-center">
        <SyncLogo className="w-20 h-20" />
        <h1 className="mt-6 text-5xl font-['Poppins'] font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-blue)] to-[var(--primary-coral)] tracking-wider">
          S Y N C
        </h1>
        <p className="mt-4 text-xl text-gray-600 max-w-xl text-center">
          Connect with nearby people through live video chats. 
          Find meaningful connections in your area.
        </p>
      </div>
    </div>
  );
};

export default HeroHeader;