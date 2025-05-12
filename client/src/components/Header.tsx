import { useState } from "react";
import { useUser } from "@/context/UserContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Users, Bell } from "lucide-react";

const Header = () => {
  const { currentUser, logout } = useUser();
  const [notificationCount] = useState(3);

  return (
    <header className="bg-white shadow-sm py-4 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <Users className="w-8 h-8 text-[var(--secondary-orange)]" />
        <h1 className="ml-2 text-2xl font-bold text-[var(--text-dark)]">Sync</h1>
      </div>
      
      <div className="flex items-center">
        <div className="relative mr-4">
          <button className="focus:outline-none">
            <Bell className="w-6 h-6 text-[var(--text-dark)]" />
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[var(--secondary-orange)] text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
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
