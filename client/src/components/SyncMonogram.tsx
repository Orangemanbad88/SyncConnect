import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      {/* Monogram container with rounded corners and off-white background */}
      <div className="relative flex items-center justify-center bg-[#F9FAFB] rounded-lg p-1.5 shadow-md">
        {/* SVG for the stylized "S" */}
        <svg 
          width="24" 
          height="24" 
          viewBox="0 0 24 24" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="relative"
          style={{ filter: 'drop-shadow(1px 1px 1px rgba(248, 113, 113, 0.7))' }}
        >
          {/* Coral shadow layer */}
          <path
            d="M18 9.5C18 5.5 15 5 12 5C9 5 6 5.5 6 8.5C6 11.5 9 12 12 12C15 12 18 12.5 18 15.5C18 18.5 15 19 12 19C9 19 6 18.5 6 14.5"
            stroke="#F87171"
            strokeWidth="4"
            strokeLinecap="round"
            style={{ opacity: 0.7 }}
          />
          
          {/* Main blue S */}
          <path
            d="M18 9.5C18 5.5 15 5 12 5C9 5 6 5.5 6 8.5C6 11.5 9 12 12 12C15 12 18 12.5 18 15.5C18 18.5 15 19 12 19C9 19 6 18.5 6 14.5"
            stroke="#3B82F6"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

export default SyncMonogram;