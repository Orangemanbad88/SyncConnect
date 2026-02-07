import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useGeolocation } from "@/hooks/useGeolocation";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";

interface UserContextType {
  currentUser: any | null;
  isAuthenticated: boolean;
  nearbyUsers: any[];
  selectedUser: any | null;
  isLoading: boolean;
  error: Error | null;
  refreshNearbyUsers: () => void;
  selectUser: (user: any) => void;
  blockedUserIds: number[];
  availableNowUserIds: number[];
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user for testing without login
const MOCK_USER = {
  id: 1,
  username: "testuser",
  email: "test@example.com",
  fullName: "Test User",
  age: 25,
  job: "Developer",
  bio: "Testing the app",
  profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop",
  coverImage: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=800&h=300&fit=crop",
  latitude: 40.7128,
  longitude: -74.006,
  isOnline: true,
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [error, setError] = useState<Error | null>(null);

  // Use mock user if not authenticated (for testing)
  const currentUser = authUser || MOCK_USER;
  const isAuthenticated = true; // Always authenticated for testing

  // Get user's location with enhanced tracking
  const {
    coords,
    locationError,
    isTracking,
    permissionStatus,
    timeSinceUpdate
  } = useGeolocation({
    updateInterval: 15000,
    highAccuracy: true
  });

  // Fetch blocked user IDs
  const { data: blockedUserIds = [] } = useQuery<number[]>({
    queryKey: ['/api/blocks'],
    enabled: isAuthenticated,
    refetchInterval: 60000,
  });

  // Fetch available users now
  const { data: availableNowUserIds = [] } = useQuery<number[]>({
    queryKey: ['/api/users/available/now'],
    enabled: true,
    refetchInterval: 60000,
  });

  // Fetch nearby users when location changes
  const {
    data: nearbyUsers = [],
    isLoading: usersLoading,
    refetch: refreshNearbyUsers
  } = useQuery({
    queryKey: ['/api/users', coords?.latitude, coords?.longitude],
    enabled: true, // Always enabled for testing
    refetchInterval: 30000,
    staleTime: 60000, // Consider data stale after 1 minute
    select: (data: unknown) => {
      const users = data as any[];
      return users
        .filter(user => user.id !== currentUser?.id) // Exclude current user
        .filter(user => !blockedUserIds.includes(user.id)) // Exclude blocked users
        .map(user => ({
          ...user,
          locationTimestamp: user.locationTimestamp || Date.now(),
          locationAge: user.locationTimestamp
            ? Math.floor((Date.now() - user.locationTimestamp) / 1000)
            : null,
          isAvailableNow: availableNowUserIds.includes(user.id),
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
    },
    onError: (err) => {
      console.error('Failed to update location:', err);
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
    },
    onError: (err) => {
      console.error('Failed to update online status:', err);
    }
  });

  // Set user online when authenticated
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      updateOnlineStatusMutation.mutate(true);

      // Set to offline when component unmounts or user logs out
      return () => {
        updateOnlineStatusMutation.mutate(false);
      };
    }
  }, [isAuthenticated, currentUser?.id]);

  // Update location when coords change
  useEffect(() => {
    if (isAuthenticated && coords && currentUser) {
      updateLocationMutation.mutate();
    }
  }, [coords?.latitude, coords?.longitude, isAuthenticated, currentUser?.id]);

  const selectUser = (user: any) => {
    setSelectedUser(user);
  };

  const isLoading = authLoading || usersLoading;

  return (
    <UserContext.Provider
      value={{
        currentUser,
        isAuthenticated,
        nearbyUsers,
        selectedUser,
        isLoading,
        error,
        refreshNearbyUsers,
        selectUser,
        blockedUserIds,
        availableNowUserIds,
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
