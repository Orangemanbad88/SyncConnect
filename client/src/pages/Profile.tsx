import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { Redirect } from 'wouter';
import { Loader2, Settings, LogOut, Moon, Sun, Sunset, Coffee, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BottomNavigation from '@/components/BottomNavigation';
import StaticMapBackground from '@/components/StaticMapBackground';
import { useAmbient } from '@/context/AmbientContext';
import { TimeOfDay } from '@/hooks/useAmbientColor';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ProfilePage = () => {
  const { user, logoutMutation, isLoading } = useAuth();
  const { timeOfDay, setForcedTimeOfDay } = useAmbient();
  const [activeTab, setActiveTab] = useState<string>('settings');

  // Redirect if not logged in
  if (!user && !isLoading) {
    return <Redirect to="/auth" />;
  }

  const timeOptions: { value: TimeOfDay | null; icon: React.ReactNode; label: string }[] = [
    { value: null, icon: <Clock className="w-4 h-4 mr-2" />, label: 'Auto' },
    { value: 'morning', icon: <Coffee className="w-4 h-4 mr-2" />, label: 'Morning' },
    { value: 'afternoon', icon: <Sun className="w-4 h-4 mr-2" />, label: 'Afternoon' },
    { value: 'sunset', icon: <Sunset className="w-4 h-4 mr-2" />, label: 'Sunset' },
    { value: 'night', icon: <Moon className="w-4 h-4 mr-2" />, label: 'Night' },
  ];

  const handleTimeChange = (time: TimeOfDay | null) => {
    setForcedTimeOfDay(time);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pb-16">
      <StaticMapBackground 
        className="fixed inset-0 z-0" 
        latitude={user?.latitude || 40.7128}
        longitude={user?.longitude || -74.0060}
      />
      
      <div className="relative z-10 container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 mt-4 text-center">Profile</h1>
        
        <div className="bg-black/40 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-800">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-500">
              <img 
                src={user?.profileImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3"} 
                alt={user?.fullName} 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.fullName}</h2>
              <p className="text-sm text-gray-300">@{user?.username}</p>
              <p className="text-sm text-gray-300">{user?.age} years old • {user?.job}</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-6">
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="appearance">
                <Sun className="w-4 h-4 mr-2" />
                Appearance
              </TabsTrigger>
            </TabsList>

            <TabsContent value="settings" className="space-y-4">
              <div className="space-y-4">
                <div className="bg-gray-900/60 rounded-lg p-4">
                  <h3 className="font-medium mb-2">Account</h3>
                  <p className="text-sm text-gray-400 mb-4">Manage your account settings</p>
                  
                  <Button 
                    variant="destructive" 
                    className="w-full" 
                    onClick={handleLogout}
                    disabled={logoutMutation.isPending}
                  >
                    {logoutMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="space-y-4">
              <div className="bg-gray-900/60 rounded-lg p-4">
                <h3 className="font-medium mb-2">Time of Day</h3>
                <p className="text-sm text-gray-400 mb-4">Change the app's appearance</p>
                
                <div className="grid grid-cols-2 gap-2">
                  {timeOptions.map((option) => (
                    <Button
                      key={option.label}
                      variant={timeOfDay === option.value ? "default" : "outline"}
                      className="flex items-center justify-center"
                      onClick={() => handleTimeChange(option.value)}
                    >
                      {option.icon}
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ProfilePage;