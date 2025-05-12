import React from 'react';

interface SyncLogoProps {
  className?: string;
}

const SyncLogo: React.FC<SyncLogoProps> = ({ className = "w-8 h-8" }) => {
  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <circle cx="12" cy="12" r="10" fill="var(--neutral-offwhite)" />
        
        {/* Blue arrow curving upward */}
        <g className="animate-spin-slow">
          <path
            d="M12 4C7.58172 4 4 7.58172 4 12C4 13.8409 4.60557 15.5463 5.63449 16.9096"
            stroke="var(--primary-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M6.5 17L5 14.5L2.5 16"
            stroke="var(--primary-blue)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        
        {/* Coral arrow curving downward */}
        <g className="animate-spin-slow-reverse">
          <path
            d="M12 20C16.4183 20 20 16.4183 20 12C20 10.1591 19.3944 8.45374 18.3655 7.09043"
            stroke="var(--primary-coral)"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <path
            d="M17.5 7L19 9.5L21.5 8"
            stroke="var(--primary-coral)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    </div>
  );
};

export default SyncLogo;