import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monogram container with 80s retro background */}
      <div className="relative flex items-center justify-center bg-[#111111] rounded-lg p-1.5 shadow-md overflow-hidden">
        {/* 80s grid background */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'linear-gradient(to right, rgba(33, 33, 33, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(33, 33, 33, 0.3) 1px, transparent 1px)',
            backgroundSize: '8px 8px',
            transform: 'perspective(200px) rotateX(60deg)',
            transformOrigin: 'center bottom',
            zIndex: 0,
            opacity: 0.3
          }}
        />
        
        {/* Neon glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(255, 17, 119, 0.2) 0%, transparent 70%)',
            filter: 'blur(5px)',
            zIndex: 1
          }}
        />
        
        {/* Text S in 80s retro style */}
        <div 
          className="retro-80s-logo text-xl font-bold flex items-center justify-center relative z-10"
          style={{ 
            background: 'linear-gradient(90deg, #FF1177 0%, #00FFFC 50%, #FF1177 100%)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `
              0 0 2px #fff,
              0 0 5px #FF1177,
              0 0 10px #FF1177
            `,
            width: '24px',
            height: '24px'
          }}
        >
          S
        </div>
      </div>
    </div>
  );
};

export default SyncMonogram;