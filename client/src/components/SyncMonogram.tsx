import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monogram container with blue/red background */}
      <div className="relative flex items-center justify-center bg-[#111111] rounded-lg p-1.5 shadow-md overflow-hidden">
        {/* Background gradient */}
        <div 
          className="absolute inset-0 w-full h-full"
          style={{
            background: 'radial-gradient(circle at top left, rgba(0, 98, 255, 0.15) 0%, rgba(0, 0, 0, 0) 70%)',
            zIndex: 0
          }}
        />
        
        {/* Subtle red glow */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at bottom right, rgba(255, 31, 90, 0.1) 0%, transparent 70%)',
            filter: 'blur(5px)',
            zIndex: 1
          }}
        />
        
        {/* Text S in Gruppo style */}
        <div 
          className="gruppo-logo text-xl flex items-center justify-center relative z-10"
          style={{ 
            background: 'linear-gradient(90deg, #0062ff 0%, #3b89ff 30%, #fff 50%, #ff1f5a 70%, #ff0037 100%)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: `
              0 0 2px #fff,
              0 0 4px #0062ff,
              0 0 6px #ff1f5a
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