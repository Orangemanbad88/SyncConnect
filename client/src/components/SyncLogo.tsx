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
          className="text-6xl font-black uppercase"
          style={{ 
            textShadow: `
              0 0 5px rgba(255, 255, 255, 0.9),
              0 0 10px rgba(255, 255, 255, 0.7),
              0 0 15px rgba(255, 255, 255, 0.5),
              0 0 20px rgba(255, 255, 255, 0.3)
            `,
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            background: 'linear-gradient(to right, #FFFFFF 0%, #FB7185 10%, #F43F5E 30%, #E11D48 60%, #BE123C 85%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 3px rgba(225, 29, 72, 0.9)) drop-shadow(0 0 5px rgba(190, 18, 60, 0.8))',
            WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.3)',
          }}
        >
          SYNC
        </h1>
        
{/* Removed underline */}
      </div>
    </div>
  );
};

export default SyncLogo;