import { useEffect, useState } from 'react';

interface CompatibilityRingProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  animated?: boolean;
  animationDuration?: number;
  className?: string;
  children?: React.ReactNode;
}

export default function CompatibilityRing({
  percentage,
  size = 120,
  strokeWidth = 8,
  showLabel = true,
  animated = true,
  animationDuration = 1500,
  className = '',
  children,
}: CompatibilityRingProps) {
  const [currentPercentage, setCurrentPercentage] = useState(animated ? 0 : percentage);
  const [isVisible, setIsVisible] = useState(false);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (currentPercentage / 100) * circumference;

  // Get color based on percentage
  const getColor = (pct: number) => {
    if (pct >= 80) return { main: '#22C55E', glow: 'rgba(34, 197, 94, 0.5)' }; // Green - excellent
    if (pct >= 60) return { main: '#C9A962', glow: 'rgba(201, 169, 98, 0.5)' }; // Gold - good
    if (pct >= 40) return { main: '#F59E0B', glow: 'rgba(245, 158, 11, 0.5)' }; // Orange - moderate
    return { main: '#EF4444', glow: 'rgba(239, 68, 68, 0.5)' }; // Red - low
  };

  const color = getColor(percentage);

  // Animate percentage on mount
  useEffect(() => {
    if (!animated) {
      setCurrentPercentage(percentage);
      return;
    }

    setIsVisible(true);
    const startTime = Date.now();
    const startValue = 0;
    const endValue = percentage;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / animationDuration, 1);

      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (endValue - startValue) * easeOut;

      setCurrentPercentage(current);

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [percentage, animated, animationDuration]);

  // Update when percentage prop changes
  useEffect(() => {
    if (!animated) {
      setCurrentPercentage(percentage);
    }
  }, [percentage, animated]);

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 rounded-full blur-xl transition-opacity duration-500"
        style={{
          background: color.glow,
          opacity: isVisible ? 0.4 : 0,
          transform: 'scale(1.2)',
        }}
      />

      {/* SVG Ring */}
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        style={{ filter: `drop-shadow(0 0 10px ${color.glow})` }}
      >
        <defs>
          <linearGradient id={`ring-gradient-${percentage}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={color.main} />
            <stop offset="50%" stopColor={color.main} stopOpacity="0.8" />
            <stop offset="100%" stopColor={color.main} />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth={strokeWidth}
        />

        {/* Animated progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#ring-gradient-${percentage})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: animated ? 'none' : 'stroke-dashoffset 0.5s ease',
          }}
        />

        {/* Sparkle dots at progress end */}
        {currentPercentage > 5 && (
          <circle
            cx={size / 2 + radius * Math.cos(((currentPercentage / 100) * 360 - 90) * (Math.PI / 180))}
            cy={size / 2 + radius * Math.sin(((currentPercentage / 100) * 360 - 90) * (Math.PI / 180))}
            r={strokeWidth / 2 + 2}
            fill={color.main}
            style={{
              filter: `drop-shadow(0 0 6px ${color.main})`,
            }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children || (
          <>
            {showLabel && (
              <>
                <span
                  className="text-3xl font-bold tabular-nums"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    color: color.main,
                    textShadow: `0 0 20px ${color.glow}`,
                  }}
                >
                  {Math.round(currentPercentage)}
                </span>
                <span
                  className="text-xs opacity-60 -mt-1"
                  style={{
                    fontFamily: "'Barlow', sans-serif",
                    color: '#9CA3AF',
                  }}
                >
                  MATCH
                </span>
              </>
            )}
          </>
        )}
      </div>

      {/* Orbiting particle (decorative) */}
      {currentPercentage >= 60 && (
        <div
          className="absolute w-2 h-2 rounded-full"
          style={{
            background: color.main,
            boxShadow: `0 0 10px ${color.main}`,
            animation: 'orbit 3s linear infinite',
            transformOrigin: `${size / 2}px ${size / 2}px`,
          }}
        />
      )}

      <style>{`
        @keyframes orbit {
          from {
            transform: rotate(0deg) translateX(${radius + 10}px) rotate(0deg);
          }
          to {
            transform: rotate(360deg) translateX(${radius + 10}px) rotate(-360deg);
          }
        }
      `}</style>
    </div>
  );
}
