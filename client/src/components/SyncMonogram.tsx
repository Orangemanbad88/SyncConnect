import React from 'react';

interface SyncMonogramProps {
  className?: string;
}

const SyncMonogram: React.FC<SyncMonogramProps> = ({ className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D5A3" />
            <stop offset="50%" stopColor="#C9A962" />
            <stop offset="100%" stopColor="#E8D5A3" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background */}
        <rect
          x="1"
          y="1"
          width="30"
          height="30"
          rx="6"
          fill="#0D0F12"
          stroke="rgba(201, 169, 98, 0.3)"
          strokeWidth="1"
        />

        {/* Left face - simple profile silhouette */}
        <path
          d="M5 24
             L5 20
             C5 18 6 16 7 15
             L8 14
             C8 13 8 12 7 11
             C7 9 8 7 10 7
             L11 7
             C12 7 13 9 12 11
             L12 14
             C12 15 13 16 13 18
             L13 24"
          fill="none"
          stroke="#C9A962"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Right face - mirrored profile */}
        <path
          d="M27 24
             L27 20
             C27 18 26 16 25 15
             L24 14
             C24 13 24 12 25 11
             C25 9 24 7 22 7
             L21 7
             C20 7 19 9 20 11
             L20 14
             C20 15 19 16 19 18
             L19 24"
          fill="none"
          stroke="#C9A962"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Lightning bolt in center */}
        <g filter="url(#glow)">
          <path
            d="M18 8 L15 15 L17 15 L14 24 L17 17 L15 17 L18 8"
            fill="url(#boltGradient)"
            stroke="#C9A962"
            strokeWidth="0.5"
          />
        </g>

        {/* Spark dots */}
        <circle cx="14" cy="10" r="1" fill="#C9A962" opacity="0.8">
          <animate attributeName="opacity" values="0.8;0.3;0.8" dur="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="18" cy="22" r="1" fill="#C9A962" opacity="0.6">
          <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1.3s" repeatCount="indefinite" />
        </circle>
      </svg>
    </div>
  );
};

export default SyncMonogram;
