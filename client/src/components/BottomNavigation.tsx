import { Home, MapPin, MessageCircle, User } from "lucide-react";

const BottomNavigation = () => {
  return (
    <nav className="nav-bar border-t border-gray-200 fixed bottom-0 inset-x-0 z-10 md:hidden">
      <div className="flex justify-around">
        <button className="flex flex-col items-center justify-center w-full py-3 text-white border-t-2 border-white">
          <Home className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full py-3 text-white opacity-70 hover:opacity-100">
          <MapPin className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Map</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full py-3 text-white opacity-70 hover:opacity-100">
          <MessageCircle className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Messages</span>
        </button>
        <button className="flex flex-col items-center justify-center w-full py-3 text-white opacity-70 hover:opacity-100">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
