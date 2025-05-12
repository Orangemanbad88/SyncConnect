import { useState, useEffect, useRef } from "react";
import Header from "@/components/Header";
import HeroHeader from "@/components/HeroHeader";
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
  const [headerOpacity, setHeaderOpacity] = useState(1);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (nearbyUsers.length > 0 && coords) {
      setDistributedUsers(
        distributeUsers(nearbyUsers, coords.latitude, coords.longitude)
      );
    }
  }, [nearbyUsers, coords]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!mainRef.current) return;
      
      const scrollPosition = mainRef.current.scrollTop;
      const maxScroll = 300; // adjust this value to control fade speed
      const newOpacity = Math.max(0, 1 - scrollPosition / maxScroll);
      setHeaderOpacity(newOpacity);
    };
    
    const mainElement = mainRef.current;
    if (mainElement) {
      mainElement.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (mainElement) {
        mainElement.removeEventListener('scroll', handleScroll);
      }
    };
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
    <div className="flex flex-col h-screen overflow-hidden">
      <Header />
      
      <main ref={mainRef} className="flex-1 flex overflow-y-auto overflow-x-hidden relative">
        <HeroHeader opacity={headerOpacity} />
        
        <div className="w-full pt-60 sm:pt-72 md:pt-80"> {/* Spacer for hero header */}
          <div className="flex w-full">
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
        </div>
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
