import { CheckCircle, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface DiscoverySidebarProps {
  users: any[];
  isLoading: boolean;
  onUserClick: (user: any) => void;
}

const DiscoverySidebar = ({ users, isLoading, onUserClick }: DiscoverySidebarProps) => {
  return (
    <div className="hidden md:block w-80 lg:w-96 bg-white shadow-lg overflow-y-auto">
      <div className="p-6">
        <h2 className="text-xl font-bold text-[var(--text-dark)] mb-4">Nearby</h2>
        
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex items-center p-3">
                <Skeleton className="h-14 w-14 rounded-full" />
                <div className="ml-3 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {users.map(user => (
              <div
                key={user.id}
                className="flex items-center p-3 rounded-lg hover:bg-[var(--neutral-bg)] transition cursor-pointer"
                onClick={() => onUserClick(user)}
              >
                <div className="relative">
                  <img
                    src={user.profileImage}
                    alt={user.fullName}
                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border border-white ${
                      user.isOnline ? "online-indicator" : "offline-indicator"
                    }`}
                  ></span>
                </div>
                <div className="ml-3">
                  <div className="flex items-center space-x-1">
                    <h3 className="font-semibold text-[var(--text-dark)]">
                      {user.fullName}, {user.age}
                    </h3>
                    {user.isOnline && (
                      <CheckCircle className="w-4 h-4 text-[var(--accent-green)]" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{user.job}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    {user.distance}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DiscoverySidebar;
