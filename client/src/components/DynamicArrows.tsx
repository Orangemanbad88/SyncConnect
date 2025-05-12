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
        {/* Outer slow spinning circle */}
        <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="55" 
            stroke="white" 
            strokeWidth="2"
            strokeDasharray="7 4"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.4))',
              opacity: 0.6
            }}
          />
        </g>

        {/* Middle spinning circle */}
        <g className="animate-spin-medium" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="45" 
            stroke="white" 
            strokeWidth="2.5"
            strokeDasharray="5 3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8
            }}
          />
          
          {/* Crossing arrows */}
          <path 
            d="M115 45 L125 55 M115 45 L105 35" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8
            }}
          />
          
          <path 
            d="M45 45 L35 55 M45 45 L55 35" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8
            }}
          />
        </g>
        
        {/* Counter-spinning crossing arrows */}
        <g className="animate-spin-slow-reverse" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="35" 
            stroke="white" 
            strokeWidth="2"
            strokeDasharray="3 2"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.7
            }}
          />
          
          <path 
            d="M45 115 L55 125 M45 115 L35 105" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.8
            }}
          />
          
          <path 
            d="M115 115 L105 125 M115 115 L125 105" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
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