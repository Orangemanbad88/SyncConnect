import { useState, useEffect } from 'react';

// Define color schemes for different times of day
type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';
type ColorScheme = {
  background: string;
  highlight: string;
  text: string;
};

const COLOR_SCHEMES: Record<TimeOfDay, ColorScheme> = {
  morning: {
    background: '#FEF3F2', // Light peach
    highlight: '#F87171', // Coral
    text: '#3B82F6',      // Blue
  },
  afternoon: {
    background: '#F5E8E0', // Tan with reddish tint
    highlight: '#F87171', // Coral
    text: '#3B82F6',      // Blue
  },
  evening: {
    background: '#FCE7F3', // Light pink
    highlight: '#EC4899', // Pink
    text: '#8B5CF6',      // Purple
  },
  night: {
    background: '#EFF6FF', // Light blue
    highlight: '#3B82F6', // Blue
    text: '#F87171',      // Coral
  },
};

export const useAmbientColor = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('afternoon');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(COLOR_SCHEMES.afternoon);

  useEffect(() => {
    // Determine time of day based on current hour
    const determineTimeOfDay = (): TimeOfDay => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        return 'morning';
      } else if (hour >= 12 && hour < 17) {
        return 'afternoon';
      } else if (hour >= 17 && hour < 21) {
        return 'evening';
      } else {
        return 'night';
      }
    };

    // Update time of day initially
    const currentTimeOfDay = determineTimeOfDay();
    setTimeOfDay(currentTimeOfDay);
    setColorScheme(COLOR_SCHEMES[currentTimeOfDay]);

    // Set up interval to check time of day every minute
    const intervalId = setInterval(() => {
      const newTimeOfDay = determineTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        setTimeOfDay(newTimeOfDay);
        setColorScheme(COLOR_SCHEMES[newTimeOfDay]);
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [timeOfDay]);

  return { colorScheme, timeOfDay };
};