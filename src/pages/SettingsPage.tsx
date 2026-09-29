import React, { useState } from 'react';
import { UserPreferences } from '../types';
import { saveUserPreferences, clearAllLocalData } from '../utils/storage';
import { soundManager } from '../utils/audio';
import {
  Settings,
  Bell,
  Volume2,
  Shield,
  Sparkles,
  RotateCcw,
  Check,
  Download,
  Trash2,
  Clock,
  Briefcase,
  Sliders,
} from 'lucide-react';

interface Props {
  prefs: UserPreferences;
  onUpdatePrefs: (next: UserPreferences) => void;
  onRetakeOnboarding: () => void;
  onRequestNotifications: () => Promise<boolean>;
  onSendTestNotification: (title: string, body: string) => void;
}

export const SettingsPage: React.FC<Props> = ({
  prefs,
  onUpdatePrefs,
  onRetakeOnboarding,
  onRequestNotifications,
  onSendTestNotification,
}) => {
  const [form, setForm] = useState<UserPreferences>(prefs);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [notificationTestStatus, setNotificationTestStatus] = useState<string | null>(null);

  const handleSave = () => {
    saveUserPreferences(form);
    soundManager.setEnabled(form.soundEnabled);
    onUpdatePrefs(form);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleTestNotification = async () => {
    const granted = await onRequestNotifications();
    if (granted) {
      onSendTestNotification(
        'Time for a gentle reset?',
        'Your shoulders and neck could use a quick 2-minute stretch.'
      );
      setNotificationTestStatus('Test notification triggered!');
    } else {
      setNotificationTestStatus('Notification permission not enabled in browser.');
    }
    setTimeout(() => setNotificationTestStatus(null), 3000);
  };

  const handleExportData = () => {
    const data = {
      preferences: form,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deskmate-wellness-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleResetData = () => {
    if (window.confirm('Reset all local posture logs and custom preferences?')) {
      clearAllLocalData();
      window.location.reload();
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-800 text-xs font-bold tracking-wide uppercase">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Preferences & Privacy</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mt-1">
            Settings & Profile
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Configure your workday break rhythms, audio chimes, notifications, and privacy options.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="self-start sm:self-auto flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-5 rounded-2xl shadow-xs transition active:scale-95"
        >
          {saveSuccess ? <Check className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
          <span>{saveSuccess ? 'Saved!' : 'Save Preferences'}</span>
        </button>
      </div>

      {/* 1. Profile & Workday Setup */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
          <Briefcase className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-stone-900">Workday Profile</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Display Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition text-stone-900"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-stone-700">Workday Style</label>
            <select
              value={form.workdayType}
              onChange={(e) =>
                setForm({
                  ...form,
                  workdayType: e.target.value as UserPreferences['workdayType'],
                })
              }
              className="w-full px-3.5 py-2.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition text-stone-900"
            >
              <option value="mostly_sitting">Mostly Sitting</option>
              <option value="mix_sitting_standing">Mix of Sitting & Standing</option>
              <option value="mostly_standing">Mostly Standing</option>
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-stone-700">Typical Desk Hours</label>
          <div className="grid grid-cols-4 gap-2">
            {[4, 6, 8, 10].map((hours) => (
              <button
                key={hours}
                type="button"
                onClick={() => setForm({ ...form, deskHours: hours })}
                className={`py-2 text-xs rounded-xl border text-center transition font-semibold ${
                  form.deskHours === hours
                    ? 'border-emerald-600 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-500/20'
                    : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                }`}
              >
                {hours === 10 ? '8+ hours' : `${hours} hours`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Micro-Break Rhythms & Preferences */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
          <Clock className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-stone-900">Micro-Break Rhythms</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700">
              Break Prompt Interval
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 50, 60].map((interval) => (
                <button
                  key={interval}
                  type="button"
                  onClick={() => setForm({ ...form, breakIntervalMinutes: interval })}
                  className={`py-2 text-xs rounded-xl border text-center transition font-semibold ${
                    form.breakIntervalMinutes === interval
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  {interval}m
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400">
              Ergonomists recommend 2 minutes of movement every 50 minutes.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-stone-700">
              Preferred Break Duration
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 5, 10].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setForm({ ...form, preferredBreakDuration: dur })}
                  className={`py-2 text-xs rounded-xl border text-center transition font-semibold ${
                    form.preferredBreakDuration === dur
                      ? 'border-emerald-600 bg-emerald-600 text-white'
                      : 'border-stone-200 hover:border-stone-300 bg-white text-stone-700'
                  }`}
                >
                  {dur} min
                </button>
              ))}
            </div>
            <p className="text-[11px] text-stone-400">
              The duration of recommended micro-routines.
            </p>
          </div>
        </div>

        {/* Quiet Hours */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Quiet Hours Start</label>
            <input
              type="time"
              value={form.quietHoursStart}
              onChange={(e) => setForm({ ...form, quietHoursStart: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-stone-700">Quiet Hours End</label>
            <input
              type="time"
              value={form.quietHoursEnd}
              onChange={(e) => setForm({ ...form, quietHoursEnd: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-800"
            />
          </div>
        </div>
      </div>

      {/* 3. Audio & Notifications Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
          <Bell className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-stone-900">Audio & Reminders</h3>
        </div>

        <div className="space-y-4">
          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-stone-900">Harmonic Audio Chimes</span>
              <p className="text-[11px] text-stone-500">
                Play gentle meditation bowl tones when starting, advancing, or completing micro-exercises.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setForm({ ...form, soundEnabled: !form.soundEnabled })}
              className={`w-12 h-6 flex items-center rounded-full p-1 transition duration-300 ${
                form.soundEnabled ? 'bg-emerald-600' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                  form.soundEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Browser Notifications */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/70">
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-stone-900">Browser Movement Reminders</span>
              <p className="text-[11px] text-stone-500">
                PWA notifications alert you quietly when it's time for a micro-break even if the app is in the background.
              </p>
            </div>

            <button
              type="button"
              onClick={handleTestNotification}
              className="shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-stone-100 border border-stone-200 text-xs font-semibold text-stone-700 transition active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-emerald-700" />
              <span>Send Test Alert</span>
            </button>
          </div>

          {notificationTestStatus && (
            <p className="text-xs text-emerald-700 font-semibold px-2 animate-fadeIn">
              {notificationTestStatus}
            </p>
          )}
        </div>
      </div>

      {/* 4. Privacy & Data Controls */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-stone-200/80 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-4 border-b border-stone-100">
          <Shield className="w-5 h-5 text-emerald-700" />
          <h3 className="text-base font-bold text-stone-900">Privacy & Data Storage</h3>
        </div>

        <p className="text-xs text-stone-600 leading-relaxed">
          DeskMate operates on a local-first philosophy. Your movement logs, posture scores, and custom break settings are stored strictly in your browser's local storage. Camera data never leaves your device.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="button"
            onClick={onRetakeOnboarding}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition active:scale-95"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-take Onboarding Quiz</span>
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export My Data</span>
          </button>

          <button
            type="button"
            onClick={handleResetData}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition active:scale-95 ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset Local Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
