import { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useWebRTC } from "@/hooks/useWebRTC";
import { Loader2, Mic, MicOff, Video as VideoIcon, VideoOff, ThumbsUp, ThumbsDown, X } from "lucide-react";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { useAmbient } from "@/context/AmbientContext";

export default function VideoChat() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { currentUser, nearbyUsers } = useUser();
  const { toast } = useToast();
  const { background, highlight } = useAmbient();
  
  const [timeLeft, setTimeLeft] = useState<number>(120); // 2 minutes in seconds
  const [showDecision, setShowDecision] = useState<boolean>(false);
  const [partnerDecision, setPartnerDecision] = useState<boolean | null>(null);
  const [myDecision, setMyDecision] = useState<boolean | null>(null);
  const [matchComplete, setMatchComplete] = useState<boolean>(false);
  
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
      className="min-h-screen flex flex-col items-center justify-between p-4 bg-black text-white"
      style={{ background: background }}
    >
      {/* Header with timer */}
      <div className="w-full flex justify-between items-center mb-4">
        <div className="text-xl font-bold">
          {targetUser.fullName}
        </div>
        {isCallInProgress && !showDecision && (
          <div className="bg-red-500 text-white px-3 py-1 rounded-full">
            {formatTime(timeLeft)}
          </div>
        )}
        <Button
          variant="ghost"
          onClick={() => {
            endCall();
            setLocation('/home');
          }}
          className="p-2"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      {/* Video container */}
      {!showDecision ? (
        <div className="relative w-full flex-1 flex flex-col items-center justify-center mb-4">
          {/* Remote video (full screen) */}
          <div className="relative w-full h-full rounded-xl overflow-hidden bg-gray-900">
            {connectionState === 'connected' ? (
              <video
                ref={remoteVideoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin" />
                <p className="ml-2">Connecting...</p>
              </div>
            )}
          </div>
          
          {/* Local video (small overlay) */}
          <div className="absolute bottom-4 right-4 w-1/4 aspect-video rounded-lg overflow-hidden border-2 border-white shadow-lg">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      ) : (
        // Decision screen
        <div className="flex-1 w-full flex flex-col items-center justify-center">
          <h2 className="text-2xl font-bold mb-8 text-center">
            Did you enjoy meeting {targetUser.fullName}?
          </h2>
          
          {!myDecision ? (
            <div className="flex gap-6">
              <Button
                onClick={() => makeDecision(true)}
                className="py-8 px-10 rounded-full bg-green-500 hover:bg-green-600 text-white"
              >
                <ThumbsUp className="w-8 h-8" />
              </Button>
              <Button
                onClick={() => makeDecision(false)}
                className="py-8 px-10 rounded-full bg-red-500 hover:bg-red-600 text-white"
              >
                <ThumbsDown className="w-8 h-8" />
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              {partnerDecision === null ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="w-10 h-10 animate-spin mb-4" />
                  <p>Waiting for {targetUser.fullName}'s response...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="text-xl mb-4">
                    {myDecision && partnerDecision ? (
                      <div className="text-center">
                        <p className="text-2xl mb-2 text-green-400">It's a match!</p>
                        <p>You and {targetUser.fullName} both want to continue the conversation.</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <p className="text-2xl mb-2 text-gray-400">No match</p>
                        <p>Keep exploring and meet someone new!</p>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={handleMatchComplete}
                    className="mt-6 px-8 py-4"
                    style={{ background: highlight }}
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
        <div className="w-full flex justify-center gap-4 mt-4">
          <Button
            variant="outline"
            onClick={toggleAudio}
            className={`p-3 rounded-full ${!isAudioEnabled ? 'bg-red-500 text-white border-red-500' : 'bg-gray-800 border-gray-700'}`}
          >
            {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
          </Button>
          <Button
            variant="outline"
            onClick={toggleVideo}
            className={`p-3 rounded-full ${!isVideoEnabled ? 'bg-red-500 text-white border-red-500' : 'bg-gray-800 border-gray-700'}`}
          >
            {isVideoEnabled ? <VideoIcon className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              endCall();
              setShowDecision(true);
            }}
            className="p-3 rounded-full bg-red-500 text-white border-red-500"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}