import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, MessageCircle } from "lucide-react";

interface Conversation {
  matchId: number;
  otherUser: {
    id: number;
    fullName: string;
    profileImage: string | null;
    isOnline: boolean;
  } | null;
  latestMessage: {
    id: number;
    content: string;
    fromUserId: number;
    toUserId: number;
    isRead: boolean;
    createdAt: string;
  };
}

function formatRelativeTime(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;
  const diffDay = Math.floor(diffHr / 24);
  if (diffDay < 7) return `${diffDay}d`;
  return new Date(dateStr).toLocaleDateString();
}

export default function Inbox() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await apiRequest("GET", "/api/conversations");
        const data = await res.json();
        if (!cancelled) setConversations(data);
      } catch {
        // silently fail — empty state handles it
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: "linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)",
      }}
    >
      <Header />

      <main className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        <h2
          className="text-lg tracking-[0.15em] uppercase mb-4"
          style={{
            fontFamily: "'Cinzel', serif",
            color: "#C9A962",
          }}
        >
          Messages
        </h2>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#C9A962" }} />
          </div>
        ) : conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <MessageCircle
              className="w-12 h-12 mb-4"
              style={{ color: "rgba(201, 169, 98, 0.3)" }}
            />
            <p className="text-white/50 text-sm">No conversations yet</p>
            <p className="text-white/30 text-xs mt-1">
              Match with someone to start chatting
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conv) => {
              if (!conv.otherUser) return null;
              const isUnread =
                !conv.latestMessage.isRead &&
                conv.latestMessage.toUserId === user?.id;
              const preview =
                conv.latestMessage.content.length > 50
                  ? conv.latestMessage.content.slice(0, 50) + "…"
                  : conv.latestMessage.content;

              return (
                <button
                  key={conv.matchId}
                  onClick={() => setLocation(`/messages/${conv.matchId}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors hover:bg-white/5"
                  style={{
                    border: "1px solid rgba(201, 169, 98, 0.08)",
                  }}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={conv.otherUser.profileImage || undefined}
                        alt={conv.otherUser.fullName}
                      />
                      <AvatarFallback
                        style={{ background: "rgba(201, 169, 98, 0.2)", color: "#C9A962" }}
                      >
                        {conv.otherUser.fullName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conv.otherUser.isOnline && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#0D0F12]" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-center justify-between">
                      <span
                        className="text-sm font-medium truncate"
                        style={{ color: isUnread ? "#fff" : "rgba(255,255,255,0.7)" }}
                      >
                        {conv.otherUser.fullName}
                      </span>
                      <span className="text-[10px] text-white/30 ml-2 shrink-0">
                        {formatRelativeTime(conv.latestMessage.createdAt)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <p
                        className="text-xs truncate"
                        style={{
                          color: isUnread ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.35)",
                          fontWeight: isUnread ? 600 : 400,
                        }}
                      >
                        {preview}
                      </p>
                      {isUnread && (
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ background: "#C9A962" }}
                        />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}
