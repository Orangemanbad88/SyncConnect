import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useLocation } from 'wouter';
import { useWebRTC, PermissionState } from '@/hooks/useWebRTC';
import IncomingCallModal from '@/components/IncomingCallModal';
import PermissionModal from '@/components/PermissionModal';
import SpeedRollIncomingModal from '@/components/SpeedRollIncomingModal';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface Caller {
  id: number;
  fullName: string;
  profileImage?: string;
  age?: number;
}

interface CallContextType {
  isInCall: boolean;
  incomingCaller: Caller | null;
  startCall: (targetUserId: number) => Promise<void>;
  endCall: () => void;
  acceptCall: () => Promise<void>;
  rejectCall: () => void;
  localStream: MediaStream | null;
  remoteStream: MediaStream | null;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  toggleAudio: () => void;
  toggleVideo: () => void;
  connectionState: RTCPeerConnectionState | null;
  permissionState: PermissionState;
  requestPermissions: () => Promise<boolean>;
}

const CallContext = createContext<CallContextType | null>(null);

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
};

interface CallProviderProps {
  children: ReactNode;
}

export const CallProvider = ({ children }: CallProviderProps) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [incomingCaller, setIncomingCaller] = useState<Caller | null>(null);
  const [showPermissionModal, setShowPermissionModal] = useState<'request' | 'denied' | null>(null);
  const [pendingCallTarget, setPendingCallTarget] = useState<number | null>(null);

  // Speed Roll incoming state
  const [speedRollIncoming, setSpeedRollIncoming] = useState<{
    rollId: number;
    fromUser: any;
    compatibilityScore: number;
  } | null>(null);

  const handleCallReceived = useCallback((fromUser: Caller) => {
    setIncomingCaller(fromUser);
  }, []);

  const handleCallAccepted = useCallback(() => {
    toast({
      title: "Call Connected",
      description: "You are now connected"
    });
  }, [toast]);

  const handleCallRejected = useCallback(() => {
    setIncomingCaller(null);
    toast({
      title: "Call Rejected",
      description: "The call was declined"
    });
  }, [toast]);

  const handleCallEnded = useCallback(() => {
    setIncomingCaller(null);
    toast({
      title: "Call Ended",
      description: "The call has ended"
    });
  }, [toast]);

  const handlePermissionDenied = useCallback(() => {
    setShowPermissionModal('denied');
  }, []);

  const handleSpeedRollIncoming = useCallback((data: { rollId: number; fromUser: any; compatibilityScore: number }) => {
    setSpeedRollIncoming(data);
  }, []);

  const {
    localStream,
    remoteStream,
    connectionState,
    isCallInProgress,
    startCall: webrtcStartCall,
    acceptCall: webrtcAcceptCall,
    rejectCall: webrtcRejectCall,
    endCall: webrtcEndCall,
    toggleAudio,
    toggleVideo,
    isAudioEnabled,
    isVideoEnabled,
    permissionState,
    checkPermissions,
    requestPermissions: webrtcRequestPermissions
  } = useWebRTC({
    onCallReceived: handleCallReceived,
    onCallAccepted: handleCallAccepted,
    onCallRejected: handleCallRejected,
    onCallEnded: handleCallEnded,
    onPermissionDenied: handlePermissionDenied,
    onSpeedRollIncoming: handleSpeedRollIncoming,
  });

  const requestPermissions = useCallback(async (): Promise<boolean> => {
    const result = await webrtcRequestPermissions();
    if (result) {
      setShowPermissionModal(null);
    }
    return result;
  }, [webrtcRequestPermissions]);

  const startCall = useCallback(async (targetUserId: number) => {
    // Check permissions first
    if (permissionState === 'denied') {
      setShowPermissionModal('denied');
      return;
    }

    if (permissionState === 'prompt' || permissionState === 'checking') {
      setPendingCallTarget(targetUserId);
      setShowPermissionModal('request');
      return;
    }

    await webrtcStartCall(targetUserId);
    setLocation(`/video/${targetUserId}`);
  }, [webrtcStartCall, setLocation, permissionState]);

  const handlePermissionGranted = useCallback(async () => {
    const granted = await requestPermissions();
    if (granted && pendingCallTarget) {
      await webrtcStartCall(pendingCallTarget);
      setLocation(`/video/${pendingCallTarget}`);
      setPendingCallTarget(null);
    }
    setShowPermissionModal(null);
  }, [requestPermissions, pendingCallTarget, webrtcStartCall, setLocation]);

  const acceptCall = useCallback(async () => {
    if (incomingCaller) {
      // Check permissions before accepting
      if (permissionState === 'denied') {
        setShowPermissionModal('denied');
        return;
      }

      if (permissionState === 'prompt' || permissionState === 'checking') {
        const granted = await requestPermissions();
        if (!granted) return;
      }

      await webrtcAcceptCall();
      setIncomingCaller(null);
      setLocation(`/video/${incomingCaller.id}`);
    }
  }, [webrtcAcceptCall, incomingCaller, setLocation, permissionState, requestPermissions]);

  const rejectCall = useCallback(() => {
    webrtcRejectCall();
    setIncomingCaller(null);
  }, [webrtcRejectCall]);

  const endCall = useCallback(() => {
    webrtcEndCall();
    setIncomingCaller(null);
  }, [webrtcEndCall]);

  const closePermissionModal = useCallback(() => {
    setShowPermissionModal(null);
    setPendingCallTarget(null);
  }, []);

  return (
    <CallContext.Provider
      value={{
        isInCall: isCallInProgress,
        incomingCaller,
        startCall,
        endCall,
        acceptCall,
        rejectCall,
        localStream,
        remoteStream,
        isAudioEnabled,
        isVideoEnabled,
        toggleAudio,
        toggleVideo,
        connectionState,
        permissionState,
        requestPermissions
      }}
    >
      {children}

      {/* Global incoming call modal */}
      <IncomingCallModal
        caller={incomingCaller}
        onAccept={acceptCall}
        onReject={rejectCall}
      />

      {/* Speed Roll incoming modal */}
      <SpeedRollIncomingModal
        rollId={speedRollIncoming?.rollId || null}
        fromUser={speedRollIncoming?.fromUser || null}
        compatibilityScore={speedRollIncoming?.compatibilityScore || 0}
        onAccept={() => {
          if (speedRollIncoming?.fromUser) {
            setSpeedRollIncoming(null);
            setLocation(`/video/${speedRollIncoming.fromUser.id}`);
          }
        }}
        onDecline={() => {
          setSpeedRollIncoming(null);
        }}
      />

      {/* Permission request/denied modal */}
      {showPermissionModal && (
        <PermissionModal
          type={showPermissionModal}
          onRequestPermission={showPermissionModal === 'request' ? handlePermissionGranted : undefined}
          onClose={closePermissionModal}
        />
      )}
    </CallContext.Provider>
  );
};
