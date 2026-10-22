'use client';

import React from 'react';

interface SnaporiaLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
  theme?: 'dark' | 'light' | 'brand';
}

export const SnaporiaLogo: React.FC<SnaporiaLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  theme = 'light',
}) => {
  const sizeConfig = {
    sm: { glyph: 'text-base', text: 'text-lg', badge: 'px-2 py-0.5' },
    md: { glyph: 'text-lg', text: 'text-xl', badge: 'px-2.5 py-1' },
    lg: { glyph: 'text-2xl', text: 'text-3xl', badge: 'px-3 py-1.5' },
  };

  const current = sizeConfig[size];

  // Theme styling
  const isBrand = theme === 'brand';
  const isDark = theme === 'dark';

  return (
    <div className={`inline-flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Neo-brutalist glyph badge */}
      <span
        className={`inline-flex items-center justify-center font-black rounded-lg border-2 border-ink shadow-[2px_2px_0_#0e0b1f] transition-transform duration-150 group-hover:rotate-12 ${
          isBrand ? 'bg-lime text-ink' : 'bg-brand text-white'
        } ${current.badge}`}
      >
        <span className={current.glyph}>✦</span>
      </span>

      {/* Headline display wordmark */}
      {showText && (
        <span
          className={`font-display tracking-tight leading-none uppercase ${current.text} ${
            isBrand ? 'text-white' : isDark ? 'text-white' : 'text-ink'
          }`}
        >
          SNAPORIA<span className="accent text-lime text-[1.1em] font-normal lowercase">.booth</span>
        </span>
      )}
    </div>
  );
};
