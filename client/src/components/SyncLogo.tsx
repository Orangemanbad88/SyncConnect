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
      {/* Blue/Red Glow Background */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {isHovered && (
          <div 
            className="absolute w-full h-full"
            style={{
              background: 'radial-gradient(circle at bottom, rgba(0, 98, 255, 0.08) 0%, transparent 80%)',
              opacity: 0.7
            }}
          />
        )}
        
        {/* Glow effects */}
        {isHovered && (
          <>
            <div 
              className="absolute w-full h-16 bg-gradient-to-r from-transparent via-blue-500/15 to-transparent" 
              style={{ 
                top: '35%',
                filter: 'blur(25px)',
                animation: 'wave1 8s ease-in-out infinite'
              }}
            />
            <div 
              className="absolute w-full h-16 bg-gradient-to-r from-transparent via-red-500/15 to-transparent" 
              style={{ 
                top: '55%',
                filter: 'blur(25px)',
                animation: 'wave2 7s ease-in-out infinite'
              }}
            />
          </>
        )}
      </div>

      {/* Main retro 80s logo text */}
      <div className="relative text-center">
        <h1 
          className="text-6xl russo-header"
          style={{ 
            letterSpacing: isHovered ? '0.15em' : '0.1em',
            textShadow: `
              0 0 2px #fff,
              0 0 7px #0062ff,
              0 0 12px #0062ff,
              0 0 18px #ff1f5a,
              0 0 35px #ff1f5a
            `,
            color: '#fff',
            background: 'linear-gradient(to right, #0062ff 0%, #3b89ff 30%, #fff 50%, #ff1f5a 70%, #ff0037 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'all 0.3s ease, letter-spacing 0.5s ease',
            paddingLeft: '0.1em',
            paddingRight: '0.1em',
            fontSize: '4.5rem',
            lineHeight: '1',
            fontWeight: '400'
          }}
        >
          SYNC
        </h1>
      </div>
    </div>
  );
};

export default SyncLogo;