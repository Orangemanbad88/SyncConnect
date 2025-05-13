import React, { useState } from 'react';

interface DynamicArrowsProps {
  className?: string;
}

const DynamicArrows: React.FC<DynamicArrowsProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <div 
      className={`relative ${className}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}>
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
          r={isHovered ? 52 : 50} 
          stroke="white" 
          strokeWidth={isHovered ? 4 : 3}
          fill="none"
          style={{ 
            filter: isHovered 
              ? 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))'
              : 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))',
            opacity: isHovered ? 1 : 0.8,
            transition: 'all 0.3s ease',
          }}
        />
        
        {/* Blue clockwise circle */}
        <g className="animate-spin-slow" style={{ transformOrigin: 'center' }}>
          <circle 
            cx="80" 
            cy="80" 
            r={isHovered ? 47 : 45} 
            stroke="#3B82F6" 
            strokeWidth={isHovered ? 4 : 3}
            fill="none"
            style={{ 
              filter: isHovered 
                ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.9))'
                : 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Blue arrow */}
          <path 
            d="M120 80 L110 70 M120 80 L110 90" 
            stroke="#3B82F6" 
            strokeWidth={isHovered ? 4 : 3}
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: isHovered 
                ? 'drop-shadow(0 0 8px rgba(59, 130, 246, 1)) drop-shadow(0 0 12px rgba(59, 130, 246, 0.8))'
                : 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
              animation: isHovered ? 'pulse 1.5s infinite' : 'none'
            }}
          />
        </g>
        
        {/* Coral clockwise circle (crossing) */}
        <g className="animate-spin-slow-reverse" style={{ transformOrigin: 'center', transformBox: 'fill-box', transform: 'rotate(45deg)' }}>
          <circle 
            cx="80" 
            cy="80" 
            r={isHovered ? 47 : 45} 
            stroke="#F87171" 
            strokeWidth={isHovered ? 4 : 3}
            fill="none"
            style={{ 
              filter: isHovered 
                ? 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.9))'
                : 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Coral arrow */}
          <path 
            d="M40 80 L50 70 M40 80 L50 90" 
            stroke="#F87171" 
            strokeWidth={isHovered ? 4 : 3}
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              filter: isHovered 
                ? 'drop-shadow(0 0 8px rgba(248, 113, 113, 1)) drop-shadow(0 0 12px rgba(248, 113, 113, 0.8))'
                : 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
              animation: isHovered ? 'pulse 1.5s infinite 0.2s' : 'none'
            }}
          />
        </g>
        
        {/* Center dot */}
        <circle 
          cx="80" 
          cy="80" 
          r={isHovered ? 8 : 6} 
          fill="white"
          style={{ 
            filter: isHovered 
              ? 'drop-shadow(0 0 15px rgba(255, 255, 255, 1))'
              : 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))',
            transition: 'all 0.3s ease',
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