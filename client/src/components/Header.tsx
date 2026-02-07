import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Loader2 } from "lucide-react";
import SyncMonogram from "./SyncMonogram";
import { Link, useLocation } from "wouter";

const Header = () => {
  const { user, logoutMutation } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => {
    if (path === '/video') return location === '/video' || location.startsWith('/video/');
    return location === path;
  };

  const navItems = [
    { path: '/home', label: 'Discover' },
    { path: '/video', label: 'Video' },
    { path: '/vibe-check', label: 'Vibe' },
    { path: '/dice', label: 'Roll the Dice' },
  ];

  return (
    <header
      className="py-4 px-6 flex justify-between items-center"
      style={{
        backgroundColor: 'rgba(13, 15, 18, 0.98)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Logo */}
      <Link to="/">
        <div className="flex items-center cursor-pointer group">
          <SyncMonogram className="w-7 h-7 transition-transform duration-300 group-hover:scale-105" />
        </div>
      </Link>

      {/* Center Navigation */}
      <nav className="hidden md:flex items-center">
        <div className="flex items-center gap-8">
          {navItems.map((item) => (
            <Link key={item.path} to={item.path}>
              <button className="relative py-2 nav-link-btn">
                <span
                  className={`nav-link-text text-[11px] tracking-[0.2em] uppercase ${isActive(item.path) ? 'active' : ''}`}
                  style={{ fontFamily: "'Cinzel', serif", fontWeight: 600 }}
                >
                  {item.label}
                </span>
              </button>
            </Link>
          ))}
        </div>
        <style>{`
          .nav-link-text {
            color: #C9A962;
            opacity: 0.5;
            transition: all 0.3s ease;
          }
          .nav-link-text.active {
            opacity: 1;
            text-shadow: 0 0 20px rgba(201, 169, 98, 0.8), 0 0 40px rgba(201, 169, 98, 0.4);
          }
          .nav-link-btn:hover .nav-link-text {
            opacity: 1;
            text-shadow: 0 0 20px rgba(201, 169, 98, 0.8), 0 0 40px rgba(201, 169, 98, 0.4);
          }
        `}</style>
      </nav>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        {/* Notification dot */}
        <div className="relative">
          <div
            className="w-2 h-2 rounded-full"
            style={{
              backgroundColor: '#C9A962',
              boxShadow: '0 0 8px rgba(201, 169, 98, 0.6)',
            }}
          />
        </div>

        {/* Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="focus:outline-none group">
              <div
                className="w-8 h-8 rounded-full overflow-hidden transition-all duration-300 group-hover:ring-2 group-hover:ring-[rgba(201,169,98,0.3)]"
              >
                <img
                  src={user?.profileImage || 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop'}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="min-w-[160px] p-1"
            style={{
              backgroundColor: 'rgba(20, 22, 26, 0.98)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
            }}
          >
            <Link to="/profile">
              <DropdownMenuItem
                className="cursor-pointer rounded-md text-[#E8E4DF] text-sm py-2.5 px-3 focus:bg-white/5 focus:text-[#C9A962]"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                Profile
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem
              className="cursor-pointer rounded-md text-[#E8E4DF] text-sm py-2.5 px-3 focus:bg-white/5 focus:text-[#C9A962]"
              style={{ fontFamily: "'Barlow', sans-serif" }}
            >
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/10 my-1" />
            <DropdownMenuItem
              className="cursor-pointer rounded-md text-[#9CA3AF] text-sm py-2.5 px-3 focus:bg-white/5 focus:text-white"
              style={{ fontFamily: "'Barlow', sans-serif" }}
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              {logoutMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Logging out...
                </span>
              ) : "Log out"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
