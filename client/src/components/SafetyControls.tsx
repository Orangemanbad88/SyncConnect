import { useState } from 'react';
import { Shield, Ban, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import ReportModal from './ReportModal';

interface SafetyControlsProps {
  targetUserId: number;
  targetUserName: string;
  videoConnectionId?: number;
  onBlock?: () => void;
  compact?: boolean;
}

export default function SafetyControls({ targetUserId, targetUserName, videoConnectionId, onBlock, compact = false }: SafetyControlsProps) {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isBlocking, setIsBlocking] = useState(false);
  const { toast } = useToast();

  const handleBlock = async () => {
    setIsBlocking(true);
    try {
      await apiRequest('POST', '/api/blocks', { blockedUserId: targetUserId });
      toast({ title: "User blocked", description: `${targetUserName} has been blocked.` });
      onBlock?.();
    } catch {
      toast({ title: "Failed to block user", variant: "destructive" });
    } finally {
      setIsBlocking(false);
    }
  };

  if (compact) {
    return (
      <>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowReportModal(true)}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2"
            title="Report user"
          >
            <Flag className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBlock}
            disabled={isBlocking}
            className="text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 p-2"
            title="Block user"
          >
            <Ban className="w-4 h-4" />
          </Button>
        </div>
        <ReportModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          reportedUserId={targetUserId}
          reportedUserName={targetUserName}
          videoConnectionId={videoConnectionId}
        />
      </>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          onClick={() => setShowReportModal(true)}
          className="border-red-500/30 text-red-400 hover:bg-red-500/10"
        >
          <Flag className="w-4 h-4 mr-2" />
          Report {targetUserName}
        </Button>
        <Button
          variant="outline"
          onClick={handleBlock}
          disabled={isBlocking}
          className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
        >
          <Ban className="w-4 h-4 mr-2" />
          {isBlocking ? 'Blocking...' : `Block ${targetUserName}`}
        </Button>
      </div>
      <ReportModal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        reportedUserId={targetUserId}
        reportedUserName={targetUserName}
        videoConnectionId={videoConnectionId}
      />
    </>
  );
}
