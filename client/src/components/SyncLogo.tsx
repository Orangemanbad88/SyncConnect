import React, { useState } from 'react';

interface SyncLogoProps {
  className?: string;
}

const SyncLogo: React.FC<SyncLogoProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
      {/* Animated wave effects */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {isHovered && (
          <>
            <div 
              className="absolute w-full h-14 bg-gradient-to-r from-red-800/20 via-red-600/40 to-red-800/20 rounded-full" 
              style={{ 
                top: '45%', 
                animation: 'wave1 3s ease-in-out infinite',
                transform: 'scaleX(0.9) translateY(0px)'
              }}
            />
            <div 
              className="absolute w-full h-12 bg-gradient-to-r from-red-800/10 via-red-500/30 to-red-800/10 rounded-full" 
              style={{ 
                top: '48%', 
                animation: 'wave2 3s ease-in-out infinite 0.2s',
                transform: 'scaleX(0.85) translateY(5px)'
              }}
            />
            <div 
              className="absolute w-full h-10 bg-gradient-to-r from-red-800/5 via-red-400/20 to-red-800/5 rounded-full" 
              style={{ 
                top: '51%', 
                animation: 'wave3 3s ease-in-out infinite 0.4s',
                transform: 'scaleX(0.8) translateY(10px)'
              }}
            />
          </>
        )}
      </div>

      {/* Main text with Roman inscription/chiseled effect */}
      <div className="relative font-cinzel font-bold tracking-wider text-center">
        {/* Base text */}
        <h1 
          className="text-6xl font-black uppercase"
          style={{ 
            textShadow: `
              0 0 1px #FFFFFF,
              0 0 2px #FFFFFF,
              0 0 3px #FFFFFF
            `,
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            background: 'linear-gradient(to right, #FFFFFF 0%, #FCA5A5 5%, #EF4444 20%, #DC2626 40%, #B91C1C 60%, #991B1B 80%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 1px rgba(255, 0, 0, 1)) drop-shadow(0 0 2px rgba(255, 0, 0, 1))',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.8)',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease'
          }}
        >
          SYNC
        </h1>
      </div>
    </div>
  );
};

export default SyncLogo;