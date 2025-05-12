import React from 'react';

interface SyncLogoProps {
  className?: string;
}

const SyncLogo: React.FC<SyncLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Main text with Roman inscription/chiseled effect */}
      <div className="relative font-cinzel font-bold tracking-wider text-center">
        {/* Base text */}
        <h1 
          className="text-[#3B82F6] text-6xl font-black uppercase"
          style={{ 
            textShadow: `
              1px 1px 0px #F87171,
              2px 2px 0px rgba(248, 113, 113, 0.7),
              0 0 5px rgba(59, 130, 246, 0.2),
              0 0 10px rgba(59, 130, 246, 0.1)
            `,
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            // Simulate a carved/chiseled appearance
            WebkitTextStroke: '0.5px rgba(0,0,0,0.1)',
          }}
        >
          SYNC
        </h1>
        
        {/* Mysterious glowing underline */}
        <div 
          className="absolute -bottom-1 left-0 right-0 h-1.5 rounded-full"
          style={{ 
            background: 'linear-gradient(90deg, #3B82F6, #F87171)',
            boxShadow: '0 0 12px rgba(59, 130, 246, 0.6)',
            opacity: 0.8
          }}
        ></div>
      </div>
    </div>
  );
};

export default SyncLogo;