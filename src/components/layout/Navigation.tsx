import React from 'react';
import {
  LayoutDashboard,
  ScanEye,
  Dumbbell,
  BotMessageSquare,
  TrendingUp,
  Settings,
  Sparkles,
} from 'lucide-react';
import { PWAInstallButton } from '../common/PWAInstallButton';

export type NavTab = 'today' | 'posture' | 'exercises' | 'coach' | 'progress' | 'profile';

interface Props {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  movementScore: number;
}

export const Navigation: React.FC<Props> = ({
  currentTab,
  onSelectTab,
  movementScore,
}) => {
  const navItems: Array<{ id: NavTab; label: string; icon: React.FC<{ className?: string }> }> = [
    { id: 'today', label: 'Today', icon: LayoutDashboard },
    { id: 'posture', label: 'Posture', icon: ScanEye },
    { id: 'exercises', label: 'Exercises', icon: Dumbbell },
    { id: 'coach', label: 'AI Coach', icon: BotMessageSquare },
    { id: 'progress', label: 'Progress', icon: TrendingUp },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar (Left) */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-stone-200/80 p-5 shrink-0 min-h-screen justify-between select-none">
        <div className="space-y-6">
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-sm shadow-emerald-900/10">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.2"
                  d="M12 2C8 6 6 9 6 13a6 6 0 0012 0c0-4-2-7-6-11z"
                />
                <path strokeLinecap="round" strokeWidth="2" d="M12 9v6" />
              </svg>
            </div>
            <div>
              <h1 className="font-extrabold text-base text-stone-900 tracking-tight leading-tight">
                DeskMate
              </h1>
              <p className="text-[11px] text-stone-400 font-medium">Office Wellness & Posture</p>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                      : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 transition ${
                      isActive ? 'text-emerald-700 stroke-[2.4]' : 'text-stone-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.id === 'coach' && (
                    <span className="ml-auto px-1.5 py-0.5 rounded-md bg-emerald-100 text-[10px] font-bold text-emerald-800">
                      AI
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Widget: Movement Score & Install */}
        <div className="space-y-3 pt-4 border-t border-stone-100">
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-[11px] text-stone-500 font-medium">Daily Movement</span>
              <span className="font-bold text-emerald-700">{movementScore} / 100</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${movementScore}%` }}
              />
            </div>
          </div>

          <PWAInstallButton variant="compact" className="w-full justify-center" />
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200/80 px-2 py-2 flex items-center justify-around shadow-lg">
        {navItems
          .filter((item) => item.id !== 'progress') // keep 5 crisp icons on mobile
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-xl transition ${
                  isActive ? 'text-emerald-800 font-bold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-emerald-700 stroke-[2.5]' : ''}`} />
                <span className="text-[10px] tracking-tight">{item.label}</span>
              </button>
            );
          })}
      </nav>
    </>
  );
};
