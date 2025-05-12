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
    <div className="flex-1 relative overflow-hidden">
      <div
        ref={mapRef}
        className="w-full h-full bg-cover bg-center transition-transform duration-300"
        style={{
          backgroundImage: `url('https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v11/static/${userCoords ? `${userCoords.longitude},${userCoords.latitude}` : '-96.7970,32.7767'},12,0/1200x800?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA')`,
          filter: "contrast(1.1) saturate(1.2)",
          transform: `scale(${zoom})`,
          transformOrigin: "center"
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
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt={`${user.fullName}, ${user.age}`}
                      className="w-14 h-14 rounded-full border-3 border-white object-cover shadow-lg"
                      style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.3)' }}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black opacity-20 pointer-events-none"></div>
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      user.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                    style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.2)' }}
                  ></span>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap">
                    {user.fullName.split(' ')[0]}, {user.age}
                  </div>
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
