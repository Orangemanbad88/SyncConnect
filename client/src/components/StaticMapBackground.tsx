import { useState, useEffect, useRef } from 'react';

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
  zoom = 12,
  width = 1200,
  height = 800,
  className = '',
  style = {}
}: StaticMapBackgroundProps) => {
  const [mapUrl, setMapUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  
  useEffect(() => {
    if (!latitude || !longitude) return;
    
    // Use the environment variable MAPBOX_ACCESS_TOKEN directly
    const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN || '';
    
    // Generate a Mapbox Static Image URL
    const mapboxUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/${longitude},${latitude},${zoom},0/${width}x${height}@2x?access_token=${mapboxToken}`;
    
    // Set the satellite map URL
    setMapUrl(mapboxUrl);
    setIsLoading(true);
    setHasError(false);
  }, [latitude, longitude, zoom, width, height]);
  
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  
  const handleImageError = () => {
    setIsLoading(false);
    setHasError(true);
    console.error("Failed to load satellite image");
  };
  
  return (
    <div 
      className={`relative ${className}`} 
      style={{
        ...style,
        backgroundColor: '#0a192f', // Fallback background
        overflow: 'hidden',
      }}
    >
      {/* Satellite imagery or fallback */}
      {mapUrl && !hasError ? (
        <img
          ref={imgRef}
          src={mapUrl}
          alt="Map satellite view"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-50'}`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ filter: 'brightness(0.7) contrast(1.2) saturate(0.8)' }}
        />
      ) : null}
      
      {/* Blue gradient overlay */}
      <div className="absolute inset-0" style={{ 
        background: 'linear-gradient(120deg, rgba(10, 25, 48, 0.7) 0%, rgba(20, 41, 82, 0.7) 50%, rgba(30, 58, 122, 0.6) 100%)',
        pointerEvents: 'none'
      }} />
      
      {/* Grid overlay */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        pointerEvents: 'none',
        opacity: 0.7
      }} />
      
      {/* Secondary grid (smaller) */}
      <div className="absolute inset-0" style={{ 
        backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
        backgroundSize: '10px 10px',
        pointerEvents: 'none',
        opacity: 0.5
      }} />
      
      {/* Radial gradient */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(circle at center, rgba(100, 150, 255, 0.2) 0%, rgba(0, 20, 80, 0.3) 70%)',
        pointerEvents: 'none',
        mixBlendMode: 'overlay'
      }} />
      
      {/* Loading state */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default StaticMapBackground;