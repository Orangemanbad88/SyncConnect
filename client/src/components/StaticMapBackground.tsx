import { useMemo, useEffect, useState } from 'react';
import { getSatelliteMapUrl } from '@/lib/mapUtils';
import { useAmbient } from '@/context/AmbientContext';
import { TimeOfDay } from '@/types';

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
  latitude = 40.7128, // Default to NYC
  longitude = -74.006,
  zoom = 11,
  width = 1200,
  height = 1200,
  className = '',
  style = {}
}: StaticMapBackgroundProps) => {
  const { timeOfDay } = useAmbient();
  const [mapUrl, setMapUrl] = useState<string>('');
  
  // Apply time of day-specific filters to the map
  const timeOfDayFilter = useMemo(() => {
    switch (timeOfDay) {
      case 'dawn':
        return 'brightness(0.85) sepia(0.2) hue-rotate(10deg)';
      case 'day':
        return 'brightness(1) saturate(1.1)';
      case 'sunset':
        return 'brightness(0.8) sepia(0.3) hue-rotate(340deg)';
      case 'night':
        return 'brightness(0.4) saturate(0.7) hue-rotate(210deg)';
      default:
        return 'brightness(1)';
    }
  }, [timeOfDay]);

  // Generate map URL when coordinates or dimensions change
  useEffect(() => {
    if (latitude && longitude) {
      const url = getSatelliteMapUrl(
        latitude,
        longitude,
        zoom,
        width,
        height,
        0, // pitch
        0, // bearing
        'satellite-streets'
      );
      setMapUrl(url);
    }
  }, [latitude, longitude, zoom, width, height]);

  return (
    <div 
      className={`absolute inset-0 w-full h-full overflow-hidden ${className}`}
      style={style}
    >
      {mapUrl ? (
        <div className="relative w-full h-full">
          <img
            src={mapUrl}
            alt="Map view"
            className="w-full h-full object-cover"
            style={{ 
              filter: timeOfDayFilter,
              transition: 'filter 1s ease-in-out'
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/60" />
        </div>
      ) : (
        <div className="w-full h-full bg-black flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
    </div>
  );
};

export default StaticMapBackground;