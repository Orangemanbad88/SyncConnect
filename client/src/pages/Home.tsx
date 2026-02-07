import { useState, useEffect } from "react";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileModal from "@/components/ProfileModal";
import VerticalProfileCards from "@/components/VerticalProfileCards";
import Map from "@/components/Map";
import { useUser } from "@/context/UserContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { calculateDistance, formatDistance, distributeUsers } from "@/lib/mapUtils";
import { LayoutGrid, Map as MapIcon, Clock } from "lucide-react";

// Fake sample users for demo
const FAKE_USERS = [
  { id: 1, fullName: "Sophia Chen", age: 26, job: "UX Designer", bio: "Coffee lover, mountain hiker, design enthusiast", profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop", isOnline: true, zodiacSign: "leo", latitude: 40.7128, longitude: -74.006 },
  { id: 2, fullName: "Marcus Johnson", age: 29, job: "Software Engineer", bio: "Building the future one line at a time", profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop", isOnline: true, zodiacSign: "aries", latitude: 40.7138, longitude: -74.008 },
  { id: 3, fullName: "Emma Williams", age: 24, job: "Photographer", bio: "Capturing moments, creating memories", profileImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop", isOnline: false, zodiacSign: "pisces", latitude: 40.7118, longitude: -74.004 },
  { id: 4, fullName: "James Rodriguez", age: 31, job: "Music Producer", bio: "Beats and melodies are my language", profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop", isOnline: true, zodiacSign: "scorpio", latitude: 40.7148, longitude: -74.002 },
  { id: 5, fullName: "Olivia Taylor", age: 27, job: "Yoga Instructor", bio: "Finding balance in chaos", profileImage: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=400&fit=crop", isOnline: true, zodiacSign: "libra", latitude: 40.7108, longitude: -74.010 },
  { id: 6, fullName: "Noah Kim", age: 28, job: "Chef", bio: "Food is art on a plate", profileImage: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop", isOnline: false, zodiacSign: "taurus", latitude: 40.7158, longitude: -74.012 },
  { id: 7, fullName: "Ava Martinez", age: 25, job: "Writer", bio: "Words are my superpower", profileImage: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=400&fit=crop", isOnline: true, zodiacSign: "gemini", latitude: 40.7098, longitude: -74.014 },
  { id: 8, fullName: "Liam Brown", age: 30, job: "Architect", bio: "Designing spaces that inspire", profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop", isOnline: true, zodiacSign: "capricorn", latitude: 40.7168, longitude: -74.016 },
];

const Home = () => {
  const { nearbyUsers, isLoading: apiLoading, selectUser, availableNowUserIds } = useUser();
  const { coords, permissionStatus } = useGeolocation();
  const { user } = useAuth();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'map'>('cards');
  const [distributedUsers, setDistributedUsers] = useState<any[]>([]);

  // Use fake users if no real users available
  const isLoading = false; // Don't show loading, always show content
  const displayUsers = nearbyUsers.length > 0 ? nearbyUsers : FAKE_USERS;

  // Fake coords if not available
  const displayCoords = coords || { latitude: 40.7128, longitude: -74.006 };

  // Distribute users for map view
  useEffect(() => {
    if (displayUsers.length > 0) {
      setDistributedUsers(distributeUsers(displayUsers, displayCoords.latitude, displayCoords.longitude));
    } else {
      setDistributedUsers([]);
    }
  }, [displayUsers, displayCoords.latitude, displayCoords.longitude]);

  // Fetch recommendations to mark matches
  const { data: recommendations } = useQuery({
    queryKey: ['/api/users', user?.id, 'recommendations'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await apiRequest('GET', `/api/users/${user.id}/recommendations`);
      return await res.json();
    },
    enabled: !!user?.id,
  });

  const recommendedUserIds = recommendations
    ? recommendations.map((rec: any) => rec.recommendedUserId)
    : [];

  // Add distance and match info to users
  const usersWithInfo = displayUsers.map(u => {
    let distanceText = undefined;
    if (u.latitude && u.longitude) {
      const distance = calculateDistance(
        displayCoords.latitude,
        displayCoords.longitude,
        u.latitude,
        u.longitude
      );
      distanceText = formatDistance(distance);
    }
    return {
      ...u,
      distanceText,
      isMatch: recommendedUserIds.includes(u.id),
      isAvailableNow: availableNowUserIds.includes(u.id),
    };
  });

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setShowProfile(true);
  };

  const handleMapUserClick = (user: any) => {
    selectUser(user);
    setSelectedUser(user);
    setShowProfile(true);
  };

  // Render content based on state
  const renderContent = () => {
    // Main content with view modes - always show users (fake or real)
    if (viewMode === 'cards') {
      return (
        <VerticalProfileCards
          users={usersWithInfo}
          onViewProfile={handleViewProfile}
          userCoords={displayCoords}
        />
      );
    } else {
      return (
        <Map
          users={distributedUsers.map(u => ({
            ...u,
            isRecommended: recommendedUserIds.includes(u.id),
          }))}
          isLoading={false}
          onUserClick={handleMapUserClick}
          userCoords={displayCoords}
          highlightRecommended={true}
        />
      );
    }
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)' }}>
      <Header />

      {/* View Toggle */}
      <div
        className="flex justify-center py-3"
        style={{ backgroundColor: 'rgba(13, 15, 18, 0.98)' }}
      >
        <div
          className="flex items-center p-1 rounded-full gap-1"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(201, 169, 98, 0.1)',
          }}
        >
          <button
            onClick={() => setViewMode('cards')}
            className="flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: viewMode === 'cards' ? 'rgba(201, 169, 98, 0.15)' : 'transparent',
              border: viewMode === 'cards' ? '1px solid rgba(201, 169, 98, 0.3)' : '1px solid transparent',
            }}
          >
            <LayoutGrid
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: viewMode === 'cards' ? '#C9A962' : 'rgba(255,255,255,0.4)' }}
            />
            <span
              className="text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                color: viewMode === 'cards' ? '#C9A962' : 'rgba(255,255,255,0.4)',
              }}
            >
              Cards
            </span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className="flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-300"
            style={{
              backgroundColor: viewMode === 'map' ? 'rgba(201, 169, 98, 0.15)' : 'transparent',
              border: viewMode === 'map' ? '1px solid rgba(201, 169, 98, 0.3)' : '1px solid transparent',
            }}
          >
            <MapIcon
              className="w-4 h-4 transition-colors duration-300"
              style={{ color: viewMode === 'map' ? '#C9A962' : 'rgba(255,255,255,0.4)' }}
            />
            <span
              className="text-[10px] tracking-[0.15em] uppercase transition-all duration-300"
              style={{
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
                color: viewMode === 'map' ? '#C9A962' : 'rgba(255,255,255,0.4)',
              }}
            >
              Map
            </span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {renderContent()}
      </div>

      <BottomNavigation />

      {showProfile && selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setShowProfile(false)}
          onStartVideoChat={() => {}}
        />
      )}
    </div>
  );
};

export default Home;
