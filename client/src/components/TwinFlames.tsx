import React, { useState } from 'react';

interface TwinFlamesProps {
  className?: string;
}

const ElectricHearts: React.FC<TwinFlamesProps> = ({ className = '' }) => {
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
          fill="url(#heartGlowGradient)"
          style={{ 
            opacity: isHovered ? 0.2 : 0.1,
            transition: 'all 0.5s ease',
            filter: isHovered ? 'blur(15px)' : 'blur(10px)'
          }}
        />
        
        {/* Blue Heart (left) */}
        <path 
          d="M55 65 C55 55 45 50 40 55 C35 60 35 65 40 70 L55 85 L70 70 C75 65 75 60 70 55 C65 50 55 55 55 65 Z"
          fill="url(#blueHeartGradient)"
          stroke="#3B82F6"
          strokeWidth={isHovered ? 1.5 : 1}
          className={isHovered ? "animate-heart-pulse" : ""}
          style={{ 
            filter: 'drop-shadow(0 0 5px rgba(59, 130, 246, 0.7))',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.85,
            transformOrigin: 'center'
          }}
        />
        
        {/* Red Heart (right) */}
        <path 
          d="M105 65 C105 55 115 50 120 55 C125 60 125 65 120 70 L105 85 L90 70 C85 65 85 60 90 55 C95 50 105 55 105 65 Z"
          fill="url(#redHeartGradient)"
          stroke="#F87171"
          strokeWidth={isHovered ? 1.5 : 1}
          className={isHovered ? "animate-heart-pulse-delayed" : ""}
          style={{ 
            filter: 'drop-shadow(0 0 5px rgba(248, 113, 113, 0.7))',
            transition: 'all 0.3s ease',
            opacity: isHovered ? 1 : 0.85,
            transformOrigin: 'center'
          }}
        />
        
        {/* Electric connecting lines between hearts */}
        {isHovered ? (
          <g className="animate-electric-pulse">
            {/* Main electric connection */}
            <path 
              d="M70 68 L75 65 L80 70 L85 65 L90 68"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.9))',
                opacity: 0.9
              }}
            />
            
            {/* Second electric connection */}
            <path 
              d="M68 75 L73 77 L80 72 L87 77 L92 75"
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
          </g>
        ) : (
          <g>
            <path 
              d="M70 68 L75 65 L80 70 L85 65 L90 68"
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
        
        {/* Connection point in center */}
        <circle 
          cx="80" 
          cy="70" 
          r={isHovered ? 3 : 2}
          fill="white"
          className="animate-connection-pulse"
          style={{ 
            filter: 'drop-shadow(0 0 4px rgba(255, 255, 255, 0.9))',
            transition: 'all 0.3s ease'
          }}
        />
        
        {/* Electric pulse waves around hearts */}
        <g className={isHovered ? "animate-pulse-wave" : ""} style={{ opacity: isHovered ? 0.6 : 0.3 }}>
          {/* Blue heart pulse wave */}
          <path 
            d="M55 45 C55 35 45 30 35 35 C25 40 25 50 35 60 L55 80 L75 60 C85 50 85 40 75 35 C65 30 55 35 55 45 Z"
            stroke="url(#bluePulseGradient)" 
            strokeWidth="1"
            strokeDasharray="2,3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.5))',
              transition: 'all 0.3s ease'
            }}
          />
          
          {/* Red heart pulse wave */}
          <path 
            d="M105 45 C105 35 115 30 125 35 C135 40 135 50 125 60 L105 80 L85 60 C75 50 75 40 85 35 C95 30 105 35 105 45 Z"
            stroke="url(#redPulseGradient)" 
            strokeWidth="1"
            strokeDasharray="2,3"
            fill="none"
            style={{ 
              filter: 'drop-shadow(0 0 3px rgba(248, 113, 113, 0.5))',
              transition: 'all 0.3s ease'
            }}
          />
        </g>
        
        {/* Electric sparks and particles */}
        {isHovered && (
          <>
            {/* Blue heart electric sparks */}
            <path 
              d="M50 52 L48 48 M60 52 L62 48 M42 60 L38 58 M68 60 L72 58 M55 85 L55 90"
              stroke="#60A5FA" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              style={{ 
                filter: 'drop-shadow(0 0 3px rgba(59, 130, 246, 0.8))',
                opacity: 0.8,
                animation: 'electric-spark 1.5s ease-in-out infinite'
              }}
            />
            
            {/* Red heart electric sparks */}
            <path 
              d="M100 52 L98 48 M110 52 L112 48 M92 60 L88 58 M118 60 L122 58 M105 85 L105 90"
              stroke="#F87171" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              style={{ 
                filter: 'drop-shadow(0 0 3px rgba(248, 113, 113, 0.8))',
                opacity: 0.8,
                animation: 'electric-spark 1.5s ease-in-out infinite 0.5s'
              }}
            />
            
            {/* Center connecting electric sparks */}
            <path 
              d="M80 65 L80 60 M80 75 L80 80 M75 70 L70 70 M85 70 L90 70"
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
            <circle cx="45" cy="55" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0s' }} />
            <circle cx="65" cy="55" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0.3s' }} />
            <circle cx="40" cy="65" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0.6s' }} />
            <circle cx="70" cy="65" r="1" fill="#60A5FA" className="animate-electric-particle" style={{ animationDelay: '0.9s' }} />
            
            <circle cx="95" cy="55" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '0.15s' }} />
            <circle cx="115" cy="55" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '0.45s' }} />
            <circle cx="90" cy="65" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '0.75s' }} />
            <circle cx="120" cy="65" r="1" fill="#F87171" className="animate-electric-particle" style={{ animationDelay: '1.05s' }} />
            
            <circle cx="75" cy="65" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0s' }} />
            <circle cx="85" cy="65" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0.3s' }} />
            <circle cx="75" cy="75" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0.6s' }} />
            <circle cx="85" cy="75" r="0.8" fill="white" className="animate-electric-center-particle" style={{ animationDelay: '0.9s' }} />
          </>
        )}
        
        {/* Additional decorative energy rings (when hovered) */}
        {isHovered && (
          <g className="animate-energy-ring">
            {/* Bottom shared energy ring */}
            <path 
              d="M55 95 C65 105 95 105 105 95"
              stroke="url(#sharedEnergyGradient)" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeDasharray="1,3"
              fill="none"
              style={{ 
                filter: 'drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))',
                opacity: 0.7
              }}
            />
            
            {/* Lower energy ring */}
            <path 
              d="M50 105 C70 120 90 120 110 105"
              stroke="url(#sharedEnergyGradient)" 
              strokeWidth="1"
              strokeLinecap="round" 
              strokeDasharray="1,5"
              fill="none"
              style={{ 
                filter: 'drop-shadow(0 0 3px rgba(255, 255, 255, 0.5))',
                opacity: 0.5
              }}
            />
          </g>
        )}
        
        {/* Gradients */}
        <defs>
          <radialGradient id="heartGlowGradient" cx="80" cy="70" r="45" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="blueHeartGradient" x1="40" y1="55" x2="70" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#DBEAFE" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#93C5FD" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#60A5FA" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.9" />
          </linearGradient>
          
          <linearGradient id="redHeartGradient" x1="120" y1="55" x2="90" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FEE2E2" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#FECACA" stopOpacity="0.9" />
            <stop offset="70%" stopColor="#FCA5A5" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="0.9" />
          </linearGradient>
          
          <linearGradient id="bluePulseGradient" x1="30" y1="60" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#93C5FD" stopOpacity="1" />
            <stop offset="50%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="redPulseGradient" x1="130" y1="60" x2="80" y2="60" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FECACA" stopOpacity="1" />
            <stop offset="50%" stopColor="#F87171" stopOpacity="1" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="sharedEnergyGradient" x1="55" y1="95" x2="105" y2="95" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="1" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="1" />
          </linearGradient>
        </defs>
        
        {/* Add styles for animations */}
        <style>
          {`
            @keyframes heart-pulse {
              0% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.05); opacity: 1; }
              100% { transform: scale(1); opacity: 0.85; }
            }
            
            @keyframes heart-pulse-delayed {
              0% { transform: scale(1); opacity: 0.85; }
              50% { transform: scale(1.05); opacity: 1; }
              100% { transform: scale(1); opacity: 0.85; }
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
            
            @keyframes pulse-wave {
              0% { transform: scale(1); opacity: 0.3; }
              50% { transform: scale(1.03); opacity: 0.6; }
              100% { transform: scale(1); opacity: 0.3; }
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
            
            @keyframes energy-ring {
              0% { opacity: 0.4; transform: translateY(0); }
              50% { opacity: 0.7; transform: translateY(-3px); }
              100% { opacity: 0.4; transform: translateY(0); }
            }
            
            .animate-heart-pulse {
              animation: heart-pulse 1.5s ease-in-out infinite;
            }
            
            .animate-heart-pulse-delayed {
              animation: heart-pulse-delayed 1.5s ease-in-out infinite 0.75s;
            }
            
            .animate-electric-pulse {
              animation: electric-pulse 2s ease-in-out infinite;
            }
            
            .animate-connection-pulse {
              animation: connection-pulse 1.5s ease-in-out infinite;
            }
            
            .animate-pulse-wave {
              animation: pulse-wave 3s ease-in-out infinite;
            }
            
            .animate-electric-particle {
              animation: electric-particle 1.5s ease-out infinite;
            }
            
            .animate-electric-center-particle {
              animation: electric-center-particle 2s ease-in-out infinite;
            }
            
            .animate-energy-ring {
              animation: energy-ring 4s ease-in-out infinite;
            }
          `}
        </style>
      </svg>
    </div>
  );
};

export default ElectricHearts;