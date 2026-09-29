import React from 'react';
import { Volume2, VolumeX, Pause, Play, Sparkles, Footprints } from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';
import { soundManager } from '../../utils/audio';

interface Props {
  sittingMinutes: number;
  isPaused: boolean;
  standingMode: boolean;
  soundEnabled: boolean;
  onTogglePause: () => void;
  onToggleStanding: () => void;
  onToggleSound: () => void;
  onStartBreak: () => void;
}

export const Header: React.FC<Props> = ({
  sittingMinutes,
  isPaused,
  standingMode,
  soundEnabled,
  onTogglePause,
  onToggleStanding,
  onToggleSound,
  onStartBreak,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-stone-50/80 backdrop-blur-md border-b border-stone-200/60 px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Mobile Title */}
      <div className="flex md:hidden items-center gap-2">
        <div className="w-8 h-8 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
          <Sparkles className="w-4 h-4" />
        </div>
        <span className="font-extrabold text-sm text-stone-900 tracking-tight">DeskMate</span>
      </div>

      {/* Desktop live status pill */}
      <div className="hidden sm:flex items-center gap-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-stone-200 shadow-xs text-xs font-medium text-stone-700">
          <span
            className={`w-2 h-2 rounded-full ${
              standingMode
                ? 'bg-blue-500'
                : isPaused
                ? 'bg-amber-400'
                : sittingMinutes > 50
                ? 'bg-amber-500 animate-pulse'
                : 'bg-emerald-500'
            }`}
          />
          <span>
            {standingMode
              ? 'Standing Desk Mode'
              : isPaused
              ? 'Timer Paused'
              : `Sitting: ${Math.floor(sittingMinutes / 60)}h ${sittingMinutes % 60}m`}
          </span>

          <button
            onClick={onTogglePause}
            className="ml-1 text-stone-400 hover:text-stone-700 p-0.5 rounded transition"
            title={isPaused ? 'Resume sitting timer' : 'Pause sitting timer'}
          >
            {isPaused ? <Play className="w-3 h-3 fill-stone-500" /> : <Pause className="w-3 h-3" />}
          </button>
        </div>

        <button
          onClick={onToggleStanding}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
            standingMode
              ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-xs'
              : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
          }`}
          title="Toggle Standing Desk Mode"
        >
          <Footprints className="w-3.5 h-3.5" />
          <span>{standingMode ? 'Standing' : 'Switched to Standing?'}</span>
        </button>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSound}
          className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-white border border-transparent hover:border-stone-200 transition"
          title={soundEnabled ? 'Mute soothing audio' : 'Enable soothing audio'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-emerald-700" />
          ) : (
            <VolumeX className="w-4 h-4 text-stone-400" />
          )}
        </button>

        <PWAInstallButton variant="compact" className="hidden sm:inline-flex" />

        <button
          onClick={onStartBreak}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow-xs active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Quick Break</span>
        </button>
      </div>
    </header>
  );
};
