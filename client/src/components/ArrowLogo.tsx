import React from 'react';

interface ArrowLogoProps {
  className?: string;
}

const ArrowLogo: React.FC<ArrowLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg 
        width="80" 
        height="80" 
        viewBox="0 0 80 80" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="animate-pulse"
        style={{ 
          filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.5))'
        }}
      >
        {/* Glowing arrow pointing down */}
        <path 
          d="M40 15 L40 55 M25 40 L40 55 L55 40" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
          strokeLinejoin="round"
          className="transition-all duration-300"
        />
        {/* Outer glow */}
        <circle 
          cx="40" 
          cy="40" 
          r="30" 
          stroke="rgba(255,255,255,0.15)" 
          strokeWidth="1.5"
          fill="none"
        />
      </svg>
    </div>
  );
};

export default ArrowLogo;