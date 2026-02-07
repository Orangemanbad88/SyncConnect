import React, { useState } from 'react';

interface TwinFlamesProps {
  className?: string;
}

const TwinFlames: React.FC<TwinFlamesProps> = ({ className = '' }) => {
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
        {/* Outer ring */}
        <circle
          cx="80"
          cy="80"
          r="60"
          stroke="url(#ringGradient)"
          strokeWidth="1"
          fill="none"
          style={{
            opacity: isHovered ? 0.6 : 0.3,
            transition: 'all 0.5s ease'
          }}
        />

        {/* Background glow */}
        <circle
          cx="80"
          cy="80"
          r="45"
          fill="url(#centerGlow)"
          style={{
            opacity: isHovered ? 0.4 : 0.2,
            transition: 'all 0.5s ease',
            filter: 'blur(8px)'
          }}
        />

        {/* Left person silhouette */}
        <g
          style={{
            filter: 'drop-shadow(0 0 10px rgba(201, 169, 98, 0.6))',
            transition: 'all 0.4s ease',
            opacity: isHovered ? 1 : 0.9
          }}
        >
          {/* Head */}
          <circle cx="45" cy="55" r="18" fill="url(#leftFaceGradient)" />
          {/* Body */}
          <path
            d="M25 80 Q45 95, 65 80 L60 120 L30 120 Z"
            fill="url(#leftFaceGradient)"
          />
        </g>

        {/* Right person silhouette */}
        <g
          style={{
            filter: 'drop-shadow(0 0 10px rgba(193, 119, 103, 0.6))',
            transition: 'all 0.4s ease',
            opacity: isHovered ? 1 : 0.9
          }}
        >
          {/* Head */}
          <circle cx="115" cy="55" r="18" fill="url(#rightFaceGradient)" />
          {/* Body */}
          <path
            d="M95 80 Q115 95, 135 80 L130 120 L100 120 Z"
            fill="url(#rightFaceGradient)"
          />
        </g>

        {/* Electric connection between people */}
        <g filter="url(#electricGlow)">
          {/* Main lightning bolt */}
          <path
            d="M65 70 L72 78 L68 78 L80 95 L76 85 L80 85 L73 70
               M95 70 L88 78 L92 78 L80 95 L84 85 L80 85 L87 70"
            fill="url(#boltGradient)"
            stroke="#E8D5A3"
            strokeWidth="1"
            style={{
              opacity: isHovered ? 1 : 0.8,
              transition: 'all 0.4s ease'
            }}
          />
        </g>

        {/* Center energy point */}
        <circle
          cx="80"
          cy="75"
          r={isHovered ? 5 : 4}
          fill="#E8D5A3"
          style={{
            filter: 'drop-shadow(0 0 10px rgba(201, 169, 98, 1))',
            transition: 'all 0.4s ease'
          }}
        />

        {/* Animated spark particles */}
        <circle cx="70" cy="60" r="2" fill="#C9A962">
          <animate attributeName="opacity" values="0.9;0.2;0.9" dur="1.2s" repeatCount="indefinite" />
        </circle>
        <circle cx="90" cy="60" r="2" fill="#C17767">
          <animate attributeName="opacity" values="0.7;0.2;0.7" dur="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="75" cy="90" r="1.5" fill="#C9A962">
          <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.8s" repeatCount="indefinite" />
        </circle>
        <circle cx="85" cy="90" r="1.5" fill="#C17767">
          <animate attributeName="opacity" values="0.6;0.1;0.6" dur="1.3s" repeatCount="indefinite" />
        </circle>

        {/* Energy particles floating between people */}
        <circle cx="65" cy="75" r="2" fill="#E8D5A3">
          <animate attributeName="cx" values="65;95;65" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.3;1" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="95" cy="70" r="1.5" fill="#C9A962">
          <animate attributeName="cx" values="95;65;95" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
        </circle>

        {/* Gradients */}
        <defs>
          <linearGradient id="ringGradient" x1="20" y1="80" x2="140" y2="80">
            <stop offset="0%" stopColor="#C9A962" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#E8E4DF" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#C17767" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="centerGlow" cx="80" cy="80" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A962" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#C9A962" stopOpacity="0" />
          </radialGradient>

          <linearGradient id="leftFaceGradient" x1="40" y1="50" x2="65" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4B87A" />
            <stop offset="50%" stopColor="#C9A962" />
            <stop offset="100%" stopColor="#B8943F" />
          </linearGradient>

          <linearGradient id="rightFaceGradient" x1="120" y1="50" x2="95" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#D4A574" />
            <stop offset="50%" stopColor="#C17767" />
            <stop offset="100%" stopColor="#A65D4E" />
          </linearGradient>

          <linearGradient id="boltGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8D5A3" />
            <stop offset="50%" stopColor="#C9A962" />
            <stop offset="100%" stopColor="#E8D5A3" />
          </linearGradient>

          <filter id="electricGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default TwinFlames;
