import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  type: 'confetti' | 'spark' | 'heart';
}

interface MatchCelebrationProps {
  isActive: boolean;
  onComplete?: () => void;
  duration?: number;
}

const COLORS = ['#C9A962', '#D4A574', '#FFD700', '#FFA500', '#FF6B6B', '#A855F7', '#EC4899'];

export default function MatchCelebration({ isActive, onComplete, duration = 3000 }: MatchCelebrationProps) {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    if (!isActive) {
      setParticles([]);
      setShowText(false);
      return;
    }

    // Create initial burst of particles
    const newParticles: Particle[] = [];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    // Confetti pieces
    for (let i = 0; i < 80; i++) {
      const angle = (Math.PI * 2 * i) / 80;
      const velocity = 8 + Math.random() * 12;
      newParticles.push({
        id: i,
        x: centerX,
        y: centerY,
        size: 8 + Math.random() * 8,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        speedX: Math.cos(angle) * velocity + (Math.random() - 0.5) * 4,
        speedY: Math.sin(angle) * velocity - Math.random() * 8,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 20,
        opacity: 1,
        type: 'confetti',
      });
    }

    // Spark particles (smaller, faster)
    for (let i = 0; i < 40; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 15 + Math.random() * 10;
      newParticles.push({
        id: 80 + i,
        x: centerX,
        y: centerY,
        size: 3 + Math.random() * 4,
        color: '#FFD700',
        speedX: Math.cos(angle) * velocity,
        speedY: Math.sin(angle) * velocity,
        rotation: 0,
        rotationSpeed: 0,
        opacity: 1,
        type: 'spark',
      });
    }

    // Heart particles
    for (let i = 0; i < 15; i++) {
      const angle = Math.random() * Math.PI * 2;
      const velocity = 4 + Math.random() * 6;
      newParticles.push({
        id: 120 + i,
        x: centerX + (Math.random() - 0.5) * 200,
        y: centerY + (Math.random() - 0.5) * 200,
        size: 20 + Math.random() * 15,
        color: '#EC4899',
        speedX: Math.cos(angle) * velocity,
        speedY: -Math.abs(Math.sin(angle) * velocity) - 2,
        rotation: (Math.random() - 0.5) * 30,
        rotationSpeed: (Math.random() - 0.5) * 5,
        opacity: 1,
        type: 'heart',
      });
    }

    setParticles(newParticles);
    setShowText(true);

    // Animation loop
    let animationId: number;
    let startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress >= 1) {
        setParticles([]);
        setShowText(false);
        onComplete?.();
        return;
      }

      setParticles(prev =>
        prev.map(p => ({
          ...p,
          x: p.x + p.speedX,
          y: p.y + p.speedY + (p.type === 'confetti' ? 0.5 : 0), // gravity for confetti
          speedY: p.speedY + (p.type === 'confetti' ? 0.3 : 0.1), // acceleration
          speedX: p.speedX * 0.99, // drag
          rotation: p.rotation + p.rotationSpeed,
          opacity: p.type === 'spark' ? Math.max(0, 1 - progress * 2) : Math.max(0, 1 - progress),
        })).filter(p => p.opacity > 0)
      );

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [isActive, duration, onComplete]);

  if (!isActive && particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Background flash */}
      <div
        className="absolute inset-0 transition-opacity duration-300"
        style={{
          background: 'radial-gradient(circle at center, rgba(201, 169, 98, 0.3) 0%, transparent 70%)',
          opacity: showText ? 1 : 0,
        }}
      />

      {/* "It's a Match!" text */}
      {showText && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="text-center animate-bounce-in"
            style={{
              animation: 'matchTextIn 0.5s ease-out forwards',
            }}
          >
            <h1
              className="text-5xl md:text-7xl mb-2"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: '700',
                background: 'linear-gradient(135deg, #C9A962 0%, #FFD700 50%, #C9A962 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 60px rgba(201, 169, 98, 0.8)',
                filter: 'drop-shadow(0 0 30px rgba(201, 169, 98, 0.5))',
              }}
            >
              It's a Match!
            </h1>
            <p
              className="text-xl text-[#E8E4DF] opacity-80"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              You both liked each other
            </p>
          </div>
        </div>
      )}

      {/* Particles */}
      <svg className="absolute inset-0 w-full h-full">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {particles.map(p => {
          if (p.type === 'heart') {
            return (
              <g
                key={p.id}
                transform={`translate(${p.x}, ${p.y}) rotate(${p.rotation}) scale(${p.size / 24})`}
                opacity={p.opacity}
              >
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  fill={p.color}
                  filter="url(#glow)"
                />
              </g>
            );
          }

          if (p.type === 'spark') {
            return (
              <circle
                key={p.id}
                cx={p.x}
                cy={p.y}
                r={p.size}
                fill={p.color}
                opacity={p.opacity}
                filter="url(#glow)"
              />
            );
          }

          // Confetti
          return (
            <rect
              key={p.id}
              x={p.x - p.size / 2}
              y={p.y - p.size / 2}
              width={p.size}
              height={p.size * 0.6}
              fill={p.color}
              opacity={p.opacity}
              transform={`rotate(${p.rotation} ${p.x} ${p.y})`}
              rx={2}
            />
          );
        })}
      </svg>

      {/* CSS Animation */}
      <style>{`
        @keyframes matchTextIn {
          0% {
            opacity: 0;
            transform: scale(0.5) translateY(20px);
          }
          50% {
            transform: scale(1.1) translateY(-10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
