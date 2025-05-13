import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monogram container with golden background */}
      <div className="relative flex items-center justify-center bg-[#111111] rounded-lg p-1.5 shadow-md overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(255, 149, 0, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
            zIndex: 0
          }}
        />
        
        {/* Subtle golden glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(255, 202, 40, 0.1) 0%, transparent 70%)',
            filter: 'blur(5px)',
            zIndex: 1
          }}
        />
        
        {/* Text S in Gruppo style */}
        <div 
          className="gruppo-logo text-xl flex items-center justify-center relative z-10"
          style={{ 
            background: 'linear-gradient(90deg, #FFCA28 0%, #FF9500 30%, #fff 50%, #FF9500 70%, #FFCA28 100%)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `
              0 0 2px #fff,
              0 0 4px #FF9500,
              0 0 6px #FF9500
            `,
            width: '24px',
            height: '24px',
            fontWeight: '400',
            letterSpacing: '0.1em'
          }}
        >
          S
        </div>
      </div>
    </div>
  );
};

export default SyncMonogram;