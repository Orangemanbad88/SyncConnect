import { useState, useEffect, useRef } from "react";
import { latLongToPixel } from "@/lib/mapUtils";
import { Plus, Minus, ArrowUp, Video } from "lucide-react";
import { useLocation } from "wouter";
import { useAmbient } from "@/context/AmbientContext";
import StaticMapBackground from "./StaticMapBackground";

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
  const [showZoomTip, setShowZoomTip] = useState(true);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { timeOfDay } = useAmbient();
  
  // Hide zoom tip after 5 seconds
  useEffect(() => {
    if (showZoomTip) {
      const timer = setTimeout(() => {
        setShowZoomTip(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [showZoomTip]);

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
  
  // Mouse wheel zoom handler
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (mapRef.current && mapRef.current.contains(e.target as Node)) {
        e.preventDefault();
        if (e.deltaY < 0) {
          // Scrolling up - zoom in
          setZoom(prev => Math.min(prev + 0.1, 3));
        } else {
          // Scrolling down - zoom out
          setZoom(prev => Math.max(prev - 0.1, 0.3));
        }
      }
    };
    
    // Add the event listener with passive: false to allow preventDefault
    window.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);
  
  // Touch pinch zoom handler for mobile devices
  useEffect(() => {
    let initialDistance = 0;
    let initialZoom = 1;
    
    const calculateDistance = (touches: TouchList): number => {
      if (touches.length < 2) return 0;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      return Math.sqrt(dx * dx + dy * dy);
    };
    
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2 && mapRef.current && mapRef.current.contains(e.target as Node)) {
        e.preventDefault();
        initialDistance = calculateDistance(e.touches);
        initialZoom = zoom;
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2 && initialDistance > 0 && mapRef.current && mapRef.current.contains(e.target as Node)) {
        e.preventDefault();
        
        const currentDistance = calculateDistance(e.touches);
        const scaleFactor = currentDistance / initialDistance;
        
        // Calculate new zoom level based on pinch gesture
        const newZoom = initialZoom * scaleFactor;
        setZoom(Math.min(Math.max(newZoom, 0.3), 3));
      }
    };
    
    const handleTouchEnd = () => {
      initialDistance = 0;
    };
    
    mapRef.current?.addEventListener('touchstart', handleTouchStart, { passive: false });
    mapRef.current?.addEventListener('touchmove', handleTouchMove, { passive: false });
    mapRef.current?.addEventListener('touchend', handleTouchEnd);
    
    return () => {
      mapRef.current?.removeEventListener('touchstart', handleTouchStart);
      mapRef.current?.removeEventListener('touchmove', handleTouchMove);
      mapRef.current?.removeEventListener('touchend', handleTouchEnd);
    };
  }, [zoom]);
  
  const handleZoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.2, 3);
      console.log("Zooming in to:", newZoom);
      return newZoom;
    });
  };
  
  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.2, 0.3);
      console.log("Zooming out to:", newZoom);
      return newZoom;
    });
  };
  
  const handleReset = () => {
    console.log("Resetting zoom to 1");
    setZoom(1);
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Map background */}
      <div 
        className="absolute inset-0" 
        style={{
          background: '#0a192f',
          backgroundImage: 'linear-gradient(120deg, #0a1930 0%, #142952 50%, #1e3a7a 100%)',
          pointerEvents: 'none',
          zIndex: 0
        }}
      ></div>
      
      {/* Main grid overlay */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.08) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.7
        }}
      ></div>
      
      {/* Fine grid overlay */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: `
            linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '10px 10px',
          pointerEvents: 'none',
          zIndex: 1,
          opacity: 0.5
        }}
      ></div>
      
      {/* Radial gradient */}
      <div 
        className="absolute inset-0" 
        style={{
          background: 'radial-gradient(circle at center, rgba(100, 150, 255, 0.1) 0%, rgba(0, 20, 80, 0.2) 70%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      ></div>
      
      <div
        ref={mapRef}
        className="w-full h-full transition-all duration-300 shadow-inner relative z-10"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: "center center",
          position: "relative",
          overflow: "hidden",
          background: "transparent"
        }}>
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
                <div className="relative group">
                  <div className="relative">
                    <img
                      src={user.profileImage}
                      alt={`${user.fullName}, ${user.age}`}
                      className="w-10 h-10 md:w-14 md:h-14 rounded-full border-3 border-white object-cover shadow-lg"
                      style={{ boxShadow: '0 0 0 2px rgba(0,0,0,0.3), 0 4px 10px rgba(0,0,0,0.3)' }}
                      onMouseEnter={() => setHoveredUserId(user.id)}
                      onMouseLeave={() => setHoveredUserId(null)}
                      onTouchStart={() => user.isOnline && setHoveredUserId(user.id)}
                      onTouchEnd={() => setTimeout(() => setHoveredUserId(null), 3000)}
                    />
                    <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent to-black opacity-20 pointer-events-none"></div>
                  </div>
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      user.isOnline ? "bg-green-500" : "bg-gray-400"
                    }`}
                    style={{ boxShadow: '0 0 0 1px rgba(0,0,0,0.2)' }}
                  ></span>
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 text-white text-xs px-2 py-1 rounded-full whitespace-nowrap shadow-md">
                    <span className="text-xs md:text-sm font-medium">{user.fullName.split(' ')[0]}, {user.age}</span>
                  </div>
                  
                  {/* Video call button that appears on hover for online users */}
                  {user.isOnline && hoveredUserId === user.id && (
                    <button
                      className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-purple-600 hover:bg-purple-700 text-white rounded-full p-2 shadow-lg transition-all duration-200 flex items-center justify-center gap-1"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering the parent onClick
                        setLocation(`/video/${user.id}`);
                      }}
                    >
                      <Video className="w-4 h-4" />
                      <span className="text-xs font-medium">Call</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
      
      {/* Map controls */}
      <div className="absolute bottom-20 sm:bottom-24 right-3 sm:right-4 flex flex-col space-y-2">
        <div className="bg-blue-600/80 px-2 sm:px-3 py-1 sm:py-2 rounded-lg mb-1 text-center shadow-md">
          <p className="text-white text-xs font-medium">Zoom: {(zoom * 100).toFixed(0)}%</p>
        </div>
        <button
          className="bg-blue-500/90 hover:bg-blue-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all border border-blue-400/30 text-white"
          onClick={handleZoomIn}
          title="Zoom In"
        >
          <Plus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          className="bg-blue-500/90 hover:bg-blue-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all border border-blue-400/30 text-white"
          onClick={handleZoomOut}
          title="Zoom Out"
        >
          <Minus className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </button>
        <button
          className="bg-purple-500/90 hover:bg-purple-600 rounded-full w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-105 transition-all border border-purple-400/30 text-white"
          onClick={handleReset}
          title="Reset Zoom"
        >
          <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
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
      
      {/* Zoom help tooltip */}
      {showZoomTip && (
        <div className="absolute left-1/2 top-4 transform -translate-x-1/2 bg-black/80 text-white px-3 sm:px-4 py-2 sm:py-3 rounded-lg shadow-xl z-50 max-w-[90%] sm:max-w-xs text-center backdrop-blur-sm animate-fade-in-down">
          <p className="font-medium mb-1 text-sm sm:text-base">Map Controls</p>
          <div className="text-xs sm:text-sm opacity-90 mb-2">
            <p className="hidden sm:block">• Use mouse wheel to zoom in and out</p>
            <p>• Pinch gesture on mobile devices</p>
            <p>• Zoom controls in bottom right</p>
            <p className="sm:hidden">• Tap users to see their profiles</p>
          </div>
          <button 
            onClick={() => setShowZoomTip(false)}
            className="text-xs py-1 px-3 bg-white/20 hover:bg-white/30 rounded-full"
          >
            Got it
          </button>
        </div>
      )}
    </div>
  );
};

export default Map;
