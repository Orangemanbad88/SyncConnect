import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import HeroHeader from "@/components/HeroHeader";
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
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nearbyUsers.length > 0 && coords) {
      setDistributedUsers(
        distributeUsers(nearbyUsers, coords.latitude, coords.longitude)
      );
    }
  }, [nearbyUsers, coords]);
  
  // We'll set up an effect to automatically fade the header
  useEffect(() => {
    // Start a timer to slowly fade out the header
    const fadeTimer = setTimeout(() => {
      // Fade out over 5 seconds
      const fadeInterval = setInterval(() => {
        setHeaderOpacity(prevOpacity => {
          const newOpacity = Math.max(0, prevOpacity - 0.01);
          
          if (newOpacity <= 0) {
            clearInterval(fadeInterval);
          }
          
          return newOpacity;
        });
      }, 50); // 20 steps per second
      
      return () => clearInterval(fadeInterval);
    }, 3000); // Start fading after 3 seconds
    
    return () => clearTimeout(fadeTimer);
  }, []);

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
    <div className="flex flex-col h-screen overflow-hidden transition-colors duration-1000" style={{ backgroundColor: background }}>
      <Header />
      
      <main className="flex-1 flex relative">
        <HeroHeader opacity={headerOpacity} />
        
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
