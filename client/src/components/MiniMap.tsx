import { useState } from 'react';
import { X, MapPin, Video } from 'lucide-react';
import { useLocation } from 'wouter';
import StaticMapBackground from './StaticMapBackground';

interface User {
  id: number;
  fullName: string;
  age: number;
  profileImage?: string;
  isOnline?: boolean;
  latitude?: number;
  longitude?: number;
}

interface MiniMapProps {
  users: User[];
  userCoords: { latitude: number; longitude: number } | null;
  currentUserId?: number;
  onClose: () => void;
  onUserSelect?: (user: User) => void;
}

export default function MiniMap({ users, userCoords, currentUserId, onClose, onUserSelect }: MiniMapProps) {
  const [, setLocation] = useLocation();
  const [hoveredUser, setHoveredUser] = useState<number | null>(null);

  if (!userCoords) return null;

  // Calculate positions for users relative to center
  const mapSize = 300;
  const centerX = mapSize / 2;
  const centerY = mapSize / 2;
  const maxDistance = 120;

  const getUserPosition = (user: User) => {
    if (!user.latitude || !user.longitude) return null;

    const deltaLat = user.latitude - userCoords.latitude;
    const deltaLng = user.longitude - userCoords.longitude;

    const scaleFactor = 8000;
    const rawX = centerX + (deltaLng * scaleFactor);
    const rawY = centerY - (deltaLat * scaleFactor);

    const dx = rawX - centerX;
    const dy = rawY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > maxDistance) {
      const scale = maxDistance / distance;
      return { x: centerX + (dx * scale), y: centerY + (dy * scale) };
    }

    return { x: rawX, y: rawY };
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0, 0, 0, 0.85)' }}
      onClick={onClose}
    >
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: mapSize,
          height: mapSize,
          background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 100%)',
          border: '2px solid rgba(201, 169, 98, 0.3)',
          boxShadow: '0 0 60px rgba(201, 169, 98, 0.2)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Satellite background */}
        <div className="absolute inset-0 opacity-60">
          <StaticMapBackground
            latitude={userCoords.latitude}
            longitude={userCoords.longitude}
            zoom={14}
          />
        </div>

        {/* Overlay gradient */}
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(circle at center, transparent 30%, rgba(13, 15, 18, 0.8) 100%)',
          }}
        />

        {/* Grid lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-0 w-full h-px bg-[#C9A962]/20" />
          <div className="absolute top-0 left-1/2 w-px h-full bg-[#C9A962]/20" />
        </div>

        {/* Users */}
        {users.map((user) => {
          if (user.id === currentUserId) return null;
          const pos = getUserPosition(user);
          if (!pos) return null;

          return (
            <div
              key={user.id}
              className="absolute cursor-pointer transition-all duration-200"
              style={{
                left: pos.x,
                top: pos.y,
                transform: 'translate(-50%, -50%)',
                zIndex: hoveredUser === user.id ? 20 : 10,
              }}
              onMouseEnter={() => setHoveredUser(user.id)}
              onMouseLeave={() => setHoveredUser(null)}
              onClick={() => onUserSelect?.(user)}
            >
              {/* Pulse for online users */}
              {user.isOnline && (
                <div
                  className="absolute inset-0 rounded-full animate-ping"
                  style={{
                    background: 'rgba(34, 197, 94, 0.4)',
                    transform: 'scale(1.5)',
                  }}
                />
              )}

              {/* Profile image */}
              <div
                className="relative w-10 h-10 rounded-full overflow-hidden transition-transform"
                style={{
                  border: user.isOnline ? '2px solid #22C55E' : '2px solid rgba(255,255,255,0.5)',
                  boxShadow: hoveredUser === user.id ? '0 0 20px rgba(201, 169, 98, 0.6)' : '0 2px 10px rgba(0,0,0,0.5)',
                  transform: hoveredUser === user.id ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                <img
                  src={user.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop'}
                  alt={user.fullName}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hover tooltip */}
              {hoveredUser === user.id && (
                <div
                  className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 rounded text-xs"
                  style={{
                    background: 'rgba(0,0,0,0.9)',
                    border: '1px solid rgba(201, 169, 98, 0.3)',
                    color: '#E8E4DF',
                  }}
                >
                  {user.fullName.split(' ')[0]}, {user.age}
                </div>
              )}

              {/* Video call button on hover */}
              {hoveredUser === user.id && user.isOnline && (
                <button
                  className="absolute -top-8 left-1/2 -translate-x-1/2 p-1.5 rounded-full transition-all hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, #A855F7 0%, #EC4899 100%)',
                    boxShadow: '0 0 15px rgba(168, 85, 247, 0.5)',
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setLocation(`/video/${user.id}`);
                  }}
                >
                  <Video className="w-3 h-3 text-white" />
                </button>
              )}
            </div>
          );
        })}

        {/* Current user (center) */}
        <div
          className="absolute"
          style={{
            left: centerX,
            top: centerY,
            transform: 'translate(-50%, -50%)',
            zIndex: 30,
          }}
        >
          <div className="relative">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #C9A962 0%, #D4A574 100%)',
                border: '2px solid white',
                boxShadow: '0 0 20px rgba(201, 169, 98, 0.6)',
              }}
            >
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{ background: 'rgba(201, 169, 98, 0.4)' }}
            />
          </div>
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 p-1.5 rounded-full transition-all hover:scale-110"
          style={{
            background: 'rgba(0,0,0,0.6)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <X className="w-4 h-4 text-white" />
        </button>

        {/* Title */}
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full flex items-center gap-2"
          style={{
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid rgba(201, 169, 98, 0.3)',
          }}
        >
          <MapPin className="w-3 h-3 text-[#C9A962]" />
          <span
            className="text-xs"
            style={{
              fontFamily: "'Barlow', sans-serif",
              color: '#C9A962',
            }}
          >
            Nearby
          </span>
        </div>
      </div>
    </div>
  );
}
