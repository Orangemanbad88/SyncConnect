import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Map from "@/components/Map";
import DiscoverySidebar from "@/components/DiscoverySidebar";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileModal from "@/components/ProfileModal";
import VideoChatModal from "@/components/VideoChatModal";
import { useUser } from "@/context/UserContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { distributeUsers } from "@/lib/mapUtils";

const Home = () => {
  const { nearbyUsers, isLoading, selectedUser, selectUser } = useUser();
  const { coords } = useGeolocation();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVideoChatModal, setShowVideoChatModal] = useState(false);
  const [distributedUsers, setDistributedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (nearbyUsers.length > 0 && coords) {
      setDistributedUsers(
        distributeUsers(nearbyUsers, coords.latitude, coords.longitude)
      );
    }
  }, [nearbyUsers, coords]);

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
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main className="flex-1 flex overflow-hidden relative">
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
      </main>
      
      <BottomNavigation />
      
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
