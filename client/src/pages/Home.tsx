import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import Map from "@/components/Map";
import DiscoverySidebar from "@/components/DiscoverySidebar";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileModal from "@/components/ProfileModal";
import VideoChatModal from "@/components/VideoChatModal";
import TimeOfDayIndicator from "@/components/TimeOfDayIndicator";
import TimeChangerPanel from "@/components/TimeChangerPanel";
import { useUser } from "@/context/UserContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { distributeUsers } from "@/lib/mapUtils";
import { useAmbient } from "@/context/AmbientContext";

const Home = () => {
  const { nearbyUsers, isLoading, selectedUser, selectUser } = useUser();
  const { coords } = useGeolocation();
  const { background } = useAmbient();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVideoChatModal, setShowVideoChatModal] = useState(false);
  const [distributedUsers, setDistributedUsers] = useState<any[]>([]);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nearbyUsers.length > 0 && coords) {
      setDistributedUsers(
        distributeUsers(nearbyUsers, coords.latitude, coords.longitude)
      );
    } else if (coords) {
      // Create placeholder users around the current location if no nearby users
      const placeholderUsers = [
        { id: 100, fullName: 'Alex Morgan', age: 28, profileImage: 'https://randomuser.me/api/portraits/men/32.jpg', latitude: coords.latitude + 0.01, longitude: coords.longitude + 0.01, isOnline: true },
        { id: 101, fullName: 'Jessica Chen', age: 26, profileImage: 'https://randomuser.me/api/portraits/women/44.jpg', latitude: coords.latitude - 0.008, longitude: coords.longitude + 0.005, isOnline: true },
        { id: 102, fullName: 'Michael Lee', age: 31, profileImage: 'https://randomuser.me/api/portraits/men/22.jpg', latitude: coords.latitude + 0.005, longitude: coords.longitude - 0.012, isOnline: false },
        { id: 103, fullName: 'Sarah Park', age: 24, profileImage: 'https://randomuser.me/api/portraits/women/67.jpg', latitude: coords.latitude - 0.015, longitude: coords.longitude - 0.008, isOnline: true },
        { id: 104, fullName: 'Emma Wilson', age: 29, profileImage: 'https://randomuser.me/api/portraits/women/33.jpg', latitude: coords.latitude + 0.003, longitude: coords.longitude + 0.018, isOnline: true },
        { id: 105, fullName: 'David Kim', age: 32, profileImage: 'https://randomuser.me/api/portraits/men/45.jpg', latitude: coords.latitude - 0.012, longitude: coords.longitude + 0.009, isOnline: true },
        { id: 106, fullName: 'Sophia Garcia', age: 27, profileImage: 'https://randomuser.me/api/portraits/women/28.jpg', latitude: coords.latitude + 0.007, longitude: coords.longitude - 0.005, isOnline: true },
        { id: 107, fullName: 'James Johnson', age: 30, profileImage: 'https://randomuser.me/api/portraits/men/55.jpg', latitude: coords.latitude - 0.006, longitude: coords.longitude - 0.014, isOnline: false },
        { id: 108, fullName: 'Olivia Brown', age: 25, profileImage: 'https://randomuser.me/api/portraits/women/90.jpg', latitude: coords.latitude + 0.016, longitude: coords.longitude + 0.002, isOnline: true },
        { id: 109, fullName: 'Ryan Miller', age: 33, profileImage: 'https://randomuser.me/api/portraits/men/78.jpg', latitude: coords.latitude - 0.018, longitude: coords.longitude + 0.016, isOnline: false },
        { id: 110, fullName: 'Ava Martinez', age: 24, profileImage: 'https://randomuser.me/api/portraits/women/63.jpg', latitude: coords.latitude + 0.009, longitude: coords.longitude - 0.019, isOnline: true },
      ];
      setDistributedUsers(placeholderUsers);
    }
  }, [nearbyUsers, coords]);
  
  // Removed fade timer effect

  const handleUserClick = (user: any) => {
    selectUser(user);
    setShowProfileModal(true);
  };

  const handleStartVideoChat = () => {
    setShowProfileModal(false);
    setShowVideoChatModal(true);
  };

  const handleCloseVideoChat = () => {
    setShowVideoChatModal(false);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden transition-all duration-1000" 
      style={{ 
        backgroundImage: background,
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}>
      <Header />
      <main className="flex-1 flex relative">
        {/* Map and sidebar */}
        <div className="flex w-full h-full z-0">
          <Map 
            users={distributedUsers}
            isLoading={isLoading}
            onUserClick={handleUserClick}
            userCoords={coords}
          />
          
          <DiscoverySidebar 
            users={nearbyUsers}
            isLoading={isLoading}
            onUserClick={handleUserClick}
          />
        </div>
      </main>
      
      <BottomNavigation />
      <TimeOfDayIndicator />
      <TimeChangerPanel />
      
      {showProfileModal && selectedUser && (
        <ProfileModal 
          user={selectedUser}
          onClose={() => setShowProfileModal(false)}
          onStartVideoChat={handleStartVideoChat}
        />
      )}
      
      {showVideoChatModal && selectedUser && (
        <VideoChatModal 
          user={selectedUser}
          onClose={handleCloseVideoChat}
        />
      )}
    </div>
  );
};

export default Home;
