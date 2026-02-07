import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportedUserId: number;
  reportedUserName: string;
  videoConnectionId?: number;
}

const REPORT_REASONS = [
  { value: 'inappropriate', label: 'Inappropriate Content' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'fake_profile', label: 'Fake Profile' },
  { value: 'spam', label: 'Spam' },
  { value: 'other', label: 'Other' },
];

export default function ReportModal({ isOpen, onClose, reportedUserId, reportedUserName, videoConnectionId }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) {
      toast({ title: "Please select a reason", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiRequest('POST', '/api/reports', {
        reportedUserId,
        reason,
        description: description || null,
        videoConnectionId: videoConnectionId || null,
      });
      toast({ title: "Report submitted", description: "We'll review this report shortly." });
      setReason('');
      setDescription('');
      onClose();
    } catch {
      toast({ title: "Failed to submit report", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="w-full max-w-md rounded-2xl p-6 bg-gray-900 border border-gray-700"
          onClick={e => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <h3 className="text-lg font-semibold text-white">Report {reportedUserName}</h3>
            </div>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-white/10">
              <X className="w-5 h-5 text-white" />
            </button>
          </div>

          <p className="text-sm text-gray-400 mb-4">
            Select a reason for reporting this user.
          </p>

          <div className="space-y-2 mb-4">
            {REPORT_REASONS.map(r => (
              <button
                key={r.value}
                onClick={() => setReason(r.value)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all text-sm ${
                  reason === r.value
                    ? 'border-red-500 bg-red-500/10 text-white'
                    : 'border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          <textarea
            placeholder="Additional details (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white text-sm placeholder-gray-500 resize-none h-24 mb-4 focus:outline-none focus:border-red-500"
          />

          <Button
            onClick={handleSubmit}
            disabled={!reason || isSubmitting}
            className="w-full py-6 rounded-xl bg-red-600 hover:bg-red-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit Report'}
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
