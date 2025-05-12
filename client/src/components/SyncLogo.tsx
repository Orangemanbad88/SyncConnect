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
            background: 'linear-gradient(to right, #FFFFFF 0%, #FCA5A5 5%, #EF4444 20%, #DC2626 40%, #B91C1C 60%, #991B1B 80%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 3px rgba(220, 38, 38, 0.9)) drop-shadow(0 0 5px rgba(185, 28, 28, 0.8)) drop-shadow(0 0 8px rgba(153, 27, 27, 0.6))',
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