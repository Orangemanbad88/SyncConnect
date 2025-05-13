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
      {/* Golden Sunset Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {isHovered && (
          <div 
            className="absolute w-full h-full"
            style={{
              background: 'radial-gradient(circle at bottom, rgba(255, 149, 0, 0.08) 0%, transparent 80%)',
              opacity: 0.7
            }}
          />
        )}
        
        {/* Glow effects */}
        {isHovered && (
          <>
            <div 
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{
                background: 'linear-gradient(to top, rgba(255, 149, 0, 0.1), transparent)',
                filter: 'blur(12px)'
              }}
            />
            <div 
              className="absolute w-full h-16 bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" 
              style={{ 
                top: '45%',
                filter: 'blur(25px)',
                animation: 'wave1 7s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-40 h-40"
              style={{
                background: 'radial-gradient(circle, rgba(255, 202, 40, 0.15) 0%, transparent 70%)',
                filter: 'blur(20px)',
                top: '10%'
              }}
            />
          </>
        )}
      </div>

      {/* Main retro 80s logo text */}
      <div className="relative text-center">
        <h1 
          className="text-6xl gruppo-logo"
          style={{ 
            letterSpacing: isHovered ? '0.2em' : '0.15em',
            textShadow: `
              0 0 2px #fff,
              0 0 5px #FF9500,
              0 0 10px #FF9500,
              0 0 15px #FF9500,
              0 0 30px #FF9500
            `,
            color: '#fff',
            background: 'linear-gradient(to right, #FFCA28 0%, #FF9500 30%, #fff 50%, #FF9500 70%, #FFCA28 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: isHovered ? 'scale(1.1) translateY(-3px)' : 'scale(1)',
            transition: 'all 0.3s ease, letter-spacing 0.5s ease',
            paddingLeft: '0.1em',
            paddingRight: '0.1em',
            fontSize: '5.2rem',
            lineHeight: '1',
            fontWeight: '400',
            filter: 'drop-shadow(0 0 3px rgba(255, 149, 0, 0.7))'
          }}
        >
          SYNC
        </h1>
        
        {/* Glass reflection effect */}
        <div 
          className="text-6xl gruppo-logo absolute top-1/2 left-0 right-0 overflow-hidden"
          style={{
            opacity: 0.2,
            height: '50%',
            transform: 'rotateX(180deg) translateY(-50%)',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.5), transparent)',
            letterSpacing: isHovered ? '0.2em' : '0.15em',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.4)',
            paddingLeft: '0.1em',
            paddingRight: '0.1em',
            fontSize: '5.2rem',
            pointerEvents: 'none'
          }}
        >
          SYNC
        </div>
      </div>
    </div>
  );
};

export default SyncLogo;