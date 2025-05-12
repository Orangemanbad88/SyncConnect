import React, { useState, useEffect } from 'react';
import { useAmbient } from '@/context/AmbientContext';
import { Sun, Sunset, Moon, Coffee } from 'lucide-react';

const TimeOfDayIndicator: React.FC = () => {
  const { timeOfDay, highlight } = useAmbient();
  const [showNotification, setShowNotification] = useState(false);
  const [lastTimeOfDay, setLastTimeOfDay] = useState(timeOfDay);

  // Show notification when time of day changes
  useEffect(() => {
    if (lastTimeOfDay !== timeOfDay) {
      setShowNotification(true);
      setLastTimeOfDay(timeOfDay);
      
      // Hide notification after 5 seconds
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [timeOfDay, lastTimeOfDay]);

  // Get icon based on time of day
  const getIcon = () => {
    switch (timeOfDay) {
      case 'morning':
        return <Coffee className="mr-2" />;
      case 'afternoon':
        return <Sun className="mr-2" />;
      case 'evening':
        return <Sunset className="mr-2" />;
      case 'night':
        return <Moon className="mr-2" />;
      default:
        return <Sun className="mr-2" />;
    }
  };

  if (!showNotification) return null;

  return (
    <div 
      className="fixed bottom-20 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center transition-all duration-500 ease-in-out"
      style={{ 
        backgroundColor: highlight,
        color: 'white',
        transform: showNotification ? 'translateY(0)' : 'translateY(100px)',
        opacity: showNotification ? 1 : 0
      }}
    >
      {getIcon()}
      <span className="font-medium">
        Switched to {timeOfDay} mode
      </span>
    </div>
  );
};

export default TimeOfDayIndicator;