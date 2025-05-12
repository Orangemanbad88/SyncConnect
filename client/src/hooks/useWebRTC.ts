import { useEffect, useRef, useState, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { useToast } from '@/hooks/use-toast';

// Define the types for the hook
interface UseWebRTCProps {
  onLocalStream?: (stream: MediaStream) => void;
  onRemoteStream?: (stream: MediaStream) => void;
  onConnectionStateChange?: (state: RTCPeerConnectionState) => void;
  onCallReceived?: (fromUser: any) => void;
  onCallAccepted?: () => void;
  onCallRejected?: () => void;
  onCallEnded?: () => void;
}

interface WebRTCHookReturn {
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  connectionState: RTCPeerConnectionState | null;
  isCallInProgress: boolean;
  isCaller: boolean;
  startCall: (targetUserId: number) => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  endCall: () => void;
  toggleAudio: () => void;
  toggleVideo: () => void;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
}

export const useWebRTC = ({
  onLocalStream,
  onRemoteStream,
  onConnectionStateChange,
  onCallReceived,
  onCallAccepted,
  onCallRejected,
  onCallEnded
}: UseWebRTCProps = {}): WebRTCHookReturn => {
  // Get current user
  const { currentUser } = useUser();
  const { toast } = useToast();
  
  // WebRTC state
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [connectionState, setConnectionState] = useState<RTCPeerConnectionState | null>(null);
  const [isCallInProgress, setIsCallInProgress] = useState(false);
  const [isCaller, setIsCaller] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  // WebRTC refs
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const websocketRef = useRef<WebSocket | null>(null);
  const targetUserIdRef = useRef<number | null>(null);
  const incomingCallUserRef = useRef<any | null>(null);
  
  // Initialize WebSocket connection
  useEffect(() => {
    if (!currentUser) return;
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    
    ws.onopen = () => {
      console.log('WebSocket connection established');
      // Register with server
      ws.send(JSON.stringify({
        type: 'register',
        userId: currentUser.id
      }));
    };
    
    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log('Received WebSocket message:', data.type);
      
      switch (data.type) {
        case 'offer':
          if (!peerConnectionRef.current) {
            await handleIncomingCall(data.offer, data.from);
          }
          break;
          
        case 'answer':
          if (peerConnectionRef.current) {
            const remoteDesc = new RTCSessionDescription(data.answer);
            await peerConnectionRef.current.setRemoteDescription(remoteDesc);
            console.log('Set remote description from answer');
          }
          break;
          
        case 'ice-candidate':
          if (peerConnectionRef.current) {
            try {
              await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log('Added ICE candidate');
            } catch (error) {
              console.error('Error adding ICE candidate:', error);
            }
          }
          break;
          
        case 'call-request':
          // Save the caller info and notify about incoming call
          incomingCallUserRef.current = data.fromUser;
          targetUserIdRef.current = data.from;
          setIsCaller(false);
          onCallReceived?.(data.fromUser);
          break;
          
        case 'call-response':
          if (data.accepted) {
            onCallAccepted?.();
            // Initiate the WebRTC connection after call is accepted
            startPeerConnection(targetUserIdRef.current as number);
          } else {
            cleanupAfterCall();
            onCallRejected?.();
            toast({
              title: "Call Rejected",
              description: "The user rejected your call"
            });
          }
          break;
          
        case 'hang-up':
          // Remote user ended the call
          cleanupAfterCall();
          onCallEnded?.();
          toast({
            title: "Call Ended",
            description: "The call has ended"
          });
          break;
          
        case 'error':
          toast({
            title: "Error",
            description: data.message,
            variant: "destructive"
          });
          cleanupAfterCall();
          break;
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to the signaling server",
        variant: "destructive"
      });
    };
    
    ws.onclose = () => {
      console.log('WebSocket connection closed');
    };
    
    websocketRef.current = ws;
    
    // Cleanup on unmount
    return () => {
      cleanupAfterCall();
      ws.close();
    };
  }, [currentUser]);
  
  // Create and initialize a peer connection
  const createPeerConnection = useCallback(async () => {
    try {
      // ICE servers for WebRTC (STUN/TURN servers)
      const iceServers = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ]
      };
      
      const pc = new RTCPeerConnection(iceServers);
      peerConnectionRef.current = pc;
      
      // Create media stream for local video/audio
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setLocalStream(stream);
      onLocalStream?.(stream);
      
      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        pc.addTrack(track, stream);
      });
      
      // Create a remote stream to show the other user
      const remoteStream = new MediaStream();
      setRemoteStream(remoteStream);
      
      // When remote tracks are received, add them to the remote stream
      pc.ontrack = (event) => {
        event.streams[0].getTracks().forEach(track => {
          remoteStream.addTrack(track);
        });
        setRemoteStream(remoteStream);
        onRemoteStream?.(remoteStream);
      };
      
      // Handle ICE candidates
      pc.onicecandidate = (event) => {
        if (event.candidate && websocketRef.current && targetUserIdRef.current) {
          websocketRef.current.send(JSON.stringify({
            type: 'ice-candidate',
            candidate: event.candidate,
            target: targetUserIdRef.current,
            from: currentUser?.id
          }));
        }
      };
      
      // Monitor connection state changes
      pc.onconnectionstatechange = () => {
        console.log('Connection state changed:', pc.connectionState);
        setConnectionState(pc.connectionState);
        onConnectionStateChange?.(pc.connectionState);
        
        if (pc.connectionState === 'disconnected' || 
            pc.connectionState === 'failed' || 
            pc.connectionState === 'closed') {
          cleanupAfterCall();
        }
      };
      
      return pc;
    } catch (error) {
      console.error('Error creating peer connection:', error);
      toast({
        title: "Media Error",
        description: "Could not access camera or microphone",
        variant: "destructive"
      });
      throw error;
    }
  }, [currentUser, onLocalStream, onRemoteStream, onConnectionStateChange]);
  
  // Handle incoming call (offer)
  const handleIncomingCall = async (offer: RTCSessionDescriptionInit, fromUserId: number) => {
    try {
      const pc = await createPeerConnection();
      
      // Set the remote description (the offer)
      await pc.setRemoteDescription(new RTCSessionDescription(offer));
      
      // Create an answer
      const answer = await pc.createAnswer();
      await pc.setLocalDescription(answer);
      
      // Send the answer via WebSocket
      if (websocketRef.current) {
        websocketRef.current.send(JSON.stringify({
          type: 'answer',
          answer,
          target: fromUserId,
          from: currentUser?.id
        }));
      }
      
      setIsCallInProgress(true);
    } catch (error) {
      console.error('Error handling incoming call:', error);
      cleanupAfterCall();
    }
  };
  
  // Start the peer connection and create an offer
  const startPeerConnection = async (targetUserId: number) => {
    try {
      const pc = await createPeerConnection();
      
      // Create an offer
      const offer = await pc.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: true
      });
      
      // Set local description
      await pc.setLocalDescription(offer);
      
      // Send the offer via WebSocket
      if (websocketRef.current) {
        websocketRef.current.send(JSON.stringify({
          type: 'offer',
          offer,
          target: targetUserId,
          from: currentUser?.id
        }));
      }
      
      setIsCallInProgress(true);
    } catch (error) {
      console.error('Error starting peer connection:', error);
      cleanupAfterCall();
      toast({
        title: "Call Failed",
        description: "Could not establish call connection",
        variant: "destructive"
      });
    }
  };
  
  // Clean up all resources after a call
  const cleanupAfterCall = useCallback(() => {
    // Close the peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    
    // Stop all tracks in the local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    
    // Clear the remote stream
    setRemoteStream(null);
    
    // Reset state
    setIsCallInProgress(false);
    setIsCaller(false);
    targetUserIdRef.current = null;
    incomingCallUserRef.current = null;
  }, [localStream]);
  
  // Start a call with another user
  const startCall = async (targetUserId: number) => {
    if (isCallInProgress) {
      toast({
        title: "Call in Progress",
        description: "You're already in a call"
      });
      return;
    }
    
    targetUserIdRef.current = targetUserId;
    setIsCaller(true);
    
    // First, send a call request
    if (websocketRef.current && currentUser) {
      websocketRef.current.send(JSON.stringify({
        type: 'call-request',
        target: targetUserId,
        from: currentUser.id,
        fromUser: currentUser
      }));
      
      toast({
        title: "Calling...",
        description: "Waiting for the user to answer"
      });
    }
  };
  
  // Accept an incoming call
  const acceptCall = async () => {
    if (!incomingCallUserRef.current || !targetUserIdRef.current || !websocketRef.current || !currentUser) {
      return;
    }
    
    websocketRef.current.send(JSON.stringify({
      type: 'call-response',
      target: targetUserIdRef.current,
      from: currentUser.id,
      accepted: true
    }));
    
    // The actual connection will be established when we receive the offer
    setIsCallInProgress(true);
  };
  
  // Reject an incoming call
  const rejectCall = () => {
    if (!targetUserIdRef.current || !websocketRef.current || !currentUser) {
      return;
    }
    
    websocketRef.current.send(JSON.stringify({
      type: 'call-response',
      target: targetUserIdRef.current,
      from: currentUser.id,
      accepted: false
    }));
    
    incomingCallUserRef.current = null;
    targetUserIdRef.current = null;
  };
  
  // End an ongoing call
  const endCall = () => {
    if (!isCallInProgress || !targetUserIdRef.current || !websocketRef.current || !currentUser) {
      return;
    }
    
    websocketRef.current.send(JSON.stringify({
      type: 'hang-up',
      target: targetUserIdRef.current,
      from: currentUser.id
    }));
    
    cleanupAfterCall();
    onCallEnded?.();
  };
  
  // Toggle audio mute/unmute
  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
      }
    }
  };
  
  // Toggle video on/off
  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  };
  
  return {
    localStream,
    remoteStream,
    connectionState,
    isCallInProgress,
    isCaller,
    startCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled
  };
};