import React, { useState } from 'react';
import { useAmbient } from '@/context/AmbientContext';
import { TimeOfDay } from '@/hooks/useAmbientColor';
import { Coffee, Sun, Sunset, Moon } from 'lucide-react';

const TimeChangerPanel: React.FC = () => {
  const { timeOfDay, setForcedTimeOfDay } = useAmbient();
  const [isExpanded, setIsExpanded] = useState(false);

  const timeOptions: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'night'];
  
  const getIcon = (time: TimeOfDay) => {
    switch (time) {
      case 'morning':
        return <Coffee size={18} />;
      case 'afternoon':
        return <Sun size={18} />;
      case 'evening':
        return <Sunset size={18} />;
      case 'night':
        return <Moon size={18} />;
    }
  };

  const handleTimeChange = (time: TimeOfDay) => {
    setForcedTimeOfDay(time === timeOfDay ? null : time);
  };

  if (!isExpanded) {
    return (
      <button 
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-28 right-4 z-40 p-2 rounded-full shadow-lg bg-white flex items-center justify-center"
      >
        <span className="sr-only">Change time of day</span>
        {getIcon(timeOfDay)}
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 right-4 z-40 p-3 rounded-lg shadow-lg bg-white">
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center mb-2">
          <h4 className="text-sm font-medium">Time of Day</h4>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-500 hover:text-gray-700 text-xs"
          >
            Close
          </button>
        </div>
        
        <div className="flex space-x-2">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeChange(time)}
              className={`flex flex-col items-center p-2 rounded-lg ${
                timeOfDay === time ? 'bg-gray-100 ring-2 ring-blue-500' : 'hover:bg-gray-100'
              }`}
            >
              {getIcon(time)}
              <span className="text-xs mt-1 capitalize">{time}</span>
            </button>
          ))}
        </div>
        
        <div className="text-xs mt-2 text-gray-500">
          {timeOfDay === 'morning' && 'Good morning! Time for coffee.'}
          {timeOfDay === 'afternoon' && 'Good afternoon! The sun is shining.'}
          {timeOfDay === 'evening' && 'Good evening! Sunset vibes.'}
          {timeOfDay === 'night' && 'Good night! Time to wind down.'}
        </div>
      </div>
    </div>
  );
};

export default TimeChangerPanel;