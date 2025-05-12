import { useState, useEffect, useRef } from "react";
import { latLongToPixel } from "@/lib/mapUtils";
import { Plus, Minus, ArrowUp } from "lucide-react";

interface MapProps {
  users: any[];
  isLoading: boolean;
  onUserClick: (user: any) => void;
  userCoords: { latitude: number; longitude: number } | null;
}

const Map = ({ users, isLoading, onUserClick, userCoords }: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapDimensions, setMapDimensions] = useState({ width: 0, height: 0 });
  const [zoom, setZoom] = useState(1);
  
  // Resize handler
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        setMapDimensions({
          width: mapRef.current.clientWidth,
          height: mapRef.current.clientHeight
        });
      }
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };
  
  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.6));
  };
  
  const handleReset = () => {
    setZoom(1);
  };

  return (
    <div className="flex-1 relative">
      <div
        ref={mapRef}
        className="w-full h-full bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1545502648-54d6ff2abdad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
          filter: "contrast(0.9) saturate(0.8)"
        }}
      >
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : (
          users.map(user => {
            if (!user.latitude || !user.longitude || !userCoords) return null;
            
            const position = latLongToPixel(
              user.latitude,
              user.longitude,
              userCoords.latitude,
              userCoords.longitude,
              mapDimensions.width * zoom,
              mapDimensions.height * zoom
            );
            
            return (
              <div
                key={user.id}
                className="absolute cursor-pointer transition-transform hover:scale-110"
                style={{
                  top: `${position.y}px`,
                  left: `${position.x}px`,
                }}
                onClick={() => onUserClick(user)}
              >
                <div className="relative">
                  <img
                    src={user.profileImage}
                    alt={`${user.fullName}, ${user.age}`}
                    className="w-12 h-12 rounded-full border-2 border-white object-cover shadow-md"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white ${
                      user.isOnline ? "online-indicator" : "offline-indicator"
                    }`}
                  ></span>
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Map controls */}
      <div className="absolute bottom-24 right-4 flex flex-col space-y-2">
        <button
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={handleZoomIn}
        >
          <Plus className="w-6 h-6 text-[var(--text-dark)]" />
        </button>
        <button
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={handleZoomOut}
        >
          <Minus className="w-6 h-6 text-[var(--text-dark)]" />
        </button>
        <button
          className="bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md"
          onClick={handleReset}
        >
          <ArrowUp className="w-6 h-6 text-[var(--text-dark)]" />
        </button>
      </div>
      
      {/* Current location indicator */}
      {userCoords && (
        <div
          className="absolute"
          style={{ bottom: "24%", left: "50%" }}
        >
          <div className="relative -ml-4">
            <div className="w-8 h-8 rounded-full bg-[var(--primary-blue)] border-2 border-white flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white"></div>
            </div>
            <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-[var(--primary-blue)] opacity-30 animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
