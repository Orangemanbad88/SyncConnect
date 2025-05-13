import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/hooks/useWebRTC";
import { Loader2, Mic, MicOff, Video as VideoIcon, VideoOff, ThumbsUp, ThumbsDown, X, Info, Lock, Play } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useAmbient } from "@/context/AmbientContext";
import ProfileVideoPreview from "@/components/ProfileVideoPreview";

export default function VideoChat() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { currentUser, nearbyUsers } = useUser();
  const { toast } = useToast();
  const { background, highlight } = useAmbient();
  
  // Video chat states
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes in seconds
  const [showDecision, setShowDecision] = useState<boolean>(false);
  const [partnerDecision, setPartnerDecision] = useState<boolean | null>(null);
  const [myDecision, setMyDecision] = useState<boolean | null>(null);
  const [matchComplete, setMatchComplete] = useState<boolean>(false);
  const [showProfileVideo, setShowProfileVideo] = useState<boolean>(false);
  
  // UI states
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');
  const [showPrivateTabInfo, setShowPrivateTabInfo] = useState<boolean>(false);
  
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  
  const targetUser = nearbyUsers.find(user => user.id === parseInt(id || "0"));
  
  const {
    localStream,
    remoteStream,
    connectionState,
    isCallInProgress,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
    startCall,
    endCall
  } = useWebRTC({
    onLocalStream: (stream) => {
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    },
    onRemoteStream: (stream) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    },
    onCallAccepted: () => {
      // Start the timer when call is accepted
      startTimer();
    },
    onCallEnded: () => {
      if (!showDecision) {
        setShowDecision(true);
      }
    }
  });
  
  // Timer functionality
  useEffect(() => {
    if (timeLeft <= 0 && isCallInProgress) {
      endCall();
      setShowDecision(true);
    }
  }, [timeLeft, isCallInProgress, endCall]);
  
  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Initialize call when component mounts
  useEffect(() => {
    if (!targetUser || !targetUser.isOnline || !currentUser) {
      toast({
        title: "Unable to connect",
        description: "The user is offline or unavailable",
        variant: "destructive"
      });
      setLocation('/home');
      return;
    }
    
    startCall(targetUser.id);
    
    // Clean up when component unmounts
    return () => {
      endCall();
    };
  }, [targetUser, currentUser, startCall, endCall, setLocation, toast]);
  
  // Handle decision making
  const makeDecision = async (decision: boolean) => {
    setMyDecision(decision);
    
    // Simulate the other user's response
    // In a real app, this would be a WebSocket or API call
    setTimeout(() => {
      const otherUserDecision = Math.random() > 0.5;
      setPartnerDecision(otherUserDecision);
      
      if (decision && otherUserDecision) {
        setMatchComplete(true);
        // Create a match in the database
        // In a real app, this would be an API call
        toast({
          title: "It's a match!",
          description: `You and ${targetUser?.fullName} have matched!`,
          variant: "default"
        });
      }
    }, 1500);
  };
  
  // Redirect to chat or home based on match result
  const handleMatchComplete = () => {
    if (matchComplete) {
      // Redirect to chat page with the matched user
      setLocation(`/messages/${targetUser?.id}`);
    } else {
      // Redirect back to home
      setLocation('/home');
    }
  };
  
  // Loading state
  if (!targetUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p>Connecting...</p>
      </div>
    );
  }
  
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-between bg-black text-white"
      style={{ background: "linear-gradient(180deg, #080808 0%, #121212 100%)" }}
    >
      {/* Header with timer and user info */}
      <div className="w-full flex justify-between items-center p-4 z-10 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center">
          <div 
            className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/40 mr-3 relative cursor-pointer group"
            onClick={() => setShowProfileVideo(true)}
          >
            <img 
              src={targetUser.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
              alt={targetUser.fullName}
              className="w-full h-full object-cover"
            />
            
            {/* Play button overlay on hover */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <Play className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <div>
            <div className="text-xl font-bold font-almarai">
              {targetUser.fullName}, {targetUser.age}
            </div>
            <div className="text-xs text-gray-300 flex items-center">
              {targetUser.job && <span className="mr-1">{targetUser.job}</span>}
              {targetUser.isOnline && (
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full inline-block mr-1"></span>
                  Online
                </span>
              )}
            </div>
          </div>
        </div>
        
        {isCallInProgress && !showDecision && (
          <div className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-1.5 rounded-full font-mono shadow-lg flex items-center font-almarai">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-2"></span>
            {formatTime(timeLeft)}
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={() => {
            endCall();
            setLocation('/home');
          }}
          className="p-2 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Tab Navigation */}
      {!showDecision && (
        <div className="w-full px-4 mt-2">
          <div className="flex rounded-lg overflow-hidden border border-white/10 bg-black/50">
            <button 
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'public' ? 'bg-red-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('public')}
            >
              Public Meeting
            </button>
            <button 
              className={`flex-1 px-4 py-2 text-sm font-medium relative ${
                activeTab === 'private' ? 'bg-blue-600 text-white' : 'bg-transparent text-gray-400 hover:text-white'
              }`}
              onClick={() => setActiveTab('private')}
              onMouseEnter={() => setShowPrivateTabInfo(true)}
              onMouseLeave={() => setShowPrivateTabInfo(false)}
            >
              Private Stream
              <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-gray-700 text-xs rounded-full">?</span>
              
              {/* Tooltip for Private Tab */}
              {showPrivateTabInfo && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-black/90 text-white text-xs p-2 rounded-md z-50 whitespace-normal">
                  Private streams are only visible after both users have matched. This area will be unlocked after a successful match.
                </div>
              )}
            </button>
          </div>
        </div>
      )}
      
      {/* Video container */}
      {!showDecision ? (
        <div className="relative w-full flex-1 flex flex-col items-center justify-center">
          {/* Background pulsing gradient effect */}
          <div 
            className="absolute inset-0 opacity-30" 
            style={{
              background: "radial-gradient(circle at center, rgba(255,50,50,0.1) 0%, rgba(0,0,0,0) 70%)",
              animation: "pulse-radial 3s ease-in-out infinite"
            }}
          ></div>
          
          {activeTab === 'public' ? (
            // Public meeting tab content
            <div className="relative w-full h-full overflow-hidden">
              {connectionState === 'connected' ? (
                <>
                  <video
                    ref={remoteVideoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Subtle frame overlay */}
                  <div className="absolute inset-0 pointer-events-none border border-white/10 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)]"></div>
                  
                  {/* Edge highlight effect */}
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-transparent to-black/20"></div>
                  
                  {/* Time indicator */}
                  <div className="absolute bottom-28 left-1/2 transform -translate-x-1/2 px-4 py-1 bg-black/50 text-white text-xs rounded-full">
                    Public · Anyone can see this chat
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black">
                  <div className="relative w-20 h-20 mb-6">
                    <div className="absolute inset-0 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 rounded-full opacity-70 animate-pulse"></div>
                    <div className="relative flex items-center justify-center w-full h-full">
                      <Loader2 className="w-10 h-10 animate-spin text-white" />
                    </div>
                  </div>
                  <p className="text-lg font-almarai text-center">
                    Connecting to {targetUser.fullName}...<br/>
                    <span className="text-sm text-gray-400">This won't take long</span>
                  </p>
                </div>
              )}
            </div>
          ) : (
            // Private stream tab content (locked)
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-black p-8">
              <div className="bg-black/60 p-8 rounded-xl border border-white/10 max-w-md flex flex-col items-center">
                <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mb-4">
                  <div className="w-8 h-8 text-blue-400 opacity-60">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
                
                <h3 className="text-xl font-medium mb-2 text-white">Private Stream Locked</h3>
                
                <p className="text-gray-400 text-center mb-6">
                  This feature will be unlocked if you and {targetUser.fullName} both match after your 2-minute meeting.
                </p>
                
                <div className="w-full bg-gray-800 h-2 rounded-full mb-2">
                  <div className="bg-blue-500 h-full rounded-full animate-pulse" style={{width: '30%'}}></div>
                </div>
                
                <p className="text-xs text-gray-500">Match required to unlock private streams</p>
              </div>
            </div>
          )}
          
          {/* Local video (small overlay) - only show in public tab */}
          {activeTab === 'public' && (
            <div className="absolute bottom-24 right-4 w-1/3 max-w-[180px] aspect-video rounded-lg overflow-hidden border border-white/20 shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              
              {/* Local video overlay with gradient */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_10px_rgba(0,0,0,0.3)] bg-gradient-to-t from-black/30 to-transparent"></div>
              
              {/* "You" label */}
              <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">You</div>
            </div>
          )}
          
          {/* Profile video preview - togglable component */}
          {showProfileVideo && (
            <div className="absolute inset-0 z-20 bg-black/80 flex items-center justify-center">
              <div className="w-full max-w-lg aspect-video">
                <ProfileVideoPreview 
                  user={targetUser} 
                  showVideo={true}
                  onClose={() => setShowProfileVideo(false)}
                  className="w-full h-full rounded-lg overflow-hidden"
                />
              </div>
            </div>
          )}
        </div>
      ) : (
        // Decision screen
        <div className="flex-1 w-full flex flex-col items-center justify-center p-6 bg-gradient-to-b from-black/60 to-black/90">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
            <div className="absolute -inset-[100px] blur-3xl" 
                 style={{
                   background: "radial-gradient(circle at 50% 50%, rgba(255, 70, 70, 0.4) 0%, rgba(0, 0, 0, 0) 70%)"
                 }}>
            </div>
          </div>
          
          <div className="relative w-24 h-24 mb-8">
            <img 
              src={targetUser.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'} 
              alt={targetUser.fullName}
              className="w-full h-full object-cover rounded-full border-4 border-white/20"
            />
            <div className="absolute inset-0 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]"></div>
          </div>
          
          <h2 className="text-3xl font-bold mb-3 text-center font-almarai">
            {!myDecision ? "How was your connection?" : (
              partnerDecision === null ? 
                "Waiting for response..." : 
                (myDecision && partnerDecision ? "It's a match!" : "No match")
            )}
          </h2>
          
          <p className="text-lg text-gray-300 mb-10 text-center max-w-md">
            {!myDecision ? 
              `Did you enjoy your 2-minute meeting with ${targetUser.fullName}?` : 
              (partnerDecision === null ? 
                `${targetUser.fullName} is deciding...` : 
                (myDecision && partnerDecision ? 
                  `You and ${targetUser.fullName} both want to continue the conversation!` : 
                  "Sometimes the chemistry isn't right. Keep exploring and meet someone new!")
              )
            }
          </p>
          
          {!myDecision ? (
            <div className="flex gap-8">
              <Button
                onClick={() => makeDecision(true)}
                className="py-10 px-12 rounded-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white shadow-lg shadow-green-500/20 transition-all duration-300 hover:scale-105"
              >
                <ThumbsUp className="w-10 h-10" />
              </Button>
              <Button
                onClick={() => makeDecision(false)}
                className="py-10 px-12 rounded-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:scale-105"
              >
                <ThumbsDown className="w-10 h-10" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-md">
              {partnerDecision === null ? (
                <div className="flex flex-col items-center w-full">
                  <div className="relative w-24 h-24 mb-4">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                    <div className="relative flex items-center justify-center w-full h-full">
                      <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
                    </div>
                  </div>
                  <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mt-4">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" 
                         style={{width: '60%'}}></div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center w-full">
                  {myDecision && partnerDecision ? (
                    // Match success animation
                    <div className="relative w-32 h-32 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full opacity-70 animate-pulse"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-rose-600 to-pink-700 rounded-full flex items-center justify-center">
                        <svg viewBox="0 0 24 24" className="w-16 h-16 text-white">
                          <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                        </svg>
                      </div>
                    </div>
                  ) : (
                    // No match animation
                    <div className="relative w-32 h-32 mb-6">
                      <div className="absolute inset-0 bg-gradient-to-r from-gray-600 to-gray-500 rounded-full opacity-40"></div>
                      <div className="absolute inset-2 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center">
                        <X className="w-16 h-16 text-gray-300" />
                      </div>
                    </div>
                  )}
                  
                  <Button
                    onClick={handleMatchComplete}
                    className={`mt-8 px-10 py-6 text-lg font-medium rounded-xl transition-all duration-300 hover:scale-105 font-almarai ${
                      myDecision && partnerDecision ? 
                        "bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-lg shadow-pink-500/30" : 
                        "bg-gradient-to-r from-gray-700 to-gray-600 hover:from-gray-600 hover:to-gray-500 text-white shadow-lg"
                    }`}
                  >
                    {myDecision && partnerDecision ? "Go to Messages" : "Continue Exploring"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Controls (only show during call) */}
      {isCallInProgress && !showDecision && (
        <div className="w-full p-4 flex justify-center gap-4 bg-gradient-to-t from-black/80 to-transparent">
          <div className="flex items-center bg-black/40 p-1 rounded-full shadow-lg">
            <Button
              variant="ghost"
              onClick={toggleAudio}
              className={`p-4 rounded-full transition-all duration-200 ${
                !isAudioEnabled 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-800/70 text-white hover:bg-gray-700'
              }`}
              title={isAudioEnabled ? "Mute microphone" : "Unmute microphone"}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </Button>
            
            <Button
              variant="ghost"
              onClick={toggleVideo}
              className={`p-4 rounded-full transition-all duration-200 mx-2 ${
                !isVideoEnabled 
                  ? 'bg-red-500 text-white hover:bg-red-600' 
                  : 'bg-gray-800/70 text-white hover:bg-gray-700'
              }`}
              title={isVideoEnabled ? "Turn off camera" : "Turn on camera"}
            >
              {isVideoEnabled ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </Button>
            
            <Button
              variant="ghost"
              onClick={() => {
                endCall();
                setShowDecision(true);
              }}
              className="p-4 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all duration-200"
              title="End call and go to match decision"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}