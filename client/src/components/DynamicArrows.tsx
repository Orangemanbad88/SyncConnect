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
        {/* Main circle */}
        <circle 
          cx="80" 
          cy="80" 
          r="50" 
          stroke="white" 
          strokeWidth="3"
          fill="none"
          style={{ 
            filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))',
            opacity: 0.8
          }}
        />
        
        {/* Blue clockwise circle */}
        <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="45" 
            stroke="#3B82F6" 
            strokeWidth="3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
            }}
          />
          
          {/* Blue arrow */}
          <path 
            d="M120 80 L110 70 M120 80 L110 90" 
            stroke="#3B82F6" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
            }}
          />
        </g>
        
        {/* Coral clockwise circle (crossing) */}
        <g className="animate-spin-slow-reverse" style={{ transformOrigin: 'center', transformBox: 'fill-box', transform: 'rotate(45deg)' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="45" 
            stroke="#F87171" 
            strokeWidth="3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
            }}
          />
          
          {/* Coral arrow */}
          <path 
            d="M40 80 L50 70 M40 80 L50 90" 
            stroke="#F87171" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
            }}
          />
        </g>
        
        {/* Center dot */}
        <circle 
          cx="80" 
          cy="80" 
          r="6" 
          fill="white"
          style={{ 
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))',
          }}
        />
        
        {/* Gradient definitions */}
        <defs>
          <radialGradient id="blueToCoralGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="1" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
};

export default DynamicArrows;