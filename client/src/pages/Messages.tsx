import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/context/UserContext";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAmbient } from "@/context/AmbientContext";
import { ArrowLeft, SendHorizontal } from "lucide-react";

interface Message {
  id: number;
  content: string;
  senderId: number;
  receiverId: number;
  timestamp: Date;
}

export default function Messages() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { currentUser, nearbyUsers } = useUser();
  const { toast } = useToast();
  const { background, highlight } = useAmbient();
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const targetUser = nearbyUsers.find(user => user.id === parseInt(id || "0"));
  
  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  // Load initial messages
  useEffect(() => {
    if (!targetUser || !currentUser) {
      toast({
        title: "Error",
        description: "User not found or you're not logged in",
        variant: "destructive"
      });
      setLocation('/home');
      return;
    }
    
    // In a real app, this would be an API call to get messages
    const mockMessages: Message[] = [
      {
        id: 1,
        content: `Hey! I enjoyed our video chat. Nice to meet you!`,
        senderId: targetUser.id,
        receiverId: currentUser.id,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      },
    ];
    
    setMessages(mockMessages);
  }, [targetUser, currentUser, setLocation, toast]);
  
  // Scroll to bottom whenever messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // Handle sending a new message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentUser || !targetUser) return;
    
    const newMsg: Message = {
      id: messages.length + 1,
      content: newMessage.trim(),
      senderId: currentUser.id,
      receiverId: targetUser.id,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    
    // In a real app, this would be an API call to send the message
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp: Date): string => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    return timestamp.toLocaleDateString();
  };
  
  if (!targetUser || !currentUser) {
    return <div>Loading...</div>;
  }
  
  return (
    <div 
      className="min-h-screen flex flex-col bg-gray-900"
      style={{ background }}
    >
      {/* Header */}
      <div className="px-4 py-3 bg-black bg-opacity-30 flex items-center border-b border-gray-800">
        <Button
          variant="ghost" 
          onClick={() => setLocation('/home')}
          className="mr-2 p-2"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={targetUser.profileImage} alt={targetUser.fullName} />
          <AvatarFallback>{targetUser.fullName.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-lg font-semibold text-white">{targetUser.fullName}</h1>
          <p className="text-xs text-gray-400">
            {targetUser.isOnline ? "Online" : "Offline"}
            {targetUser.location && ` • ${targetUser.location}`}
          </p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => {
          const isMyMessage = message.senderId === currentUser.id;
          
          return (
            <div 
              key={message.id} 
              className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
            >
              <div className="flex items-end">
                {!isMyMessage && (
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={targetUser.profileImage} alt={targetUser.fullName} />
                    <AvatarFallback>{targetUser.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <Card 
                    className={`px-4 py-2 max-w-xs text-white ${isMyMessage ? 
                      'bg-opacity-80 rounded-tr-none' : 
                      'bg-gray-800 bg-opacity-80 rounded-tl-none'}`}
                    style={{ background: isMyMessage ? highlight : undefined }}
                  >
                    <p>{message.content}</p>
                  </Card>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTimestamp(message.timestamp)}
                  </p>
                </div>
                {isMyMessage && (
                  <Avatar className="h-8 w-8 ml-2">
                    <AvatarImage 
                      src={currentUser.profileImage} 
                      alt={currentUser.fullName} 
                    />
                    <AvatarFallback>{currentUser.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 bg-black bg-opacity-30 border-t border-gray-800">
        <div className="flex">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border-gray-700 text-white"
          />
          <Button 
            onClick={handleSendMessage}
            className="ml-2"
            style={{ background: highlight }}
            disabled={!newMessage.trim()}
          >
            <SendHorizontal className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}