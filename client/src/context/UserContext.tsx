import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useGeolocation } from "@/hooks/useGeolocation";
import { queryClient } from "@/lib/queryClient";

interface UserContextType {
  currentUser: any | null;
  isAuthenticated: boolean;
  nearbyUsers: any[];
  selectedUser: any | null;
  isLoading: boolean;
  error: Error | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshNearbyUsers: () => void;
  selectUser: (user: any) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);
  
  // Mock user for demonstration
  const mockUser = {
    id: 999,
    username: "currentuser",
    fullName: "Current User",
    age: 26,
    job: "Product Designer",
    bio: "Always looking for new connections and experiences. Love travel, photography, and good coffee.",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&h=120",
    isOnline: true
  };
  
  // Get user's location with enhanced tracking
  const { 
    coords, 
    locationError, 
    isTracking, 
    permissionStatus, 
    timeSinceUpdate 
  } = useGeolocation({
    updateInterval: 15000, // Update location every 15 seconds
    highAccuracy: true
  });
  
  // Fetch nearby users when location changes
  const { 
    data: nearbyUsers = [], 
    isLoading, 
    refetch: refreshNearbyUsers 
  } = useQuery({
    queryKey: ['/api/users', coords?.latitude, coords?.longitude],
    enabled: !!coords?.latitude && !!coords?.longitude,
    refetchInterval: 30000, // Refresh every 30 seconds
    select: (data) => {
      // Add additional info like timeAgo
      return data.map((user: any) => ({
        ...user,
        locationTimestamp: user.locationTimestamp || Date.now(),
        locationAge: user.locationTimestamp 
          ? Math.floor((Date.now() - user.locationTimestamp) / 1000) 
          : null
      }));
    }
  });
  
  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async () => {
      if (!currentUser || !coords) return null;
      return apiRequest('PATCH', `/api/users/${currentUser.id}/location`, {
        latitude: coords.latitude,
        longitude: coords.longitude
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    }
  });
  
  // Update online status mutation
  const updateOnlineStatusMutation = useMutation({
    mutationFn: async (isOnline: boolean) => {
      if (!currentUser) return null;
      return apiRequest('PATCH', `/api/users/${currentUser.id}/status`, {
        isOnline
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users'] });
    }
  });
  
  // Set mock user as authenticated on initial load
  useEffect(() => {
    setCurrentUser(mockUser);
    setIsAuthenticated(true);
    
    // Set user as online
    updateOnlineStatusMutation.mutate(true);
    
    // Set to offline when component unmounts
    return () => {
      if (isAuthenticated) {
        updateOnlineStatusMutation.mutate(false);
      }
    };
  }, []);
  
  // Update location when coords change
  useEffect(() => {
    if (isAuthenticated && coords) {
      updateLocationMutation.mutate();
    }
  }, [coords, isAuthenticated]);
  
  const login = async (username: string, password: string) => {
    try {
      // In a real app, we would make an API request here
      setCurrentUser(mockUser);
      setIsAuthenticated(true);
      updateOnlineStatusMutation.mutate(true);
    } catch (err) {
      setError(err as Error);
    }
  };
  
  const logout = async () => {
    try {
      // Set user offline before logging out
      await updateOnlineStatusMutation.mutateAsync(false);
      setCurrentUser(null);
      setIsAuthenticated(false);
    } catch (err) {
      setError(err as Error);
    }
  };
  
  const selectUser = (user: any) => {
    setSelectedUser(user);
  };
  
  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        nearbyUsers,
        selectedUser,
        isLoading,
        error,
        login,
        logout,
        refreshNearbyUsers,
        selectUser
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
