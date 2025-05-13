import { Home, MapPin, MessageCircle, User, Dices } from "lucide-react";
import { Link, useLocation } from "wouter";
import { COLOR_SCHEMES } from "@/hooks/useAmbientColor";

const BottomNavigation = () => {
  const [location] = useLocation();
  
  // Using sunset color scheme to match desktop aesthetic
  const activeColor = COLOR_SCHEMES.sunset.highlight;
  const glowEffect = `0 0 5px ${activeColor}, 0 0 10px ${activeColor}40`;
  
  return (
    <nav className="nav-bar border-t border-gray-800/50 fixed bottom-0 inset-x-0 z-10 md:hidden shadow-lg backdrop-blur-md" 
         style={{ 
           backgroundColor: 'rgba(0, 0, 0, 0.85)',
           boxShadow: '0 -4px 20px rgba(0,0,0,0.7)'
         }}>
      <div className="flex justify-around">
        <Link to="/home">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0] 
            ${location === '/home' ? 'text-[#FF8040]' : 'opacity-70 hover:opacity-100'}`}
            style={location === '/home' ? { textShadow: glowEffect } : {}}
          >
            <Home className="w-5 h-5" style={location === '/home' ? { filter: 'drop-shadow(0 0 3px #FF8040)' } : {}} />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Discover</span>
          </button>
        </Link>
        
        <Link to="/map">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0] 
            ${location === '/map' ? 'text-[#FF8040]' : 'opacity-70 hover:opacity-100'}`}
            style={location === '/map' ? { textShadow: glowEffect } : {}}
          >
            <MapPin className="w-5 h-5" style={location === '/map' ? { filter: 'drop-shadow(0 0 3px #FF8040)' } : {}} />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Map</span>
          </button>
        </Link>
        
        <Link to="/dice">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0]
            ${location === '/dice' ? 'text-[#FF8040]' : 'opacity-70 hover:opacity-100'}`}
            style={location === '/dice' ? { textShadow: glowEffect } : {}}
          >
            <Dices className="w-5 h-5" style={location === '/dice' ? { filter: 'drop-shadow(0 0 3px #FF8040)' } : {}} />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Dice</span>
          </button>
        </Link>
        
        <Link to="/profile">
          <button 
            className={`flex flex-col items-center justify-center w-full py-3 text-[#f0f0f0] 
            ${location === '/profile' ? 'text-[#FF8040]' : 'opacity-70 hover:opacity-100'}`}
            style={location === '/profile' ? { textShadow: glowEffect } : {}}
          >
            <User className="w-5 h-5" style={location === '/profile' ? { filter: 'drop-shadow(0 0 3px #FF8040)' } : {}} />
            <span className="text-[10px] mt-1 tracking-wide font-medium uppercase">Profile</span>
          </button>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNavigation;
