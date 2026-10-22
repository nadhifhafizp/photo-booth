'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, RotateCcw, X } from 'lucide-react';
import { SnaporiaLogo } from '@/components/SnaporiaLogo';
import { SfxToggle } from '@/components/SfxToggle';
import { playClickSound } from '@/lib/sfx';

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
    <header className="w-full border-b-[2.5px] border-ink sticky top-0 z-40 bg-paper/95 backdrop-blur-md px-4 md:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo / Back Button */}
      <div className="flex items-center gap-3">
        {step === 'capturing' && onBackToTemplates && (
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onBackToTemplates();
            }}
            className="btn-brutal btn-brutal-white text-xs py-1.5 px-3 min-h-[36px]"
          >
            <ChevronLeft size={14} />
            <span>Ganti template</span>
          </button>
        )}
        {(step === 'setup' || step === 'result') && (
          <Link href="/" onClick={playClickSound} className="focus:outline-none">
            <SnaporiaLogo size="sm" />
          </Link>
        )}
      </div>

      {/* Center Stepper Pills (Neo-brutalist) */}
      <nav aria-label="Alur langkah photobooth" className="flex items-center gap-1.5 sm:gap-2">
        {/* Step 1 */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onGoToStep?.('setup');
          }}
          className={`px-3 py-1.5 rounded-full border-2 border-ink font-mono text-xs font-bold transition-all cursor-pointer ${
            step === 'setup'
              ? 'bg-brand text-white shadow-stk-sm'
              : 'bg-white text-ink/70 hover:text-ink'
          }`}
        >
          <span>01 / TEMPLATE</span>
        </button>

        <span className="text-ink font-mono font-bold text-xs">⟶</span>

        {/* Step 2 */}
        <button
          type="button"
          onClick={() => {
            playClickSound();
            onGoToStep?.('capturing');
          }}
          className={`px-3 py-1.5 rounded-full border-2 border-ink font-mono text-xs font-bold transition-all cursor-pointer ${
            step === 'capturing'
              ? 'bg-brand text-white shadow-stk-sm'
              : 'bg-white text-ink/70 hover:text-ink'
          }`}
        >
          <span>02 / STUDIO</span>
        </button>

        <span className="text-ink font-mono font-bold text-xs">⟶</span>

        {/* Step 3 */}
        <button
          type="button"
          onClick={() => {
            if (canViewResult) {
              playClickSound();
              onGoToStep?.('result');
            }
          }}
          disabled={!canViewResult}
          className={`px-3 py-1.5 rounded-full border-2 border-ink font-mono text-xs font-bold transition-all ${
            step === 'result'
              ? 'bg-brand text-white shadow-stk-sm cursor-pointer'
              : canViewResult
              ? 'bg-white text-ink/70 hover:text-ink cursor-pointer'
              : 'bg-ink/5 text-ink/30 border-dashed cursor-not-allowed shadow-none'
          }`}
        >
          <span>03 / RESULT</span>
        </button>
      </nav>

      {/* Right Action & SFX */}
      <div className="flex items-center gap-3">
        <SfxToggle className="hidden sm:inline-flex" />

        {step === 'setup' && (
          <Link
            href="/"
            onClick={playClickSound}
            className="btn-brutal btn-brutal-white text-xs py-1.5 px-3 min-h-[36px]"
          >
            <X size={14} />
            <span>Keluar</span>
          </Link>
        )}
        {step === 'capturing' && (
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onBackToTemplates?.();
            }}
            className="btn-brutal btn-brutal-white text-xs py-1.5 px-3 min-h-[36px]"
          >
            <X size={14} />
            <span>Batal</span>
          </button>
        )}
        {step === 'result' && onResetSession && (
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onResetSession();
            }}
            className="btn-brutal btn-brutal-white text-xs py-1.5 px-3 min-h-[36px]"
          >
            <RotateCcw size={13} />
            <span>Foto lagi</span>
          </button>
        )}
      </div>
    </header>
  );
};
