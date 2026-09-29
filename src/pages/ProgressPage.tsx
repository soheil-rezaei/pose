import React from 'react';
import { DailyStats, UserPreferences } from '../types';
import {
  TrendingUp,
  Sparkles,
  Calendar,
  Award,
  Flame,
  Clock,
  Coffee,
  CheckCircle2,
  HeartPulse,
  Info,
} from 'lucide-react';

interface Props {
  stats: DailyStats;
  prefs: UserPreferences;
  onStartBreak: () => void;
}

export const ProgressPage: React.FC<Props> = ({ stats, prefs, onStartBreak }) => {
  // Realistic weekly history data
  const weeklyData = [
    { day: 'Mon', sittingHours: 6.8, breaks: 5, movementMin: 30, score: 76 },
    { day: 'Tue', sittingHours: 6.2, breaks: 6, movementMin: 38, score: 84 },
    { day: 'Wed', sittingHours: 7.1, breaks: 4, movementMin: 26, score: 70 },
    { day: 'Thu', sittingHours: 6.5, breaks: 6, movementMin: 36, score: 82 },
    { day: 'Fri', sittingHours: 5.9, breaks: 7, movementMin: 42, score: 88 },
    { day: 'Sat', sittingHours: 3.4, breaks: 4, movementMin: 28, score: 80 },
    { day: 'Sun (Today)', sittingHours: 5.7, breaks: stats.breaksTaken, movementMin: stats.movementMinutes, score: stats.movementScore },
  ];

  const totalWeeklyBreaks = weeklyData.reduce((acc, d) => acc + d.breaks, 0);
  const totalWeeklyExerciseMin = weeklyData.reduce((acc, d) => acc + d.movementMin, 0);
  const avgSitting = (
    weeklyData.reduce((acc, d) => acc + d.sittingHours, 0) / weeklyData.length
  ).toFixed(1);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wide uppercase">
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>Workplace Movement Patterns</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
          Wellness & Habits Progress
        </h2>
        <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
          Insight into your daily movement breaks and posture awareness without medical pressure.
        </p>
      </div>

      {/* Weekly High-Level Metric Tiles (Specified in prompt Section 15) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Movement Breaks */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold text-stone-500">Weekly Movement Breaks</span>
            <Coffee className="w-4 h-4 text-amber-600" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {totalWeeklyBreaks}
            </div>
            <p className="text-xs text-emerald-700 font-medium mt-1">
              +4 breaks compared to last week
            </p>
          </div>
        </div>

        {/* Exercise Minutes */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold text-stone-500">Total Exercise Time</span>
            <Flame className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-emerald-700 tracking-tight">
              {totalWeeklyExerciseMin} <span className="text-sm font-normal text-stone-400">min</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">Short micro-movements add up</p>
          </div>
        </div>

        {/* Average Sitting */}
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-400">
            <span className="text-xs font-semibold text-stone-500">Avg Daily Sitting</span>
            <Clock className="w-4 h-4 text-teal-600" />
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-stone-900 tracking-tight">
              {avgSitting} <span className="text-sm font-normal text-stone-400">hours</span>
            </div>
            <p className="text-xs text-stone-500 mt-1">Balanced with regular standups</p>
          </div>
        </div>
      </div>

      {/* Movement Score Breakdown Card */}
      <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-emerald-50 via-teal-50/50 to-stone-50 border border-emerald-200/70 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-emerald-700" />
              <h3 className="text-lg font-bold text-stone-900">Today's Movement Score</h3>
            </div>
            <p className="text-xs text-stone-600 mt-0.5">
              Reflects your movement frequency, break habits, and posture consistency.
            </p>
          </div>

          <div className="flex items-baseline gap-1 self-start sm:self-auto bg-white px-4 py-2 rounded-2xl border border-emerald-200 shadow-xs">
            <span className="text-3xl font-black text-emerald-900">{stats.movementScore}</span>
            <span className="text-xs font-bold text-emerald-700">/ 100</span>
          </div>
        </div>

        {/* Component Bars */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="flex justify-between font-semibold text-stone-700">
              <span>Movement Breaks Completed</span>
              <span className="text-emerald-700">32 / 38 pts</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '84%' }} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="flex justify-between font-semibold text-stone-700">
              <span>Active Movement Minutes</span>
              <span className="text-emerald-700">30 / 32 pts</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="flex justify-between font-semibold text-stone-700">
              <span>Posture Awareness Checks</span>
              <span className="text-emerald-700">10 / 15 pts</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full" style={{ width: '66%' }} />
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-stone-200/60 space-y-2">
            <div className="flex justify-between font-semibold text-stone-700">
              <span>Sitting Time Moderation</span>
              <span className="text-emerald-700">10 / 15 pts</span>
            </div>
            <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full" style={{ width: '66%' }} />
            </div>
          </div>
        </div>

        {/* Motivational Guidance Note */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-emerald-100 text-xs">
          <div className="flex items-center gap-2 text-stone-700 font-medium">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Take one more 2-minute movement break to reach today's goal of 85+.</span>
          </div>
          <button
            onClick={onStartBreak}
            className="shrink-0 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition shadow-xs active:scale-95"
          >
            Start Break
          </button>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-stone-900">7-Day Activity Trends</h4>
            <p className="text-xs text-stone-500 mt-0.5">
              Daily movement breaks (bars) vs. sitting duration
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500" />
              <span className="text-stone-600 font-medium">Breaks Taken</span>
            </div>
          </div>
        </div>

        {/* CSS Interactive Bar Chart */}
        <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 pt-6 border-b border-stone-200/80 px-2 sm:px-4">
          {weeklyData.map((d, i) => {
            const heightPercent = Math.min(100, Math.round((d.breaks / 8) * 100));
            const isToday = i === weeklyData.length - 1;

            return (
              <div key={d.day} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                {/* Tooltip on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 text-white text-[10px] rounded-lg px-2 py-1 pointer-events-none whitespace-nowrap mb-1">
                  {d.breaks} breaks • {d.movementMin}m
                </div>

                <div className="w-full max-w-[42px] bg-stone-100 rounded-t-2xl overflow-hidden h-full flex items-end">
                  <div
                    className={`w-full rounded-t-2xl transition-all duration-700 ${
                      isToday ? 'bg-emerald-600' : 'bg-emerald-400/80 group-hover:bg-emerald-500'
                    }`}
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>

                <span
                  className={`text-[11px] font-semibold mt-1 ${
                    isToday ? 'text-emerald-800 font-bold' : 'text-stone-500'
                  }`}
                >
                  {d.day.split(' ')[0]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Wellness Milestones Badges */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-4">
        <h4 className="text-base font-bold text-stone-900">Workplace Wellness Milestones</h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700 shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-stone-900">Consistency Champion</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Completed 5+ breaks 5 days in a row.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-stone-900">Cervical Spine Care</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Logged 10 chin tucks and neck rotations.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center text-teal-700 shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-stone-900">Ergonomic Eye Care</h5>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Maintained 20-20-20 horizon breaks today.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Footer */}
      <div className="p-4 rounded-2xl bg-stone-100/60 border border-stone-200 text-stone-500 text-xs flex items-center gap-2.5">
        <Info className="w-4 h-4 shrink-0 text-stone-400" />
        <span>
          Daily movement metrics are designed to motivate healthy desk habits and do not represent a clinical diagnosis or medical evaluation.
        </span>
      </div>
    </div>
  );
};
