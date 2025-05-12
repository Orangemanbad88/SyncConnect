import React from 'react';

interface SyncLogoProps {
  className?: string;
}

const SyncLogo: React.FC<SyncLogoProps> = ({ className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Main text with Roman inscription/chiseled effect */}
      <div className="relative font-cinzel font-bold tracking-wider text-center">
        {/* Base text */}
        <div 
          className="flex font-cinzel text-6xl font-black uppercase tracking-wider"
          style={{ 
            textShadow: `
              0 0 5px rgba(255, 255, 255, 0.7),
              0 0 10px rgba(239, 68, 68, 0.6),
              0 0 15px rgba(59, 130, 246, 0.5),
              0 0 20px rgba(239, 68, 68, 0.4),
              0 0 30px rgba(59, 130, 246, 0.3)
            `,
            letterSpacing: '0.2em',
            fontVariationSettings: '"wght" 900',
            WebkitTextStroke: '0.5px rgba(255, 255, 255, 0.3)',
          }}
        >
          <span style={{
            background: 'linear-gradient(to right, #FFFFFF 0%, #F87171 15%, #EF4444 45%, #dc2626 85%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 3px rgba(239, 68, 68, 0.9))',
          }}>S</span>
          <span style={{
            background: 'linear-gradient(to right, #FFFFFF 0%, #F87171 15%, #EF4444 45%, #dc2626 85%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 3px rgba(239, 68, 68, 0.9))',
          }}>Y</span>
          <span style={{
            background: 'linear-gradient(to right, #FFFFFF 0%, #3B82F6 15%, #1D4ED8 45%, #0036c3 85%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.9))',
          }}>N</span>
          <span style={{
            background: 'linear-gradient(to right, #FFFFFF 0%, #3B82F6 15%, #1D4ED8 45%, #0036c3 85%, #FFFFFF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(0 0 4px rgba(59, 130, 246, 0.9))',
          }}>C</span>
        </div>
        
{/* Removed underline */}
      </div>
    </div>
  );
};

export default SyncLogo;