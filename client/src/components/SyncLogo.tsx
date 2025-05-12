import React from 'react';

interface SyncLogoProps {
  className?: string;
}

const SyncLogo: React.FC<SyncLogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Base layer with white background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-white"></div>
      </div>
      
      {/* Blue clockwise spinning circle with arrow (reversed direction) */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full absolute inset-0 animate-spin-slow-reverse"
      >
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="var(--primary-blue)" 
          strokeWidth="6"
          strokeDasharray="70 70" 
          strokeLinecap="round"
        />
        
        {/* Blue arrow */}
        <path 
          d="M25 35L15 25L5 35" 
          stroke="var(--primary-blue)" 
          strokeWidth="6" 
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(225, 15, 25)"
        />
      </svg>
      
      {/* Coral spinning circle with arrow (reversed direction) */}
      <svg 
        viewBox="0 0 100 100" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg" 
        className="w-full h-full absolute inset-0 animate-spin-slow"
      >
        <circle 
          cx="50" 
          cy="50" 
          r="45" 
          stroke="var(--primary-coral)" 
          strokeWidth="6"
          strokeDasharray="70 70" 
          strokeDashoffset="70"
          strokeLinecap="round"
        />
        
        {/* Coral arrow */}
        <path 
          d="M75 65L85 75L95 65" 
          stroke="var(--primary-coral)" 
          strokeWidth="6" 
          strokeLinecap="round"
          strokeLinejoin="round"
          transform="rotate(225, 85, 75)"
        />
      </svg>
    </div>
  );
};

export default SyncLogo;