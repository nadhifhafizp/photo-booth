'use client';

import React, { RefObject } from 'react';
import { Camera, CameraOff, RefreshCw, FlipHorizontal, Timer, Sparkles, Info } from 'lucide-react';
import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';

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
  onTriggerShutter: () => void;
  isCapturing: boolean;
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
  onTriggerShutter,
  isCapturing,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col lg:flex-row gap-6 md:gap-8 items-start animate-in fade-in duration-300">
      {/* ── LEFT: VIEWFINDER & SHUTTER CONTROLS ── */}
      <div className="w-full lg:w-[68%] flex flex-col gap-4">
        {/* Viewfinder Frame */}
        <div
          className="relative w-full rounded-3xl overflow-hidden aspect-[4/3] md:aspect-[16/10] bg-black border shadow-2xl flex items-center justify-center"
          style={{ borderColor: 'var(--border)' }}
        >
          {/* Video Stream */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover transition-all duration-300"
            style={{ transform: isMirrored ? 'scaleX(-1)' : 'none' }}
          />

          {/* Flash Effect */}
          <div
            className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150 ${
              isFlash ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Connecting State Overlay */}
          {!isStreaming && !cameraError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center bg-black/85 z-30">
              <div className="p-3.5 rounded-full bg-pink-500/15 text-pink-500 animate-pulse">
                <Camera size={36} />
              </div>
              <h4 className="font-bold text-base text-white">Menghubungkan ke Kamera...</h4>
              <p className="text-xs text-zinc-400 max-w-xs leading-relaxed">
                Pastikan Anda mengizinkan (Allow) akses kamera pada prompt peramban di atas.
              </p>
              {onUseDemoCamera && (
                <button
                  onClick={onUseDemoCamera}
                  className="mt-2 px-4 py-2 rounded-xl text-xs font-bold border border-zinc-700 bg-zinc-800 text-white cursor-pointer hover:bg-zinc-700 transition"
                >
                  <Sparkles size={12} className="inline mr-1.5 text-pink-400" /> Coba dengan Mode Demo
                </button>
              )}
            </div>
          )}

          {/* Top Info Bar Overlay */}
          <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/60 border border-white/10 text-xs font-bold text-white shadow-lg">
              <span className={`w-2.5 h-2.5 rounded-full ${isStreaming ? 'bg-emerald-500 animate-pulse' : 'bg-yellow-400 animate-ping'}`} />
              <span>{isStreaming ? 'Kamera aktif' : 'Menghubungkan...'}</span>
            </div>
            <div className="hidden sm:flex text-xs font-semibold text-white/70 backdrop-blur-md bg-black/40 px-3 py-1.5 rounded-full border border-white/10">
              Pastikan wajah terlihat jelas
            </div>
          </div>

          {/* Countdown Center Overlay */}
          {countdown !== null && (
            <div
              className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-4"
              style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(3px)' }}
            >
              <div
                className="w-28 h-28 rounded-full flex items-center justify-center text-5xl font-black text-white shadow-2xl animate-bounce"
                style={{ background: 'var(--primary)' }}
              >
                {countdown}
              </div>
              <p className="text-white text-base md:text-lg font-bold drop-shadow-md">
                {currentShot === 0
                  ? 'Siap pose? Foto pertama segera dimulai'
                  : `Pose ke-${currentShot + 1}! Tahan senyumanmu...`}
              </p>
            </div>
          )}

          {/* Camera Error Overlay */}
          {cameraError && (
            <div
              className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center"
              style={{ background: 'rgba(0,0,0,0.94)', backdropFilter: 'blur(8px)' }}
            >
              <div className="p-4 rounded-full mb-3 bg-red-500/20 text-red-400">
                <CameraOff size={40} />
              </div>
              <h4 className="font-bold text-lg mb-2 text-white">Akses Kamera Diperlukan</h4>
              <p className="text-xs max-w-sm mb-5 text-zinc-400 leading-relaxed">{cameraError}</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onRetryCamera}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition hover:opacity-90 shadow-lg"
                  style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                >
                  <RefreshCw size={14} /> Coba Lagi
                </button>
                {onUseDemoCamera && (
                  <button
                    onClick={onUseDemoCamera}
                    className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition hover:opacity-90 border border-zinc-700 bg-zinc-800 text-white"
                  >
                    <Sparkles size={14} className="text-pink-400" /> Mode Kamera Demo
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Bottom Viewfinder Info Overlay */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md bg-black/60 border border-white/10 text-xs font-bold text-white shadow-lg">
              <span>Foto {photos.length} / {totalPhoto}</span>
              <span className="text-white/40">•</span>
              <span>Timer {timerDuration} dtk</span>
            </div>
          </div>
        </div>

        {/* Viewfinder Bottom Controls Bar */}
        <div
          className="w-full rounded-2xl p-4 border flex items-center justify-between"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {/* Timer Toggle */}
          <button
            onClick={onToggleTimer}
            disabled={isCapturing}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--muted)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <Timer size={16} />
            <span>Timer ({timerDuration}s)</span>
          </button>

          {/* Big Circular Shutter Button */}
          <button
            onClick={onTriggerShutter}
            disabled={isCapturing || !!cameraError}
            aria-label="Ambil Foto"
            className="group relative flex items-center justify-center p-1.5 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 disabled:opacity-50 cursor-pointer"
            style={{
              background: 'transparent',
              border: '4px solid var(--primary)',
            }}
          >
            <div
              className={`w-14 h-14 rounded-full transition-all duration-300 ${
                isCapturing ? 'animate-pulse scale-90' : 'group-hover:scale-95'
              }`}
              style={{ background: 'var(--primary)' }}
            />
          </button>

          {/* Mirror Flip Toggle */}
          <button
            onClick={onToggleMirror}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer hover:opacity-80"
            style={{
              background: isMirrored ? 'rgba(255, 46, 126, 0.15)' : 'var(--muted)',
              borderColor: isMirrored ? 'var(--primary)' : 'var(--border)',
              color: isMirrored ? 'var(--primary)' : 'var(--foreground)',
            }}
          >
            <FlipHorizontal size={16} />
            <span>Mirror</span>
          </button>
        </div>
      </div>

      {/* ── RIGHT: SIDEBAR (TEMPLATE AKTIF & POSE TRACKER) ── */}
      <div className="w-full lg:w-[32%] flex flex-col gap-4">
        {/* Card 1: TEMPLATE AKTIF */}
        <div
          className="rounded-3xl p-5 border flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="text-[11px] font-black uppercase tracking-widest text-primary flex items-center justify-between">
            <span>TEMPLATE AKTIF</span>
            <span className="text-zinc-500 font-bold">{selectedTpl.category}</span>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-14 h-16 rounded-xl overflow-hidden bg-black/60 border shrink-0 flex items-center justify-center p-1" style={{ borderColor: 'var(--border)' }}>
              <img
                src={selectedTpl.thumb}
                alt={selectedTpl.name}
                className="h-full w-auto object-contain"
              />
            </div>
            <div>
              <h4 className="font-black text-base leading-tight" style={{ color: 'var(--foreground)' }}>
                {selectedTpl.name.replace(/^[^\w\s]+/, '').trim()}
              </h4>
              <p className="text-xs font-medium text-muted-foreground mt-1">
                {selectedTpl.totalPhoto} pose • 1 photostrip HD
              </p>
            </div>
          </div>

          {/* Tone Filter Selector */}
          <div className="pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-2">
              Pilih Tone Warna (Live)
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {FILTERS.map(f => {
                const isSelected = selectedFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => onSelectFilter(f.id)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border text-center"
                    style={{
                      background: isSelected ? 'var(--primary)' : 'var(--muted)',
                      borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                      color: isSelected ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
                    }}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Card 2: POSE TRACKER */}
        <div
          className="rounded-3xl p-5 border flex flex-col gap-4"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <div className="flex items-center justify-between">
            <span className="font-black text-sm" style={{ color: 'var(--foreground)' }}>
              Pose tracker
            </span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              {photos.length}/{totalPhoto}
            </span>
          </div>

          {/* Slot Grid */}
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: totalPhoto }).map((_, idx) => {
              const photo = photos[idx];
              const isCurrent = idx === currentShot && isCapturing;
              return (
                <div
                  key={idx}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border flex items-center justify-center relative transition-all ${
                    photo
                      ? 'border-emerald-500 shadow-sm'
                      : isCurrent
                      ? 'border-pink-500 ring-2 ring-pink-500/30 bg-pink-500/10'
                      : 'border-dashed border-zinc-700 bg-zinc-900/40 text-zinc-600'
                  }`}
                >
                  {photo ? (
                    <img src={photo} alt={`Pose ${idx + 1}`} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xs font-bold">{idx + 1}</span>
                  )}
                </div>
              );
            })}
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Tip: coba pose berbeda di setiap jepretan biar strip-mu makin seru. Watermark resmi Snaporia akan otomatis tercetak di footer.
          </p>
        </div>

        {/* Card 3: Camera helper info */}
        <div
          className="rounded-2xl p-4 border flex items-start gap-3"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Info size={16} className="text-pink-500 shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Semua foto diproses langsung di perambanmu secara privat tanpa disimpan ke server luar.
          </p>
        </div>
      </div>
    </div>
  );
};
