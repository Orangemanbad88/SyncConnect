import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import VerticalProfileCards from '@/components/VerticalProfileCards';
import ProfileModal from '@/components/ProfileModal';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Loader2, MapPin } from 'lucide-react';
import { calculateDistance, formatDistance } from '@/lib/mapUtils';

export default function Explore() {
  const { nearbyUsers, isLoading } = useUser();
  const { coords, permissionStatus } = useGeolocation();
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  // Add distance info to users
  const usersWithDistance = nearbyUsers.map(user => {
    if (user.latitude && user.longitude && coords) {
      const distance = calculateDistance(
        coords.latitude,
        coords.longitude,
        user.latitude,
        user.longitude
      );
      return {
        ...user,
        distanceText: formatDistance(distance),
      };
    }
    return user;
  });

  const handleViewProfile = (user: any) => {
    setSelectedUser(user);
    setShowProfile(true);
  };

  const handleStartVideoChat = (user: any) => {
    // Will navigate via the component
  };

  if (isLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)',
        }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-[#C9A962] animate-spin mx-auto mb-4" />
            <p className="text-[#9CA3AF]">Discovering nearby souls...</p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (!coords) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)',
        }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className="text-center p-8 rounded-2xl max-w-sm"
            style={{
              background: 'rgba(26, 29, 35, 0.8)',
              border: '1px solid rgba(201, 169, 98, 0.2)',
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(201, 169, 98, 0.1)' }}
            >
              <MapPin className="w-8 h-8 text-[#C9A962]" />
            </div>
            <h3
              className="text-xl mb-2"
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#C9A962',
              }}
            >
              Enable Location
            </h3>
            <p className="text-[#9CA3AF] text-sm">
              {permissionStatus === 'denied'
                ? 'Location access was denied. Please enable it in your browser settings.'
                : 'Allow location access to discover people near you.'}
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  if (usersWithDistance.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)',
        }}
      >
        <Header />
        <div className="flex-1 flex items-center justify-center p-8">
          <div
            className="text-center p-8 rounded-2xl max-w-sm"
            style={{
              background: 'rgba(26, 29, 35, 0.8)',
              border: '1px solid rgba(201, 169, 98, 0.2)',
            }}
          >
            <h3
              className="text-xl mb-2"
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#C9A962',
              }}
            >
              No One Nearby
            </h3>
            <p className="text-[#9CA3AF] text-sm">
              There's no one online in your area right now. Check back later!
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <div className="flex-1 overflow-hidden">
        <VerticalProfileCards
          users={usersWithDistance}
          onViewProfile={handleViewProfile}
          onStartVideoChat={handleStartVideoChat}
          userCoords={coords}
        />
      </div>
      <BottomNavigation />

      {showProfile && selectedUser && (
        <ProfileModal
          user={selectedUser}
          onClose={() => setShowProfile(false)}
          onStartVideoChat={() => {}}
        />
      )}
    </div>
  );
}
