import { useState, useEffect, useCallback } from 'react';
import { loadUserPreferences } from '../utils/storage';

export function useSittingTimer() {
  // Initialize at 54 minutes (3240 seconds) to match the prompt's authentic state
  const [sittingSeconds, setSittingSeconds] = useState<number>(() => {
    return 54 * 60;
  });
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [standingMode, setStandingMode] = useState<boolean>(false);

  useEffect(() => {
    if (isPaused || standingMode) return;

    const interval = setInterval(() => {
      setSittingSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPaused, standingMode]);

  // Request browser notification permission if desired
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const perm = await Notification.requestPermission();
      return perm === 'granted';
    }
    return false;
  }, []);

  const sendNotification = useCallback((title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(title, {
          body,
          icon: '/icon.svg',
          badge: '/pwa-192x192.png',
        });
      } catch (e) {
        console.warn('Notification display failed:', e);
      }
    }
  }, []);

  const resetSittingTimer = useCallback(() => {
    setSittingSeconds(0);
  }, []);

  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev);
  }, []);

  const toggleStandingMode = useCallback(() => {
    setStandingMode((prev) => !prev);
  }, []);

  const sittingMinutes = Math.floor(sittingSeconds / 60);

  return {
    sittingSeconds,
    sittingMinutes,
    isPaused,
    standingMode,
    togglePause,
    toggleStandingMode,
    resetSittingTimer,
    requestNotificationPermission,
    sendNotification,
  };
}
