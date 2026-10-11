'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, RotateCcw, X } from 'lucide-react';
import { SnaporiaLogo } from '@/components/SnaporiaLogo';

interface HeaderStepperProps {
  step: 'setup' | 'capturing' | 'result';
  onGoToStep?: (step: 'setup' | 'capturing' | 'result') => void;
  onBackToTemplates?: () => void;
  onResetSession?: () => void;
  canViewResult?: boolean;
}

export const HeaderStepper: React.FC<HeaderStepperProps> = ({
  step,
  onGoToStep,
  onBackToTemplates,
  onResetSession,
  canViewResult = false,
}) => {
  return (
    <header className="w-full border-b sticky top-0 z-40 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between"
      style={{ background: 'rgba(10, 10, 10, 0.85)', borderColor: 'var(--border)' }}>
      {/* Brand Logo */}
      <div className="flex items-center gap-4">
        {step === 'capturing' && onBackToTemplates && (
          <button
            onClick={onBackToTemplates}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <ChevronLeft size={16} /> Ganti template
          </button>
        )}
        {(step === 'setup' || step === 'result') && (
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <SnaporiaLogo size="sm" />
          </Link>
        )}
      </div>

      {/* Center Stepper Pills */}
      <nav aria-label="Langkah alur" className="flex items-center gap-2 text-xs font-semibold">
        <button
          onClick={() => onGoToStep?.('setup')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
            step === 'setup'
              ? 'text-white shadow-sm font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={{ background: step === 'setup' ? 'var(--primary)' : 'transparent' }}
        >
          <span>1. Template</span>
        </button>

        <span className="text-neutral-500 text-xs">→</span>

        <button
          onClick={() => onGoToStep?.('capturing')}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
            step === 'capturing'
              ? 'text-white shadow-sm font-bold'
              : 'text-muted-foreground hover:text-foreground'
          }`}
          style={{ background: step === 'capturing' ? 'var(--primary)' : 'transparent' }}
        >
          <span>2. Foto (Kamera)</span>
        </button>

        <span className="text-neutral-500 text-xs">→</span>

        <button
          onClick={() => canViewResult && onGoToStep?.('result')}
          disabled={!canViewResult}
          className={`px-3.5 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
            step === 'result'
              ? 'text-white shadow-sm font-bold cursor-pointer'
              : canViewResult
              ? 'text-muted-foreground hover:text-foreground cursor-pointer'
              : 'text-muted-foreground/40 cursor-not-allowed'
          }`}
          style={{ background: step === 'result' ? 'var(--primary)' : 'transparent' }}
        >
          <span>3. Hasil</span>
        </button>
      </nav>

      {/* Right Action */}
      <div className="flex items-center gap-3">
        {step === 'setup' && (
          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition"
          >
            <X size={14} /> Keluar
          </Link>
        )}
        {step === 'capturing' && (
          <button
            onClick={onBackToTemplates}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground hover:text-foreground transition cursor-pointer"
          >
            <X size={14} /> Batal
          </button>
        )}
        {step === 'result' && onResetSession && (
          <button
            onClick={onResetSession}
            className="px-3.5 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer hover:opacity-80"
            style={{ borderColor: 'var(--border)', background: 'var(--card)', color: 'var(--foreground)' }}
          >
            <RotateCcw size={13} /> Mulai lagi
          </button>
        )}
      </div>
    </header>
  );
};
