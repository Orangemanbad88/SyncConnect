import { useState, useEffect } from 'react';
import { Clock, Sun, Moon, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { queryClient } from '@/lib/queryClient';
import { useAuth } from '@/hooks/use-auth';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
  '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00',
];

const TIME_LABELS: Record<string, string> = {
  '08:00': '8am', '09:00': '9am', '10:00': '10am', '11:00': '11am',
  '12:00': '12pm', '13:00': '1pm', '14:00': '2pm', '15:00': '3pm',
  '16:00': '4pm', '17:00': '5pm', '18:00': '6pm', '19:00': '7pm',
  '20:00': '8pm', '21:00': '9pm', '22:00': '10pm',
};

interface AvailabilitySchedulerProps {
  userId: number;
}

export default function AvailabilityScheduler({ userId }: AvailabilitySchedulerProps) {
  // Grid state: grid[day][timeSlotIndex] = active
  const [grid, setGrid] = useState<boolean[][]>(
    Array.from({ length: 7 }, () => Array(TIME_SLOTS.length).fill(false))
  );
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const { toast } = useToast();

  // Load existing availability
  useEffect(() => {
    const loadAvailability = async () => {
      try {
        const res = await apiRequest('GET', `/api/users/${userId}/availability`);
        const windows = await res.json();
        if (windows.length > 0) {
          const newGrid = Array.from({ length: 7 }, () => Array(TIME_SLOTS.length).fill(false));
          for (const w of windows) {
            const dayIdx = w.dayOfWeek;
            const startIdx = TIME_SLOTS.indexOf(w.startTime);
            const endIdx = TIME_SLOTS.indexOf(w.endTime);
            if (startIdx !== -1 && endIdx !== -1) {
              for (let i = startIdx; i <= endIdx; i++) {
                newGrid[dayIdx][i] = true;
              }
            }
          }
          setGrid(newGrid);
        }
      } catch {
        // Ignore load errors
      }
    };
    loadAvailability();
  }, [userId]);

  const toggleCell = (day: number, slot: number) => {
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      newGrid[day][slot] = !newGrid[day][slot];
      return newGrid;
    });
    setIsDirty(true);
  };

  const setTonight = () => {
    const today = new Date().getDay();
    setGrid(prev => {
      const newGrid = prev.map(row => [...row]);
      // Set 7pm-10pm for today
      const eveningSlots = [11, 12, 13, 14]; // indices for 19:00-22:00
      for (const idx of eveningSlots) {
        if (idx < TIME_SLOTS.length) {
          newGrid[today][idx] = true;
        }
      }
      return newGrid;
    });
    setIsDirty(true);
    toast({ title: "Tonight set", description: "Added 7pm-10pm for today" });
  };

  const saveAvailability = async () => {
    setIsSaving(true);
    try {
      // Convert grid to windows
      const windows: { dayOfWeek: number; startTime: string; endTime: string; isRecurring: boolean }[] = [];

      for (let day = 0; day < 7; day++) {
        let blockStart: number | null = null;
        for (let slot = 0; slot <= TIME_SLOTS.length; slot++) {
          if (slot < TIME_SLOTS.length && grid[day][slot]) {
            if (blockStart === null) blockStart = slot;
          } else {
            if (blockStart !== null) {
              windows.push({
                dayOfWeek: day,
                startTime: TIME_SLOTS[blockStart],
                endTime: TIME_SLOTS[slot - 1],
                isRecurring: true,
              });
              blockStart = null;
            }
          }
        }
      }

      await apiRequest('PUT', `/api/users/${userId}/availability`, { windows });
      queryClient.invalidateQueries({ queryKey: ['/api/users/available/now'] });
      toast({ title: "Availability saved" });
      setIsDirty(false);
    } catch {
      toast({ title: "Failed to save", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <h3 className="font-medium text-white">Availability</h3>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={setTonight}
          className="text-xs border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
        >
          <Moon className="w-3 h-3 mr-1" />
          Tonight
        </Button>
      </div>

      <p className="text-xs text-gray-400">Tap time blocks when you're available for speed dates</p>

      {/* Schedule grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[400px]">
          {/* Day headers */}
          <div className="grid grid-cols-8 gap-1 mb-1">
            <div className="text-xs text-gray-500 p-1"></div>
            {DAYS.map(day => (
              <div key={day} className="text-xs text-gray-400 text-center p-1 font-medium">{day}</div>
            ))}
          </div>

          {/* Time rows */}
          {TIME_SLOTS.map((slot, slotIdx) => (
            <div key={slot} className="grid grid-cols-8 gap-1 mb-0.5">
              <div className="text-[10px] text-gray-500 p-1 text-right">{TIME_LABELS[slot]}</div>
              {DAYS.map((_, dayIdx) => (
                <button
                  key={`${dayIdx}-${slotIdx}`}
                  onClick={() => toggleCell(dayIdx, slotIdx)}
                  className={`h-6 rounded transition-all ${
                    grid[dayIdx][slotIdx]
                      ? 'bg-blue-500/60 border border-blue-400/40'
                      : 'bg-gray-800/40 border border-gray-700/30 hover:bg-gray-700/40'
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {isDirty && (
        <Button
          onClick={saveAvailability}
          disabled={isSaving}
          className="w-full py-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Check className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Availability'}
        </Button>
      )}
    </div>
  );
}
