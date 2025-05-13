import { useState, useEffect } from 'react';

// Define color schemes for different times of day
export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night' | 'sunset';
export type ColorScheme = {
  background: string;
  highlight: string;
  text: string;
};

export const COLOR_SCHEMES: Record<TimeOfDay, ColorScheme> = {
  morning: {
    background: 'linear-gradient(150deg, #FEF9C3 0%, #FEF3F2 70%, #FCE7F3 100%)', // Soft yellow/peach gradient
    highlight: '#F59E0B', // Amber/orange
    text: '#3B82F6',      // Blue
  },
  afternoon: {
    background: 'linear-gradient(150deg, #E0F2FE 0%, #F5F5F4 50%, #FEF3F2 100%)', // Light blue to white to peach
    highlight: '#F87171', // Coral
    text: '#3B82F6',      // Blue
  },
  evening: {
    background: 'linear-gradient(150deg, #93C5FD 0%, #DDD6FE 50%, #FBCFE8 100%)', // Blue to purple to pink gradient
    highlight: '#EC4899', // Pink
    text: '#8B5CF6',      // Purple
  },
  sunset: {
    background: 'linear-gradient(150deg, #FF8C00 0%, #FF4500 30%, #8B0000 70%, #191970 100%)', // Sunset with deep blue at bottom
    highlight: '#FF6347', // Tomato red
    text: '#4169E1',      // Royal blue
  },
  night: {
    background: 'linear-gradient(150deg, #020617 0%, #1E293B 50%, #334155 100%)', // Dark blue to slate gradient
    highlight: '#A78BFA', // Purple
    text: '#E2E8F0',      // Light gray
  },
};

export const useAmbientColor = (forcedTimeOfDay?: TimeOfDay) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>(forcedTimeOfDay || 'afternoon');
  const [colorScheme, setColorScheme] = useState<ColorScheme>(
    forcedTimeOfDay ? COLOR_SCHEMES[forcedTimeOfDay] : COLOR_SCHEMES.afternoon
  );

  // This function determines the time of day based on current hour
  const determineTimeOfDay = (): TimeOfDay => {
    const hour = new Date().getHours();
    
    if (hour >= 5 && hour < 12) {
      return 'morning';
    } else if (hour >= 12 && hour < 17) {
      return 'afternoon';
    } else if (hour >= 17 && hour < 18) {
      return 'sunset'; // Specific time for sunset (5-6pm)
    } else if (hour >= 18 && hour < 21) {
      return 'evening';
    } else {
      return 'night';
    }
  };

  useEffect(() => {
    console.log('useAmbientColor effect, forcedTimeOfDay:', forcedTimeOfDay);
    
    // If forcedTimeOfDay is provided, use that instead of time-based detection
    if (forcedTimeOfDay) {
      console.log('Setting forced time of day:', forcedTimeOfDay);
      setTimeOfDay(forcedTimeOfDay);
      setColorScheme(COLOR_SCHEMES[forcedTimeOfDay]);
      return;
    }
    
    // Update time of day initially
    const currentTimeOfDay = determineTimeOfDay();
    console.log('Setting auto time of day:', currentTimeOfDay);
    setTimeOfDay(currentTimeOfDay);
    setColorScheme(COLOR_SCHEMES[currentTimeOfDay]);

    // Set up interval to check time of day every minute
    const intervalId = setInterval(() => {
      const newTimeOfDay = determineTimeOfDay();
      if (newTimeOfDay !== timeOfDay) {
        console.log('Time of day changing to:', newTimeOfDay);
        setTimeOfDay(newTimeOfDay);
        setColorScheme(COLOR_SCHEMES[newTimeOfDay]);
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [forcedTimeOfDay]); // Only depend on forcedTimeOfDay to prevent re-running

  return { colorScheme, timeOfDay };
};