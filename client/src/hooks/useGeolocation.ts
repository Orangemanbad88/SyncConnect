import { useState, useEffect, useCallback } from 'react';

interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp?: number;
}

interface GeolocationState {
  coords: Coordinates | null;
  error: string | null;
  locationError: GeolocationPositionError | null;
  isTracking: boolean;
  lastUpdated: number | null;
  permissionStatus: PermissionState | null;
}

export const useGeolocation = (options?: {
  highAccuracy?: boolean;
  maxAge?: number;
  timeout?: number;
  updateInterval?: number;
}) => {
  const {
    highAccuracy = true,
    maxAge = 10000,
    timeout = 15000,
    updateInterval = 10000, // Update every 10 seconds by default
  } = options || {};

  const [state, setState] = useState<GeolocationState>({
    coords: null,
    error: null,
    locationError: null,
    isTracking: false,
    lastUpdated: null,
    permissionStatus: null
  });

  // Check geolocation permission
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then(result => {
        setState(prev => ({
          ...prev,
          permissionStatus: result.state
        }));

        result.onchange = () => {
          setState(prev => ({
            ...prev,
            permissionStatus: result.state
          }));
        };
      });
    }
  }, []);

  // Function to update position
  const updatePosition = useCallback((position: GeolocationPosition) => {
    setState(prev => ({
      ...prev,
      coords: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp
      },
      error: null,
      locationError: null,
      isTracking: true,
      lastUpdated: Date.now()
    }));
  }, []);

  // Function to handle errors
  const handleError = useCallback((error: GeolocationPositionError) => {
    let errorMessage = "Failed to get location";
    
    switch (error.code) {
      case error.PERMISSION_DENIED:
        errorMessage = "Location access denied. Please allow location access in your browser settings.";
        break;
      case error.POSITION_UNAVAILABLE:
        errorMessage = "Location information is unavailable. Please check your device settings.";
        break;
      case error.TIMEOUT:
        errorMessage = "Location request timed out. Please try again.";
        break;
    }
    
    setState(prev => ({
      ...prev,
      error: errorMessage,
      locationError: error,
      isTracking: false
    }));
  }, []);

  // Get initial position and watch for changes
  useEffect(() => {
    if (!navigator.geolocation) {
      setState(prev => ({
        ...prev,
        error: "Geolocation is not supported by your browser"
      }));
      return;
    }

    setState(prev => ({
      ...prev,
      isTracking: true
    }));

    // Get initial position
    navigator.geolocation.getCurrentPosition(
      updatePosition,
      handleError,
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeout,
        maximumAge: maxAge
      }
    );

    // Watch position for changes
    const watchId = navigator.geolocation.watchPosition(
      updatePosition,
      handleError,
      {
        enableHighAccuracy: highAccuracy,
        timeout: timeout,
        maximumAge: maxAge
      }
    );

    // Set up an interval to force updates at a minimum frequency
    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        updatePosition,
        handleError,
        {
          enableHighAccuracy: highAccuracy,
          timeout: timeout,
          maximumAge: 0 // Force a fresh reading
        }
      );
    }, updateInterval);

    return () => {
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
      setState(prev => ({
        ...prev,
        isTracking: false
      }));
    };
  }, [highAccuracy, maxAge, timeout, updateInterval, updatePosition, handleError]);

  // Calculate time since last update
  const timeSinceUpdate = state.lastUpdated 
    ? Math.floor((Date.now() - state.lastUpdated) / 1000) 
    : null;

  return {
    ...state,
    timeSinceUpdate
  };
};
