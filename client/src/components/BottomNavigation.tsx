import { Home, MapPin, MessageCircle, User, Dices } from "lucide-react";
import { Link, useLocation } from "wouter";

const BottomNavigation = () => {
  const [location] = useLocation();
  
  return (
    <nav className="nav-bar border-t border-gray-200 fixed bottom-0 inset-x-0 z-10 md:hidden" style={{ backgroundColor: 'var(--primary-coral)' }}>
      <div className="flex justify-around">
        <Link to="/home">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-white ${location === '/home' ? 'border-t-2 border-white' : 'opacity-70 hover:opacity-100'}`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Home</span>
          </button>
        </Link>
        
        <button className="flex flex-col items-center justify-center w-full py-3 text-white opacity-70 hover:opacity-100">
          <MapPin className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Map</span>
        </button>
        
        <Link to="/roulette">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-white ${location === '/roulette' ? 'border-t-2 border-white' : 'opacity-70 hover:opacity-100'}`}
          >
            <Dices className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Match</span>
          </button>
        </Link>
        
        <button className="flex flex-col items-center justify-center w-full py-3 text-white opacity-70 hover:opacity-100">
          <User className="w-6 h-6" />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNavigation;
