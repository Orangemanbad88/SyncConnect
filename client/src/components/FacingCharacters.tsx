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
        
        {/* Connection wave elements */}
        <g>
          {/* First wave - always visible */}
          <path 
            d="M65 70 Q 80 60, 95 70" 
            stroke="rgba(255, 255, 255, 0.4)" 
            strokeWidth="1.5" 
            fill="none"
            strokeDasharray="2,2"
            style={{ 
              filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))',
            }}
          />
          
          {/* Second wave - visible when hovered or animated */}
          <path 
            d="M65 70 Q 80 65, 95 70" 
            stroke="rgba(255, 255, 255, 0.6)" 
            strokeWidth="1.5" 
            fill="none"
            className={isHovered ? "animate-pulse" : ""}
            style={{ 
              filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.6))',
              opacity: isHovered ? 1 : 0.4,
            }}
          />
          
          {/* Third wave - visible only when hovered */}
          {isHovered && (
            <path 
              d="M65 70 Q 80 70, 95 70" 
              stroke="rgba(255, 255, 255, 0.8)" 
              strokeWidth="2" 
              fill="none"
              className="animate-pulse"
              style={{ 
                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.8))',
              }}
            />
          )}
          
          {/* Fourth wave - visible only when hovered */}
          {isHovered && (
            <path 
              d="M65 70 Q 80 75, 95 70" 
              stroke="rgba(255, 255, 255, 1)" 
              strokeWidth="2" 
              fill="none"
              className="animate-pulse"
              style={{ 
                filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))',
                animation: 'pulse 2s infinite',
              }}
            />
          )}
          
          {/* Fifth wave - visible only when hovered */}
          {isHovered && (
            <path 
              d="M65 70 Q 80 80, 95 70" 
              stroke="rgba(255, 255, 255, 0.7)" 
              strokeWidth="1.5" 
              fill="none"
              className="animate-pulse"
              style={{ 
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.7))',
                animation: 'pulse 3s infinite',
              }}
            />
          )}
        </g>
      </svg>
    </div>
  );
};

export default FacingCharacters;