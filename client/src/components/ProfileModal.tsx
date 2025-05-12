import { X, MapPin, Video, Clock, Wifi, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import MoodReactions from "./MoodReactions";
import { calculateDistance, formatDistance } from "@/lib/mapUtils";
import { useGeolocation } from "@/hooks/useGeolocation";

interface ProfileModalProps {
  user: any;
  onClose: () => void;
  onStartVideoChat: () => void;
}

const ProfileModal = ({ user, onClose, onStartVideoChat }: ProfileModalProps) => {
  const [interests, setInterests] = useState<string[]>([]);
  const [locationDetail, setLocationDetail] = useState({
    distance: "Nearby",
    lastSeen: "",
    locationAge: 0
  });
  
  // Get current user's location
  const { coords } = useGeolocation();
  
  useEffect(() => {
    // In a real app, we would fetch interests from the API
    setInterests(["Hiking", "Photography", "Coding", "Coffee", "Travel"]);
    
    // Calculate real-time distance if coords are available
    if (coords && user.latitude && user.longitude) {
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        user.latitude,
        user.longitude
      );
      
      // Update location details
      setLocationDetail({
        distance: formatDistance(distance),
        lastSeen: user.lastSeen || "recently",
        locationAge: user.locationAge || 0
      });
    } else if (user.distanceText) {
      // Use pre-calculated distance
      setLocationDetail({
        distance: user.distanceText,
        lastSeen: user.lastSeen || "recently",
        locationAge: user.locationAge || 0
      });
    }
  }, [user.id, user.latitude, user.longitude, coords, user.distanceText, user.lastSeen, user.locationAge]);
  
  // Check if location data is stale (older than 30 minutes)
  const isLocationStale = locationDetail.locationAge > 1800;
  
  // Prevent clicks inside the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-20 flex items-center justify-center"
      onClick={onClose}
    >
      <Card 
        className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 overflow-hidden"
        onClick={handleModalClick}
      >
        <div className="relative">
          <div 
            className="h-40 bg-cover bg-center" 
            style={{ 
              backgroundImage: `url(${user.coverImage || "https://images.unsplash.com/photo-1519501025264-65ba15a82390?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=300"})` 
            }}
          ></div>
          <button 
            className="absolute top-4 right-4 bg-white bg-opacity-70 rounded-full p-1"
            onClick={onClose}
          >
            <X className="w-6 h-6 text-[var(--text-dark)]" />
          </button>
          <img 
            src={user.profileImage} 
            alt={user.fullName} 
            className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full border-4 border-white object-cover" 
          />
        </div>
        
        <div className="pt-14 px-6 pb-6">
          <div className="text-center mb-4">
            <div className="flex justify-center items-center">
              <h2 className="text-2xl font-bold text-[var(--text-dark)]">
                {user.fullName}, {user.age}
              </h2>
              <span className={`ml-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none rounded-full ${user.isOnline ? "text-green-700 bg-green-100" : "text-gray-700 bg-gray-100"}`}>
                {user.isOnline ? "Online" : "Offline"}
              </span>
            </div>
            <p className="text-gray-600">{user.job}</p>
            <div className="flex items-center justify-center space-x-2 mt-2">
              <Badge variant="outline" className={`flex items-center gap-1 px-2 py-1 ${isLocationStale ? 'bg-yellow-50' : ''}`}>
                <MapPin className={`w-3 h-3 ${isLocationStale ? 'text-yellow-500' : ''}`} />
                <span>{locationDetail.distance}</span>
                {isLocationStale && <AlertTriangle className="w-3 h-3 text-yellow-500 ml-1" />}
              </Badge>
              
              {user.isOnline && (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1 bg-green-50">
                  <Wifi className="w-3 h-3 text-green-500" />
                  <span>Online</span>
                </Badge>
              )}
              
              {locationDetail.lastSeen && (
                <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                  <Clock className="w-3 h-3" />
                  <span>Active {locationDetail.lastSeen}</span>
                </Badge>
              )}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="font-semibold text-[var(--text-dark)] mb-2">About</h3>
            <p className="text-gray-700">{user.bio}</p>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-4">
            <h3 className="font-semibold text-[var(--text-dark)] mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {interests.map((interest, index) => (
                <Badge key={index} variant="outline" className="px-3 py-1 bg-[var(--neutral-bg)] rounded-full text-sm text-gray-700">
                  {interest}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-4 mb-6">
            <MoodReactions toUserId={user.id} />
          </div>
          
          <Button 
            className="w-full py-6 bg-[var(--secondary-coral)] hover:bg-red-400 text-white font-semibold rounded-lg transition shadow-md"
            onClick={onStartVideoChat}
            disabled={!user.isOnline}
          >
            <Video className="w-5 h-5 mr-2" />
            {user.isOnline ? "Start Video Chat" : "User is Offline"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfileModal;
