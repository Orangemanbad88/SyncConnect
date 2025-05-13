import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Recommendation } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Heart, X, Star, GraduationCap, Briefcase, MapPin } from "lucide-react";

// Define extended recommendation type that includes user data
interface EnhancedRecommendation extends Recommendation {
  user: {
    id: number;
    fullName: string;
    age: number;
    job: string | null;
    bio: string | null;
    location: string | null;
    zodiacSign: string | null;
    profileImage: string | null;
  };
}

const RecommendationPanel: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch recommendations for the current user
  const { data: recommendations, isLoading, error } = useQuery<EnhancedRecommendation[], Error>({
    queryKey: ['/api/users', user?.id, 'recommendations'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await apiRequest('GET', `/api/users/${user.id}/recommendations`);
      return await res.json();
    },
    enabled: !!user?.id,
  });
  
  // Mark recommendation as viewed
  const markAsViewedMutation = useMutation({
    mutationFn: async (recommendationId: number) => {
      await apiRequest('PATCH', `/api/recommendations/${recommendationId}/viewed`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'recommendations'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to update recommendation: ${error.message}`,
        variant: "destructive",
      });
    },
  });
  
  // Handle accepting a recommendation
  const handleAccept = async () => {
    if (!recommendations || currentIndex >= recommendations.length) return;
    
    const recommendation = recommendations[currentIndex];
    
    // Here you would implement logic to initiate contact or connection
    toast({
      title: "Connection initiated!",
      description: `You've expressed interest in connecting with ${recommendation.user.fullName}`,
    });
    
    // Mark as viewed
    await markAsViewedMutation.mutate(recommendation.id);
    
    // Move to next recommendation
    setCurrentIndex(prev => Math.min(prev + 1, recommendations?.length || 0));
  };
  
  // Handle rejecting a recommendation
  const handleReject = async () => {
    if (!recommendations || currentIndex >= recommendations.length) return;
    
    const recommendation = recommendations[currentIndex];
    
    // Mark as viewed
    await markAsViewedMutation.mutate(recommendation.id);
    
    // Move to next recommendation
    setCurrentIndex(prev => Math.min(prev + 1, recommendations?.length || 0));
  };

  // Format reason with emoji based on content
  const formatReason = (reason: string | null) => {
    if (!reason) return "";
    
    if (reason.includes("interest")) return "🧩 " + reason;
    if (reason.includes("location") || reason.includes("near")) return "📍 " + reason;
    if (reason.includes("age")) return "🎂 " + reason;
    if (reason.includes("profession") || reason.includes("job")) return "💼 " + reason;
    if (reason.includes("zodiac")) return "✨ " + reason;
    
    return "💫 " + reason;
  };
  
  // Render loading state
  if (isLoading) {
    return (
      <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-zinc-800 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-zinc-800">
        <h3 className="text-lg font-semibold text-red-500">Error loading recommendations</h3>
        <p className="text-zinc-400">{error.message}</p>
      </div>
    );
  }
  
  // Render empty state
  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-zinc-800">
        <h3 className="text-lg font-semibold text-white">No Recommendations</h3>
        <p className="text-zinc-400">We're working on finding great matches for you!</p>
      </div>
    );
  }
  
  // Render "all viewed" state
  if (currentIndex >= recommendations.length) {
    return (
      <div className="w-full max-w-md mx-auto p-4 rounded-lg bg-black/40 backdrop-blur-sm border border-zinc-800">
        <h3 className="text-lg font-semibold text-white">All Caught Up!</h3>
        <p className="text-zinc-400">You've viewed all your recommendations. Check back later for more!</p>
      </div>
    );
  }
  
  // Current recommendation to display
  const currentRecommendation = recommendations[currentIndex];
  
  return (
    <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden bg-black/40 backdrop-blur-sm border border-zinc-800">
      {/* Header */}
      <div className="px-4 py-3 border-b border-zinc-800">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <Star className="h-5 w-5 mr-2 text-amber-500" />
          Personalized Connections
        </h3>
      </div>
      
      {/* Profile card */}
      <div className="relative">
        {/* Profile image */}
        <div className="w-full h-64 bg-zinc-900 relative">
          {currentRecommendation.user.profileImage ? (
            <img 
              src={currentRecommendation.user.profileImage} 
              alt={currentRecommendation.user.fullName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-b from-zinc-800 to-zinc-900">
              <span className="text-zinc-500 text-6xl font-thin">
                {currentRecommendation.user.fullName.charAt(0)}
              </span>
            </div>
          )}
          
          {/* Match score overlay */}
          <div className="absolute top-2 right-2 bg-black/60 rounded-full px-3 py-1 backdrop-blur-sm flex items-center">
            <Star className="h-4 w-4 text-amber-500 mr-1" />
            <span className="text-white text-sm font-medium">
              {Math.round(currentRecommendation.score * 100)}% Match
            </span>
          </div>
        </div>
        
        {/* Profile info */}
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h4 className="text-xl font-semibold text-white">
              {currentRecommendation.user.fullName}, {currentRecommendation.user.age}
            </h4>
            {currentRecommendation.user.zodiacSign && (
              <span className="text-amber-400">
                {currentRecommendation.user.zodiacSign}
              </span>
            )}
          </div>
          
          {/* Job & Location */}
          <div className="space-y-1 mb-3">
            {currentRecommendation.user.job && (
              <div className="flex items-center text-zinc-300 text-sm">
                <Briefcase className="h-4 w-4 mr-2 text-zinc-500" />
                {currentRecommendation.user.job}
              </div>
            )}
            
            {currentRecommendation.user.location && (
              <div className="flex items-center text-zinc-300 text-sm">
                <MapPin className="h-4 w-4 mr-2 text-zinc-500" />
                {currentRecommendation.user.location}
              </div>
            )}
          </div>
          
          {/* Bio */}
          {currentRecommendation.user.bio && (
            <p className="text-zinc-400 text-sm mb-3 line-clamp-2">
              {currentRecommendation.user.bio}
            </p>
          )}
          
          {/* Recommendation reason */}
          {currentRecommendation.reason && (
            <div className="bg-zinc-900/60 rounded p-2 mb-3">
              <p className="text-sm text-amber-300">
                {formatReason(currentRecommendation.reason)}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex border-t border-zinc-800">
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none h-14 text-red-500 hover:text-red-400 hover:bg-zinc-900/50"
          onClick={handleReject}
        >
          <X className="h-6 w-6 mr-2" />
          Pass
        </Button>
        <Button 
          variant="ghost" 
          className="flex-1 rounded-none h-14 text-blue-500 hover:text-blue-400 hover:bg-zinc-900/50"
          onClick={handleAccept}
        >
          <Heart className="h-6 w-6 mr-2" />
          Connect
        </Button>
      </div>
      
      {/* Progress indicator */}
      <div className="flex p-2 bg-zinc-900">
        {recommendations.map((_, index) => (
          <div 
            key={index}
            className={`h-1 flex-1 mx-0.5 rounded-full ${
              index < currentIndex 
                ? 'bg-zinc-600' 
                : index === currentIndex 
                  ? 'bg-blue-500' 
                  : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RecommendationPanel;