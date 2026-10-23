'use client';

import React, { RefObject, useEffect } from 'react';
import { CameraOff, RefreshCw, FlipHorizontal, Timer, Sparkles, SwitchCamera, RotateCcw, Check } from 'lucide-react';
import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';
import { playClickSound, playShutterSound, playBeepSound } from '@/lib/sfx';

interface CameraStudioViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraError: string | null;
  onRetryCamera: () => void;
  onUseDemoCamera?: () => void;
  countdown: number | null;
  isFlash: boolean;
  isStreaming: boolean;
  currentShot: number;
  totalPhoto: number;
  photos: string[];
  selectedTpl: FrameTemplate;
  selectedFilter: FilterType;
  onSelectFilter: (f: FilterType) => void;
  timerDuration: number;
  onToggleTimer: () => void;
  isMirrored: boolean;
  onToggleMirror: () => void;
  facingMode: 'user' | 'environment';
  onToggleCameraFacing: () => void;
  onTriggerShutter: () => void;
  isCapturing: boolean;
  pendingReviewPhoto?: { index: number; dataUrl: string } | null;
  onKeepPhoto?: () => void;
  onRetakeCurrent?: () => void;
  onRetakeSpecificPose?: (index: number) => void;
}

export const CameraStudioView: React.FC<CameraStudioViewProps> = ({
  videoRef,
  cameraError,
  onRetryCamera,
  onUseDemoCamera,
  countdown,
  isFlash,
  isStreaming,
  currentShot,
  totalPhoto,
  photos,
  selectedTpl,
  selectedFilter,
  onSelectFilter,
  timerDuration,
  onToggleTimer,
  isMirrored,
  onToggleMirror,
  facingMode,
  onToggleCameraFacing,
  onTriggerShutter,
  isCapturing,
  pendingReviewPhoto,
  onKeepPhoto,
  onRetakeCurrent,
  onRetakeSpecificPose,
}) => {
  // Play sound effect on countdown changes
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      playBeepSound(countdown === 1);
    }
  }, [countdown]);

  // Play shutter sound on flash
  useEffect(() => {
    if (isFlash) {
      playShutterSound();
    }
  }, [isFlash]);

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col lg:flex-row gap-5 lg:gap-8 items-start animate-in fade-in duration-200">
      {/* ── LEFT: VIEWFINDER & SHUTTER DOCK (7 cols) ── */}
      <div className="w-full lg:w-[68%] flex flex-col gap-4 sm:gap-5">

        {/* Viewfinder Frame with Corner Brackets */}
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-ink border-[2.5px] sm:border-[3px] border-ink shadow-stk flex items-center justify-center select-none"
        >
          {/* Corner Brackets Overlay (`⌜ ⌝ ⌞ ⌟`) */}
          <div className="absolute inset-3 sm:inset-4 pointer-events-none z-20 flex flex-col justify-between">
            <div className="flex justify-between text-white/70 font-mono text-xl sm:text-2xl font-bold leading-none">
              <span>⌜</span>
              <span>⌝</span>
            </div>
            <div className="flex justify-between text-white/70 font-mono text-xl sm:text-2xl font-bold leading-none">
              <span>⌞</span>
              <span>⌟</span>
            </div>
          </div>

          {/* Video Stream Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transition-all duration-200"
            style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
          />

          {/* Flash Effect Overlay */}
          <div
            className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150 ${
              isFlash ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Top Status Bar Inside Viewfinder */}
          <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-30 flex items-center justify-between pointer-events-none">
            {/* Live REC Status Badge */}
            <div className="badge-live pointer-events-auto text-[11px] sm:text-xs">
              <span className="badge-dot" />
              <span>{isStreaming ? '● LIVE REC' : 'CONNECTING...'}</span>
            </div>

            {/* Quick Camera Switcher Pill (Front / Back) */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onToggleCameraFacing();
              }}
              disabled={isCapturing || !!pendingReviewPhoto}
              aria-label={`Ganti ke kamera ${facingMode === 'user' ? 'belakang' : 'depan'}`}
              className="pointer-events-auto btn-brutal btn-brutal-white text-xs py-1.5 px-2.5 sm:px-3.5 min-h-[38px] shadow-stk-sm"
            >
              <SwitchCamera size={15} className="text-brand" />
              <span className="font-mono text-[11px] sm:text-xs">
                <span className="hidden sm:inline">Kamera: </span>{facingMode === 'user' ? 'DEPAN' : 'BELAKANG'}
              </span>
            </button>
          </div>

          {/* ── RETAKE / KEEP REVIEW MODAL OVERLAY (PER POSE) ── */}
          {pendingReviewPhoto && (
            <div className="absolute inset-0 z-40 bg-ink/85 backdrop-blur-xs flex flex-col items-center justify-center p-4 sm:p-6 gap-3 sm:gap-5">
              <div className="badge-live text-[11px] sm:text-xs">
                <span>✓ HASIL POSE {pendingReviewPhoto.index + 1} / {totalPhoto}</span>
              </div>

              {/* Photo Preview Card */}
              <div className="relative max-h-[45%] sm:max-h-[50%] aspect-[4/3] bg-white p-2 rounded-xl sm:rounded-2xl border-[2.5px] border-ink shadow-stk -rotate-1">
                <img
                  src={pendingReviewPhoto.dataUrl}
                  alt={`Review pose ${pendingReviewPhoto.index + 1}`}
                  className="w-full h-full object-cover rounded-lg sm:rounded-xl"
                />
              </div>

              {/* Review Decision Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-4 pt-1 w-full max-w-xs sm:max-w-none">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onRetakeCurrent?.();
                  }}
                  className="btn-brutal btn-brutal-white text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 shadow-stk-sm w-full sm:w-auto"
                >
                  <RotateCcw size={16} />
                  <span>Retake Pose ↺</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onKeepPhoto?.();
                  }}
                  className="btn-brutal text-xs sm:text-sm py-2.5 sm:py-3 px-5 sm:px-6 shadow-stk-sm w-full sm:w-auto"
                >
                  <Check size={16} />
                  <span>
                    {pendingReviewPhoto.index + 1 === totalPhoto
                      ? 'Simpan & Buat Photostrip ↗'
                      : 'Lanjut Pose Berikutnya ⟶'}
                  </span>
                </button>
              </div>

              <p className="font-mono text-[10px] sm:text-[11px] text-white/70 text-center max-w-sm px-2">
                Bisa retake ulang pose ini atau ganti kamera depan/belakang sebelum mengambil pose selanjutnya.
              </p>
            </div>
          )}

          {/* Giant Countdown Overlay */}
          {countdown !== null && !pendingReviewPhoto && (
            <div className="absolute inset-0 z-40 bg-ink/75 backdrop-blur-xs flex flex-col items-center justify-center gap-3 sm:gap-4">
              <div
                key={countdown}
                className="animate-countdown-pop font-display text-[6rem] sm:text-[10rem] md:text-[12rem] text-lime leading-none drop-shadow-[6px_6px_0_#0e0b1f]"
              >
                {countdown}
              </div>
              <div className="flex flex-col items-center gap-2">
                <p className="font-mono text-xs sm:text-sm font-bold text-white uppercase tracking-widest bg-ink border-2 border-lime px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-center mx-4">
                  {`POSE ${currentShot + 1} DARI ${totalPhoto}! TAHAN SENYUM`}
                </p>
                <div className="inline-flex items-center gap-1.5 bg-ink/90 border border-pink text-white font-mono text-[10px] sm:text-xs px-3 py-1 rounded-full shadow-stk-sm">
                  <span className="w-2 h-2 rounded-full bg-pink animate-ping" />
                  <span className="font-bold tracking-wider text-pink">● LIVE MOTION BUFFER RECORDING</span>
                </div>
              </div>
            </div>
          )}

          {/* Camera Error Screen */}
          {cameraError && (
            <div className="absolute inset-0 z-50 bg-ink/95 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
              <div className="p-3 sm:p-4 rounded-full mb-3 bg-danger/20 text-danger border-2 border-danger">
                <CameraOff size={32} />
              </div>
              <h4 className="font-display text-lg sm:text-xl text-white uppercase mb-2">
                Akses Kamera Diperlukan
              </h4>
              <p className="text-xs text-white/70 max-w-sm mb-5 leading-relaxed">
                {cameraError}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onRetryCamera();
                  }}
                  className="btn-brutal text-xs py-2.5 px-4 sm:px-5"
                >
                  <RefreshCw size={14} />
                  <span>Coba Lagi</span>
                </button>
                {onUseDemoCamera && (
                  <button
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onUseDemoCamera();
                    }}
                    className="btn-brutal btn-brutal-white text-xs py-2.5 px-4 sm:px-5"
                  >
                    <Sparkles size={14} className="text-brand" />
                    <span>Mode Demo</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bottom Pose Track Indicator Overlay */}
          <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4 z-30 flex items-center justify-between pointer-events-none">
            <div className="chip-brutal bg-white text-ink border-ink font-bold pointer-events-auto text-[10px] sm:text-xs">
              <span>POSE {currentShot + 1} DARI {totalPhoto}</span>
              <span>•</span>
              <span>TIMER {timerDuration}S</span>
            </div>
          </div>
        </div>

        {/* Viewfinder Bottom Controls Dock */}
        <div className="w-full bg-white border-[2.5px] border-ink rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-stk flex items-center justify-between gap-2 sm:gap-3">
          {/* Left Controls: Timer duration & Camera facing toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onToggleTimer();
              }}
              disabled={isCapturing || !!pendingReviewPhoto}
              className="btn-brutal btn-brutal-white text-xs py-2 sm:py-2.5 px-2.5 sm:px-3.5 min-h-[44px]"
              aria-label={`Durasi timer ${timerDuration} detik`}
            >
              <Timer size={16} />
              <span className="hidden sm:inline">TIMER </span>
              <span>{timerDuration}S</span>
            </button>

            {/* Switch Camera Button (Front / Back) */}
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onToggleCameraFacing();
              }}
              disabled={isCapturing || !!pendingReviewPhoto}
              className={`btn-brutal text-xs py-2 sm:py-2.5 px-2.5 sm:px-3.5 min-h-[44px] ${
                facingMode === 'environment' ? 'btn-brutal-brand' : 'btn-brutal-white'
              }`}
              aria-label="Ganti kamera"
            >
              <SwitchCamera size={16} />
              <span className="hidden md:inline">Kamera </span>
              <span>{facingMode === 'user' ? 'Depan' : 'Belakang'}</span>
            </button>
          </div>

          {/* Center Giant Shutter Button (≥ 80px pink with 4px ink border) */}
          <div className="flex flex-col items-center shrink-0">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onTriggerShutter();
              }}
              disabled={isCapturing || !!cameraError || !!pendingReviewPhoto}
              aria-label={`Ambil foto pose ${currentShot + 1}`}
              className="relative w-18 h-18 sm:w-22 sm:h-22 rounded-full border-4 border-ink bg-pink shadow-[4px_4px_0_#0e0b1f] sm:shadow-[5px_5px_0_#0e0b1f] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0_#0e0b1f] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group select-none"
            >
              <div
                className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 border-ink bg-white transition-transform duration-150 ${
                  isCapturing ? 'animate-ping scale-75' : 'group-hover:scale-95'
                }`}
              />
            </button>
            <span className="font-editorial-mono text-[9px] sm:text-[10px] text-brand font-bold mt-1 uppercase text-center">
              {isCapturing ? 'MENGAMBIL...' : `SNAP #${currentShot + 1}`}
            </span>
          </div>

          {/* Right Controls: Mirror Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onToggleMirror();
              }}
              className={`btn-brutal text-xs py-2 sm:py-2.5 px-3 sm:px-4 min-h-[44px] ${
                isMirrored ? 'btn-brutal-brand' : 'btn-brutal-white'
              }`}
              aria-label={`Mode cermin: ${isMirrored ? 'aktif' : 'nonaktif'}`}
            >
              <FlipHorizontal size={16} />
              <span className="hidden sm:inline">MIRROR</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── RIGHT: SIDEBAR (TEMPLATE AKTIF & RETAKE PROGRES) (5 cols) ── */}
      <div className="w-full lg:w-[32%] flex flex-col gap-4 sm:gap-6">

        {/* Card: Active Template Info */}
        <div className="bg-white border-[2.5px] border-ink rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-stk flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-ink">
            <span className="font-editorial-mono text-brand font-bold text-[11px] sm:text-xs">
              02 / ACTIVE SETUP
            </span>
            <span className="chip-brutal text-[10px] py-0.5 px-2">
              {selectedTpl.category}
            </span>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-14 h-18 sm:w-16 sm:h-20 rounded-xl sm:rounded-2xl border-2 border-ink bg-brand-tint overflow-hidden shrink-0 flex items-center justify-center p-1.5 shadow-stk-sm">
              <img
                src={selectedTpl.thumb}
                alt={selectedTpl.name}
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h3 className="font-display text-base sm:text-lg text-ink uppercase leading-snug">
                {selectedTpl.name.replace(/^[^\w\s]+/, '').trim()}
              </h3>
              <p className="font-mono text-[11px] sm:text-xs text-muted mt-1 font-semibold">
                {selectedTpl.totalPhoto} pose • HD strip format
              </p>
            </div>
          </div>

          {/* Tone Filter Selector Chips */}
          <div className="pt-3 sm:pt-4 border-t-2 border-ink">
            <label className="font-editorial-mono text-[10px] sm:text-[11px] text-ink font-bold block mb-2">
              PILIH LIVE TONE:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-2">
              {FILTERS.map(f => {
                const isSelected = selectedFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => {
                      playClickSound();
                      onSelectFilter(f.id);
                    }}
                    className={`py-2 px-2.5 rounded-xl border-2 border-ink font-mono text-[11px] sm:text-xs font-bold transition-all cursor-pointer text-center select-none min-h-[38px] ${
                      isSelected
                        ? 'bg-brand text-white shadow-stk-sm'
                        : 'bg-paper text-ink hover:bg-brand-tint'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card: Pose Progress Tracker & Retake Manager */}
        <div className="bg-white border-[2.5px] border-ink rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-stk flex flex-col gap-3 sm:gap-4">
          <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b-2 border-ink">
            <div>
              <span className="font-editorial-mono text-brand font-bold text-[11px] sm:text-xs block">
                PROGRES POSE ({photos.filter(Boolean).length}/{totalPhoto})
              </span>
              <span className="text-[10px] text-muted font-mono">
                Ketuk foto untuk retake ulang
              </span>
            </div>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-2 gap-2 sm:gap-3">
            {Array.from({ length: totalPhoto }).map((_, i) => {
              const photo = photos[i];
              const isCurrent = i === currentShot && !pendingReviewPhoto;
              return (
                <div
                  key={i}
                  onClick={() => {
                    if (photo && onRetakeSpecificPose) {
                      playClickSound();
                      onRetakeSpecificPose(i);
                    }
                  }}
                  className={`aspect-[4/3] rounded-xl sm:rounded-2xl border-2 border-ink flex flex-col items-center justify-center overflow-hidden relative cursor-pointer transition-transform hover:scale-[1.02] ${
                    photo
                      ? 'bg-black shadow-stk-sm'
                      : isCurrent
                      ? 'bg-brand-tint border-brand border-2'
                      : 'bg-paper border-dashed'
                  }`}
                >
                  {photo ? (
                    <>
                      <img
                        src={photo}
                        alt={`Pose ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-ink/60 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-white">
                        <RotateCcw size={14} />
                        <span className="font-mono text-[9px] font-bold">Retake ↺</span>
                      </div>
                      <span className="absolute bottom-1 left-1 bg-ink text-white font-mono text-[8px] sm:text-[9px] px-1 py-0.5 rounded border border-white/20">
                        P{i + 1} ✓
                      </span>
                    </>
                  ) : (
                    <div className="flex flex-col items-center gap-0.5 p-1 text-center">
                      <span className="font-mono text-[10px] sm:text-xs font-bold text-ink">
                        {isCurrent ? `● P${i + 1}` : `P${i + 1}`}
                      </span>
                      <span className="text-[8px] sm:text-[9px] font-mono text-muted leading-tight">
                        {isCurrent ? 'Siap' : 'Antre'}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
