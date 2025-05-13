import React, { useState } from 'react';
import { useAmbient } from '@/context/AmbientContext';
import { TimeOfDay } from '@/hooks/useAmbientColor';
import { Coffee, Sun, Sunset, Moon } from 'lucide-react';

const TimeChangerPanel: React.FC = () => {
  const { timeOfDay, setForcedTimeOfDay } = useAmbient();
  const [isExpanded, setIsExpanded] = useState(false);

  const timeOptions: TimeOfDay[] = ['morning', 'afternoon', 'evening', 'sunset', 'night'];
  
  const getIcon = (time: TimeOfDay) => {
    switch (time) {
      case 'morning':
        return <Coffee size={18} />;
      case 'afternoon':
        return <Sun size={18} />;
      case 'evening':
        return <Sunset size={18} />;
      case 'sunset':
        return <Sunset size={18} className="text-orange-500" />;
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
        className="fixed bottom-28 right-4 z-40 p-3 rounded-full shadow-lg bg-black/70 text-white hover:bg-black/90 transition-all flex items-center justify-center gap-2 backdrop-blur-sm border border-gray-600"
      >
        <span className="sr-only">Change time of day</span>
        {getIcon(timeOfDay)}
        <span className="text-xs font-medium capitalize hidden sm:inline">{timeOfDay} Mode</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-28 right-4 z-40 p-4 rounded-lg shadow-lg bg-black/80 backdrop-blur-md border border-gray-700 text-white">
      <div className="flex flex-col space-y-3">
        <div className="flex justify-between items-center mb-1">
          <h4 className="text-sm font-semibold">Time of Day</h4>
          <button
            onClick={() => setIsExpanded(false)}
            className="text-gray-300 hover:text-white text-xs"
          >
            Close
          </button>
        </div>
        
        <div className="flex space-x-3">
          {timeOptions.map((time) => (
            <button
              key={time}
              onClick={() => handleTimeChange(time)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                timeOfDay === time ? 'bg-purple-600/80 ring-2 ring-purple-300' : 'hover:bg-gray-800/80'
              }`}
            >
              {getIcon(time)}
              <span className="text-xs mt-1 capitalize">{time}</span>
            </button>
          ))}
        </div>
        
        <div className="text-xs mt-1 text-gray-300 italic">
          {timeOfDay === 'morning' && 'Good morning! Time for coffee.'}
          {timeOfDay === 'afternoon' && 'Good afternoon! The sun is shining.'}
          {timeOfDay === 'evening' && 'Good evening! Sunset vibes.'}
          {timeOfDay === 'sunset' && 'Beautiful sunset! The perfect golden hour.'}
          {timeOfDay === 'night' && 'Good night! Time to wind down.'}
        </div>
      </div>
    </div>
  );
};

export default TimeChangerPanel;