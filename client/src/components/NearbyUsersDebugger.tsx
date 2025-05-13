import { useUser } from '@/context/UserContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useEffect } from 'react';

export const NearbyUsersDebugger = () => {
  const { nearbyUsers, refreshNearbyUsers } = useUser();
  const { coords } = useGeolocation();

  useEffect(() => {
    const logDebugInfo = () => {
      console.log("NearbyUsers Debug Info:");
      console.log("Current coordinates:", coords);
      console.log("Number of nearby users:", nearbyUsers.length);
      console.log("Nearby users:", nearbyUsers);
    };

    logDebugInfo();
    
    // Force refresh and log again after a delay
    const timer = setTimeout(() => {
      console.log("Forcing refresh of nearby users...");
      refreshNearbyUsers();
      
      // Log again after refresh
      setTimeout(logDebugInfo, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, [coords, nearbyUsers, refreshNearbyUsers]);

  return null; // This component doesn't render anything
};

export default NearbyUsersDebugger;