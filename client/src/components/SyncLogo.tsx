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
      {/* 80s Retro Grid Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {isHovered && (
          <div 
            className="absolute w-full h-full"
            style={{
              background: 'linear-gradient(to right, rgba(33, 33, 33, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(33, 33, 33, 0.1) 1px, transparent 1px)',
              backgroundSize: '20px 20px',
              transform: 'perspective(500px) rotateX(60deg)',
              transformOrigin: 'center bottom',
              animation: 'grid-move 5s linear infinite',
              opacity: 0.3
            }}
          />
        )}
        
        {/* Neon glow effects */}
        {isHovered && (
          <>
            <div 
              className="absolute bottom-0 left-0 right-0 h-16"
              style={{
                background: 'linear-gradient(to top, rgba(255, 0, 128, 0.2), transparent)',
                filter: 'blur(8px)'
              }}
            />
            <div 
              className="absolute w-full h-16 bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" 
              style={{ 
                top: '45%',
                filter: 'blur(20px)',
                animation: 'wave1 5s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-full h-12 bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" 
              style={{ 
                top: '65%',
                filter: 'blur(15px)',
                animation: 'wave2 6s ease-in-out infinite'
              }}
            />
          </>
        )}
      </div>

      {/* Main retro 80s logo text */}
      <div className="relative text-center">
        <h1 
          className="text-6xl retro-80s-logo"
          style={{ 
            letterSpacing: isHovered ? '0.25em' : '0.15em',
            textShadow: `
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 20px #FF1177,
              0 0 30px #FF1177,
              0 0 40px #FF1177,
              0 0 55px #FF1177,
              0 0 75px #FF1177
            `,
            color: '#fff',
            background: 'linear-gradient(to right, #FF1177 0%, #00FFFC 25%, #FFFC00 50%, #00FFFC 75%, #FF1177 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: isHovered ? 'scale(1.05) skewY(-1deg)' : 'scale(1) skewY(0deg)',
            transition: 'all 0.3s ease, letter-spacing 0.5s ease',
            paddingLeft: '0.2em',
            paddingRight: '0.2em',
            fontSize: '4.5rem',
            fontWeight: 'bold',
            filter: 'drop-shadow(0 0 6px rgba(255, 17, 119, 0.7))'
          }}
        >
          SYNC
        </h1>
        
        {/* Chrome reflection effect */}
        <div 
          className="text-6xl retro-80s-logo absolute top-1/2 left-0 right-0 overflow-hidden"
          style={{
            opacity: 0.3,
            height: '50%',
            transform: 'rotateX(180deg) translateY(-50%)',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.3), transparent)',
            letterSpacing: isHovered ? '0.25em' : '0.15em',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.2)',
            paddingLeft: '0.2em',
            paddingRight: '0.2em',
            fontSize: '4.5rem',
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