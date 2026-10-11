'use client';

import React, { useState } from 'react';
import { Download, Share2, Copy, Check, Sparkles, ArrowRight, RefreshCw, Palette } from 'lucide-react';
import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';

interface ResultCelebrationViewProps {
  finalImage: string;
  selectedTpl: FrameTemplate;
  templates: FrameTemplate[];
  onSwitchTemplate: (tpl: FrameTemplate) => void;
  onDownload: () => void;
  onReset: () => void;
  selectedFilter: FilterType;
  onChangeFilter: (f: FilterType) => void;
  onBackToCatalog: () => void;
}

export const ResultCelebrationView: React.FC<ResultCelebrationViewProps> = ({
  finalImage,
  selectedTpl,
  templates,
  onSwitchTemplate,
  onDownload,
  onReset,
  selectedFilter,
  onChangeFilter,
  onBackToCatalog,
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Snaporia Photobooth Strip',
          text: 'Lihat hasil foto photobooth kami di Snaporia!',
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2500);
      } catch {
        // user cancelled share
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8 lg:gap-14 items-center justify-center animate-in fade-in duration-300">
      {/* ── LEFT: TILTED PHOTOSTRIP DISPLAY ── */}
      <div className="w-full lg:w-[46%] flex items-center justify-center">
        <div
          className="relative p-6 md:p-8 rounded-3xl border shadow-xl flex items-center justify-center max-w-sm w-full"
          style={{ background: '#121214', borderColor: 'var(--border)' }}
        >
          {/* Tilted Photo Strip */}
          <div className="relative group max-h-[76vh] flex items-center justify-center transform -rotate-2 hover:rotate-0 transition-transform duration-300">
            <img
              src={finalImage}
              alt="Hasil Photostrip Snaporia"
              className="max-h-[70vh] w-auto object-contain rounded-xl shadow-2xl border border-white/10"
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT: CELEBRATION ACTIONS & DETAILS ── */}
      <div className="w-full lg:w-[54%] flex flex-col gap-6">
        {/* Main Headings */}
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Hasil fotomu udah jadi.
          </h1>
          <p className="text-sm md:text-base text-muted-foreground font-normal max-w-lg">
            Simpan photostrip ini atau kirim langsung ke teman-temanmu. Strip dilengkapi watermark resmi <strong className="text-foreground">snaporia.</strong>
          </p>
        </div>

        {/* Action Buttons Grid */}
        <div className="grid grid-cols-2 gap-3 max-w-md">
          {/* 1. Download Button (Big Primary) */}
          <button
            onClick={onDownload}
            className="col-span-1 py-3 px-5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition-all hover:bg-pink-600 active:scale-95 shadow-sm"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Download size={18} /> Download
          </button>

          {/* 2. Share Button */}
          <button
            onClick={handleShare}
            className="col-span-1 py-3 px-5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border cursor-pointer transition-all hover:bg-neutral-900"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            {shared ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
            <span>{shared ? 'Tershare!' : 'Bagikan'}</span>
          </button>

          {/* 3. Tone / Filter Button */}
          <button
            onClick={() => setShowFilterPicker(!showFilterPicker)}
            className="col-span-1 py-2.5 px-5 rounded-xl font-semibold text-xs flex items-center justify-center gap-2 border cursor-pointer transition-all hover:bg-neutral-900"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            <Palette size={16} /> Ganti Tone
          </button>

          {/* 4. Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="col-span-1 py-3 px-5 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 border cursor-pointer transition-all hover:opacity-80"
            style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
            <span>{copied ? 'Tersalin!' : 'Salin link'}</span>
          </button>
        </div>

        {/* Tone Picker Expansion (if opened) */}
        {showFilterPicker && (
          <div
            className="p-4 rounded-2xl border flex flex-col gap-2 max-w-md animate-in fade-in duration-200"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Ubah Tone Foto (Instan):
            </span>
            <div className="grid grid-cols-4 gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  onClick={() => onChangeFilter(f.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-bold border transition cursor-pointer text-center ${
                    selectedFilter === f.id ? 'ring-2 ring-pink-500' : 'hover:opacity-80'
                  }`}
                  style={{
                    background: selectedFilter === f.id ? 'var(--primary)' : 'var(--muted)',
                    borderColor: 'var(--border)',
                    color: selectedFilter === f.id ? 'var(--primary-foreground)' : 'var(--foreground)',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QR Code Card for Mobile Download */}
        <div
          className="max-w-md p-4 rounded-3xl border flex items-center gap-4 shadow-sm"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          {/* Crisp QR Code Graphic */}
          <div className="w-16 h-16 rounded-xl bg-white p-1.5 shrink-0 flex items-center justify-center shadow-inner">
            <svg viewBox="0 0 24 24" className="w-full h-full text-black fill-current">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm4-2h2v2h-2v-2z" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h4 className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>
              Scan untuk ambil di HP
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Link aktif selama 24 jam untuk unduhan langsung tanpa kabel.
            </p>
          </div>
        </div>

        {/* Quick Switch Template / Back link */}
        <div className="pt-2 border-t max-w-md flex flex-col gap-3" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-muted-foreground">Mau vibes lain?</span>
            <button
              onClick={() => setShowTemplatePicker(!showTemplatePicker)}
              className="text-xs font-bold text-pink-500 hover:text-pink-400 flex items-center gap-1 cursor-pointer"
            >
              Pilih template baru <ArrowRight size={14} />
            </button>
          </div>

          {showTemplatePicker && (
            <div className="grid grid-cols-4 gap-2 pt-2 animate-in fade-in duration-200">
              {templates.slice(0, 8).map(tpl => (
                <button
                  key={tpl.id}
                  onClick={() => onSwitchTemplate(tpl)}
                  className={`p-1.5 rounded-xl border text-center transition cursor-pointer hover:scale-105 ${
                    selectedTpl.id === tpl.id ? 'ring-2 ring-pink-500' : ''
                  }`}
                  style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                >
                  <img src={tpl.thumb} alt={tpl.name} className="w-full aspect-[9/16] object-contain rounded mb-1" />
                  <span className="text-[10px] font-bold block truncate" style={{ color: 'var(--foreground)' }}>
                    {tpl.name.replace(/^[^\w\s]+/, '').trim()}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
