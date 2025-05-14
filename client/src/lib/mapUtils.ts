// Map utilities to work with Mapbox and other mapping functionality
import { MAPBOX_ACCESS_TOKEN } from '../config';

export interface MapMarker {
  id: number;
  latitude: number;
  longitude: number;
  user: any;
}

// Convert lat/long to pixel coordinates for demo map
export const latLongToPixel = (
  lat: number, 
  long: number, 
  centerLat: number = 40.7128, 
  centerLong: number = -74.006,
  width: number = 100,
  height: number = 100
): { x: number, y: number } => {
  // This is a very simple conversion for demo purposes 
  // Enhanced to handle edge cases better
  
  // Scale factors - how many pixels per degree of lat/long
  // Using smaller values for a more zoomed-out view
  const latScale = height / 0.1; // 0.1 degrees of latitude
  const longScale = width / 0.1; // 0.1 degrees of longitude
  
  // Calculate pixel coordinates
  let x = ((long - centerLong) * longScale) + (width / 2);
  let y = ((centerLat - lat) * latScale) + (height / 2);
  
  // Constrain to keep markers on screen (with some padding)
  const padding = 50;
  x = Math.max(padding, Math.min(width - padding, x));
  y = Math.max(padding, Math.min(height - padding, y));
  
  console.log(`Plotting point (${lat}, ${long}) at (${x}, ${y}) px`);
  
  return { x, y };
};

// Calculate distance between two coordinates in miles
export const calculateDistance = (
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number => {
  const earthRadius = 3958.8; // miles
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  const deltaLat = toRadians(lat2 - lat1);
  const deltaLon = toRadians(lon2 - lon1);

  const a = 
    Math.sin(deltaLat/2) * Math.sin(deltaLat/2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
    Math.sin(deltaLon/2) * Math.sin(deltaLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return earthRadius * c;
};

// Convert degrees to radians
export const toRadians = (degrees: number): number => {
  return degrees * Math.PI / 180;
};

// Format distance in miles with one decimal place
export const formatDistance = (distance: number): string => {
  const miles = Math.round(distance * 10) / 10;
  return `${miles} miles away`;
};

// Mock function to distribute users randomly on the map
export const distributeUsers = (
  users: any[], 
  centerLat: number = 40.7128, 
  centerLong: number = -74.006, 
  radiusDegrees: number = 0.02
): any[] => {
  return users.map(user => {
    if (!user.latitude || !user.longitude) {
      // Generate random position if none exists
      const angle = Math.random() * 2 * Math.PI;
      const distance = Math.random() * radiusDegrees;
      
      const latitude = centerLat + (distance * Math.cos(angle));
      const longitude = centerLong + (distance * Math.sin(angle));
      
      return { ...user, latitude, longitude };
    }
    return user;
  });
};

// Get Mapbox satellite imagery URL for a given location
export const getSatelliteMapUrl = (
  latitude: number,
  longitude: number,
  zoom: number = 11,
  width: number = 1200,
  height: number = 1200,
  pitch: number = 0,
  bearing: number = 0,
  style: 'satellite' | 'satellite-streets' = 'satellite'
): string => {
  // Mapbox style can be 'satellite' for pure satellite imagery or 'satellite-streets' for satellite with roads/labels
  const mapboxStyle = style === 'satellite' ? 'mapbox/satellite-v9' : 'mapbox/satellite-streets-v12';
  
  return `https://api.mapbox.com/styles/v1/${mapboxStyle}/static/${longitude},${latitude},${zoom},${bearing},${pitch}/${width}x${height}?access_token=${MAPBOX_ACCESS_TOKEN}`;
};
