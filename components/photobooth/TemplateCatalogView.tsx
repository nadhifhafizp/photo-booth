'use client';

import React from 'react';
import { Search, Sparkles, Check, Camera, X } from 'lucide-react';
import { FrameTemplate } from '@/app/photobooth/framesData';

interface TemplateCatalogViewProps {
  selectedTpl: FrameTemplate;
  onSelectTemplate: (tpl: FrameTemplate) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  filteredTemplates: FrameTemplate[];
  totalTemplatesCount: number;
  onConfirmTemplate: () => void;
}

export const TemplateCatalogView: React.FC<TemplateCatalogViewProps> = ({
  selectedTpl,
  onSelectTemplate,
  selectedCategory,
  onSelectCategory,
  categories,
  searchQuery,
  onSearchQueryChange,
  filteredTemplates,
  onConfirmTemplate,
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 pb-28 flex flex-col gap-8 animate-in fade-in duration-300">
      {/* ── HERO HEADER (STEP 01) ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight" style={{ color: 'var(--foreground)' }}>
            Pilih template yang paling kamu banget.
          </h1>
          <p className="text-sm md:text-base max-w-2xl font-normal" style={{ color: 'var(--muted-foreground)' }}>
            Jelajahi 60+ koleksi frame Gen Z viral (Newspaper, Y2K, Cute, Music, Scrapbook, Modern). Siap pose {selectedTpl.totalPhoto} kali dengan watermark resmi Snaporia.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={onConfirmTemplate}
              className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-pink-500/40 text-pink-400 hover:bg-pink-500/10 cursor-pointer transition shadow-sm"
            >
              <Camera size={14} /> Langsung Buka Kamera Studio →
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="w-full md:w-80">
          <div
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-sm transition-all focus-within:ring-1 focus-within:ring-pink-500"
            style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
          >
            <Search size={16} style={{ color: 'var(--muted-foreground)' }} />
            <input
              type="text"
              placeholder="Cari template..."
              value={searchQuery}
              onChange={e => onSearchQueryChange(e.target.value)}
              className="bg-transparent w-full outline-none text-sm font-medium"
              style={{ color: 'var(--foreground)' }}
            />
            {searchQuery && (
              <button
                onClick={() => onSearchQueryChange('')}
                className="text-xs font-bold text-muted-foreground hover:text-foreground cursor-pointer px-1 flex items-center justify-center"
                aria-label="Hapus pencarian"
              >
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORY PILLS ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => onSelectCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                isActive
                  ? 'shadow-sm text-white'
                  : 'text-neutral-400 hover:text-white border border-neutral-800 bg-neutral-900/80'
              }`}
              style={{
                background: isActive ? 'var(--primary)' : undefined,
                borderColor: isActive ? 'var(--primary)' : undefined,
              }}
            >
              {cat === 'All' ? 'Semua Frame' : cat}
            </button>
          );
        })}
      </div>

      {/* ── TEMPLATES GRID ── */}
      {filteredTemplates.length === 0 ? (
        <div className="py-20 text-center space-y-3">
          <p className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
            Tidak ada template yang cocok dengan &quot;{searchQuery}&quot;
          </p>
          <button
            onClick={() => {
              onSearchQueryChange('');
              onSelectCategory('All');
            }}
            className="text-xs font-bold underline cursor-pointer"
            style={{ color: 'var(--primary)' }}
          >
            Reset pencarian & kategori
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {filteredTemplates.map(tpl => {
            const isSelected = selectedTpl.id === tpl.id;
            return (
              <div
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col border ${
                  isSelected
                    ? 'ring-2 ring-pink-500 bg-pink-500/5 shadow-md'
                    : 'hover:border-neutral-700 bg-neutral-950'
                }`}
                style={{
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                }}
              >
                {/* "Dipilih" Badge */}
                {isSelected && (
                  <div
                    className="absolute top-3 left-3 z-20 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                  >
                    <Check size={12} strokeWidth={3} /> Dipilih
                  </div>
                )}

                {/* Subtle watermark indicator on card preview */}
                <div className="absolute top-3 right-3 z-20 px-2 py-0.5 rounded text-xs font-semibold backdrop-blur-md bg-black/60 text-white/80">
                  snaporia.
                </div>

                {/* Template Frame Preview */}
                <div className="relative aspect-[9/16] bg-black/40 overflow-hidden flex items-center justify-center p-3">
                  <img
                    src={tpl.thumb}
                    alt={tpl.name}
                    loading="lazy"
                    className="h-full w-auto object-contain drop-shadow-md"
                  />
                </div>

                {/* Card Meta Footer */}
                <div className="p-3.5 flex flex-col gap-1 border-t" style={{ borderColor: 'var(--border)' }}>
                  <h3 className="font-bold text-sm truncate" style={{ color: 'var(--foreground)' }}>
                    {tpl.name.replace(/^[^\w\s]+/, '').trim()}
                  </h3>
                  <div className="flex items-center justify-between text-xs font-medium" style={{ color: 'var(--muted-foreground)' }}>
                    <span>{tpl.category}</span>
                    <span>• {tpl.totalPhoto} foto</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── FIXED FLOATING BOTTOM BAR ── */}
      <div
        className="fixed bottom-0 left-0 right-0 z-50 p-4 border-t backdrop-blur-xl"
        style={{ background: 'rgba(10, 10, 10, 0.95)', borderColor: 'var(--border)' }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Selected Template Thumbnail & Name */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-12 h-14 rounded-lg overflow-hidden border shrink-0 bg-black flex items-center justify-center p-1"
              style={{ borderColor: 'var(--primary)' }}
            >
              <img
                src={selectedTpl.thumb}
                alt={selectedTpl.name}
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-neutral-400">
                Template Terpilih
              </span>
              <span className="text-sm font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md text-white">
                {selectedTpl.name.replace(/^[^\w\s]+/, '').trim()}
              </span>
              <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                {selectedTpl.category} • {selectedTpl.totalPhoto} Pose
              </span>
            </div>
          </div>

          {/* Confirm Button */}
          <button
            onClick={onConfirmTemplate}
            className="px-7 py-3 rounded-xl font-bold text-sm flex items-center gap-2 cursor-pointer transition-all duration-150 hover:bg-pink-600 active:scale-95 shadow-sm shrink-0"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            <Camera size={18} />
            <span>Pakai Template &amp; Buka Kamera →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
