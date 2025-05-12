// Mock map data and utilities to work with the map

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
  // In a real app, we would use a proper map library like Mapbox or Leaflet
  const latScale = height / 0.05; // 0.05 degrees of latitude
  const longScale = width / 0.05; // 0.05 degrees of longitude
  
  const x = ((long - centerLong) * longScale) + width / 2;
  const y = ((centerLat - lat) * latScale) + height / 2;
  
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
