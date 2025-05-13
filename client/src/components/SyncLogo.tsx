import React, { useState, useEffect, useRef } from 'react';

interface SyncLogoProps {
  className?: string;
}

const SyncLogo: React.FC<SyncLogoProps> = ({ className = '' }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  // Generate random wave pattern
  const createWavePattern = (waveIndex = 0) => {
    const baseHeight = 45;
    const amplitude = isAnimating ? 8 + waveIndex * 2 : 2;
    const frequency = isAnimating ? 8 + waveIndex : 6;
    const speed = isAnimating ? 1000 - waveIndex * 200 : 2000;
    const steps = 60;
    
    // Add some randomness to each wave
    const phase = waveIndex * Math.PI / 3;
    
    const points = Array.from({ length: steps + 1 }, (_, i) => {
      const x = (i / steps) * 100;
      const y = baseHeight + (Math.sin((i / frequency) + phase + Date.now() / speed) * amplitude);
      return `${x},${y}`;
    });
    
    return points.join(' ');
  };

  // Update wave animation
  useEffect(() => {
    if (!svgRef.current) return;
    
    let animationFrame: number;
    
    const animateWaves = () => {
      if (!svgRef.current) return;
      const waveElements = svgRef.current.querySelectorAll('.wave');
      waveElements.forEach((wave, index) => {
        const points = createWavePattern(index);
        wave.setAttribute('points', points);
      });
      
      animationFrame = requestAnimationFrame(animateWaves);
    };
    
    animateWaves();
    
    return () => cancelAnimationFrame(animationFrame);
  }, [isAnimating]);

  // Create glow filter definition
  const glowFilter = (
    <defs>
      <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
      <linearGradient id="syncGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#FFFFFF" />
        <stop offset="5%" stopColor="#FCA5A5" />
        <stop offset="20%" stopColor="#EF4444" />
        <stop offset="40%" stopColor="#DC2626" />
        <stop offset="60%" stopColor="#B91C1C" />
        <stop offset="80%" stopColor="#991B1B" />
        <stop offset="100%" stopColor="#FFFFFF" />
      </linearGradient>
    </defs>
  );

  return (
    <div 
      className={`relative flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsAnimating(true)}
      onMouseLeave={() => setIsAnimating(false)}
      onTouchStart={() => setIsAnimating(true)}
      onTouchEnd={() => setIsAnimating(false)}
    >
      <svg 
        ref={svgRef}
        viewBox="0 0 100 100" 
        className="w-full h-full"
        style={{ filter: 'drop-shadow(0 0 2px rgba(255, 0, 0, 1))' }}
      >
        {glowFilter}
        
        {/* Background wave animations */}
        <g className="wave-container">
          {[0, 1, 2, 3, 4].map((i) => (
            <polyline
              key={`wave-${i}`}
              className="wave"
              points={createWavePattern(i)}
              fill="none"
              stroke={`rgba(255, ${Math.max(0, 60 - i * 15)}, ${Math.max(0, 60 - i * 15)}, ${0.9 - i * 0.15})`}
              strokeWidth={2.5 - i * 0.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ 
                transition: 'all 0.3s ease',
                transform: `translateY(${10 + i * 4}px)`,
                filter: i === 0 ? 'drop-shadow(0 0 3px rgba(255, 0, 0, 0.7))' : 'none'
              }}
            />
          ))}
        </g>
        
        {/* SYNC Text */}
        <text
          x="50%"
          y="40%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-cinzel font-black uppercase text-4xl"
          style={{
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            stroke: 'rgba(255, 255, 255, 0.9)',
            strokeWidth: 0.8,
            filter: 'url(#glow)',
            fill: 'url(#syncGradient)',
            transform: isAnimating ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.3s ease',
            transformOrigin: 'center'
          }}
        >
          SYNC
        </text>
        
        {/* Pulse effect when animated */}
        {isAnimating && (
          <circle
            cx="50"
            cy="40"
            r="30"
            fill="none"
            stroke="rgba(255, 0, 0, 0.4)"
            strokeWidth="0.5"
            style={{
              animation: 'pulse 2s infinite',
              transformOrigin: 'center',
            }}
          />
        )}
      </svg>
    </div>
  );
};

export default SyncLogo;