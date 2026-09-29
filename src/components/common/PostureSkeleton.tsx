import React from 'react';

interface Props {
  status?: 'aligned' | 'forward_lean' | 'slight_tilt';
  view?: 'side' | 'front';
  showGuides?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const PostureSkeleton: React.FC<Props> = ({
  status = 'aligned',
  view = 'side',
  showGuides = true,
  className = '',
  size = 'md',
}) => {
  const isAligned = status === 'aligned';
  const isForward = status === 'forward_lean';
  const isTilt = status === 'slight_tilt';

  // Dimensions based on size
  const heightMap = { sm: 160, md: 240, lg: 320 };
  const widthMap = { sm: 180, md: 260, lg: 340 };
  const width = widthMap[size];
  const height = heightMap[size];

  // Colors
  const spineColor = isAligned ? '#059669' : isForward ? '#d97706' : '#ea580c';
  const headColor = isAligned ? '#10b981' : isForward ? '#f59e0b' : '#f97316';
  const jointColor = isAligned ? '#34d399' : '#fbbf24';

  if (view === 'side') {
    // Side profile showing head-over-shoulder cervical spine curvature
    // Forward lean moves head from x=120 to x=150
    const headX = isForward ? 148 : 120;
    const headY = isForward ? 70 : 60;
    const neckCtrlX = isForward ? 140 : 120;

    return (
      <div className={`relative flex items-center justify-center ${className}`}>
        <svg
          viewBox="0 0 260 260"
          className="w-full h-auto max-w-[280px] drop-shadow-sm select-none"
        >
          {/* Ergonomic Screen Guide */}
          {showGuides && (
            <g opacity="0.45">
              {/* Eye level horizon line */}
              <line
                x1="20"
                y1={headY}
                x2="240"
                y2={headY}
                stroke="#64748b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
              />
              <text x="25" y={headY - 6} fill="#64748b" fontSize="9" fontWeight="500">
                Eye Level Horizon
              </text>

              {/* Monitor position representation */}
              <rect x="200" y="45" width="8" height="65" rx="3" fill="#94a3b8" />
              <rect x="202" y="110" width="4" height="25" fill="#94a3b8" />
              <rect x="195" y="135" width="22" height="4" rx="2" fill="#94a3b8" />

              {/* Desk Surface */}
              <line x1="90" y1="170" x2="240" y2="170" stroke="#cbd5e1" strokeWidth="2.5" />
              <text x="175" y="185" fill="#94a3b8" fontSize="8">
                Desk Height
              </text>
            </g>
          )}

          {/* Chair silhouette */}
          <path
            d="M 65 100 L 72 200 L 140 200"
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <line x1="85" y1="200" x2="85" y2="245" stroke="#cbd5e1" strokeWidth="4" />
          <line x1="60" y1="245" x2="110" y2="245" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />

          {/* Pelvis / Hip base */}
          <circle cx="100" cy="195" r="9" fill={jointColor} />

          {/* Spine Curve */}
          {/* Thoracic to cervical */}
          <path
            d={`M 100 195 C 88 155, ${isForward ? '102' : '92'} 120, 115 105 S ${neckCtrlX} 82, ${headX} ${headY + 14}`}
            fill="none"
            stroke={spineColor}
            strokeWidth="5.5"
            strokeLinecap="round"
          />

          {/* Shoulder Joint */}
          <circle cx="115" cy="108" r="7" fill={jointColor} />

          {/* Arm resting at 90 degrees */}
          <path
            d="M 115 108 L 135 150 L 180 166"
            fill="none"
            stroke={isAligned ? '#6ee7b7' : '#fde047'}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <circle cx="135" cy="150" r="5" fill={jointColor} />
          <circle cx="180" cy="166" r="4" fill={jointColor} />

          {/* Skull / Head */}
          <circle
            cx={headX}
            cy={headY}
            r="20"
            fill={headColor}
            className="transition-all duration-700 ease-out"
          />
          {/* Eye gaze direction indicator */}
          <circle cx={headX + 11} cy={headY - 2} r="3" fill="#ffffff" />
          <circle cx={headX + 12} cy={headY - 2} r="1.5" fill="#0f172a" />

          {/* Forward lean warning arc or checkmark */}
          {isForward && (
            <g>
              <line x1="115" y1="108" x2="115" y2="50" stroke="#f87171" strokeWidth="1.5" strokeDasharray="3 3" />
              <path
                d="M 115 65 A 30 30 0 0 1 140 68"
                fill="none"
                stroke="#ef4444"
                strokeWidth="2"
              />
              <text x="145" y="48" fill="#b91c1c" fontSize="8.5" fontWeight="600">
                +18° Lean
              </text>
            </g>
          )}

          {isAligned && (
            <g>
              <line x1="115" y1="108" x2="115" y2="50" stroke="#10b981" strokeWidth="1.5" strokeDasharray="2 2" />
              <text x="125" y="46" fill="#047857" fontSize="8.5" fontWeight="600">
                Aligned Axis
              </text>
            </g>
          )}

          {/* Thigh / Knee */}
          <path
            d="M 100 195 L 155 195 L 155 245"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          <circle cx="155" cy="195" r="5.5" fill="#cbd5e1" />
          <circle cx="155" cy="245" r="4" fill="#cbd5e1" />
        </svg>
      </div>
    );
  }

  // Front profile showing shoulder symmetry & neck balance
  const leftShoulderY = isTilt ? 116 : 110;
  const rightShoulderY = isTilt ? 104 : 110;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg viewBox="0 0 260 260" className="w-full h-auto max-w-[280px] drop-shadow-sm select-none">
        {/* Shoulder Horizontal Reference Guide */}
        {showGuides && (
          <g opacity="0.5">
            <line x1="30" y1="110" x2="230" y2="110" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 4" />
            <text x="35" y="103" fill="#64748b" fontSize="8.5">
              Neutral Shoulder Plane
            </text>
          </g>
        )}

        {/* Head */}
        <circle cx="130" cy="62" r="22" fill={headColor} />
        {/* Eyes */}
        <circle cx="122" cy="60" r="2.5" fill="#ffffff" />
        <circle cx="138" cy="60" r="2.5" fill="#ffffff" />

        {/* Neck */}
        <line x1="130" y1="84" x2="130" y2="105" stroke={spineColor} strokeWidth="5" strokeLinecap="round" />

        {/* Collarbone / Shoulder Line */}
        <path
          d={`M 75 ${leftShoulderY} Q 130 108 185 ${rightShoulderY}`}
          fill="none"
          stroke={spineColor}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="75" cy={leftShoulderY} r="7" fill={jointColor} />
        <circle cx="185" cy={rightShoulderY} r="7" fill={jointColor} />

        {/* Arms dropping down */}
        <path d={`M 75 ${leftShoulderY} L 65 170`} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
        <path d={`M 185 ${rightShoulderY} L 195 170`} stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />

        {/* Central Vertical Spine */}
        <line x1="130" y1="108" x2="130" y2="200" stroke={spineColor} strokeWidth="5" strokeLinecap="round" />

        {/* Pelvis */}
        <line x1="100" y1="200" x2="160" y2="200" stroke="#64748b" strokeWidth="6" strokeLinecap="round" />
        <circle cx="100" cy="200" r="6" fill={jointColor} />
        <circle cx="160" cy="200" r="6" fill={jointColor} />

        {isTilt && (
          <text x="60" y="140" fill="#ea580c" fontSize="9" fontWeight="600">
            Right Shoulder Elevated
          </text>
        )}
      </svg>
    </div>
  );
};
