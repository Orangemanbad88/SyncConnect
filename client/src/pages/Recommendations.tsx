import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import Map from "@/components/Map";
import RecommendationPanel from "@/components/RecommendationPanel";
import BottomNavigation from "@/components/BottomNavigation";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useAmbient } from "@/context/AmbientContext";
import { useUser } from "@/context/UserContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, RefreshCw } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const Recommendations = () => {
  const { coords } = useGeolocation();
  const { background } = useAmbient();
  const { user } = useAuth();
  const { nearbyUsers, isLoading: userLoading, selectUser } = useUser();
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch recommendations to highlight on the map
  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ['/api/users', user?.id, 'recommendations'],
    queryFn: async () => {
      if (!user?.id) return [];
      const res = await apiRequest('GET', `/api/users/${user.id}/recommendations`);
      return await res.json();
    },
    enabled: !!user?.id,
  });
  
  // Mutation for generating new recommendations
  const generateRecommendationsMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) throw new Error("User not authenticated");
      const res = await apiRequest('POST', `/api/users/${user.id}/generate-recommendations`, { count: 5 });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users', user?.id, 'recommendations'] });
      toast({
        title: "Recommendations Generated",
        description: "We've found some new potential matches for you!",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Couldn't Generate Recommendations",
        description: error.message,
        variant: "destructive",
      });
    }
  });
  
  // Extract recommended users to highlight them on the map
  const recommendedUserIds = recommendations 
    ? recommendations.map((rec: any) => rec.recommendedUserId) 
    : [];
  
  // Mark recommended users on the map
  const usersWithRecommendationStatus = nearbyUsers.map((user: any) => ({
    ...user,
    isRecommended: recommendedUserIds.includes(user.id),
  }));
  
  const handleUserClick = (user: any) => {
    selectUser(user);
    // You could navigate to user profile or open a modal here
  };
  
  const isLoading = userLoading || recommendationsLoading;
  
  return (
    <div 
      className="flex flex-col h-screen overflow-hidden transition-all duration-1000" 
      style={{ 
        backgroundImage: background,
        backgroundSize: '400% 400%',
        animation: 'gradient 15s ease infinite'
      }}
    >
      <Header />
      
      {isLoading ? (
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-zinc-400" />
        </div>
      ) : (
        <main className={`flex-1 ${isMobile ? 'flex flex-col' : 'grid grid-cols-5'} relative overflow-hidden`}>
          {/* Map - takes up more space on desktop, less on mobile */}
          <div className={isMobile ? "h-1/2" : "col-span-3"}>
            <Map 
              users={usersWithRecommendationStatus}
              isLoading={isLoading}
              onUserClick={handleUserClick}
              userCoords={coords}
              highlightRecommended={true} // Passing this as a prop, we'll update the Map component
            />
          </div>
          
          {/* Recommendation panel */}
          <div className={`${isMobile ? "h-1/2 overflow-auto" : "col-span-2 overflow-auto"} p-4 flex flex-col items-center`}>
            <div className="flex flex-col items-center w-full max-w-md mb-4">
              <h2 className="text-2xl font-bold text-white mb-2 text-center aldrich-header">Your Connections</h2>
              <p className="text-zinc-400 mb-4 text-center">
                Our algorithm has found these potential matches just for you!
              </p>
              
              <Button 
                onClick={() => generateRecommendationsMutation.mutate()}
                disabled={generateRecommendationsMutation.isPending}
                className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {generateRecommendationsMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Generate New Matches
                  </>
                )}
              </Button>
            </div>
            
            <RecommendationPanel />
          </div>
        </main>
      )}
      
      <BottomNavigation />
    </div>
  );
};

export default Recommendations;