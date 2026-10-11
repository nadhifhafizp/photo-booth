import React from 'react';

interface SnaporiaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

export const SnaporiaLogo: React.FC<SnaporiaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
}) => {
  const iconSizes = {
    sm: { box: 'w-7 h-7', svg: 28, text: 'text-lg', dot: 'text-sm' },
    md: { box: 'w-8 h-8', svg: 32, text: 'text-xl', dot: 'text-base' },
    lg: { box: 'w-10 h-10', svg: 40, text: 'text-2xl', dot: 'text-lg' },
  };

  const current = iconSizes[size];

  return (
    <div className={`inline-flex items-center gap-2.5 select-none ${className}`}>
      {/* ── Geometric Brandmark Icon ── */}
      <div className={`relative ${current.box} shrink-0 rounded-xl overflow-hidden flex items-center justify-center bg-gradient-to-br from-[#ff2e7e] to-[#e11d48] shadow-md border border-white/15`}>
        <svg
          width={current.svg}
          height={current.svg}
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full p-1"
        >
          {/* Outer photostrip frame contour */}
          <rect
            x="5"
            y="5"
            width="22"
            height="22"
            rx="5"
            stroke="white"
            strokeWidth="1.8"
            strokeOpacity="0.9"
          />
          {/* Overlapping offset frame hint (photobooth strip effect) */}
          <path
            d="M8 2.5H24C25.5 2.5 26.5 3.5 26.5 5"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeOpacity="0.45"
          />
          {/* Precision camera lens aperture circle */}
          <circle
            cx="16"
            cy="16"
            r="5.5"
            stroke="white"
            strokeWidth="1.8"
          />
          {/* Camera core pupil / shutter accent */}
          <circle
            cx="16"
            cy="16"
            r="2.2"
            fill="white"
          />
          {/* Flash sparkle dot (top right) */}
          <circle
            cx="21.5"
            cy="10.5"
            r="1.2"
            fill="white"
            fillOpacity="0.95"
          />
        </svg>
      </div>

      {/* ── Typographic Wordmark ── */}
      {showText && (
        <span className={`font-extrabold tracking-tight ${current.text} text-white leading-none`}>
          snaporia<span className="text-[#ff2e7e]">.</span>
        </span>
      )}
    </div>
  );
};
