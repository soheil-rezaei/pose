import React, { useState, useEffect, useRef } from 'react';
import { Exercise } from '../../types';
import { ExerciseIllustration } from '../common/ExerciseIllustration';
import { soundManager } from '../../utils/audio';
import { recordCompletedBreak } from '../../utils/storage';
import confetti from 'canvas-confetti';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  X,
  Volume2,
  VolumeX,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Smile,
  ShieldCheck,
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  exercises: Exercise[];
  routineTitle?: string;
  onClose: () => void;
  onComplete: () => void;
}

export const MicroBreakModal: React.FC<Props> = ({
  isOpen,
  exercises,
  routineTitle = '2-Minute Desk Reset',
  onClose,
  onComplete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [soundOn, setSoundOn] = useState(soundManager.isEnabled());
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedbackGiven, setFeedbackGiven] = useState<string | null>(null);

  const currentExercise = exercises[currentIndex] || exercises[0];
  const [timeLeft, setTimeLeft] = useState<number>(() => currentExercise?.durationSeconds || 30);

  // Sync time left when changing exercise
  useEffect(() => {
    if (currentExercise) {
      setTimeLeft(currentExercise.durationSeconds);
      setIsPlaying(true);
    }
  }, [currentIndex, currentExercise]);

  // Audio start chime on initial open
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsCompleted(false);
      setFeedbackGiven(null);
      soundManager.playStartChime();
    }
  }, [isOpen]);

  // Timer loop
  useEffect(() => {
    if (!isOpen || isCompleted || !isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Advance to next exercise or finish
          if (currentIndex < exercises.length - 1) {
            soundManager.playAdvanceChime();
            setCurrentIndex((idx) => idx + 1);
            return exercises[currentIndex + 1].durationSeconds;
          } else {
            // All completed!
            clearInterval(timer);
            soundManager.playCompleteChime();
            setIsCompleted(true);
            const totalDurationMinutes = Math.max(
              1,
              Math.round(
                exercises.reduce((acc, curr) => acc + curr.durationSeconds, 0) / 60
              )
            );
            recordCompletedBreak(totalDurationMinutes);
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 },
                colors: ['#10B981', '#34D399', '#064E3B', '#F59E0B'],
              });
            } catch (e) {
              // canvas confetti safe ignore
            }
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, isCompleted, isPlaying, currentIndex, exercises]);

  if (!isOpen || !currentExercise) return null;

  const totalRoutineSeconds = exercises.reduce((acc, e) => acc + e.durationSeconds, 0);
  const currentElapsed =
    exercises.slice(0, currentIndex).reduce((acc, e) => acc + e.durationSeconds, 0) +
    (currentExercise.durationSeconds - timeLeft);
  const overallProgressPercent = Math.min(
    100,
    Math.round((currentElapsed / totalRoutineSeconds) * 100)
  );

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundManager.setEnabled(next);
  };

  const handleNext = () => {
    if (currentIndex < exercises.length - 1) {
      soundManager.playAdvanceChime();
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsCompleted(true);
      soundManager.playCompleteChime();
      recordCompletedBreak(Math.max(1, Math.round(totalRoutineSeconds / 60)));
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-900/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl rounded-3xl bg-white shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/80">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                Micro-Break Session
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900 mt-0.5">{routineTitle}</h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleSound}
              className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-200/60 transition"
              title={soundOn ? 'Mute sound' : 'Enable sound'}
            >
              {soundOn ? <Volume2 className="w-4 h-4 text-emerald-700" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
              title="Close session"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Routine Progress Bar */}
        <div className="w-full bg-stone-100 h-1.5 overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-300 ease-out"
            style={{ width: `${overallProgressPercent}%` }}
          />
        </div>

        {/* Main Body */}
        {!isCompleted ? (
          <div className="p-6 overflow-y-auto space-y-6">
            {/* Step Counter Indicator */}
            <div className="flex items-center justify-between text-xs font-medium text-stone-500">
              <span>
                Exercise <strong className="text-stone-800">{currentIndex + 1}</strong> of {exercises.length}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 text-[11px] font-semibold">
                {currentExercise.seated ? '🪑 Seated' : '🧍 Standing'} • {currentExercise.targetArea}
              </span>
            </div>

            {/* Visual Illustration & Big Countdown Timer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              <ExerciseIllustration
                type={currentExercise.illustrationType}
                className="w-full h-44 shadow-inner"
              />

              <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-emerald-50/70 border border-emerald-100/60 text-center">
                <div className="relative flex items-center justify-center">
                  <div className="text-5xl font-extrabold text-emerald-950 font-mono tracking-tight">
                    {timeLeft}
                    <span className="text-lg font-normal text-emerald-700 ml-1">s</span>
                  </div>
                </div>

                <p className="text-xs font-medium text-emerald-800 mt-2">
                  {isPlaying ? 'Breathe deeply and gently hold' : 'Paused — take your time'}
                </p>

                {/* Micro play/pause pill */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-xs active:scale-95"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-3 h-3" /> Pause
                    </>
                  ) : (
                    <>
                      <Play className="w-3 h-3 fill-white" /> Resume
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Exercise Title and Step Instructions */}
            <div className="space-y-3">
              <div>
                <h4 className="text-lg font-bold text-stone-900">{currentExercise.name}</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  Follow along smoothly. Keep your breathing gentle and relaxed.
                </p>
              </div>

              <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/60 space-y-2">
                {currentExercise.instructions.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-700 leading-relaxed">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800 mt-0.5">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>

              {currentExercise.safetyNote && (
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/60 text-[11px] text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
                  <span>{currentExercise.safetyNote}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Completion Screen */
          <div className="p-8 text-center space-y-6 my-auto">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-100 flex items-center justify-center text-emerald-700 shadow-inner animate-gentle-pulse">
              <Sparkles className="w-8 h-8" />
            </div>

            <div className="space-y-2 max-w-sm mx-auto">
              <h3 className="text-2xl font-bold text-stone-900">Micro-Break Completed!</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Wonderful job taking care of your body. Your daily movement score has increased, and your muscles are primed for comfort.
              </p>
            </div>

            {/* Post-Break Feeling Check-in */}
            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 max-w-sm mx-auto text-left">
              <p className="text-xs font-semibold text-stone-700 mb-2">How does your body feel now?</p>
              <div className="grid grid-cols-3 gap-2">
                {['Refreshed', 'More Relaxed', 'Ready to Focus'].map((feeling) => (
                  <button
                    key={feeling}
                    onClick={() => setFeedbackGiven(feeling)}
                    className={`px-2 py-2 rounded-xl text-xs font-medium text-center border transition ${
                      feedbackGiven === feeling
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {feeling}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onComplete();
                onClose();
              }}
              className="w-full max-w-xs mx-auto flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-2xl transition shadow-md hover:shadow-lg active:scale-98"
            >
              <span>Back to Workday</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Bottom Navigation Toolbar during exercise */}
        {!isCompleted && (
          <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-800 disabled:opacity-30 disabled:pointer-events-none transition"
            >
              <SkipBack className="w-3.5 h-3.5" /> Previous
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs active:scale-95"
            >
              <span>{currentIndex === exercises.length - 1 ? 'Finish Routine' : 'Next Movement'}</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
