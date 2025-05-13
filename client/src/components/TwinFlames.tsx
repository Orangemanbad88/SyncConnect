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
          r="45" 
          fill="url(#flameGlowGradient)"
          style={{ 
            opacity: isHovered ? 0.2 : 0.1,
            transition: 'all 0.5s ease',
            filter: isHovered ? 'blur(15px)' : 'blur(10px)'
          }}
        />
        
        {/* Blue Flame (left) */}
        <path 
          d="M50 130 C50 110 55 100 60 95 C65 90 58 85 56 80 C54 75 58 65 60 63 C64 60 55 56 53 50 C51 44 62 38 65 35 C58 50 70 55 72 60 C74 65 66 70 68 75 C70 80 63 85 62 90 C61 95 68 100 68 110 C68 120 60 125 54 130 C52 132 50 132 50 130Z"
          fill="url(#blueFlameGradient)"
          className={isHovered ? "animate-flame-flicker" : ""}
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(59, 130, 246, 0.7))',
            transition: 'all 0.3s ease',
            transformOrigin: '60px 85px',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: isHovered ? 1 : 0.9
          }}
        />
        
        {/* Inner blue flame */}
        <path 
          d="M54 125 C53 115 58 105 62 100 C63 95 59 90 58 85 C58 80 61 75 62 73 C60 83 65 88 66 92 C67 96 62 100 63 105 C64 110 60 115 57 120 C55 123 54 125 54 125Z"
          fill="url(#blueInnerFlameGradient)"
          style={{ 
            filter: 'drop-shadow(0 0 5px rgba(156, 189, 255, 0.9))',
            opacity: 0.8,
            transition: 'all 0.3s ease',
            animation: 'flame-pulse 2s ease-in-out infinite'
          }}
        />
        
        {/* Red Flame (right) */}
        <path 
          d="M110 130 C110 110 105 100 100 95 C95 90 102 85 104 80 C106 75 102 65 100 63 C96 60 105 56 107 50 C109 44 98 38 95 35 C102 50 90 55 88 60 C86 65 94 70 92 75 C90 80 97 85 98 90 C99 95 92 100 92 110 C92 120 100 125 106 130 C108 132 110 132 110 130Z"
          fill="url(#redFlameGradient)"
          className={isHovered ? "animate-flame-flicker-delayed" : ""}
          style={{ 
            filter: 'drop-shadow(0 0 8px rgba(248, 113, 113, 0.7))',
            transition: 'all 0.3s ease',
            transformOrigin: '100px 85px',
            transform: isHovered ? 'scale(1.05)' : 'scale(1)',
            opacity: isHovered ? 1 : 0.9
          }}
        />
        
        {/* Inner red flame */}
        <path 
          d="M106 125 C107 115 102 105 98 100 C97 95 101 90 102 85 C102 80 99 75 98 73 C100 83 95 88 94 92 C93 96 98 100 97 105 C96 110 100 115 103 120 C105 123 106 125 106 125Z"
          fill="url(#redInnerFlameGradient)"
          style={{ 
            filter: 'drop-shadow(0 0 5px rgba(255, 156, 156, 0.9))',
            opacity: 0.8,
            transition: 'all 0.3s ease',
            animation: 'flame-pulse 2s ease-in-out infinite 0.5s'
          }}
        />
        
        {/* Electric pulse connection between flames */}
        {isHovered ? (
          <g className="animate-electric-pulse">
            {/* Main electric connection */}
            <path 
              d="M65 80 L70 75 L75 82 L80 70 L85 82 L90 75 L95 80"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))',
                opacity: 0.9
              }}
            />
            
            {/* Secondary electric connections */}
            <path 
              d="M68 90 L72 87 L80 95 L88 87 L92 90"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1,2"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))',
                opacity: 0.7
              }}
            />
            
            <path 
              d="M67 70 L72 67 L80 60 L88 67 L93 70"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="2,2"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.7))',
                opacity: 0.6
              }}
            />
          </g>
        ) : (
          <g>
            <path 
              d="M65 80 L70 75 L75 82 L80 70 L85 82 L90 75 L95 80"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1,3"
              style={{
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.6))',
                opacity: 0.6
              }}
            />
          </g>
        )}
        
        {/* Center electric node */}
        <circle 
          cx="80" 
          cy="80" 
          r={isHovered ? 3 : 2}
          fill="white"
          className="animate-connection-pulse"
          style={{ 
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))',
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Electric sparks and particles */}
        {isHovered && (
          <>
            {/* Blue flame sparks */}
            <path 
              d="M60 50 L57 45 M70 60 L73 55 M50 70 L45 68 M45 90 L40 92 M60 110 L57 115"
              stroke="#60A5FA" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              style={{ 
                filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.8))',
                opacity: 0.8,
                animation: 'electric-spark 1.5s ease-in-out infinite'
              }}
            />
            
            {/* Red flame sparks */}
            <path 
              d="M100 50 L103 45 M90 60 L87 55 M110 70 L115 68 M115 90 L120 92 M100 110 L103 115"
              stroke="#F87171" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              style={{ 
                filter: 'drop-shadow(0 0 3px rgba(248, 113, 113, 0.8))',
                opacity: 0.8,
                animation: 'electric-spark 1.5s ease-in-out infinite 0.5s'
              }}
            />
            
            {/* Center electric sparks */}
            <path 
              d="M80 70 L80 65 M80 90 L80 95 M70 80 L65 80 M90 80 L95 80"
              stroke="white" 
              strokeWidth="1"
              strokeLinecap="round" 
              strokeDasharray="1,2"
              style={{ 
                filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))',
                opacity: 0.8,
                animation: 'electric-spark 1s ease-in-out infinite 0.25s'
              }}
            />
            
            {/* Electric particles */}
            <circle cx="57" cy="55" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0s' }} />
            <circle cx="65" cy="70" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0.3s' }} />
            <circle cx="50" cy="85" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0.6s' }} />
            <circle cx="60" cy="100" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0.9s' }} />
            
            <circle cx="103" cy="55" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '0.15s' }} />
            <circle cx="95" cy="70" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '0.45s' }} />
            <circle cx="110" cy="85" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '0.75s' }} />
            <circle cx="100" cy="100" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '1.05s' }} />
            
            {/* Center electric particles */}
            <circle cx="75" cy="75" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0s' }} />
            <circle cx="85" cy="75" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0.3s' }} />
            <circle cx="75" cy="85" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0.6s' }} />
            <circle cx="85" cy="85" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0.9s' }} />
          </>
        )}
        
        {/* Gradients */}
        <defs>
          <radialGradient id="flameGlowGradient" cx="80" cy="80" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          
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
            
            @keyframes electric-pulse {
              0% { opacity: 0.7; stroke-dasharray: none; }
              25% { opacity: 1; stroke-dasharray: 2,1; }
              50% { opacity: 0.7; stroke-dasharray: none; }
              75% { opacity: 1; stroke-dasharray: 1,2; }
              100% { opacity: 0.7; stroke-dasharray: none; }
            }
            
            @keyframes connection-pulse {
              0% { r: 2px; opacity: 0.8; }
              50% { r: 3px; opacity: 1; filter: drop-shadow(0 0 8px rgba(255, 255, 255, 1)); }
              100% { r: 2px; opacity: 0.8; }
            }
            
            @keyframes electric-spark {
              0% { opacity: 0.3; }
              50% { opacity: 0.8; }
              100% { opacity: 0.3; }
            }
            
            @keyframes electric-particle {
              0% { opacity: 0; transform: scale(0.5); }
              50% { opacity: 1; transform: scale(1.5); }
              100% { opacity: 0; transform: scale(0.5); }
            }
            
            @keyframes electric-center-particle {
              0% { opacity: 0; r: 0.5; }
              50% { opacity: 1; r: 1.5; }
              100% { opacity: 0; r: 0.5; }
            }
            
            .animate-flame-flicker {
              animation: flame-flicker 4s ease-in-out infinite;
            }
            
            .animate-flame-flicker-delayed {
              animation: flame-flicker-delayed 4s ease-in-out infinite;
            }
            
            .animate-electric-pulse {
              animation: electric-pulse 2s ease-in-out infinite;
            }
            
            .animate-connection-pulse {
              animation: connection-pulse 1.5s ease-in-out infinite;
            }
            
            .animate-electric-particle {
              animation: electric-particle 1.5s ease-out infinite;
            }
            
            .animate-electric-center-particle {
              animation: electric-center-particle 2s ease-in-out infinite;
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default TwinFlames;