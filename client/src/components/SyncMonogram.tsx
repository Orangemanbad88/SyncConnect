import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monogram container with rounded corners and off-white background */}
      <div className="relative flex items-center justify-center bg-[#F9FAFB] rounded-lg p-1.5 shadow-md">
        {/* SVG for the Varela Round-style "S" */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
          style={{ filter: 'drop-shadow(1px 1px 1px rgba(239, 68, 68, 0.8)) drop-shadow(2px 2px 2px rgba(220, 38, 38, 0.6))' }}
        >
          {/* Red shadow/glow layer */}
          <path
            d="M17 8.5C17 8.5 13 6.5 10 8.5C7 10.5 11 13 11 13C11 13 15 15 10 17C8 18 6 16 6 16"
            stroke="#EF4444"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ opacity: 0.7 }}
          />
          
          {/* Main S in rounded Varela Round style */}
          <path
            d="M17 8.5C17 8.5 13 6.5 10 8.5C7 10.5 11 13 11 13C11 13 15 15 10 17C8 18 6 16 6 16"
            stroke="#DC2626"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default SyncMonogram;