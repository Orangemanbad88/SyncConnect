import { useState, useEffect } from 'react';

interface StaticMapBackgroundProps {
  latitude?: number;
  longitude?: number;
  zoom?: number;
  width?: number;
  height?: number;
  className?: string;
  style?: React.CSSProperties;
}

const StaticMapBackground = ({
  latitude = 40.7128,
  longitude = -74.0060,
  zoom = 10,
  width = 1200,
  height = 800,
  className = '',
  style = {}
}: StaticMapBackgroundProps) => {
  const [mapUrl, setMapUrl] = useState<string>('');
  
  useEffect(() => {
    // Use a direct public mapbox style that doesn't require a token
    const baseMapUrl = 'https://tile.openstreetmap.org/';
    
    // Create a basic div with a grid pattern as fallback
    const gridPattern = `
      linear-gradient(
        to right,
        rgba(50, 50, 80, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(
        to bottom,
        rgba(50, 50, 80, 0.1) 1px,
        transparent 1px
      )
    `;
    
    // Set the map URL to fallback (we'll use CSS background pattern)
    setMapUrl('');
  }, [latitude, longitude, zoom, width, height]);
  
  return (
    <div 
      className={`relative ${className}`} 
      style={{
        ...style,
        background: '#112244',
        backgroundImage: 'linear-gradient(120deg, #112255 0%, #223366 50%, #334477 100%)',
        backgroundSize: '20px 20px',
        backgroundPosition: 'center',
      }}
    >
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
        pointerEvents: 'none'
      }} />
      
      {/* Radial gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, rgba(100, 150, 255, 0.1) 0%, rgba(0, 20, 80, 0.2) 70%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
};

export default StaticMapBackground;