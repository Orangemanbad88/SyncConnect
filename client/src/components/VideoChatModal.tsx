import { useState, useEffect, useRef } from "react";
import { Mic, MicOff, Video, VideoOff, X, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { useCall } from "@/context/CallContext";
import ConnectionQualityIndicator from "./ConnectionQualityIndicator";

interface VideoChatModalProps {
  user: any;
  onClose: () => void;
}

const VideoChatModal = ({ user, onClose }: VideoChatModalProps) => {
  const [callDuration, setCallDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [localVideoLoaded, setLocalVideoLoaded] = useState(false);
  const [remoteVideoLoaded, setRemoteVideoLoaded] = useState(false);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  const {
    localStream,
    remoteStream,
    connectionState,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    endCall
  } = useCall();

  // Set up video streams
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
      setLocalVideoLoaded(true);
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      setRemoteVideoLoaded(true);
    }
  }, [remoteStream]);

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

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting' || connectionState === 'new' || !connectionState;

  return (
    <div className={`fixed inset-0 bg-black z-30 ${isFullscreen ? '' : ''}`}>
      <div className="relative h-full w-full overflow-hidden">
        {/* Remote video (main view) */}
        <div className="h-full w-full bg-gray-900 flex items-center justify-center">
          {isConnecting ? (
            <div className="flex flex-col items-center">
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/30 animate-ping" />
                <div className="absolute inset-0 rounded-full border-4 border-blue-500/50 animate-pulse" />
                <img
                  src={user.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                  alt={user.fullName}
                  className="w-full h-full object-cover rounded-full border-4 border-white/20"
                />
              </div>
              <p className="text-white text-lg font-medium">Connecting to {user.fullName}...</p>
              <p className="text-gray-400 text-sm mt-2">Setting up secure connection</p>
            </div>
          ) : remoteStream ? (
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              onLoadedData={() => setRemoteVideoLoaded(true)}
            />
          ) : (
            <div className="flex flex-col items-center">
              <img
                src={user.profileImage || 'https://randomuser.me/api/portraits/men/32.jpg'}
                alt={user.fullName}
                className="w-32 h-32 object-cover rounded-full border-4 border-white/20 mb-4"
              />
              <p className="text-white text-lg">Waiting for video...</p>
            </div>
          )}

          {/* Gradient overlays for better UI visibility */}
          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/60 via-transparent to-black/40" />
        </div>

        {/* Self view (picture-in-picture) */}
        <div className="absolute top-4 right-4 w-32 h-48 bg-gray-800 rounded-xl overflow-hidden shadow-2xl border-2 border-white/20 group">
          {localStream ? (
            <>
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
                onLoadedData={() => setLocalVideoLoaded(true)}
              />
              {!isVideoEnabled && (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <VideoOff className="w-8 h-8 text-gray-400" />
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-700">
              <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            </div>
          )}

          {/* "You" label */}
          <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full">
            You
          </div>
        </div>

        {/* Top info bar */}
        <div className="absolute top-4 left-4 flex items-center gap-3">
          {/* User info */}
          <div className="bg-black/60 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-medium flex items-center gap-3">
            <div className="relative">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-yellow-500'} animate-pulse`} />
            </div>
            <span className="font-almarai">{user.fullName}, {user.age}</span>
          </div>

          {/* Call duration */}
          <div className="bg-black/60 backdrop-blur-sm px-3 py-2 rounded-xl text-white text-sm font-mono">
            {formatDuration(callDuration)}
          </div>

          {/* Connection quality */}
          <ConnectionQualityIndicator connectionState={connectionState} />
        </div>

        {/* Video chat controls */}
        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
          <div className="flex items-center gap-3 bg-black/40 backdrop-blur-sm p-2 rounded-2xl">
            {/* Mute/unmute */}
            <button
              onClick={toggleAudio}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 ${
                isAudioEnabled
                  ? 'bg-white/90 hover:bg-white text-gray-800'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isAudioEnabled ? 'Mute' : 'Unmute'}
            >
              {isAudioEnabled ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
            </button>

            {/* Camera on/off */}
            <button
              onClick={toggleVideo}
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 ${
                isVideoEnabled
                  ? 'bg-white/90 hover:bg-white text-gray-800'
                  : 'bg-red-500 hover:bg-red-600 text-white'
              }`}
              title={isVideoEnabled ? 'Turn off camera' : 'Turn on camera'}
            >
              {isVideoEnabled ? <Video className="w-6 h-6" /> : <VideoOff className="w-6 h-6" />}
            </button>

            {/* End call */}
            <button
              className="w-16 h-16 rounded-full bg-red-600 hover:bg-red-700 flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105"
              onClick={handleEndCall}
              title="End call"
            >
              <X className="w-8 h-8 text-white" />
            </button>

            {/* Fullscreen toggle */}
            <button
              onClick={toggleFullscreen}
              className="w-14 h-14 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-105 text-gray-800"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Connection status indicator */}
        {connectionState === 'failed' && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-white text-xl font-bold mb-2">Connection Failed</h3>
              <p className="text-gray-400 mb-4">Unable to establish video connection</p>
              <button
                onClick={handleEndCall}
                className="px-6 py-2 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoChatModal;
