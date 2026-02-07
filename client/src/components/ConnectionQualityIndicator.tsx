import { useState, useEffect } from 'react';
import { Wifi, WifiOff, Signal, SignalLow, SignalMedium, SignalHigh } from 'lucide-react';

interface ConnectionQualityIndicatorProps {
  connectionState: RTCPeerConnectionState | null;
  className?: string;
}

type QualityLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';

const ConnectionQualityIndicator = ({ connectionState, className = '' }: ConnectionQualityIndicatorProps) => {
  const [quality, setQuality] = useState<QualityLevel>('good');

  useEffect(() => {
    // Determine quality based on connection state
    switch (connectionState) {
      case 'connected':
        setQuality('excellent');
        break;
      case 'connecting':
      case 'new':
        setQuality('fair');
        break;
      case 'disconnected':
        setQuality('poor');
        break;
      case 'failed':
      case 'closed':
        setQuality('disconnected');
        break;
      default:
        setQuality('fair');
    }
  }, [connectionState]);

  const getQualityConfig = () => {
    switch (quality) {
      case 'excellent':
        return {
          icon: SignalHigh,
          color: 'text-green-500',
          bgColor: 'bg-green-500/20',
          label: 'Excellent',
          bars: 4
        };
      case 'good':
        return {
          icon: SignalMedium,
          color: 'text-green-400',
          bgColor: 'bg-green-400/20',
          label: 'Good',
          bars: 3
        };
      case 'fair':
        return {
          icon: SignalLow,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/20',
          label: 'Connecting',
          bars: 2
        };
      case 'poor':
        return {
          icon: Signal,
          color: 'text-orange-500',
          bgColor: 'bg-orange-500/20',
          label: 'Poor',
          bars: 1
        };
      case 'disconnected':
        return {
          icon: WifiOff,
          color: 'text-red-500',
          bgColor: 'bg-red-500/20',
          label: 'Disconnected',
          bars: 0
        };
    }
  };

  const config = getQualityConfig();
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${config.bgColor} backdrop-blur-sm px-3 py-2 rounded-xl flex items-center gap-2`}>
        {/* Signal bars */}
        <div className="flex items-end gap-0.5 h-4">
          {[1, 2, 3, 4].map((bar) => (
            <div
              key={bar}
              className={`w-1 rounded-sm transition-all duration-300 ${
                bar <= config.bars
                  ? config.color.replace('text-', 'bg-')
                  : 'bg-gray-600'
              }`}
              style={{ height: `${bar * 25}%` }}
            />
          ))}
        </div>

        {/* Quality label */}
        <span className={`text-xs font-medium ${config.color}`}>
          {config.label}
        </span>
      </div>
    </div>
  );
};

export default ConnectionQualityIndicator;
