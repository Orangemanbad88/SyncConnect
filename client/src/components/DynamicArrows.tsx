import React from 'react';

interface DynamicArrowsProps {
  className?: string;
}

const DynamicArrows: React.FC<DynamicArrowsProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg 
        width="160" 
        height="160" 
        viewBox="0 0 160 160" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="relative"
      >
        {/* First Arrow - Clockwise */}
        <g className="animate-spin-slow">
          <path 
            d="M40 80 A40 40 0 1 0 120 80 M110 70 L120 80 L110 90" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="glow-path"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8
            }}
          />
        </g>
        
        {/* Second Arrow - Counter-Clockwise */}
        <g className="animate-spin-slow-reverse" style={{ transformOrigin: 'center' }}>
          <path 
            d="M120 80 A40 40 0 1 0 40 80 M50 70 L40 80 L50 90" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="glow-path"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8 
            }}
          />
        </g>
        
        {/* Center dot */}
        <circle 
          cx="80" 
          cy="80" 
          r="4" 
          fill="white"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))',
          }}
        />
        
        {/* Outer ring */}
        <circle 
          cx="80" 
          cy="80" 
          r="60" 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="1"
          strokeDasharray="4 4"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default DynamicArrows;