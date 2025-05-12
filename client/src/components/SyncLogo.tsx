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
          className="text-6xl font-black uppercase relative inline-block"
          style={{ 
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.3)',
          }}
        >
          {/* Invisible text to maintain proper dimensions */}
          <span className="opacity-0">SYNC</span>
          
          {/* Red half (S and Y) */}
          <span className="absolute inset-0 left-0" style={{
            textShadow: `
              0 0 5px rgba(255, 255, 255, 0.7),
              0 0 10px rgba(239, 68, 68, 0.7),
              0 0 15px rgba(239, 68, 68, 0.5),
              0 0 25px rgba(239, 68, 68, 0.4)
            `,
            clipPath: 'polygon(0 0, 50% 0, 50% 100%, 0 100%)',
            WebkitBackgroundClip: 'text',
            background: 'linear-gradient(to right, #FFFFFF 0%, #F87171 15%, #EF4444 45%, #dc2626 85%, #FFFFFF 100%)',
            WebkitTextFillColor: 'transparent',
            width: '100%',
          }}>SYNC</span>
          
          {/* Blue half (N and C) */}
          <span className="absolute inset-0 left-0" style={{
            textShadow: `
              0 0 5px rgba(255, 255, 255, 0.7),
              0 0 10px rgba(59, 130, 246, 0.8),
              0 0 15px rgba(37, 99, 235, 0.7),
              0 0 25px rgba(29, 78, 216, 0.6)
            `,
            clipPath: 'polygon(50% 0, 100% 0, 100% 100%, 50% 100%)',
            WebkitBackgroundClip: 'text',
            background: 'linear-gradient(to right, #FFFFFF 0%, #3B82F6 15%, #1D4ED8 45%, #0031b0 85%, #FFFFFF 100%)',
            WebkitTextFillColor: 'transparent',
            width: '100%',
          }}>SYNC</span>
        </h1>
        
{/* Removed underline */}
      </div>
    </div>
  );
};

export default SyncLogo;