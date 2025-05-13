import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monogram container with modern background */}
      <div className="relative flex items-center justify-center bg-[#111111] rounded-lg p-1.5 shadow-md overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(circle at center, rgba(0, 61, 125, 0.3) 0%, rgba(0, 0, 0, 0) 70%)',
            zIndex: 0
          }}
        />
        
        {/* Subtle blue glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle, rgba(0, 127, 255, 0.15) 0%, transparent 70%)',
            filter: 'blur(5px)',
            zIndex: 1
          }}
        />
        
        {/* Text S in Russo One style */}
        <div 
          className="russo-one-logo text-xl flex items-center justify-center relative z-10"
          style={{ 
            background: 'linear-gradient(90deg, #0059B2 0%, #007FFF 40%, #fff 50%, #007FFF 60%, #0059B2 100%)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `
              0 0 2px #fff,
              0 0 4px #007FFF,
              0 0 6px #007FFF
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