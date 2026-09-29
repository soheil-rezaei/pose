import { DailyStats, PostureCheckResult, UserPreferences, ChatMessage } from '../types';

const STORAGE_KEYS = {
  PREFERENCES: 'deskmate_prefs',
  DAILY_STATS: 'deskmate_daily_stats',
  POSTURE_HISTORY: 'deskmate_posture_history',
  CHAT_HISTORY: 'deskmate_chat_history',
  SITTING_SESSION: 'deskmate_sitting_session',
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  name: 'Alex',
  workdayType: 'mostly_sitting',
  deskHours: 8,
  goals: ['Better posture', 'More movement', 'Neck/shoulder mobility', 'Reduce sitting'],
  preferredBreakDuration: 2,
  breakIntervalMinutes: 50,
  soundEnabled: true,
  notificationsEnabled: true,
  quietHoursStart: '18:30',
  quietHoursEnd: '08:30',
  hasCompletedOnboarding: true, // true by default so demo is immediate, but user can re-trigger anytime
};

export function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export const DEFAULT_DAILY_STATS: DailyStats = {
  date: getTodayDateString(),
  sittingMinutes: 342, // 5h 42m demo baseline
  movementMinutes: 34,
  breaksTaken: 6,
  breakGoal: 8,
  postureChecks: 3,
  exerciseMinutes: 18,
  movementScore: 82, // 82 / 100
};

export function loadUserPreferences(): UserPreferences {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
    if (raw) return { ...DEFAULT_PREFERENCES, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading preferences:', e);
  }
  return DEFAULT_PREFERENCES;
}

export function saveUserPreferences(prefs: UserPreferences): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(prefs));
  } catch (e) {
    console.error('Error saving preferences:', e);
  }
}

export function loadDailyStats(): DailyStats {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_STATS);
    if (raw) {
      const parsed: DailyStats = JSON.parse(raw);
      if (parsed.date === getTodayDateString()) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error loading daily stats:', e);
  }
  return { ...DEFAULT_DAILY_STATS, date: getTodayDateString() };
}

export function saveDailyStats(stats: DailyStats): void {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_STATS, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving daily stats:', e);
  }
}

export function calculateMovementScore(stats: DailyStats, prefs: UserPreferences): number {
  // Score formula (0-100):
  // 1. Break completion (max 40 pts): breaksTaken / breakGoal * 40
  // 2. Active movement minutes (max 30 pts): min(30, (movementMinutes / 40) * 30)
  // 3. Posture checks completed (max 15 pts): min(15, postureChecks * 5)
  // 4. Sitting moderation (max 15 pts): sitting balance
  const breakRatio = Math.min(1.2, stats.breaksTaken / Math.max(1, stats.breakGoal));
  const breakPts = Math.round(breakRatio * 38);

  const activeRatio = Math.min(1, stats.movementMinutes / 35);
  const activePts = Math.round(activeRatio * 32);

  const posturePts = Math.min(15, stats.postureChecks * 5);

  // Bonus for sitting moderation
  const sittingBonus = stats.sittingMinutes < 420 ? 15 : 10;

  const total = Math.min(100, Math.max(20, breakPts + activePts + posturePts + sittingBonus));
  return total;
}

export function recordCompletedBreak(durationMinutes: number): DailyStats {
  const current = loadDailyStats();
  const prefs = loadUserPreferences();

  const updated: DailyStats = {
    ...current,
    breaksTaken: current.breaksTaken + 1,
    movementMinutes: current.movementMinutes + durationMinutes,
    exerciseMinutes: current.exerciseMinutes + durationMinutes,
  };

  updated.movementScore = calculateMovementScore(updated, prefs);
  saveDailyStats(updated);
  return updated;
}

export function recordPostureCheck(score: number): DailyStats {
  const current = loadDailyStats();
  const prefs = loadUserPreferences();

  const updated: DailyStats = {
    ...current,
    postureChecks: current.postureChecks + 1,
  };

  updated.movementScore = calculateMovementScore(updated, prefs);
  saveDailyStats(updated);
  return updated;
}

export function loadPostureHistory(): PostureCheckResult[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.POSTURE_HISTORY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading posture history:', e);
  }
  // Realistic initial demo records
  return [
    {
      id: 'p-1',
      timestamp: 'Today at 09:15 AM',
      score: 86,
      headPosition: 'aligned',
      shoulderSymmetry: 'balanced',
      distanceQuality: 'optimal',
      recommendations: ['Great alignment! Keep monitor top at eye level.'],
    },
    {
      id: 'p-2',
      timestamp: 'Today at 11:30 AM',
      score: 72,
      headPosition: 'slight_forward',
      shoulderSymmetry: 'balanced',
      distanceQuality: 'optimal',
      recommendations: ['Head leaning slightly forward. Bring screen 2 inches closer.'],
    },
    {
      id: 'p-3',
      timestamp: 'Yesterday at 03:45 PM',
      score: 68,
      headPosition: 'slight_forward',
      shoulderSymmetry: 'slight_tilt',
      distanceQuality: 'too_close',
      recommendations: ['Relax right shoulder down away from ear.', 'Perform 5 slow chin tucks.'],
    },
  ];
}

export function savePostureHistory(history: PostureCheckResult[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.POSTURE_HISTORY, JSON.stringify(history));
  } catch (e) {
    console.error('Error saving posture history:', e);
  }
}

export function clearAllLocalData(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.PREFERENCES);
    localStorage.removeItem(STORAGE_KEYS.DAILY_STATS);
    localStorage.removeItem(STORAGE_KEYS.POSTURE_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.CHAT_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.SITTING_SESSION);
  } catch (e) {
    console.error('Error clearing data:', e);
  }
}
