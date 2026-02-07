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
    background: 'linear-gradient(135deg, #1A1D23 0%, #252A33 50%, #2D3340 100%)',
    highlight: '#C9A962', // Gold
    text: '#E8E4DF',      // Warm white
  },
  afternoon: {
    background: 'linear-gradient(135deg, #1A1D23 0%, #22262E 50%, #2A2F38 100%)',
    highlight: '#D4A574', // Amber
    text: '#E8E4DF',      // Warm white
  },
  evening: {
    background: 'linear-gradient(135deg, #151820 0%, #1A1D23 50%, #252A33 100%)',
    highlight: '#C17767', // Muted coral
    text: '#E8E4DF',      // Warm white
  },
  sunset: {
    background: 'linear-gradient(135deg, #0D0F12 0%, #1A1D23 40%, #252A33 70%, #1A1D23 100%)',
    highlight: '#C9A962', // Gold
    text: '#E8E4DF',      // Warm white
  },
  night: {
    background: 'linear-gradient(135deg, #0D0F12 0%, #151820 50%, #1A1D23 100%)',
    highlight: '#8B7355', // Muted bronze
    text: '#9CA3AF',      // Soft gray
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