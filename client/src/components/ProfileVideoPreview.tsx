import { useState, useEffect, useRef } from 'react';
import { Play, X } from 'lucide-react';

interface ProfileVideoPreviewProps {
  user: any;
  className?: string;
  showVideo?: boolean;
  onClose?: () => void;
}

const ProfileVideoPreview = ({ 
  user, 
  className = '', 
  showVideo = false,
  onClose
}: ProfileVideoPreviewProps) => {
  const [isPlaying, setIsPlaying] = useState(showVideo);
  const [timeLeft, setTimeLeft] = useState(15); // 15 seconds
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Sample videos for testing - in a real app, these would come from the user profile
  const sampleVideos = [
    'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-fashion-woman-with-silver-makeup-39875-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-under-multicolored-lights-32769-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-changing-lights-32746-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-man-with-short-hair-posing-in-the-forest-41846-large.mp4',
    'https://assets.mixkit.co/videos/preview/mixkit-woman-running-her-fingers-through-her-hair-1989-large.mp4'
  ];
  
  // Determine video URL based on user ID
  const videoUrl = sampleVideos[user.id % sampleVideos.length];
  
  // Start or stop the video based on the isPlaying state
  useEffect(() => {
    if (isPlaying && videoRef.current) {
      videoRef.current.play();
      
      // Start the timer
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            return 15; // reset for next time
          }
          return prev - 1;
        });
      }, 1000);
    } else if (videoRef.current) {
      videoRef.current.pause();
      
      // Reset the timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeLeft(15);
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying]);
  
  // Auto-close after video completes
  useEffect(() => {
    if (timeLeft === 0 && onClose) {
      onClose();
    }
  }, [timeLeft, onClose]);
  
  // Toggle video playback
  const togglePlay = () => {
    setIsPlaying(prev => !prev);
  };
  
  // Show just the profile image with a play button overlay
  if (!isPlaying) {
    return (
      <div 
        className={`relative cursor-pointer ${className}`}
        onClick={togglePlay}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img 
          src={user.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
          alt={user.fullName}
          className="w-full h-full object-cover"
        />
        
        {/* Play button overlay */}
        <div 
          className={`absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity duration-200 ${
            isHovering ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-white/80 flex items-center justify-center">
            <Play className="w-6 h-6 text-black ml-1" />
          </div>
          <div className="absolute bottom-2 left-0 right-0 text-center text-xs text-white font-medium">
            Click to see 15s intro
          </div>
        </div>
      </div>
    );
  }
  
  // Show the video player with controls and timer
  return (
    <div className={`relative ${className}`}>
      <video 
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        playsInline
        muted
        loop
      />
      
      {/* Video controls overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Close button - make this clickable */}
        <div className="absolute top-2 right-2 pointer-events-auto">
          <button 
            onClick={onClose || togglePlay}
            className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {/* Timer */}
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-0.5 rounded-full text-xs font-mono">
          00:{timeLeft.toString().padStart(2, '0')}
        </div>
        
        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
          <div 
            className="h-full bg-red-500"
            style={{ width: `${(timeLeft / 15) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ProfileVideoPreview;