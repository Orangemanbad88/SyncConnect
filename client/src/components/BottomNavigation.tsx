import { Home, MapPin, MessageCircle, User, Dices } from "lucide-react";
import { Link, useLocation } from "wouter";

const BottomNavigation = () => {
  const [location] = useLocation();
  
  return (
    <nav className="nav-bar border-t border-gray-800 fixed bottom-0 inset-x-0 z-10 md:hidden shadow-lg backdrop-blur-sm" 
         style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)' }}>
      <div className="flex justify-around">
        <Link to="/home">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0] 
            ${location === '/home' ? 'border-t-2 border-[#3B82F6]' : 'opacity-60 hover:opacity-90'}`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Discover</span>
          </button>
        </Link>
        
        <Link to="/home">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0] 
            ${location === '/map' ? 'border-t-2 border-[#3B82F6]' : 'opacity-60 hover:opacity-90'}`}
          >
            <MapPin className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Map</span>
          </button>
        </Link>
        
        <Link to="/dice">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0]
            ${location === '/dice' ? 'border-t-2 border-[#3B82F6]' : 'opacity-60 hover:opacity-90'}`}
          >
            <Dices className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Dice</span>
          </button>
        </Link>
        
        <Link to="/profile">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0] 
            ${location === '/profile' ? 'border-t-2 border-[#3B82F6]' : 'opacity-60 hover:opacity-90'}`}
          >
            <User className="w-5 h-5" />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Profile</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
