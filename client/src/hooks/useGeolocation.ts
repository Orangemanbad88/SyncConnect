import { useState, useEffect } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface GeolocationState {
  coords: Coordinates | null;
  error: string | null;
  locationError: GeolocationPositionError | null;
}

export const useGeolocation = () => {
  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    locationError: null
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser"
      }));
      return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      position => {
        setState(prev => ({
          ...prev,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          error: null,
          locationError: null
        }));
      },
      error => {
        setState(prev => ({
          ...prev,
          error: "Failed to get current position",
          locationError: error
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );

    // Watch position for changes
    const watchId = navigator.geolocation.watchPosition(
      position => {
        setState(prev => ({
          ...prev,
          coords: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          },
          error: null,
          locationError: null
        }));
      },
      error => {
        setState(prev => ({
          ...prev,
          error: "Failed to watch position",
          locationError: error
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return state;
};
