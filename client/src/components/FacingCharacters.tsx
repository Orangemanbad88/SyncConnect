import React, { useState } from 'react';

interface FacingCharactersProps {
  className?: string;
}

const FacingCharacters: React.FC<FacingCharactersProps> = ({ className = '' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className={`relative ${className}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={() => setIsHovered(true)}
      onTouchEnd={() => setIsHovered(false)}
    >
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
        
        {/* Blue character (left) */}
        <g className={isHovered ? "animate-pulse" : ""}>
          {/* Head */}
          <circle 
            cx="50" 
            cy="70" 
            r="15" 
            fill="#3B82F6"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Body */}
          <path 
            d="M50 90 L50 120" 
            stroke="#3B82F6" 
            strokeWidth="8" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Arms */}
          <path 
            d="M50 100 L35 90" 
            stroke="#3B82F6" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          <path 
            d="M50 100 L65 95" 
            stroke="#3B82F6" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Legs */}
          <path 
            d="M50 120 L40 140" 
            stroke="#3B82F6" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          <path 
            d="M50 120 L60 140" 
            stroke="#3B82F6" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
        </g>
        
        {/* Red character (right) */}
        <g className={isHovered ? "animate-pulse" : ""}>
          {/* Head */}
          <circle 
            cx="110" 
            cy="70" 
            r="15" 
            fill="#F87171"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Body */}
          <path 
            d="M110 90 L110 120" 
            stroke="#F87171" 
            strokeWidth="8" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Arms */}
          <path 
            d="M110 100 L95 95" 
            stroke="#F87171" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          <path 
            d="M110 100 L125 90" 
            stroke="#F87171" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          
          {/* Legs */}
          <path 
            d="M110 120 L100 140" 
            stroke="#F87171" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
          <path 
            d="M110 120 L120 140" 
            stroke="#F87171" 
            strokeWidth="6" 
            strokeLinecap="round"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
            }}
          />
        </g>
        
        {/* Connection element - pulsing when hovered */}
        {isHovered && (
          <path 
            d="M65 70 L95 70" 
            stroke="#FFFFFF" 
            strokeWidth="2" 
            strokeDasharray="2,2"
            className="animate-pulse"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.9))',
            }}
          />
        )}
      </svg>
    </div>
  );
};

export default FacingCharacters;