import { useState } from 'react';
import { useUser } from '@/context/UserContext';
import { useGeolocation } from '@/hooks/useGeolocation';
import Header from '@/components/Header';
import BottomNavigation from '@/components/BottomNavigation';
import { Link } from 'wouter';
import { Loader2, MapPin, Video, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VideoLobby() {
  const { nearbyUsers, isLoading } = useUser();
  const { coords, permissionStatus } = useGeolocation();

  // Filter to only show online users
  const onlineUsers = nearbyUsers.filter(user => user.isOnline);

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
            <p className="text-[#9CA3AF]">Finding users ready to chat...</p>
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
                : 'Allow location access to find people to video chat with.'}
            </p>
          </div>
        </div>
        <BottomNavigation />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)',
      }}
    >
      <Header />

      <div className="flex-1 overflow-auto p-4 pb-24">
        {/* Header Section */}
        <div className="text-center mb-8 pt-4">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4"
            style={{
              background: 'linear-gradient(135deg, rgba(201, 169, 98, 0.2) 0%, rgba(201, 169, 98, 0.05) 100%)',
              border: '1px solid rgba(201, 169, 98, 0.3)',
            }}
          >
            <Video className="w-10 h-10 text-[#C9A962]" />
          </div>
          <h1
            className="text-2xl mb-2"
            style={{
              fontFamily: "'Cinzel', serif",
              color: '#C9A962',
            }}
          >
            Video Chat
          </h1>
          <p className="text-[#9CA3AF] text-sm max-w-xs mx-auto">
            Connect face-to-face with people near you
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3 mb-8 justify-center">
          <Link to="/dice">
            <Button
              className="flex items-center gap-2 px-6 py-3 rounded-xl"
              style={{
                background: 'linear-gradient(135deg, #C9A962 0%, #8B7355 100%)',
                color: '#0D0F12',
                fontFamily: "'Cinzel', serif",
                fontWeight: 600,
              }}
            >
              <Sparkles className="w-4 h-4" />
              Random Match
            </Button>
          </Link>
        </div>

        {/* Online Users Section */}
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#C9A962]" />
            <h2
              className="text-lg"
              style={{
                fontFamily: "'Cinzel', serif",
                color: '#E8E4DF',
              }}
            >
              Online Now
            </h2>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(34, 197, 94, 0.2)',
                color: '#22c55e',
              }}
            >
              {onlineUsers.length}
            </span>
          </div>

          {onlineUsers.length === 0 ? (
            <div
              className="text-center p-8 rounded-2xl"
              style={{
                background: 'rgba(26, 29, 35, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
              }}
            >
              <p className="text-[#9CA3AF]">No one is online right now. Check back later!</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {onlineUsers.map((user) => (
                <Link key={user.id} to={`/video/${user.id}`}>
                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 hover:scale-[1.02]"
                    style={{
                      background: 'rgba(26, 29, 35, 0.8)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                    }}
                  >
                    {/* User Image */}
                    <div className="aspect-[3/4] relative">
                      <img
                        src={user.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=500&fit=crop'}
                        alt={user.fullName}
                        className="w-full h-full object-cover"
                      />

                      {/* Online indicator */}
                      <div
                        className="absolute top-2 right-2 w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: '#22c55e',
                          boxShadow: '0 0 8px rgba(34, 197, 94, 0.6)',
                        }}
                      />

                      {/* Gradient overlay */}
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(201, 169, 98, 0.3) 100%)',
                        }}
                      >
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            background: 'rgba(201, 169, 98, 0.9)',
                          }}
                        >
                          <Video className="w-6 h-6 text-[#0D0F12]" />
                        </div>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="p-3">
                      <h3
                        className="text-sm font-medium truncate"
                        style={{
                          color: '#E8E4DF',
                          fontFamily: "'Barlow', sans-serif",
                        }}
                      >
                        {user.fullName}, {user.age}
                      </h3>
                      {user.job && (
                        <p className="text-xs text-[#9CA3AF] truncate">
                          {user.job}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}
