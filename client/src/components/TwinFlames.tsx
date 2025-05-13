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
        {/* Blue flame (left) */}
        <g className={isHovered ? "animate-pulse" : ""}>
          {/* Base of blue flame */}
          <path 
            d="M50 130 C50 110 55 100 60 95 C65 90 58 85 56 80 C54 75 58 65 60 63 C64 60 55 56 53 50 C51 44 62 38 65 35 C58 50 70 55 72 60 C74 65 66 70 68 75 C70 80 63 85 62 90 C61 95 68 100 68 110 C68 120 60 125 54 130 C52 132 50 132 50 130 Z" 
            fill="url(#blueFlameGradient)"
            className={isHovered ? "animate-flame-flicker" : ""}
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))',
              transition: 'all 0.3s ease',
              transformOrigin: '60px 85px',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              opacity: isHovered ? 1 : 0.9,
              animation: isHovered ? 'flame-flicker 3s ease-in-out infinite' : 'none'
            }}
          />
          
          {/* Inner blue flame glow */}
          <path 
            d="M54 125 C53 115 58 105 62 100 C63 95 59 90 58 85 C58 80 61 75 62 73 C60 83 65 88 66 92 C67 96 62 100 63 105 C64 110 60 115 57 120 C55 123 54 125 54 125 Z" 
            fill="url(#blueInnerFlameGradient)"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(156, 189, 255, 0.9))',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              animation: 'flame-pulse 2s ease-in-out infinite'
            }}
          />
        </g>
        
        {/* Red flame (right) */}
        <g className={isHovered ? "animate-pulse" : ""}>
          {/* Base of red flame */}
          <path 
            d="M110 130 C110 110 105 100 100 95 C95 90 102 85 104 80 C106 75 102 65 100 63 C96 60 105 56 107 50 C109 44 98 38 95 35 C102 50 90 55 88 60 C86 65 94 70 92 75 C90 80 97 85 98 90 C99 95 92 100 92 110 C92 120 100 125 106 130 C108 132 110 132 110 130 Z" 
            fill="url(#redFlameGradient)"
            className={isHovered ? "animate-flame-flicker-delayed" : ""}
            style={{ 
              filter: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.7))',
              transition: 'all 0.3s ease',
              transformOrigin: '100px 85px',
              transform: isHovered ? 'scale(1.05)' : 'scale(1)',
              opacity: isHovered ? 1 : 0.9,
              animation: isHovered ? 'flame-flicker 3s ease-in-out infinite 0.5s' : 'none'
            }}
          />
          
          {/* Inner red flame glow */}
          <path 
            d="M106 125 C107 115 102 105 98 100 C97 95 101 90 102 85 C102 80 99 75 98 73 C100 83 95 88 94 92 C93 96 98 100 97 105 C96 110 100 115 103 120 C105 123 106 125 106 125 Z" 
            fill="url(#redInnerFlameGradient)"
            style={{ 
              filter: 'drop-shadow(0 0 5px rgba(255, 156, 156, 0.9))',
              opacity: 0.8,
              transition: 'all 0.3s ease',
              animation: 'flame-pulse 2s ease-in-out infinite 0.5s'
            }}
          />
        </g>
        
        {/* Intertwining flames in the middle */}
        <g className={isHovered ? "animate-flame-dance" : ""}>
          {/* Blue intertwining flame */}
          <path 
            d="M60 90 C65 85 70 83 80 85 C85 86 85 76 83 72 C81 68 86 65 83 60 C87 65 92 70 87 75 C82 80 86 83 80.5 83 C75 83 70 86 65 90 C62 92 60 92 60 90 Z" 
            fill="url(#blueIntertwineGradient)"
            style={{ 
              filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.8))',
              opacity: isHovered ? 0.9 : 0.7,
              transition: 'all 0.3s ease',
              animation: 'flame-dance 4s ease-in-out infinite'
            }}
          />
          
          {/* Red intertwining flame */}
          <path 
            d="M100 90 C95 85 90 83 80 85 C75 86 75 76 77 72 C79 68 74 65 77 60 C73 65 68 70 73 75 C78 80 74 83 79.5 83 C85 83 90 86 95 90 C98 92 100 92 100 90 Z" 
            fill="url(#redIntertwineGradient)"
            style={{ 
              filter: 'drop-shadow(0 0 6px rgba(248, 113, 113, 0.8))',
              opacity: isHovered ? 0.9 : 0.7,
              transition: 'all 0.3s ease',
              animation: 'flame-dance 4s ease-in-out infinite 0.5s'
            }}
          />
        </g>
        
        {/* Center shared flame */}
        <path 
          d="M80 110 C80 100 77 95 75 90 C74 85 78 80 80 75 C82 80 86 85 85 90 C83 95 80 100 80 110 Z" 
          fill="url(#centerFlameGradient)"
          style={{ 
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))',
            opacity: isHovered ? 1 : 0.8,
            transition: 'all 0.3s ease',
            animation: 'flame-pulse 2s ease-in-out infinite'
          }}
        />
        
        {/* Flame particles */}
        {isHovered && (
          <>
            <circle cx="70" cy="60" r="1.5" fill="white" className="animate-flame-particle" style={{ animationDelay: '0s' }} />
            <circle cx="90" cy="65" r="1" fill="white" className="animate-flame-particle" style={{ animationDelay: '0.3s' }} />
            <circle cx="75" cy="50" r="1.2" fill="white" className="animate-flame-particle" style={{ animationDelay: '0.6s' }} />
            <circle cx="85" cy="55" r="0.8" fill="white" className="animate-flame-particle" style={{ animationDelay: '0.9s' }} />
            <circle cx="80" cy="45" r="1" fill="white" className="animate-flame-particle" style={{ animationDelay: '1.2s' }} />
            <circle cx="65" cy="70" r="0.8" fill="white" className="animate-flame-particle" style={{ animationDelay: '1.5s' }} />
            <circle cx="95" cy="70" r="0.8" fill="white" className="animate-flame-particle" style={{ animationDelay: '1.8s' }} />
          </>
        )}
        
        {/* Gradients */}
        <defs>
          <radialGradient id="blueFlameGradient" cx="60" cy="85" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="1" />
            <stop offset="40%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="70%" stopColor="#1D4ED8" stopOpacity="1" />
            <stop offset="100%" stopColor="#1E3A8A" stopOpacity="0.8" />
          </radialGradient>
          
          <radialGradient id="blueInnerFlameGradient" cx="60" cy="90" r="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DBEAFE" stopOpacity="1" />
            <stop offset="40%" stopColor="#93C5FD" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.5" />
          </radialGradient>
          
          <radialGradient id="redFlameGradient" cx="100" cy="85" r="40" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FECACA" stopOpacity="1" />
            <stop offset="40%" stopColor="#F87171" stopOpacity="1" />
            <stop offset="70%" stopColor="#DC2626" stopOpacity="1" />
            <stop offset="100%" stopColor="#991B1B" stopOpacity="0.8" />
          </radialGradient>
          
          <radialGradient id="redInnerFlameGradient" cx="100" cy="90" r="25" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEE2E2" stopOpacity="1" />
            <stop offset="40%" stopColor="#FECACA" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="0.5" />
          </radialGradient>
          
          <radialGradient id="blueIntertwineGradient" cx="75" cy="75" r="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DBEAFE" stopOpacity="1" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
          </radialGradient>
          
          <radialGradient id="redIntertwineGradient" cx="85" cy="75" r="15" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEE2E2" stopOpacity="1" />
            <stop offset="50%" stopColor="#FCA5A5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#EF4444" stopOpacity="0.8" />
          </radialGradient>
          
          <linearGradient id="centerFlameGradient" x1="80" y1="70" x2="80" y2="110" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="30%" stopColor="#FEF3C7" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#FBBF24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.5" />
          </linearGradient>
        </defs>
        
        {/* Add styles for animations */}
        <style>
          {`
            @keyframes flame-flicker {
              0% { transform: scale(1) translate(0, 0); }
              25% { transform: scale(1.05) translate(-1px, -1px); }
              50% { transform: scale(1) translate(0, 0); }
              75% { transform: scale(1.05) translate(1px, -1px); }
              100% { transform: scale(1) translate(0, 0); }
            }
            
            @keyframes flame-flicker-delayed {
              0% { transform: scale(1) translate(0, 0); }
              25% { transform: scale(1.05) translate(1px, -1px); }
              50% { transform: scale(1) translate(0, 0); }
              75% { transform: scale(1.05) translate(-1px, -1px); }
              100% { transform: scale(1) translate(0, 0); }
            }
            
            @keyframes flame-pulse {
              0% { opacity: 0.7; }
              50% { opacity: 1; }
              100% { opacity: 0.7; }
            }
            
            @keyframes flame-dance {
              0% { transform: scale(1) rotate(0deg); }
              25% { transform: scale(1.02) rotate(1deg); }
              50% { transform: scale(1) rotate(0deg); }
              75% { transform: scale(1.02) rotate(-1deg); }
              100% { transform: scale(1) rotate(0deg); }
            }
            
            @keyframes flame-particle {
              0% { opacity: 0; transform: translate(0, 0); }
              25% { opacity: 1; }
              100% { opacity: 0; transform: translate(var(--tx, 3px), -10px); }
            }
            
            .animate-flame-particle {
              animation: flame-particle 3s ease-out infinite;
              --tx: 0px;
            }
            
            .animate-flame-particle:nth-child(odd) {
              --tx: -3px;
            }
            
            .animate-flame-flicker {
              animation: flame-flicker 4s ease-in-out infinite;
            }
            
            .animate-flame-flicker-delayed {
              animation: flame-flicker-delayed 4s ease-in-out infinite;
            }
            
            .animate-flame-dance {
              animation: flame-dance 5s ease-in-out infinite;
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default TwinFlames;