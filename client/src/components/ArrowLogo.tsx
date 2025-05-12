import React from 'react';

interface CircularArrowsProps {
  className?: string;
}

const CircularArrows: React.FC<CircularArrowsProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg 
        width="100" 
        height="100" 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="animate-[spin_4s_linear_infinite]"
        style={{ 
          filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))'
        }}
      >
        {/* Circular arrows */}
        <g opacity="0.9">
          {/* First arrow (clockwise) */}
          <path 
            d="M30 50 A20 20 0 1 1 70 50 M65 45 L70 50 L65 55" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          />
          
          {/* Second arrow (counter-clockwise) */}
          <path 
            d="M70 50 A20 20 0 1 1 30 50 M35 45 L30 50 L35 55" 
            stroke="white" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            opacity="0.7"
          />
        </g>

        {/* Outer circle */}
        <circle 
          cx="50" 
          cy="50" 
          r="40" 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="2"
          fill="none"
          strokeDasharray="5,3"
        />
      </svg>
    </div>
  );
};

export default CircularArrows;