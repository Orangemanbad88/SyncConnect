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
        {/* Title text */}
        <text 
          x="80" 
          y="20" 
          textAnchor="middle" 
          fontSize="14" 
          fontFamily="Arial, sans-serif" 
          fill="white" 
          opacity="0.9"
          style={{ 
            filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))'
          }}
        >
          Syncing Vortex
        </text>

        {/* Outer blue spiral circle */}
        <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="55" 
            stroke="#3B82F6" /* Primary blue */
            strokeWidth="2.5"
            strokeDasharray="8 5"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))',
              opacity: 0.8
            }}
          />
          {/* Blue arrows */}
          <path 
            d="M125 80 L115 70 M125 80 L115 90" 
            stroke="#3B82F6" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              opacity: 0.9
            }}
          />
        </g>

        {/* Middle spinning vortex - pink/coral */}
        <g className="animate-spin-medium" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="45" 
            stroke="#F87171" /* Coral color */
            strokeWidth="2.5"
            strokeDasharray="5 3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.7))',
              opacity: 0.8
            }}
          />
          
          {/* Coral crossing arrows */}
          <path 
            d="M115 45 L125 55 M115 45 L105 35" 
            stroke="#F87171" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              opacity: 0.9
            }}
          />
        </g>
        
        {/* Counter-spinning inner vortex - combines both colors */}
        <g className="animate-spin-slow-reverse" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r="35" 
            stroke="white" 
            strokeWidth="2"
            strokeDasharray="10 5"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))',
              opacity: 0.7
            }}
          />
          
          {/* Blue arrow */}
          <path 
            d="M45 115 L55 125 M45 115 L35 105" 
            stroke="#3B82F6" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              opacity: 0.9
            }}
          />
          
          {/* Coral arrow */}
          <path 
            d="M115 115 L105 125 M115 115 L125 105" 
            stroke="#F87171" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              opacity: 0.9
            }}
          />
        </g>
        
        {/* Center glow effect */}
        <circle 
          cx="80" 
          cy="80" 
          r="15" 
          fill="url(#blueToCoralGradient)"
          opacity="0.3"
          style={{ 
            filter: 'blur(5px)',
          }}
        />
        
        {/* Center dot with gradient */}
        <circle 
          cx="80" 
          cy="80" 
          r="6" 
          fill="url(#blueToCoralGradient)"
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
        
        {/* Spiral Convergence effect */}
        <path
          d="M80,25 Q120,50 100,80 T80,135 Q40,110 60,80 T80,25"
          fill="none"
          stroke="url(#blueToCoralGradient)"
          strokeWidth="1.5"
          strokeDasharray="3 5"
          opacity="0.4"
          style={{ 
            filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))',
          }}
        />
      </svg>
    </div>
  );
};

export default DynamicArrows;