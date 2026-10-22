'use client';

import React, { useState, useEffect } from 'react';
import { isSfxEnabled, setSfxEnabled, playClickSound } from '@/lib/sfx';

interface SfxToggleProps {
  className?: string;
  variant?: 'pill' | 'compact';
}

export const SfxToggle: React.FC<SfxToggleProps> = ({ className = '', variant = 'pill' }) => {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    setEnabled(isSfxEnabled());
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    setEnabled(next);
    setSfxEnabled(next);
    if (next) {
      playClickSound();
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={`Toggle sound effects, currently ${enabled ? 'ON' : 'OFF'}`}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 border-ink text-xs font-mono font-bold uppercase tracking-wider transition-all cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 ${
        enabled
          ? 'bg-lime text-ink shadow-[2px_2px_0_#0e0b1f]'
          : 'bg-white/80 text-muted border-dashed shadow-none'
      } ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${enabled ? 'bg-ink animate-pulse' : 'bg-muted'}`} />
      <span>{enabled ? 'SFX ON' : 'SFX OFF'}</span>
    </button>
  );
};
