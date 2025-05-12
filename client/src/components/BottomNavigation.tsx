import { Home, MapPin, MessageCircle, User } from "lucide-react";

const BottomNavigation = () => {
  return (
    <nav className="bg-white border-t border-gray-200 fixed bottom-0 inset-x-0 z-10 md:hidden">
      <div className="flex justify-around">
        <button className="flex flex-col items-center justify-center w-full py-3 text-[var(--primary-blue)] border-t-2 border-[var(--primary-blue)]">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full py-3 text-gray-600">
          <MapPin className="w-6 h-6" />
          <span className="text-xs mt-1">Map</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full py-3 text-gray-600">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1">Messages</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full py-3 text-gray-600">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
