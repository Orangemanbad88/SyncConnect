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
              0 0 5px rgba(255, 91, 91, 0.7),
              0 0 10px rgba(255, 91, 91, 0.5),
              0 0 15px rgba(255, 91, 91, 0.3),
              0 0 20px rgba(255, 91, 91, 0.2)
            `,
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            // Add a reddish metallic sheen effect
            background: 'linear-gradient(to bottom, #FF5B5B 0%, #E04545 50%, #FF3838 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 3px rgba(255, 91, 91, 0.7))',
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