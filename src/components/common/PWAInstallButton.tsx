import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share, X, Sparkles, Smartphone } from 'lucide-react';

interface Props {
  variant?: 'compact' | 'prominent';
  className?: string;
}

export const PWAInstallButton: React.FC<Props> = ({ variant = 'compact', className = '' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already installed as standalone PWA, hide install trigger
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    if (variant === 'prominent') {
      return (
        <div className={`bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-2xl p-5 shadow-lg border border-emerald-700/40 ${className}`}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-700/80 flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5 text-emerald-200" />
              </div>
              <div>
                <h4 className="font-semibold text-white text-base">Install DeskMate on your computer</h4>
                <p className="text-xs text-emerald-100/90 mt-0.5">
                  Get seamless desk micro-break reminders right on your desktop or phone dock.
                </p>
              </div>
            </div>
            <button
              onClick={install}
              className="shrink-0 flex items-center gap-2 bg-emerald-400 hover:bg-emerald-300 text-emerald-950 font-semibold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Download className="w-4 h-4" />
              Install App
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={install}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition active:scale-95 shadow-xs ${className}`}
        title="Install DeskMate as desktop or mobile app"
      >
        <Download className="w-3.5 h-3.5 text-emerald-700" />
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-stone-100 text-stone-700 hover:bg-stone-200 border border-stone-200 transition ${className}`}
          title="Install on iOS"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
          <span>Add to Home Screen</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-fadeIn">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-stone-100 text-stone-800">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <Smartphone className="w-4 h-4 text-emerald-800" />
                  </div>
                  <h3 className="text-base font-semibold text-stone-900">Install on iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-600">
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                    1
                  </span>
                  <p>
                    Tap the <strong className="text-stone-900 inline-flex items-center gap-1">Share <Share className="w-3.5 h-3.5 inline" /></strong> button in Safari's bottom toolbar.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                    2
                  </span>
                  <p>
                    Scroll down and select <strong className="text-stone-900">Add to Home Screen</strong>.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-xs font-bold text-emerald-800">
                    3
                  </span>
                  <p>
                    Tap <strong className="text-stone-900">Add</strong> in the top right to launch full-screen anytime.
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-6 w-full rounded-xl bg-stone-900 py-2.5 text-xs font-semibold text-white hover:bg-stone-800 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
