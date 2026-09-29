import { EXERCISES, PRESET_ROUTINES } from '../data/exercises';
import { Exercise } from '../types';

export interface RecommendationContext {
  sittingMinutes: number;
  breaksToday: number;
  userGoal?: string;
  discomfortArea?: string;
  timeAvailableMinutes?: number;
  energyLevel?: 'low' | 'moderate' | 'high';
}

export interface RecommendationResult {
  title: string;
  reason: string;
  durationMinutes: number;
  exercises: Exercise[];
  routineId?: string;
}

export function generateExerciseRecommendation(
  context: RecommendationContext
): RecommendationResult {
  const {
    sittingMinutes = 54,
    breaksToday = 0,
    discomfortArea = '',
    timeAvailableMinutes = 2,
    energyLevel = 'moderate',
  } = context;

  // Rule 1: Specific discomfort reported (e.g. Neck stiffness)
  if (discomfortArea.toLowerCase().includes('neck') || discomfortArea.toLowerCase().includes('cervical')) {
    const neckExercises = EXERCISES.filter((e) => e.category === 'Neck' || e.id === 'shoulder-rolls');
    return {
      title: 'Neck & Upper Spine Ease',
      reason: 'Targeted gentle mobility to relieve cervical tension from looking at screens.',
      durationMinutes: 2,
      exercises: neckExercises.slice(0, 3),
      routineId: 'neck-shoulders',
    };
  }

  // Rule 2: Shoulder or upper back tightness
  if (
    discomfortArea.toLowerCase().includes('shoulder') ||
    discomfortArea.toLowerCase().includes('upper back')
  ) {
    const shoulderExercises = EXERCISES.filter(
      (e) => e.category === 'Shoulders' || e.category === 'Upper back'
    );
    return {
      title: 'Shoulder & Chest Unwind',
      reason: 'Opens rounded shoulders and releases tension in the upper trapezius.',
      durationMinutes: 2,
      exercises: shoulderExercises.slice(0, 3),
      routineId: 'neck-shoulders',
    };
  }

  // Rule 3: Eye strain / digital fatigue
  if (discomfortArea.toLowerCase().includes('eye') || discomfortArea.toLowerCase().includes('headache')) {
    const eyeExercises = EXERCISES.filter(
      (e) => e.category === 'Eye relaxation' || e.category === 'Breathing'
    );
    return {
      title: 'Digital Eye & Nervous Reset',
      reason: 'Relaxes ciliary eye muscles and activates parasympathetic calm.',
      durationMinutes: 2,
      exercises: eyeExercises.slice(0, 2),
      routineId: 'mindful-breather',
    };
  }

  // Rule 4: Very quick break (< 2 minutes)
  if (timeAvailableMinutes <= 1) {
    const quickExercises = [
      EXERCISES.find((e) => e.id === 'chin-tuck')!,
      EXERCISES.find((e) => e.id === 'shoulder-rolls')!,
    ].filter(Boolean);
    return {
      title: '60-Second Micro-Reset',
      reason: 'A bite-sized alignment check to release tension without interrupting your workflow.',
      durationMinutes: 1,
      exercises: quickExercises,
    };
  }

  // Rule 5: User has already completed 5+ breaks today -> gentle restorative mobility or rest
  if (breaksToday >= 6) {
    const restorative = EXERCISES.filter(
      (e) => e.category === 'Breathing' || e.id === 'eye-202020'
    );
    return {
      title: 'Gentle Restorative Breath & Eye Care',
      reason: "Fantastic job on keeping active today! Here's a calming reset to recharge focus.",
      durationMinutes: 2,
      exercises: restorative.slice(0, 2),
      routineId: 'mindful-breather',
    };
  }

  // Rule 6: Prolonged sitting (> 50 minutes) or low energy -> standing movement booster
  if (sittingMinutes >= 50 || energyLevel === 'low') {
    const standingBoost = EXERCISES.filter((e) => !e.seated || e.id === 'shoulder-rolls');
    return {
      title: 'Standing Energy & Circulation Booster',
      reason: `You've been seated for ${sittingMinutes} min. Getting upright helps wake up leg veins and decompresses spinal discs.`,
      durationMinutes: 2,
      exercises: standingBoost.slice(0, 3),
      routineId: 'standing-energy',
    };
  }

  // Default: Standard balanced 2-minute desk reset
  const defaultList = [
    EXERCISES.find((e) => e.id === 'chin-tuck')!,
    EXERCISES.find((e) => e.id === 'shoulder-rolls')!,
    EXERCISES.find((e) => e.id === 'seated-cat-cow')!,
    EXERCISES.find((e) => e.id === 'eye-202020')!,
  ].filter(Boolean);

  return {
    title: 'Balanced 2-Minute Desk Reset',
    reason: 'The optimal combination of cervical alignment, shoulder release, and eye rest.',
    durationMinutes: 2,
    exercises: defaultList,
    routineId: 'quick-reset',
  };
}
