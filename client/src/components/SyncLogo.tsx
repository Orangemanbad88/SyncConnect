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
      {/* Subtle Modern Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {isHovered && (
          <div 
            className="absolute w-full h-full"
            style={{
              background: 'radial-gradient(circle at bottom, rgba(0, 127, 255, 0.05) 0%, transparent 80%)',
              opacity: 0.5
            }}
          />
        )}
        
        {/* Glow effects */}
        {isHovered && (
          <>
            <div 
              className="absolute bottom-0 left-0 right-0 h-12"
              style={{
                background: 'linear-gradient(to top, rgba(0, 127, 255, 0.1), transparent)',
                filter: 'blur(8px)'
              }}
            />
            <div 
              className="absolute w-full h-16 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent" 
              style={{ 
                top: '45%',
                filter: 'blur(25px)',
                animation: 'wave1 7s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute left-1/2 transform -translate-x-1/2 w-32 h-32"
              style={{
                background: 'radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)',
                filter: 'blur(15px)',
                top: '10%'
              }}
            />
          </>
        )}
      </div>

      {/* Main retro 80s logo text */}
      <div className="relative text-center">
        <h1 
          className="text-6xl russo-one-logo"
          style={{ 
            letterSpacing: isHovered ? '0.15em' : '0.08em',
            textShadow: `
              0 0 2px #fff,
              0 0 4px #fff,
              0 0 8px #007FFF,
              0 0 15px #007FFF,
              0 0 30px #007FFF
            `,
            color: '#fff',
            background: 'linear-gradient(to right, #0059B2 0%, #007FFF 40%, #fff 50%, #007FFF 60%, #0059B2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: isHovered ? 'scale(1.05) translateY(-2px)' : 'scale(1)',
            transition: 'all 0.3s ease, letter-spacing 0.5s ease',
            paddingLeft: '0.1em',
            paddingRight: '0.1em',
            fontSize: '5rem',
            fontWeight: 'normal',
            filter: 'drop-shadow(0 0 3px rgba(0, 127, 255, 0.7))'
          }}
        >
          SYNC
        </h1>
        
        {/* Chrome/metal reflection effect */}
        <div 
          className="text-6xl russo-one-logo absolute top-1/2 left-0 right-0 overflow-hidden"
          style={{
            opacity: 0.3,
            height: '50%',
            transform: 'rotateX(180deg) translateY(-50%)',
            background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0.4), transparent)',
            letterSpacing: isHovered ? '0.15em' : '0.08em',
            color: 'transparent',
            WebkitBackgroundClip: 'text',
            WebkitTextStroke: '1px rgba(255, 255, 255, 0.3)',
            paddingLeft: '0.1em',
            paddingRight: '0.1em',
            fontSize: '5rem',
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