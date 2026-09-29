import React from 'react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 z-50 flex items-center gap-2 rounded-xl bg-amber-900/90 text-amber-50 backdrop-blur-md px-3.5 py-2 text-xs font-medium shadow-lg border border-amber-700/50 animate-fadeIn">
      <WifiOff className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
      <span>Offline Mode — All exercises & timers available locally</span>
    </div>
  );
};
