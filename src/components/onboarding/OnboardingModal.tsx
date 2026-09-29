import React, { useState } from 'react';
import { UserPreferences } from '../../types';
import { saveUserPreferences } from '../../utils/storage';
import { Sparkles, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  isOpen: boolean;
  initialPrefs: UserPreferences;
  onComplete: (prefs: UserPreferences) => void;
  onClose?: () => void;
}

export const OnboardingModal: React.FC<Props> = ({
  isOpen,
  initialPrefs,
  onComplete,
  onClose,
}) => {
  const [step, setStep] = useState(1);
  const [prefs, setPrefs] = useState<UserPreferences>(initialPrefs);

  if (!isOpen) return null;

  const toggleGoal = (goal: string) => {
    setPrefs((prev) => {
      const exists = prev.goals.includes(goal);
      const nextGoals = exists
        ? prev.goals.filter((g) => g !== goal)
        : [...prev.goals, goal];
      return { ...prev, goals: nextGoals };
    });
  };

  const handleFinish = () => {
    const finalPrefs = { ...prefs, hasCompletedOnboarding: true };
    saveUserPreferences(finalPrefs);
    onComplete(finalPrefs);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-lg rounded-3xl bg-white shadow-2xl border border-stone-200 p-6 sm:p-8 space-y-6 text-stone-800">
        {/* Header with Step Indicator */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Step {step} of 3
            </span>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  s === step ? 'w-6 bg-emerald-600' : 'w-2 bg-stone-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step 1: Workday & Desk Hours */}
        {step === 1 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-stone-900">What best describes your workday?</h3>
              <p className="text-xs text-stone-500 mt-1">
                DeskMate customizes movement intervals based on your posture routine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'mostly_sitting', label: 'Mostly Sitting', icon: '🪑' },
                { id: 'mix_sitting_standing', label: 'Mix Sit & Stand', icon: '🔄' },
                { id: 'mostly_standing', label: 'Mostly Standing', icon: '🧍' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() =>
                    setPrefs((prev) => ({
                      ...prev,
                      workdayType: item.id as UserPreferences['workdayType'],
                    }))
                  }
                  className={`p-4 rounded-2xl border text-center transition flex flex-col items-center gap-2 ${
                    prefs.workdayType === item.id
                      ? 'border-emerald-600 bg-emerald-50/60 text-emerald-950 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-stone-50/40 text-stone-700'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-semibold">{item.label}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-stone-700">
                How many hours do you usually work at a desk daily?
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { val: 4, label: '< 4 hours' },
                  { val: 6, label: '4–6 hours' },
                  { val: 8, label: '6–8 hours' },
                  { val: 10, label: '8+ hours' },
                ].map((slot) => (
                  <button
                    key={slot.val}
                    onClick={() => setPrefs((prev) => ({ ...prev, deskHours: slot.val }))}
                    className={`py-2 px-1 text-xs rounded-xl border text-center transition font-medium ${
                      prefs.deskHours === slot.val
                        ? 'border-emerald-600 bg-emerald-600 text-white font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    {slot.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Goals */}
        {step === 2 && (
          <div className="space-y-4 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-stone-900">What do you want to improve?</h3>
              <p className="text-xs text-stone-500 mt-1">Select all that apply to you.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                'Better posture',
                'More movement',
                'Neck/shoulder mobility',
                'Reduce sitting',
                'Better work breaks',
                'General workplace wellness',
              ].map((goal) => {
                const selected = prefs.goals.includes(goal);
                return (
                  <button
                    key={goal}
                    onClick={() => toggleGoal(goal)}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border text-xs text-left transition ${
                      selected
                        ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-stone-50/30 text-stone-700'
                    }`}
                  >
                    <span>{goal}</span>
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        selected
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-stone-300'
                      }`}
                    >
                      {selected && <Check className="w-3 h-3 stroke-3" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Preferred Break Duration & Frequency */}
        {step === 3 && (
          <div className="space-y-5 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold text-stone-900">How long should your breaks be?</h3>
              <p className="text-xs text-stone-500 mt-1">
                Short micro-breaks maintain your focus while protecting your posture.
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2.5">
              {[
                { min: 1, label: '1 min', desc: 'Bite-sized' },
                { min: 2, label: '2 min', desc: 'Recommended' },
                { min: 5, label: '5 min', desc: 'Deep reset' },
                { min: 10, label: '10 min', desc: 'Walk & stretch' },
              ].map((dur) => (
                <button
                  key={dur.min}
                  onClick={() =>
                    setPrefs((prev) => ({ ...prev, preferredBreakDuration: dur.min }))
                  }
                  className={`p-3 rounded-2xl border text-center transition flex flex-col items-center ${
                    prefs.preferredBreakDuration === dur.min
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-950 font-semibold ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  <span className="text-base font-bold">{dur.label}</span>
                  <span className="text-[10px] text-stone-500 mt-0.5">{dur.desc}</span>
                </button>
              ))}
            </div>

            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-stone-700">
                Recommended break frequency:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 50, 60].map((interval) => (
                  <button
                    key={interval}
                    onClick={() =>
                      setPrefs((prev) => ({ ...prev, breakIntervalMinutes: interval }))
                    }
                    className={`py-2 px-1 text-xs rounded-xl border text-center transition font-medium ${
                      prefs.breakIntervalMinutes === interval
                        ? 'border-emerald-600 bg-emerald-600 text-white font-semibold'
                        : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                    }`}
                  >
                    Every {interval}m
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer controls */}
        <div className="flex items-center justify-between pt-4 border-t border-stone-100">
          {step > 1 ? (
            <button
              onClick={() => setStep((s) => s - 1)}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 transition"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-5 rounded-xl transition shadow-xs active:scale-95"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 px-6 rounded-xl transition shadow-md hover:shadow-lg active:scale-95"
            >
              <span>Start My Wellness Plan</span>
              <Sparkles className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
