import { Link, useLocation } from "wouter";
import { Home, MessageCircle, User, Stars } from "lucide-react";
import { motion } from "framer-motion";

const BottomNavigation = () => {
  const [location] = useLocation();

  const navItems = [
    { path: '/home', label: 'Discover', icon: Home },
    { path: '/zodiac', label: 'Zodiac', icon: Stars },
    { path: '/messages', label: 'Messages', icon: MessageCircle },
    { path: '/profile', label: 'Profile', icon: User },
  ];

  const isActive = (path: string) => location === path;

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-10"
      style={{
        background: 'linear-gradient(180deg, rgba(13, 15, 18, 0.95) 0%, rgba(10, 12, 14, 0.99) 100%)',
        borderTop: '1px solid rgba(201, 169, 98, 0.12)',
        paddingBottom: 'env(safe-area-inset-bottom)',
        backdropFilter: 'blur(20px)',
      }}
    >
      <div className="flex justify-around py-2">
        {navItems.map((item) => {
          const active = isActive(item.path);
          const Icon = item.icon;
          return (
            <Link key={item.path} to={item.path}>
              <motion.button
                className="relative flex flex-col items-center justify-center px-5 py-2"
                whileTap={{ scale: 0.95 }}
              >
                {/* Active background pill */}
                {active && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-1 rounded-2xl"
                    style={{
                      background: 'rgba(201, 169, 98, 0.1)',
                      border: '1px solid rgba(201, 169, 98, 0.2)',
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}

                <Icon
                  className="w-5 h-5 mb-1 relative z-10 transition-colors duration-200"
                  style={{
                    color: active ? '#C9A962' : 'rgba(255, 255, 255, 0.35)',
                    filter: active ? 'drop-shadow(0 0 6px rgba(201, 169, 98, 0.5))' : 'none',
                  }}
                />
                <span
                  className="relative z-10 text-[9px] tracking-[0.15em] uppercase transition-all duration-200"
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontWeight: 600,
                    color: active ? '#C9A962' : 'rgba(255, 255, 255, 0.35)',
                  }}
                >
                  {item.label}
                </span>
              </motion.button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
