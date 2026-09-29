/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navigation, NavTab } from './components/layout/Navigation';
import { Header } from './components/layout/Header';
import { TodayDashboard } from './pages/TodayDashboard';
import { PosturePage } from './pages/PosturePage';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage';
import { AICoachPage } from './pages/AICoachPage';
import { ProgressPage } from './pages/ProgressPage';
import { SettingsPage } from './pages/SettingsPage';
import { MicroBreakModal } from './components/break/MicroBreakModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { useSittingTimer } from './hooks/useSittingTimer';
import {
  loadDailyStats,
  loadUserPreferences,
  saveUserPreferences,
  saveDailyStats,
} from './utils/storage';
import { EXERCISES, PRESET_ROUTINES } from './data/exercises';
import { Exercise, ExerciseCategory } from './types';
import { soundManager } from './utils/audio';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('today');
  const [prefs, setPrefs] = useState(() => loadUserPreferences());
  const [stats, setStats] = useState(() => loadDailyStats());
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);

  // Micro-Break Player Modal state
  const [isBreakModalOpen, setIsBreakModalOpen] = useState(false);
  const [activeBreakExercises, setActiveBreakExercises] = useState<Exercise[]>([]);
  const [breakRoutineTitle, setBreakRoutineTitle] = useState('2-Minute Desk Reset');

  const {
    sittingSeconds,
    sittingMinutes,
    isPaused,
    standingMode,
    togglePause,
    toggleStandingMode,
    resetSittingTimer,
    requestNotificationPermission,
    sendNotification,
  } = useSittingTimer();

  // Register Service Worker for PWA
  useEffect(() => {
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('DeskMate ServiceWorker registered:', registration.scope);
          })
          .catch((error) => {
            console.log('DeskMate ServiceWorker registration failed:', error);
          });
      });
    }
  }, []);

  // Sync sound manager with preferences
  useEffect(() => {
    soundManager.setEnabled(prefs.soundEnabled);
  }, [prefs.soundEnabled]);

  // Launch a structured routine or dynamic 2-min break
  const handleStartBreak = useCallback((routineKey?: string) => {
    let exercisesToUse: Exercise[] = [];
    let title = '2-Minute Desk Reset';

    if (routineKey === 'neck-shoulders') {
      exercisesToUse = PRESET_ROUTINES.neckAndShoulders.exerciseIds
        .map((id) => EXERCISES.find((e) => e.id === id)!)
        .filter(Boolean);
      title = 'Neck & Shoulder Relief';
    } else if (routineKey === 'standing-energy') {
      exercisesToUse = PRESET_ROUTINES.standingEnergy.exerciseIds
        .map((id) => EXERCISES.find((e) => e.id === id)!)
        .filter(Boolean);
      title = 'Standing Energy Booster';
    } else if (routineKey === 'mindful-breather') {
      exercisesToUse = PRESET_ROUTINES.mindfulBreather.exerciseIds
        .map((id) => EXERCISES.find((e) => e.id === id)!)
        .filter(Boolean);
      title = 'Calm & Eye Reset';
    } else {
      exercisesToUse = PRESET_ROUTINES.quickReset.exerciseIds
        .map((id) => EXERCISES.find((e) => e.id === id)!)
        .filter(Boolean);
      title = '2-Minute Desk Reset';
    }

    setActiveBreakExercises(exercisesToUse);
    setBreakRoutineTitle(title);
    setIsBreakModalOpen(true);
  }, []);

  // Launch single exercise directly in the player
  const handleStartSingleExercise = useCallback((exercise: Exercise) => {
    setActiveBreakExercises([exercise]);
    setBreakRoutineTitle(exercise.name);
    setIsBreakModalOpen(true);
  }, []);

  // When a break is completed
  const handleBreakComplete = useCallback(() => {
    setStats(loadDailyStats());
    resetSittingTimer();
  }, [resetSittingTimer]);

  // When posture check is finished
  const handlePostureCheckCompleted = useCallback(() => {
    setStats(loadDailyStats());
  }, []);

  // Direct exercise navigation from posture page
  const handleNavigateToExercise = useCallback((category?: string) => {
    if (category) {
      setSelectedCategory(category as ExerciseCategory);
    }
    setCurrentTab('exercises');
  }, []);

  const handleToggleSound = useCallback(() => {
    const next = !prefs.soundEnabled;
    const nextPrefs = { ...prefs, soundEnabled: next };
    setPrefs(nextPrefs);
    saveUserPreferences(nextPrefs);
    soundManager.setEnabled(next);
  }, [prefs]);

  return (
    <div className="flex min-h-screen bg-stone-50 text-stone-800 font-sans selection:bg-emerald-100 selection:text-emerald-950">
      {/* Offline Status Badge */}
      <OfflineIndicator />

      {/* Navigation (Sidebar on desktop, bottom bar on mobile) */}
      <Navigation
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setSelectedCategory(null);
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        movementScore={stats.movementScore}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-16 md:pb-0">
        {/* Top Header */}
        <Header
          sittingMinutes={sittingMinutes}
          isPaused={isPaused}
          standingMode={standingMode}
          soundEnabled={prefs.soundEnabled}
          onTogglePause={togglePause}
          onToggleStanding={toggleStandingMode}
          onToggleSound={handleToggleSound}
          onStartBreak={() => handleStartBreak()}
        />

        {/* Routed Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {currentTab === 'today' && (
            <TodayDashboard
              stats={stats}
              prefs={prefs}
              sittingMinutes={sittingMinutes}
              onStartBreak={handleStartBreak}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'posture' && (
            <PosturePage
              onStartExercise={handleNavigateToExercise}
              onCheckCompleted={handlePostureCheckCompleted}
            />
          )}

          {currentTab === 'exercises' && (
            <ExerciseLibraryPage
              onStartSingleExercise={handleStartSingleExercise}
              onStartRoutine={handleStartBreak}
              selectedCategoryProp={selectedCategory}
            />
          )}

          {currentTab === 'coach' && (
            <AICoachPage
              stats={stats}
              prefs={prefs}
              sittingMinutes={sittingMinutes}
              onStartRoutine={handleStartBreak}
              onNavigateTab={(tab) => setCurrentTab(tab)}
            />
          )}

          {currentTab === 'progress' && (
            <ProgressPage
              stats={stats}
              prefs={prefs}
              onStartBreak={() => handleStartBreak()}
            />
          )}

          {currentTab === 'profile' && (
            <SettingsPage
              prefs={prefs}
              onUpdatePrefs={(next) => setPrefs(next)}
              onRetakeOnboarding={() => setIsOnboardingOpen(true)}
              onRequestNotifications={requestNotificationPermission}
              onSendTestNotification={sendNotification}
            />
          )}
        </main>
      </div>

      {/* Guided Micro-Break Session Modal Player */}
      <MicroBreakModal
        isOpen={isBreakModalOpen}
        exercises={activeBreakExercises}
        routineTitle={breakRoutineTitle}
        onClose={() => setIsBreakModalOpen(false)}
        onComplete={handleBreakComplete}
      />

      {/* Onboarding Flow Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        initialPrefs={prefs}
        onComplete={(next) => {
          setPrefs(next);
          setIsOnboardingOpen(false);
        }}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
}
