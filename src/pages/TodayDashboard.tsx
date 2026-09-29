import React from 'react';
import { DailyStats, UserPreferences } from '../types';
import { PWAInstallButton } from '../components/common/PWAInstallButton';
import {
  Sparkles,
  Clock,
  Flame,
  CheckCircle2,
  ScanEye,
  ArrowRight,
  Coffee,
  HeartPulse,
  Sun,
  Eye,
  Compass,
} from 'lucide-react';

interface Props {
  stats: DailyStats;
  prefs: UserPreferences;
  sittingMinutes: number;
  onStartBreak: (routineId?: string) => void;
  onNavigateTab: (tab: any) => void;
}

export const TodayDashboard: React.FC<Props> = ({
  stats,
  prefs,
  sittingMinutes,
  onStartBreak,
  onNavigateTab,
}) => {
  // Format sitting time
  const currentSittingHours = Math.floor(sittingMinutes / 60);
  const currentSittingRemainingMinutes = sittingMinutes % 60;

  const totalSittingHours = Math.floor(stats.sittingMinutes / 60);
  const totalSittingRemainingMinutes = stats.sittingMinutes % 60;

  // Next break calculation based on user interval
  const nextBreakIn = Math.max(0, prefs.breakIntervalMinutes - (sittingMinutes % prefs.breakIntervalMinutes));
  const isBreakDue = sittingMinutes >= prefs.breakIntervalMinutes;

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* 1. Warm Greeting & Contextual Vibe */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>Today's Workday Wellness</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Good morning, {prefs.name}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Let's make your workday a little healthier and more comfortable.
          </p>
        </div>

        {/* Posture quick link button */}
        <button
          onClick={() => onNavigateTab('posture')}
          className="inline-flex items-center gap-2 self-start sm:self-auto px-3.5 py-2 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold border border-stone-200/80 shadow-xs transition active:scale-95"
        >
          <ScanEye className="w-4 h-4 text-emerald-600" />
          <span>Quick Posture Check</span>
        </button>
      </div>

      {/* 2. Prominent Primary Hero Banner (The Core CTA) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-teal-950 text-white p-6 sm:p-8 shadow-xl border border-emerald-700/50">
        {/* Soft decorative background circles */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-teal-400/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Current Sitting Session</span>
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                You've been sitting for {sittingMinutes} min
              </h3>
              <p className="text-sm text-emerald-100/90 leading-relaxed">
                {isBreakDue
                  ? 'Your spine and shoulders are ready for a gentle reset. Step away from your keyboard for 2 minutes.'
                  : 'Taking brief movement breaks keeps blood circulating and prevents neck stiffness before it begins.'}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex flex-col items-start md:items-end gap-2">
            <button
              onClick={() => onStartBreak()}
              className="flex items-center justify-center gap-2.5 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-bold text-sm sm:text-base px-7 py-4 rounded-2xl shadow-lg hover:shadow-emerald-400/20 transition-all active:scale-95 group"
            >
              <Sparkles className="w-5 h-5 text-emerald-900 group-hover:rotate-12 transition-transform" />
              <span>Start a 2-minute break</span>
              <ArrowRight className="w-4 h-4 ml-0.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <span className="text-[11px] text-emerald-200/70 font-medium">
              4 desk-friendly movements • No gear needed
            </span>
          </div>
        </div>
      </div>

      {/* 3. Daily Status Cards (Clean Grid) */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Sitting Time */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold text-stone-500">Sitting Time</span>
            <Clock className="w-4 h-4 text-stone-400" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {totalSittingHours}h {totalSittingRemainingMinutes}m
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Goal: &lt; 7h per day</p>
          </div>
        </div>

        {/* Active Movement Time */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold text-stone-500">Active Time</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-emerald-700 tracking-tight">
              {stats.movementMinutes} min
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Goal: 40 min daily</p>
          </div>
        </div>

        {/* Breaks Taken */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold text-stone-500">Breaks Taken</span>
            <Coffee className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
              {stats.breaksTaken} <span className="text-xs font-normal text-stone-400">/ {stats.breakGoal}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              {stats.breaksTaken >= stats.breakGoal ? 'Daily goal reached!' : `${stats.breakGoal - stats.breaksTaken} more to goal`}
            </p>
          </div>
        </div>

        {/* Next Break */}
        <div className="p-4 sm:p-5 rounded-3xl bg-white border border-stone-200/70 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400 mb-2">
            <span className="text-xs font-semibold text-stone-500">Next Break</span>
            <Compass className="w-4 h-4 text-teal-600" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold text-teal-800 tracking-tight">
              {isBreakDue ? 'Due Now' : `in ${nextBreakIn}m`}
            </div>
            <p className="text-[11px] text-stone-400 mt-1">Every {prefs.breakIntervalMinutes}m interval</p>
          </div>
        </div>

        {/* Daily Movement Score */}
        <div className="col-span-2 lg:col-span-1 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50/60 border border-emerald-200/60 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-emerald-800 mb-2">
            <span className="text-xs font-semibold">Movement Score</span>
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black text-emerald-950 tracking-tight">
              {stats.movementScore} <span className="text-xs font-medium text-emerald-700">/ 100</span>
            </div>
            <p className="text-[11px] text-emerald-800 font-medium mt-1">
              {stats.movementScore >= 80 ? 'Healthy rhythm today' : 'Take 1 break to reach 80+'}
            </p>
          </div>
        </div>
      </div>

      {/* 4. Daily Progress Rings / Indicators */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/70 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-stone-900">Today's Movement Targets</h4>
            <p className="text-xs text-stone-500 mt-0.5">Gentle benchmarks designed for desk workers</p>
          </div>
          <button
            onClick={() => onNavigateTab('progress')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>View trends</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* Movement Goal */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-600">Active Movement</span>
              <span className="font-bold text-stone-800">{stats.movementMinutes} / 40 min</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.movementMinutes / 40) * 100)}%` }}
              />
            </div>
          </div>

          {/* Break Goal */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-600">Movement Breaks</span>
              <span className="font-bold text-stone-800">{stats.breaksTaken} / {stats.breakGoal}</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.breaksTaken / stats.breakGoal) * 100)}%` }}
              />
            </div>
          </div>

          {/* Posture Checks */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-medium text-stone-600">Posture Checks</span>
              <span className="font-bold text-stone-800">{stats.postureChecks} / 3</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 rounded-full transition-all duration-700"
                style={{ width: `${Math.min(100, (stats.postureChecks / 3) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Quick Micro-Routines (Bite-sized desk stretches) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base font-bold text-stone-900">Desk-Friendly Quick Resets</h4>
          <button
            onClick={() => onNavigateTab('exercises')}
            className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
          >
            <span>Full library (18)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {[
            {
              id: 'chin-tuck',
              title: 'Chin Tuck Alignment',
              duration: '30s',
              target: 'Cervical Spine',
              icon: '📐',
              tag: 'Seated',
            },
            {
              id: 'shoulder-rolls',
              title: 'Shoulder Rolls',
              duration: '30s',
              target: 'Upper Trapezius',
              icon: '🔄',
              tag: 'Seated',
            },
            {
              id: 'seated-spinal-twist',
              title: 'Gentle Spinal Twist',
              duration: '40s',
              target: 'Torso & Lower Back',
              icon: '🪑',
              tag: 'Seated',
            },
            {
              id: 'eye-202020',
              title: '20-20-20 Eye Reset',
              duration: '30s',
              target: 'Visual Fatigue',
              icon: '👁️',
              tag: 'Eye Care',
            },
          ].map((item) => (
            <div
              key={item.id}
              onClick={() => onStartBreak()}
              className="group p-4 rounded-3xl bg-white border border-stone-200/70 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <span className="text-2xl p-2 rounded-2xl bg-stone-50 group-hover:bg-emerald-50 transition">
                  {item.icon}
                </span>
                <span className="text-[11px] font-semibold text-stone-400 group-hover:text-emerald-700 transition">
                  {item.duration}
                </span>
              </div>
              <div className="mt-3">
                <h5 className="text-sm font-bold text-stone-900 group-hover:text-emerald-950 transition">
                  {item.title}
                </h5>
                <p className="text-[11px] text-stone-500 mt-0.5">{item.target}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. DeskMate AI Coach Contextual Card */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-teal-50 via-emerald-50 to-stone-50 border border-emerald-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-emerald-100 flex items-center justify-center shrink-0 shadow-sm">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-stone-900 text-sm">Ask DeskMate Coach</h4>
              <span className="px-2 py-0.5 rounded-full bg-emerald-200/60 text-[10px] font-bold text-emerald-900">
                Personalized
              </span>
            </div>
            <p className="text-xs text-stone-600 mt-1 max-w-lg leading-relaxed">
              "You've logged 6 breaks today! Would you like a 90-second breathing & eye rest, or a standing calf booster?"
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('coach')}
          className="shrink-0 flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition shadow-xs active:scale-95"
        >
          <span>Chat with Coach</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 7. PWA Prominent Install Banner (if not installed) */}
      <PWAInstallButton variant="prominent" />
    </div>
  );
};
