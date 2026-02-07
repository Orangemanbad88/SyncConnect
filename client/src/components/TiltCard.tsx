import { useRef, useState, ReactNode } from 'react';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  maxTilt?: number;
  scale?: number;
  glareEnabled?: boolean;
  glareMaxOpacity?: number;
  perspective?: number;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export default function TiltCard({
  children,
  className = '',
  style = {},
  maxTilt = 15,
  scale = 1.02,
  glareEnabled = true,
  glareMaxOpacity = 0.3,
  perspective = 1000,
  onClick,
}: TiltCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (-mouseY / (rect.height / 2)) * maxTilt;
    const rotateY = (mouseX / (rect.width / 2)) * maxTilt;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    // Update glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
    setTransform('');
  };

  // Touch support
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;

    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touchX = touch.clientX - centerX;
    const touchY = touch.clientY - centerY;

    const rotateX = (-touchY / (rect.height / 2)) * maxTilt * 0.5;
    const rotateY = (touchX / (rect.width / 2)) * maxTilt * 0.5;

    setTransform(
      `perspective(${perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${scale}, ${scale}, ${scale})`
    );

    const glareX = ((touch.clientX - rect.left) / rect.width) * 100;
    const glareY = ((touch.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
    setIsHovering(true);
  };

  const handleTouchEnd = () => {
    setIsHovering(false);
    setTransform('');
  };

  return (
    <div
      ref={cardRef}
      className={`relative ${className}`}
      style={{
        ...style,
        transform: transform || 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovering ? 'none' : 'transform 0.5s ease-out',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={onClick}
    >
      {children}

      {/* Glare effect */}
      {glareEnabled && (
        <div
          className="absolute inset-0 pointer-events-none rounded-inherit overflow-hidden"
          style={{
            borderRadius: 'inherit',
            opacity: isHovering ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, rgba(255, 255, 255, ${glareMaxOpacity}) 0%, transparent 60%)`,
            }}
          />
        </div>
      )}

      {/* Shine line effect */}
      {glareEnabled && isHovering && (
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{ borderRadius: 'inherit' }}
        >
          <div
            className="absolute w-[200%] h-[200%] -top-1/2 -left-1/2"
            style={{
              background: `linear-gradient(
                ${Math.atan2(glarePosition.y - 50, glarePosition.x - 50) * (180 / Math.PI) + 90}deg,
                transparent 0%,
                rgba(201, 169, 98, 0.1) 45%,
                rgba(201, 169, 98, 0.3) 50%,
                rgba(201, 169, 98, 0.1) 55%,
                transparent 100%
              )`,
              transform: `translate(${(glarePosition.x - 50) * 0.5}%, ${(glarePosition.y - 50) * 0.5}%)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
