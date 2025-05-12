import { useState, useEffect } from "react";
import { Mic, Video, X, Camera, Settings } from "lucide-react";

interface VideoChatModalProps {
  user: any;
  onClose: () => void;
}

const VideoChatModal = ({ user, onClose }: VideoChatModalProps) => {
  const [callDuration, setCallDuration] = useState(0);
  
  // Update call duration every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Format call duration as mm:ss
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black z-30">
      <div className="relative h-full w-full overflow-hidden">
        <div 
          className="h-full w-full bg-cover bg-center" 
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')",
            filter: "brightness(0.8)"
          }}
        ></div>
        
        {/* Self view */}
        <div className="absolute top-4 right-4 w-32 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
          <img 
            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=128&h=192" 
            alt="Self view" 
            className="w-full h-full object-cover" 
          />
        </div>
        
        {/* Video chat controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-4">
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Mic className="w-6 h-6 text-[var(--text-dark)]" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Video className="w-6 h-6 text-[var(--text-dark)]" />
          </button>
          <button 
            className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center shadow-lg"
            onClick={onClose}
          >
            <X className="w-8 h-8 text-white" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Camera className="w-6 h-6 text-[var(--text-dark)]" />
          </button>
          <button className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-lg">
            <Settings className="w-6 h-6 text-[var(--text-dark)]" />
          </button>
        </div>
        
        <div className="absolute top-4 left-4">
          <div className="bg-gray-800 bg-opacity-50 px-4 py-2 rounded-lg text-white font-medium flex items-center">
            <div className="w-2 h-2 rounded-full bg-[var(--accent-green)] mr-2 animate-pulse"></div>
            <span>{user.fullName}, {user.age}</span>
          </div>
        </div>
        
        <div className="absolute top-16 left-4">
          <div className="bg-gray-800 bg-opacity-50 px-3 py-1 rounded-lg text-white text-sm">
            {formatDuration(callDuration)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoChatModal;
