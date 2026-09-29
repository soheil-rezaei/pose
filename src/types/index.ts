export type ExerciseCategory =
  | 'Neck'
  | 'Shoulders'
  | 'Upper back'
  | 'Lower back'
  | 'Wrists'
  | 'Hips'
  | 'Legs'
  | 'Full body'
  | 'Eye relaxation'
  | 'Breathing';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  durationSeconds: number;
  difficulty: 'Gentle' | 'Moderate';
  targetArea: string;
  instructions: string[];
  safetyNote?: string;
  seated: boolean;
  illustrationType:
    | 'neck-tilt'
    | 'neck-rotation'
    | 'chin-tuck'
    | 'shoulder-roll'
    | 'chest-opener'
    | 'overhead-reach'
    | 'cat-cow'
    | 'spinal-twist'
    | 'wrist-stretch'
    | 'figure-four'
    | 'calf-raise'
    | 'eye-202020'
    | 'box-breathing'
    | 'standing-reset';
}

export interface PostureCheckResult {
  id: string;
  timestamp: string;
  score: number; // 0 - 100
  headPosition: 'aligned' | 'slight_forward' | 'forward_lean';
  shoulderSymmetry: 'balanced' | 'slight_tilt' | 'uneven';
  distanceQuality: 'optimal' | 'too_close' | 'too_far';
  recommendations: string[];
}

export interface UserPreferences {
  name: string;
  workdayType: 'mostly_sitting' | 'mix_sitting_standing' | 'mostly_standing';
  deskHours: number; // e.g. 4, 6, 8, 10
  goals: string[]; // 'Better posture', 'More movement', 'Neck/shoulder mobility', etc.
  preferredBreakDuration: number; // minutes: 1, 2, 5, 10
  breakIntervalMinutes: number; // minutes: 30, 45, 50, 60
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  quietHoursStart: string; // "18:00"
  quietHoursEnd: string; // "08:30"
  hasCompletedOnboarding: boolean;
}

export interface DailyStats {
  date: string; // YYYY-MM-DD
  sittingMinutes: number;
  movementMinutes: number;
  breaksTaken: number;
  breakGoal: number;
  postureChecks: number;
  exerciseMinutes: number;
  movementScore: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  actions?: Array<{
    label: string;
    actionType: 'start_break' | 'open_exercise' | 'check_posture' | 'prompt';
    payload?: any;
  }>;
}
