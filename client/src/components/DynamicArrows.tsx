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
        {/* Full circle with clockwise arrow */}
        <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="50" 
            stroke="white" 
            strokeWidth="4"
            strokeDasharray="5 3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8
            }}
          />
          <path 
            d="M130 80 L120 70 M130 80 L120 90" 
            stroke="white" 
            strokeWidth="4" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8
            }}
          />
        </g>
        
        {/* Full circle with counter-clockwise arrow */}
        <g className="animate-spin-slow-reverse" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="35" 
            stroke="white" 
            strokeWidth="3"
            strokeDasharray="3 3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.6
            }}
          />
          <path 
            d="M115 80 L105 70 M115 80 L105 90" 
            stroke="white" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            transform="rotate(180, 80, 80)"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.6
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