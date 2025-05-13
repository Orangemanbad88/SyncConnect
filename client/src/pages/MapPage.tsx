import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Map from "@/components/Map";
import BottomNavigation from "@/components/BottomNavigation";
import ProfileModal from "@/components/ProfileModal";
import VideoChatModal from "@/components/VideoChatModal";
import TimeOfDayIndicator from "@/components/TimeOfDayIndicator";
import { useUser } from "@/context/UserContext";
import { useGeolocation } from "@/hooks/useGeolocation";
import { distributeUsers } from "@/lib/mapUtils";
import { useAmbient } from "@/context/AmbientContext";

const MapPage = () => {
  const { nearbyUsers, isLoading, selectedUser, selectUser } = useUser();
  const { coords } = useGeolocation();
  const { background } = useAmbient();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showVideoChatModal, setShowVideoChatModal] = useState(false);
  const [distributedUsers, setDistributedUsers] = useState<any[]>([]);

  useEffect(() => {
    if (nearbyUsers.length > 0 && coords) {
      setDistributedUsers(
        distributeUsers(nearbyUsers, coords.latitude, coords.longitude)
      );
    } else if (coords) {
      setDistributedUsers([]);
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
    <div className="flex flex-col h-screen overflow-hidden transition-all duration-1000" 
      style={{ 
        backgroundImage: background,
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}>
      <Header />
      <main className="flex-1 flex relative">
        {/* Full-width map */}
        <div className="flex w-full h-full z-0">
          <div className="flex-1 h-full md:h-auto">
            <Map 
              users={distributedUsers}
              isLoading={isLoading}
              onUserClick={handleUserClick}
              userCoords={coords}
            />
          </div>
        </div>
      </main>
      
      <BottomNavigation />
      <TimeOfDayIndicator />
      
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

export default MapPage;