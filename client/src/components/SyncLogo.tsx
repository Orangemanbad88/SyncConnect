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
              0 0 5px rgba(255, 255, 255, 0.7),
              0 0 10px rgba(59, 130, 246, 0.6),
              0 0 15px rgba(59, 130, 246, 0.4),
              0 0 20px rgba(59, 130, 246, 0.3),
              0 0 30px rgba(255, 255, 255, 0.2)
            `,
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            // Add a blue metallic sheen effect with a hint of white
            background: 'linear-gradient(to bottom, #FFFFFF 0%, #3B82F6 15%, #2563EB 50%, #1D4ED8 85%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.7))',
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