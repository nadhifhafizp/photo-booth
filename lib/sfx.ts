'use client';

// Sound & Haptics SFX utility using Web Audio API (zero external assets needed)

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSfxEnabled(): boolean {
  if (typeof window === 'undefined') return true;
  const stored = localStorage.getItem('snaporia_sfx_enabled');
  return stored === null ? true : stored === 'true';
}

export function setSfxEnabled(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('snaporia_sfx_enabled', enabled ? 'true' : 'false');
  if (enabled) {
    // Play a friendly confirmation chirp
    playClickSound();
  }
}

export function triggerHaptic(duration = 15): void {
  if (typeof window !== 'undefined' && 'vibrate' in navigator && isSfxEnabled()) {
    try {
      navigator.vibrate(duration);
    } catch {
      // Haptics not allowed or supported
    }
  }
}

/**
 * Gentle tactile click sound for UI buttons
 */
export function playClickSound(): void {
  if (!isSfxEnabled()) return;
  triggerHaptic(12);

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.04);

    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.04);
  } catch {
    // Audio context error or blocked
  }
}

/**
 * Mechanical camera shutter sound for photo capture
 */
export function playShutterSound(): void {
  if (!isSfxEnabled()) return;
  triggerHaptic(30);

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const now = ctx.currentTime;

    // First click (mirror up)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(800, now);
    osc1.frequency.exponentialRampToValueAtTime(200, now + 0.03);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.03);

    // Second click (shutter curtain)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'square';
    osc2.frequency.setValueAtTime(320, now + 0.05);
    osc2.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    gain2.gain.setValueAtTime(0.25, now + 0.05);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.05);
    osc2.stop(now + 0.12);
  } catch {
    // audio error
  }
}

/**
 * Countdown beep (high pitch for 3, 2, 1)
 */
export function playBeepSound(isFinal = false): void {
  if (!isSfxEnabled()) return;
  triggerHaptic(isFinal ? 25 : 12);

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    const freq = isFinal ? 880 : 540; // A5 for final shot, C#5 for countdown
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    gain.gain.setValueAtTime(0.18, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + (isFinal ? 0.15 : 0.08));

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + (isFinal ? 0.15 : 0.08));
  } catch {
    // audio error
  }
}
