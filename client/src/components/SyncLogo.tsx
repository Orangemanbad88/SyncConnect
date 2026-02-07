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
      {/* Subtle glow on hover */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div
          className="absolute w-full h-full transition-opacity duration-500"
          style={{
            background: 'radial-gradient(circle at center, rgba(201, 169, 98, 0.15) 0%, transparent 60%)',
            opacity: isHovered ? 1 : 0.3,
            filter: 'blur(30px)'
          }}
        />
      </div>

      {/* Main logo text */}
      <div className="relative text-center">
        <h1
          style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: '700',
            letterSpacing: isHovered ? '0.2em' : '0.15em',
            color: '#C9A962',
            textShadow: isHovered
              ? '0 0 30px rgba(201, 169, 98, 0.5), 0 0 60px rgba(201, 169, 98, 0.2)'
              : '0 0 20px rgba(201, 169, 98, 0.3)',
            transform: isHovered ? 'scale(1.02)' : 'scale(1)',
            transition: 'all 0.4s ease',
            fontSize: '4rem',
            lineHeight: '1',
          }}
        >
          SYNC
        </h1>
      </div>
    </div>
  );
};

export default SyncLogo;
