import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monogram container with rounded corners and off-white background */}
      <div className="relative flex items-center justify-center bg-[#F9FAFB] rounded-lg p-1.5 shadow-md">
        {/* Text S in Archivo Black */}
        <div 
          className="archive-black-logo text-xl font-bold flex items-center justify-center"
          style={{ 
            background: 'linear-gradient(90deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)', 
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0px 1px 1px rgba(239, 68, 68, 0.8))', 
            textShadow: '0px 0px 1px rgba(255, 255, 255, 0.5)',
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