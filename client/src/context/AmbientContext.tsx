import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useAmbientColor, TimeOfDay } from '@/hooks/useAmbientColor';

// Define the shape of our context
type AmbientContextType = {
  background: string;
  highlight: string;
  text: string;
  timeOfDay: TimeOfDay;
  setForcedTimeOfDay: (timeOfDay: TimeOfDay | null) => void;
};

// Create the context with default values
const AmbientContext = createContext<AmbientContextType>({
  background: '#F5E8E0',
  highlight: '#F87171',
  text: '#3B82F6',
  timeOfDay: 'afternoon',
  setForcedTimeOfDay: () => {},
});

// Provider component
export const AmbientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [forcedTime, setForcedTime] = useState<TimeOfDay | null>(null);
  const { colorScheme, timeOfDay } = useAmbientColor(forcedTime || undefined);
  
  const setForcedTimeOfDay = (time: TimeOfDay | null) => {
    setForcedTime(time);
  };
  
  const value = {
    background: colorScheme.background,
    highlight: colorScheme.highlight,
    text: colorScheme.text,
    timeOfDay,
    setForcedTimeOfDay,
  };
  
  return (
    <AmbientContext.Provider value={value}>
      {children}
    </AmbientContext.Provider>
  );
};

// Custom hook to use the ambient context
function useAmbient() {
  const context = useContext(AmbientContext);
  if (context === undefined) {
    throw new Error('useAmbient must be used within an AmbientProvider');
  }
  return context;
}

export { useAmbient };