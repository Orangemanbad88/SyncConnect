import React, { createContext, useContext, ReactNode } from 'react';
import { useAmbientColor } from '@/hooks/useAmbientColor';

// Define the shape of our context
type AmbientContextType = {
  background: string;
  highlight: string;
  text: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
};

// Create the context with default values
const AmbientContext = createContext<AmbientContextType>({
  background: '#F5E8E0',
  highlight: '#F87171',
  text: '#3B82F6',
  timeOfDay: 'afternoon',
});

// Provider component
export const AmbientProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { colorScheme, timeOfDay } = useAmbientColor();
  
  const value = {
    background: colorScheme.background,
    highlight: colorScheme.highlight,
    text: colorScheme.text,
    timeOfDay,
  };
  
  return (
    <AmbientContext.Provider value={value}>
      {children}
    </AmbientContext.Provider>
  );
};

// Custom hook to use the ambient context
export const useAmbient = () => useContext(AmbientContext);