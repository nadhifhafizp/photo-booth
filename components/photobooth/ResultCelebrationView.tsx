'use client';

import React, { useState } from 'react';
import { Download, Share2, Copy, Check, Printer, RotateCcw, Palette, ArrowRight } from 'lucide-react';
import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';
import { playClickSound } from '@/lib/sfx';

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
}) => {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  const handleCopyLink = async () => {
    playClickSound();
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
    playClickSound();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Snaporia Photobooth Strip',
          text: 'Lihat photostrip kami yang baru saja dicetak di Snaporia!',
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

  const handlePrint = () => {
    playClickSound();
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Cetak Photostrip Snaporia</title>
            <style>
              @page { size: auto; margin: 10mm; }
              body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #fff; }
              img { max-height: 95vh; max-width: 100%; object-fit: contain; }
            </style>
          </head>
          <body>
            <img src="${finalImage}" onload="window.print(); window.close();" />
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 flex flex-col lg:flex-row gap-10 lg:gap-14 items-center justify-center animate-in fade-in duration-200">

      {/* ── LEFT: TILTED PHOTOSTRIP DISPLAY (STICKER SHADOW) ── */}
      <div className="w-full lg:w-[46%] flex items-center justify-center relative">
        {/* Floating Sticker: READY */}
        <div className="absolute -top-4 -left-2 z-20 bg-lime text-ink font-mono font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-ink shadow-stk-sm rotate-[-6deg]">
          READY ✓
        </div>

        {/* Floating Sticker: 100% HD */}
        <div className="absolute -bottom-3 -right-2 z-20 bg-yellow text-ink font-mono font-black text-xs px-3.5 py-1.5 rounded-full border-2 border-ink shadow-stk-sm rotate-[4deg]">
          ★ 300 DPI HD
        </div>

        {/* Photostrip Container */}
        <div className="bg-white border-[3px] border-ink p-4 sm:p-6 rounded-3xl shadow-[12px_12px_0_#0e0b1f] max-w-sm w-full flex items-center justify-center -rotate-2 hover:rotate-0 transition-transform duration-300">
          <img
            src={finalImage}
            alt="Hasil Photostrip Snaporia"
            className="max-h-[70vh] w-auto object-contain rounded-xl border-2 border-ink shadow-sm"
          />
        </div>
      </div>

      {/* ── RIGHT: CELEBRATION ACTIONS & DETAILS ── */}
      <div className="w-full lg:w-[54%] flex flex-col gap-6">
        {/* Main Headline */}
        <div>
          <p className="font-editorial-mono text-brand font-bold mb-2">03 / FINAL STRIP</p>
          <h1 className="text-4xl sm:text-6xl text-ink font-display leading-[0.95]">
            STRIP IS <em className="accent">ready.</em>
          </h1>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-lg leading-relaxed">
            Simpan photostrip ini dalam resolusi tinggi atau cetak langsung.
          </p>
        </div>

        {/* Action Buttons Grid (Neo-brutalist) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
          {/* 1. Download Button (Primary Lime) */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onDownload();
            }}
            className="btn-brutal py-3.5 px-6 text-sm"
          >
            <Download size={18} />
            <span>Download ↓</span>
          </button>

          {/* 2. Print Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="btn-brutal btn-brutal-white py-3.5 px-6 text-sm"
          >
            <Printer size={18} />
            <span>Cetak ⎙</span>
          </button>

          {/* 3. Tone Selector Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowFilterPicker(!showFilterPicker);
            }}
            className="btn-brutal btn-brutal-white py-3 px-5 text-xs"
          >
            <Palette size={16} />
            <span>Ganti Tone ✦</span>
          </button>

          {/* 4. Copy / Share */}
          <button
            type="button"
            onClick={handleShare}
            className="btn-brutal btn-brutal-white py-3 px-5 text-xs"
          >
            {shared || copied ? <Check size={16} className="text-brand font-bold" /> : <Share2 size={16} />}
            <span>{shared || copied ? 'Tersalin!' : 'Bagikan ↗'}</span>
          </button>
        </div>

        {/* Tone Picker Expansion (if opened) */}
        {showFilterPicker && (
          <div className="p-4 bg-white rounded-2xl border-[2.5px] border-ink shadow-stk-sm flex flex-col gap-2.5 max-w-md animate-in fade-in duration-150">
            <span className="font-editorial-mono text-[11px] text-ink font-bold uppercase">
              UBAH TONE PHOTOSTRIP (INSTAN):
            </span>
            <div className="grid grid-cols-4 gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onChangeFilter(f.id);
                  }}
                  className={`py-2 px-2 rounded-xl font-mono text-xs font-bold border-2 border-ink transition-all cursor-pointer text-center select-none ${
                    selectedFilter === f.id
                      ? 'bg-brand text-white shadow-stk-sm'
                      : 'bg-paper text-ink hover:bg-brand-tint'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* QR Code Sticker Card for Mobile Transfer */}
        <div className="max-w-md p-5 bg-white rounded-3xl border-[2.5px] border-ink shadow-stk flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl border-2 border-ink bg-yellow p-2 shrink-0 flex items-center justify-center shadow-stk-sm">
            <svg viewBox="0 0 24 24" className="w-full h-full text-ink fill-current">
              <path d="M2 2h8v8H2V2zm2 2v4h4V4H4zm10-2h8v8h-8V2zm2 2v4h4V4h-4zM2 14h8v8H2v-8zm2 2v4h4v-4H4zm14 0h4v2h-4v-2zm-4 0h2v2h-2v-2zm2 2h2v2h-2v-2zm2 2h2v2h-2v-2zm-4 0h2v2h-2v-2zm0-4h2v2h-2v-2zm4-2h2v2h-2v-2z" />
            </svg>
          </div>
          <div>
            <h4 className="font-display text-base text-ink uppercase leading-tight">
              Scan untuk simpan di HP
            </h4>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Buka kamera ponsel Anda untuk mengunduh photostrip ini langsung tanpa kabel.
            </p>
          </div>
        </div>

        {/* Quick Reset / Switch Template Options */}
        <div className="pt-2 border-t-2 border-ink max-w-md flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-muted">Mau coba gaya lain?</span>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowTemplatePicker(!showTemplatePicker);
              }}
              className="font-mono text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Pilih frame baru</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {showTemplatePicker && (
            <div className="grid grid-cols-4 gap-2 pt-2 animate-in fade-in duration-150">
              {templates.slice(0, 8).map(tpl => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onSwitchTemplate(tpl);
                  }}
                  className={`p-1.5 rounded-xl border-2 border-ink text-center transition cursor-pointer hover:scale-105 bg-white ${
                    selectedTpl.id === tpl.id ? 'ring-2 ring-brand' : ''
                  }`}
                >
                  <img src={tpl.thumb} alt={tpl.name} className="w-full aspect-[9/16] object-contain rounded mb-1" />
                  <span className="font-mono text-[9px] font-bold block truncate text-ink">
                    {tpl.name.replace(/^[^\w\s]+/, '').trim()}
                  </span>
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onReset();
            }}
            className="btn-brutal btn-brutal-brand text-xs py-3 px-5 justify-center mt-2"
          >
            <RotateCcw size={14} />
            <span>Mulai Sesi Baru</span>
            <span>↺</span>
          </button>
        </div>

      </div>
    </div>
  );
};
