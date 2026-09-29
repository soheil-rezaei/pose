import React from 'react';
import { Exercise } from '../../types';

interface Props {
  type: Exercise['illustrationType'];
  className?: string;
}

export const ExerciseIllustration: React.FC<Props> = ({ type, className = '' }) => {
  return (
    <div className={`relative flex items-center justify-center p-4 rounded-2xl bg-stone-100/80 border border-stone-200/60 overflow-hidden ${className}`}>
      {type === 'chin-tuck' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="100" cy="80" r="28" fill="#10B981" />
          <path d="M 100 108 L 100 150" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
          {/* Arrow showing tuck motion */}
          <path d="M 130 80 L 100 80" stroke="#047857" strokeWidth="3" strokeDasharray="3 3" />
          <polygon points="98,80 105,76 105,84" fill="#047857" />
          <path d="M 70 150 Q 100 140 130 150" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
          <circle cx="118" cy="78" r="3.5" fill="#ffffff" />
        </svg>
      )}

      {type === 'neck-tilt' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="115" cy="85" r="26" fill="#10B981" transform="rotate(18, 100, 110)" />
          <path d="M 100 112 Q 105 130 100 150" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
          <path d="M 70 150 L 130 150" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
          {/* Gentle curved stretch wave */}
          <path d="M 72 90 Q 80 105 85 120" stroke="#34D399" strokeWidth="2.5" strokeDasharray="4 4" />
        </svg>
      )}

      {type === 'neck-rotation' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="100" cy="85" r="26" fill="#10B981" />
          <path d="M 100 111 L 100 155" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
          <path d="M 70 155 L 130 155" stroke="#047857" strokeWidth="6" strokeLinecap="round" />
          {/* Circular rotation arrow */}
          <path d="M 68 85 A 32 15 0 0 1 132 85" fill="none" stroke="#047857" strokeWidth="2.5" strokeDasharray="4 3" />
          <polygon points="134,85 128,81 128,89" fill="#047857" />
        </svg>
      )}

      {type === 'shoulder-roll' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="100" cy="70" r="22" fill="#10B981" />
          <line x1="100" y1="92" x2="100" y2="150" stroke="#059669" strokeWidth="5" />
          <path d="M 65 110 Q 100 100 135 110" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
          {/* Shoulder roll circular arrow */}
          <path d="M 60 110 A 14 14 0 1 1 65 96" fill="none" stroke="#047857" strokeWidth="3" />
          <polygon points="68,96 61,91 66,102" fill="#047857" />
          <path d="M 140 110 A 14 14 0 1 0 135 96" fill="none" stroke="#047857" strokeWidth="3" />
          <polygon points="132,96 139,91 134,102" fill="#047857" />
        </svg>
      )}

      {type === 'chest-opener' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="100" cy="70" r="22" fill="#10B981" />
          <path d="M 100 92 C 105 115 105 135 100 160" stroke="#059669" strokeWidth="5" />
          {/* Arms pulled back */}
          <path d="M 75 110 Q 100 135 125 110" stroke="#047857" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Expanding chest sun rays */}
          <circle cx="100" cy="115" r="14" fill="#34D399" opacity="0.3" className="animate-ping" />
          <line x1="90" y1="115" x2="110" y2="115" stroke="#047857" strokeWidth="2" />
        </svg>
      )}

      {type === 'overhead-reach' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="100" cy="80" r="20" fill="#10B981" />
          <line x1="100" y1="100" x2="100" y2="155" stroke="#059669" strokeWidth="5" />
          {/* Arms stretched overhead */}
          <path d="M 100 105 L 85 45 L 96 35" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
          <path d="M 100 105 L 115 45 L 104 35" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" />
          <circle cx="100" cy="35" r="5" fill="#34D399" />
          <line x1="90" y1="155" x2="90" y2="190" stroke="#64748B" strokeWidth="4" />
          <line x1="110" y1="155" x2="110" y2="190" stroke="#64748B" strokeWidth="4" />
        </svg>
      )}

      {type === 'cat-cow' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="130" cy="80" r="18" fill="#10B981" />
          {/* Arching cat spine */}
          <path d="M 70 120 C 85 85, 115 85, 130 110" stroke="#059669" strokeWidth="5.5" fill="none" strokeLinecap="round" />
          <line x1="70" y1="120" x2="70" y2="160" stroke="#64748B" strokeWidth="4" />
          <line x1="130" y1="110" x2="130" y2="160" stroke="#64748B" strokeWidth="4" />
          <path d="M 90 140 Q 100 130 110 140" stroke="#34D399" strokeWidth="2.5" fill="none" />
        </svg>
      )}

      {type === 'spinal-twist' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="100" cy="70" r="22" fill="#10B981" />
          <line x1="100" y1="92" x2="100" y2="155" stroke="#059669" strokeWidth="5" />
          {/* Twisted arms across torso */}
          <path d="M 80 115 L 115 110 L 130 135" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <path d="M 85 100 Q 100 108 115 100" stroke="#34D399" strokeWidth="2.5" fill="none" strokeDasharray="3 3" />
        </svg>
      )}

      {type === 'wrist-stretch' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          {/* Forearm extended with fingers pulled up */}
          <path d="M 45 115 L 110 115 L 110 85" stroke="#059669" strokeWidth="6" strokeLinecap="round" />
          <path d="M 125 75 L 110 85 L 125 95" stroke="#047857" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 100 70 A 20 20 0 0 1 125 90" fill="none" stroke="#34D399" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      )}

      {type === 'figure-four' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          <circle cx="100" cy="70" r="20" fill="#10B981" />
          <line x1="100" y1="90" x2="100" y2="140" stroke="#059669" strokeWidth="5" />
          {/* Crossed ankle over knee */}
          <path d="M 85 140 L 85 180" stroke="#64748B" strokeWidth="4.5" />
          <path d="M 115 140 L 75 140 L 85 155" stroke="#047857" strokeWidth="4.5" strokeLinecap="round" fill="none" />
        </svg>
      )}

      {type === 'calf-raise' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          {/* Calves up on toes */}
          <circle cx="100" cy="65" r="20" fill="#10B981" />
          <line x1="100" y1="85" x2="100" y2="135" stroke="#059669" strokeWidth="5" />
          <line x1="90" y1="135" x2="90" y2="175" stroke="#047857" strokeWidth="4.5" />
          <line x1="110" y1="135" x2="110" y2="175" stroke="#047857" strokeWidth="4.5" />
          {/* Raised heel angle */}
          <path d="M 90 175 L 98 185" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <path d="M 110 175 L 118 185" stroke="#047857" strokeWidth="4" strokeLinecap="round" />
          <line x1="75" y1="188" x2="135" y2="188" stroke="#94A3B8" strokeWidth="2" strokeDasharray="3 3" />
        </svg>
      )}

      {type === 'eye-202020' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          {/* Stylized eye with gazing horizon */}
          <path d="M 40 100 Q 100 50 160 100 Q 100 150 40 100 Z" fill="none" stroke="#059669" strokeWidth="4.5" />
          <circle cx="100" cy="100" r="22" fill="#10B981" />
          <circle cx="100" cy="100" r="10" fill="#064E3B" />
          <circle cx="104" cy="96" r="3.5" fill="#ffffff" />
          {/* Soft blinking ripple */}
          <circle cx="100" cy="100" r="36" stroke="#34D399" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.6" className="animate-spin" />
        </svg>
      )}

      {type === 'box-breathing' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          {/* Calm square box with expanding lungs */}
          <rect x="50" y="50" width="100" height="100" rx="16" fill="none" stroke="#047857" strokeWidth="3" />
          <circle cx="100" cy="100" r="30" fill="#34D399" opacity="0.4" className="animate-breathe" />
          <circle cx="100" cy="100" r="14" fill="#10B981" />
          <text x="100" y="40" textAnchor="middle" fill="#064E3B" fontSize="9" fontWeight="600">Inhale (4s)</text>
          <text x="165" y="103" textAnchor="start" fill="#064E3B" fontSize="9" fontWeight="600">Hold (4s)</text>
          <text x="100" y="165" textAnchor="middle" fill="#064E3B" fontSize="9" fontWeight="600">Exhale (4s)</text>
          <text x="35" y="103" textAnchor="end" fill="#064E3B" fontSize="9" fontWeight="600">Hold (4s)</text>
        </svg>
      )}

      {type === 'standing-reset' && (
        <svg viewBox="0 0 200 200" className="w-36 h-36">
          {/* Perfectly upright mountain pose */}
          <circle cx="100" cy="60" r="20" fill="#10B981" />
          <line x1="100" y1="80" x2="100" y2="140" stroke="#059669" strokeWidth="5" />
          <line x1="75" y1="95" x2="125" y2="95" stroke="#047857" strokeWidth="5" strokeLinecap="round" />
          <line x1="75" y1="95" x2="70" y2="135" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="125" y1="95" x2="130" y2="135" stroke="#64748B" strokeWidth="3.5" strokeLinecap="round" />
          <line x1="90" y1="140" x2="90" y2="185" stroke="#047857" strokeWidth="4.5" />
          <line x1="110" y1="140" x2="110" y2="185" stroke="#047857" strokeWidth="4.5" />
          <line x1="100" y1="35" x2="100" y2="15" stroke="#34D399" strokeWidth="2.5" strokeDasharray="3 3" />
        </svg>
      )}
    </div>
  );
};
