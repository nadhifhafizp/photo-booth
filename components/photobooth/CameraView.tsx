'use client';

import React, { RefObject } from 'react';
import { CameraOff, RefreshCw } from 'lucide-react';

interface CameraViewProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  cameraError: string | null;
  onRetryCamera: () => void;
  countdown: number | null;
  isFlash: boolean;
  step: 'setup' | 'capturing' | 'result';
  currentShot: number;
  photoCount: number;
  templateName: string;
}

export const CameraView: React.FC<CameraViewProps> = ({
  videoRef,
  cameraError,
  onRetryCamera,
  countdown,
  isFlash,
  step,
  currentShot,
  photoCount,
  templateName,
}) => {
  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden aspect-[3/4] max-w-sm mx-auto border shadow-2xl"
      style={{ borderColor: 'var(--border)', background: '#0a0a0a' }}
    >
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-full h-full object-cover transition-all duration-300"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Error state */}
      {cameraError && (
        <div
          className="absolute inset-0 z-40 flex flex-col items-center justify-center p-6 text-center"
          style={{ background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(6px)' }}
        >
          <div className="p-3 rounded-full mb-3" style={{ background: 'rgba(239,68,68,0.2)' }}>
            <CameraOff size={36} style={{ color: '#f87171' }} />
          </div>
          <h4 className="font-bold text-base mb-2" style={{ color: 'var(--foreground)' }}>
            Akses Kamera Diperlukan
          </h4>
          <p className="text-xs max-w-xs mb-5 leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            {cameraError}
          </p>
          <button
            onClick={onRetryCamera}
            className="px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 cursor-pointer transition hover:opacity-90"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <RefreshCw size={14} /> Coba Lagi
          </button>
        </div>
      )}

      {/* Countdown animation */}
      {countdown !== null && (
        <div
          className="absolute inset-0 flex items-center justify-center z-50"
          style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}
        >
          <span className="text-[8rem] font-black leading-none animate-ping" style={{ color: 'var(--primary)' }}>
            {countdown}
          </span>
        </div>
      )}

      {/* Flash effect */}
      <div
        className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-100 ${
          isFlash ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* REC badge */}
      {step === 'capturing' && (
        <div
          className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold shadow animate-pulse"
          style={{ background: 'rgba(239,68,68,0.9)', color: '#fff' }}
        >
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          REC • Pose {currentShot + 1} dari {photoCount}
        </div>
      )}

      {/* Viewfinder guide */}
      {step === 'setup' && (
        <div className="absolute inset-0 pointer-events-none border border-white/10 flex flex-col justify-between p-3">
          <div className="flex justify-between items-center text-[10px] font-mono text-white/60 bg-black/50 px-2.5 py-1 rounded-md backdrop-blur-xs">
            <span className="truncate max-w-[200px]">{templateName.toUpperCase()}</span>
            <span className="shrink-0">{photoCount} POSE</span>
          </div>
        </div>
      )}
    </div>
  );
};
