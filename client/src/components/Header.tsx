import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { useAmbient } from "@/context/AmbientContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Bell, Dices } from "lucide-react";
import SyncLogo from "./SyncLogo";
import { Link, useLocation } from "wouter";

const Header = () => {
  const { currentUser, logout } = useUser();
  const { highlight, text } = useAmbient();
  const [notificationCount] = useState(3);
  const [location] = useLocation();

  return (
    <header className="shadow-md py-2 px-6 flex justify-between items-center transition-colors duration-500 backdrop-blur-sm" style={{ backgroundColor: 'rgba(0, 0, 0, 0.95)', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
      <div className="flex items-center">
        <Link to="/home">
          <div className="flex items-center cursor-pointer">
            <SyncLogo className="w-7 h-7" />
          </div>
        </Link>
      </div>
      
      <div className="flex items-center space-x-5">
        <nav className="hidden md:flex space-x-6 text-[#f0f0f0]">
          <Link to="/home">
            <div className={`flex items-center py-2 px-3 transition-colors border-b-2 ${location === '/home' ? 'border-[#3B82F6]' : 'border-transparent hover:border-gray-400'}`}>
              <span className="text-xs font-medium tracking-wide">DISCOVER</span>
            </div>
          </Link>
          <Link to="/roulette">
            <div className={`flex items-center py-2 px-3 transition-colors border-b-2 ${location === '/roulette' ? 'border-[#3B82F6]' : 'border-transparent hover:border-gray-400'}`}>
              <Dices className="w-4 h-4 mr-2 opacity-80" />
              <span className="text-xs font-medium tracking-wide">MATCH ROULETTE</span>
            </div>
          </Link>
        </nav>
      
        <div className="relative mr-4">
          <button className="focus:outline-none hover:opacity-80 transition-opacity">
            <Bell className="w-4 h-4 text-[#f0f0f0]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#3B82F6] text-white text-xs font-bold px-1.5 py-0.5 rounded-full shadow-md">
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none ring-offset-black hover:opacity-90 transition-opacity">
                <img
                  src={currentUser?.profileImage}
                  alt="Profile"
                  className="w-7 h-7 rounded-full cursor-pointer object-cover border-2 border-[#3B82F6]/30"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-black/95 text-[#f0f0f0] border border-gray-800">
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-gray-700" />
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800" 
                onClick={() => logout()}
              >
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
