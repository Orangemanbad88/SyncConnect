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
import { Bell } from "lucide-react";
import SyncLogo from "./SyncLogo";

const Header = () => {
  const { currentUser, logout } = useUser();
  const { highlight, text } = useAmbient();
  const [notificationCount] = useState(3);

  return (
    <header className="shadow-lg py-5 px-8 flex justify-between items-center transition-colors duration-1000" style={{ backgroundColor: 'var(--primary-coral)' }}>
      <div className="flex items-center">
        <SyncLogo className="w-10 h-10" />
        <h1 className="ml-3 font-['Cinzel'] text-3xl font-bold tracking-[0.05em] opacity-90" style={{ color: 'white' }}>SYNC</h1>
      </div>
      
      <div className="flex items-center">
        <div className="relative mr-4">
          <button className="focus:outline-none">
            <Bell className="w-6 h-6 text-white" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 text-[var(--primary-coral)] text-xs font-bold px-1.5 py-0.5 rounded-full"
                    style={{ backgroundColor: 'white' }}>
                {notificationCount}
              </span>
            )}
          </button>
        </div>
        
        <div className="relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <img
                  src={currentUser?.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full cursor-pointer object-cover"
                />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="cursor-pointer">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="cursor-pointer" 
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
