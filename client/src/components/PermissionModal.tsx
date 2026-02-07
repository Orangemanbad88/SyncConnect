import { Camera, Mic, AlertTriangle, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PermissionModalProps {
  type: 'request' | 'denied';
  onRequestPermission?: () => void;
  onClose: () => void;
}

const PermissionModal = ({ type, onRequestPermission, onClose }: PermissionModalProps) => {
  const isRequest = type === 'request';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="relative bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl border border-white/10">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center ${
            isRequest
              ? 'bg-blue-500/20 border-2 border-blue-500/50'
              : 'bg-red-500/20 border-2 border-red-500/50'
          }`}>
            {isRequest ? (
              <div className="flex gap-1">
                <Camera className="w-7 h-7 text-blue-400" />
                <Mic className="w-7 h-7 text-blue-400" />
              </div>
            ) : (
              <AlertTriangle className="w-10 h-10 text-red-400" />
            )}
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold text-white text-center mb-3 font-almarai">
          {isRequest
            ? 'Camera & Microphone Access'
            : 'Permission Denied'}
        </h2>

        {/* Description */}
        <p className="text-gray-400 text-center mb-6 leading-relaxed">
          {isRequest
            ? 'SYNC needs access to your camera and microphone to enable video calls. This allows you to connect face-to-face with matches.'
            : 'Camera or microphone access was denied. Video calls require these permissions to work. Please enable them in your browser settings.'}
        </p>

        {/* Permission icons explanation */}
        {isRequest && (
          <div className="bg-white/5 rounded-xl p-4 mb-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Camera className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Camera</p>
                <p className="text-gray-500 text-xs">To show your video during calls</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Mic className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Microphone</p>
                <p className="text-gray-500 text-xs">To let others hear you</p>
              </div>
            </div>
          </div>
        )}

        {/* Browser settings hint for denied */}
        {!isRequest && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <Settings className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-200 font-medium mb-1">How to enable permissions:</p>
                <ol className="text-yellow-200/70 space-y-1 list-decimal list-inside">
                  <li>Click the lock/info icon in your address bar</li>
                  <li>Find Camera and Microphone settings</li>
                  <li>Change both to "Allow"</li>
                  <li>Refresh the page</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex-1 py-3 rounded-xl border-white/20 text-white hover:bg-white/10"
          >
            {isRequest ? 'Not Now' : 'Close'}
          </Button>

          {isRequest && onRequestPermission && (
            <Button
              onClick={onRequestPermission}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white"
            >
              Allow Access
            </Button>
          )}
        </div>

        {/* Privacy note */}
        <p className="text-center text-gray-600 text-xs mt-4">
          Your privacy matters. Video is only shared during active calls.
        </p>
      </div>
    </div>
  );
};

export default PermissionModal;
