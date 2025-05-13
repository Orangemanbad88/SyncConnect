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
        {/* Background glow */}
        <circle 
          cx="80" 
          cy="80" 
          r="40" 
          fill="url(#pulseGlowGradient)"
          style={{ 
            opacity: isHovered ? 0.15 : 0.05,
            transition: 'all 0.5s ease',
            filter: isHovered ? 'blur(15px)' : 'blur(10px)'
          }}
        />
        
        {/* Left Pulse (Blue) */}
        <path 
          d="M30 80 L45 80 L50 60 L60 100 L65 60 L70 90 L75 80 L80 80"
          stroke="url(#bluePulseGradient)" 
          strokeWidth={isHovered ? 4 : 3}
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
          className={isHovered ? "animate-pulse-line" : ""}
          style={{ 
            filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.85
          }}
        />
        
        {/* Right Pulse (Red) */}
        <path 
          d="M130 80 L115 80 L110 60 L100 100 L95 60 L90 90 L85 80 L80 80"
          stroke="url(#redPulseGradient)" 
          strokeWidth={isHovered ? 4 : 3}
          strokeLinecap="round" 
          strokeLinejoin="round"
          fill="none"
          className={isHovered ? "animate-pulse-line-delayed" : ""}
          style={{ 
            filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.85
          }}
        />
        
        {/* Center connecting circle */}
        <circle 
          cx="80" 
          cy="80" 
          r={isHovered ? 5 : 4}
          fill="white"
          className="animate-pulse-circle"
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(255, 255, 255, 0.9))',
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Intertwining elements */}
        <g className={isHovered ? "animate-pulse-intertwine" : ""}>
          {/* Blue intertwining element */}
          <path 
            d="M60 80 C65 75 70 65 80 65 C70 65 65 55 60 50"
            stroke="url(#blueIntertwineGradient)" 
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
              opacity: isHovered ? 0.9 : 0.7
            }}
          />
          
          {/* Blue intertwining element (bottom) */}
          <path 
            d="M60 80 C65 85 70 95 80 95 C70 95 65 105 60 110"
            stroke="url(#blueIntertwineGradient)" 
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
              opacity: isHovered ? 0.9 : 0.7
            }}
          />
          
          {/* Red intertwining element */}
          <path 
            d="M100 80 C95 75 90 65 80 65 C90 65 95 55 100 50"
            stroke="url(#redIntertwineGradient)" 
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 4px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
              opacity: isHovered ? 0.9 : 0.7
            }}
          />
          
          {/* Red intertwining element (bottom) */}
          <path 
            d="M100 80 C95 85 90 95 80 95 C90 95 95 105 100 110"
            stroke="url(#redIntertwineGradient)" 
            strokeWidth="2.5"
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 4px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
              opacity: isHovered ? 0.9 : 0.7
            }}
          />
        </g>
        
        {/* Pulse particles */}
        {isHovered && (
          <>
            {/* Blue side particles */}
            <circle cx="45" cy="80" r="1.2" fill="#60A5FA" className="animate-pulse-particle" style={{ animationDelay: '0s' }} />
            <circle cx="55" cy="80" r="1" fill="#60A5FA" className="animate-pulse-particle" style={{ animationDelay: '0.4s' }} />
            <circle cx="65" cy="80" r="1.4" fill="#60A5FA" className="animate-pulse-particle" style={{ animationDelay: '0.8s' }} />
            <circle cx="75" cy="80" r="0.8" fill="#60A5FA" className="animate-pulse-particle" style={{ animationDelay: '1.2s' }} />
            
            {/* Red side particles */}
            <circle cx="115" cy="80" r="1.2" fill="#F87171" className="animate-pulse-particle" style={{ animationDelay: '0.2s' }} />
            <circle cx="105" cy="80" r="1" fill="#F87171" className="animate-pulse-particle" style={{ animationDelay: '0.6s' }} />
            <circle cx="95" cy="80" r="1.4" fill="#F87171" className="animate-pulse-particle" style={{ animationDelay: '1.0s' }} />
            <circle cx="85" cy="80" r="0.8" fill="#F87171" className="animate-pulse-particle" style={{ animationDelay: '1.4s' }} />
            
            {/* Center white particles */}
            <circle cx="80" cy="70" r="1" fill="white" className="animate-pulse-center-particle" style={{ animationDelay: '0s' }} />
            <circle cx="80" cy="90" r="1" fill="white" className="animate-pulse-center-particle" style={{ animationDelay: '0.5s' }} />
            <circle cx="70" cy="80" r="1" fill="white" className="animate-pulse-center-particle" style={{ animationDelay: '1.0s' }} />
            <circle cx="90" cy="80" r="1" fill="white" className="animate-pulse-center-particle" style={{ animationDelay: '1.5s' }} />
          </>
        )}
        
        {/* Gradients */}
        <defs>
          <radialGradient id="pulseGlowGradient" cx="80" cy="80" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="bluePulseGradient" x1="30" y1="80" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="1" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="redPulseGradient" x1="130" y1="80" x2="80" y2="80" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FECACA" stopOpacity="1" />
            <stop offset="50%" stopColor="#F87171" stopOpacity="1" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="blueIntertwineGradient" x1="60" y1="50" x2="80" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="1" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="1" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="redIntertwineGradient" x1="100" y1="50" x2="80" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FECACA" stopOpacity="1" />
            <stop offset="50%" stopColor="#FCA5A5" stopOpacity="1" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Add styles for animations */}
        <style>
          {`
            @keyframes pulse-line {
              0% { stroke-width: 3px; opacity: 0.85; }
              50% { stroke-width: 4px; opacity: 1; }
              100% { stroke-width: 3px; opacity: 0.85; }
            }
            
            @keyframes pulse-line-delayed {
              0% { stroke-width: 3px; opacity: 0.85; }
              50% { stroke-width: 4px; opacity: 1; }
              100% { stroke-width: 3px; opacity: 0.85; }
            }
            
            @keyframes pulse-circle {
              0% { r: 4px; opacity: 0.9; }
              50% { r: 5px; opacity: 1; }
              100% { r: 4px; opacity: 0.9; }
            }
            
            @keyframes pulse-intertwine {
              0% { transform: scale(1); opacity: 0.7; }
              50% { transform: scale(1.05); opacity: 0.9; }
              100% { transform: scale(1); opacity: 0.7; }
            }
            
            @keyframes pulse-particle {
              0% { opacity: 0; transform: translate(0, 0); }
              25% { opacity: 1; transform: translate(var(--dx, 0), var(--dy, -3px)); }
              100% { opacity: 0; transform: translate(var(--dx, 0), var(--dy, -6px)); }
            }
            
            @keyframes pulse-center-particle {
              0% { opacity: 0; transform: scale(0.5); }
              50% { opacity: 1; transform: scale(1.5); }
              100% { opacity: 0; transform: scale(0.5); }
            }
            
            .animate-pulse-line {
              animation: pulse-line 1.5s ease-in-out infinite;
            }
            
            .animate-pulse-line-delayed {
              animation: pulse-line-delayed 1.5s ease-in-out infinite 0.25s;
            }
            
            .animate-pulse-circle {
              animation: pulse-circle 1.5s ease-in-out infinite;
            }
            
            .animate-pulse-intertwine {
              animation: pulse-intertwine 3s ease-in-out infinite;
            }
            
            .animate-pulse-particle {
              animation: pulse-particle 2s ease-out infinite;
              --dx: 0px;
              --dy: -6px;
            }
            
            .animate-pulse-particle:nth-child(even) {
              --dy: 6px;
            }
            
            .animate-pulse-particle:nth-child(3n) {
              --dx: -3px;
              --dy: 3px;
            }
            
            .animate-pulse-particle:nth-child(3n+1) {
              --dx: 3px;
              --dy: 3px;
            }
            
            .animate-pulse-center-particle {
              animation: pulse-center-particle 2s ease-in-out infinite;
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default TwinFlames;