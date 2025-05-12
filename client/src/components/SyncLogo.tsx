import React from 'react';

interface SyncLogoProps {
  className?: string;
}

const SyncLogo: React.FC<SyncLogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Outer blue circle that spins clockwise */}
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full animate-spin-slow">
        {/* White background circle */}
        <circle cx="12" cy="12" r="11" fill="white" />
        
        {/* Blue semicircle with arrow */}
        <path
          d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22"
          stroke="var(--primary-blue)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Blue arrow */}
        <path
          d="M7 6L3 5L4 9"
          stroke="var(--primary-blue)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Inner coral circle that spins counter-clockwise */}
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
           className="w-5/6 h-5/6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-spin-slow-reverse">
        {/* Coral semicircle with arrow */}
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2"
          stroke="var(--primary-coral)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Coral arrow */}
        <path
          d="M17 18L21 19L20 15"
          stroke="var(--primary-coral)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};

export default SyncLogo;