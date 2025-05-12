import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/context/UserContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getQueryFn, queryClient, apiRequest } from '@/lib/queryClient';

// Define common emoji reactions
const MOOD_EMOJIS = [
  { emoji: '😍', label: 'Heart eyes' },
  { emoji: '😊', label: 'Smiling' },
  { emoji: '🔥', label: 'Fire' },
  { emoji: '👋', label: 'Wave' },
  { emoji: '👍', label: 'Thumbs up' },
  { emoji: '🤔', label: 'Thinking' },
  { emoji: '😮', label: 'Wow' },
  { emoji: '❤️', label: 'Heart' }
];

interface MoodReaction {
  id: number;
  fromUserId: number;
  toUserId: number;
  emoji: string;
  createdAt: string;
}

interface MoodReactionsProps {
  toUserId: number;
  className?: string;
}

const MoodReactions: React.FC<MoodReactionsProps> = ({ toUserId, className = '' }) => {
  const { currentUser } = useUser();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Query to fetch reactions between users
  const { data: reactions = [], isLoading } = useQuery({
    queryKey: ['moodReactions', currentUser?.id, toUserId],
    queryFn: async () => {
      if (!currentUser || !toUserId) return [];
      const data = await apiRequest({
        url: `/api/users/${currentUser.id}/mood-reactions/${toUserId}`,
        method: 'GET'
      });
      return Array.isArray(data) ? data : [];
    },
    enabled: !!currentUser && !!toUserId
  });
  
  // Mutation to send a new reaction
  const mutation = useMutation({
    mutationFn: async ({ emoji }: { emoji: string }) => {
      return apiRequest({
        url: '/api/mood-reactions',
        method: 'POST',
        body: {
          fromUserId: currentUser!.id,
          toUserId: toUserId,
          emoji: emoji
        }
      });
    },
    onSuccess: () => {
      // Invalidate and refetch the reactions
      queryClient.invalidateQueries({ queryKey: ['moodReactions', currentUser?.id, toUserId] });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'Failed to send reaction',
        variant: 'destructive'
      });
    }
  });

  // Send a reaction
  const handleSendReaction = (emoji: string) => {
    if (!currentUser) return;
    
    mutation.mutate({ emoji });
    
    // Show a toast notification
    toast({
      title: 'Reaction sent',
      description: `You sent ${emoji}`,
    });
  };

  // Count occurrences of each emoji
  const emojiCounts = reactions.reduce((acc, reaction) => {
    acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className={`${className}`}>
      <h3 className="font-['Cinzel'] font-bold text-lg mb-2">Mood Reactions</h3>
      
      {/* Display reaction counts */}
      <div className="flex flex-wrap gap-2 mb-4">
        {Object.entries(emojiCounts).map(([emoji, count]) => (
          <div key={emoji} className="flex items-center bg-white bg-opacity-20 px-2 py-1 rounded-full">
            <span className="text-xl mr-1">{emoji}</span>
            <span className="text-xs font-medium">{count}</span>
          </div>
        ))}
        {Object.keys(emojiCounts).length === 0 && !isLoading && (
          <p className="text-sm text-white text-opacity-70">No reactions yet</p>
        )}
        {isLoading && <p className="text-sm text-white text-opacity-70">Loading...</p>}
      </div>
      
      {/* Emoji reaction buttons */}
      <div className="grid grid-cols-4 gap-2">
        {MOOD_EMOJIS.map(({ emoji, label }) => (
          <button
            key={emoji}
            onClick={() => handleSendReaction(emoji)}
            disabled={mutation.isPending}
            aria-label={`React with ${label}`}
            title={label}
            className="text-2xl bg-white bg-opacity-10 hover:bg-opacity-25 rounded-full w-10 h-10 flex items-center justify-center transition-all transform hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {emoji}
          </button>
        ))}
      </div>
    </div>
  );
};

export default MoodReactions;