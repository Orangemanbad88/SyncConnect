import React from 'react';
import SyncLogo from './SyncLogo';
import { useAmbient } from '@/context/AmbientContext';

interface HeroHeaderProps {
  opacity: number;
}

const HeroHeader: React.FC<HeroHeaderProps> = ({ opacity }) => {
  const { background, highlight, text, timeOfDay } = useAmbient();

  return (
    <div 
      className="absolute top-0 left-0 w-full shadow-lg z-10 transition-all duration-700 ease-in-out"
      style={{ 
        opacity: opacity,
        height: `${Math.max(200, 400 * opacity)}px`,
        backgroundColor: background,
        color: highlight
      }}
    >
      <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center h-full">
        <SyncLogo className="w-32 h-32 mb-6" />
        <h1 className="mt-6 text-6xl app-title tracking-[0.25em]" style={{ color: highlight }}>
          S Y N C
        </h1>
        <p className="mt-6 text-2xl app-description max-w-2xl text-center leading-relaxed" style={{ color: text }}>
          Connect with nearby people through live video chats
        </p>
        <div className="mt-4 px-4 py-2 rounded-full bg-white bg-opacity-60 text-sm">
          {timeOfDay.charAt(0).toUpperCase() + timeOfDay.slice(1)} vibes
        </div>
      </div>
    </div>
  );
};

export default HeroHeader;