'use client';

import React from 'react';
import { Search, Camera, X, Check } from 'lucide-react';
import { FrameTemplate } from '@/app/photobooth/framesData';
import { playClickSound } from '@/lib/sfx';

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
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-36 flex flex-col gap-8 animate-in fade-in duration-200">
      {/* ── SECTION HEADER (`01 / PICK A LAYOUT`) ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-[2.5px] border-ink pb-8">
        <div>
          <p className="font-editorial-mono text-brand font-bold mb-2">01 / PICK A LAYOUT</p>
          <h1 className="text-4xl sm:text-6xl text-ink font-display">
            CHOOSE YOUR <em className="accent">aesthetic</em>.
          </h1>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-xl">
            Pilih dari 80+ koleksi frame estetik viral (Retro Polaroid, Newspaper, Music, Vintage Film, Y2K, Cute, Modern).
          </p>
        </div>

        {/* Brutalist Search Bar */}
        <div className="w-full md:w-80">
          <label htmlFor="template-search" className="font-editorial-mono block text-xs font-bold text-ink mb-1.5">
            CARI FRAME:
          </label>
          <div className="relative flex items-center">
            <input
              id="template-search"
              type="text"
              placeholder="Ketik nama atau tema..."
              value={searchQuery}
              onChange={e => onSearchQueryChange(e.target.value)}
              className="w-full bg-white border-[2.5px] border-ink rounded-2xl px-4 py-2.5 pr-10 text-sm font-medium text-ink placeholder:text-muted focus:shadow-stk-sm focus:outline-none"
            />
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onSearchQueryChange('');
                }}
                className="absolute right-3 p-1 text-ink/60 hover:text-ink cursor-pointer"
                aria-label="Hapus teks pencarian"
              >
                <X size={16} />
              </button>
            ) : (
              <Search size={16} className="absolute right-3 text-muted pointer-events-none" />
            )}
          </div>
        </div>
      </div>

      {/* ── CATEGORY PILLS (CHIPS) ── */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-2 no-scrollbar">
        {categories.map(cat => {
          const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              type="button"
              onClick={() => {
                playClickSound();
                onSelectCategory(cat);
              }}
              className={`px-4 py-2 rounded-full font-mono text-xs font-bold uppercase tracking-wider border-2 border-ink transition-all cursor-pointer shrink-0 select-none ${
                isActive
                  ? 'bg-brand text-white shadow-stk-sm'
                  : 'bg-white text-ink hover:bg-brand-tint'
              }`}
            >
              {cat === 'All' ? '✦ SEMUA FRAME' : cat}
            </button>
          );
        })}
      </div>

      {/* ── TEMPLATES GRID (STICKER CARDS) ── */}
      {filteredTemplates.length === 0 ? (
        <div className="py-16 text-center space-y-4 bg-white rounded-3xl border-[2.5px] border-ink p-8 shadow-stk max-w-lg mx-auto">
          <div className="inline-flex p-3 rounded-full bg-brand-tint border-2 border-ink text-brand font-display text-2xl">
            ✦
          </div>
          <p className="font-display text-2xl text-ink uppercase">
            {searchQuery ? 'Frame Tidak Ditemukan' : 'Semua Frame Telah Dikosongkan'}
          </p>
          <p className="text-muted text-xs sm:text-sm leading-relaxed max-w-md mx-auto">
            {searchQuery
              ? `Tidak ada template yang cocok dengan kata kunci "${searchQuery}".`
              : 'Seluruh template frame lama telah dihapus sesuai permintaan. Anda dapat menginstruksikan frame baru yang diinginkan, atau langsung mencoba kamera studio.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            {searchQuery ? (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onSearchQueryChange('');
                  onSelectCategory('All');
                }}
                className="btn-brutal btn-brutal-brand text-xs py-2 px-4"
              >
                <span>Reset Pencarian</span>
                <span>↺</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  onConfirmTemplate();
                }}
                className="btn-brutal text-xs py-3 px-5"
              >
                <Camera size={16} />
                <span>Coba Kamera Studio (Default Strip)</span>
                <span>↗</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTemplates.map((tpl, idx) => {
            const isSelected = selectedTpl.id === tpl.id;
            const tilt = idx % 2 === 0 ? 'card-tilt-odd' : 'card-tilt-even';

            return (
              <article
                key={tpl.id}
                onClick={() => {
                  playClickSound();
                  onSelectTemplate(tpl);
                }}
                className={`card-sticker ${tilt} cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'border-[3px] border-brand shadow-[8px_8px_0_#3a21c4] bg-[#faf8ff]'
                    : 'hover:border-ink'
                }`}
              >
                {/* Selected Check Badge */}
                {isSelected && (
                  <div className="absolute -top-3 -right-3 z-20 bg-lime text-ink border-2 border-ink px-2.5 py-1 rounded-full font-mono text-[11px] font-black shadow-stk-sm flex items-center gap-1">
                    <Check size={12} strokeWidth={3} />
                    <span>ACTIVE</span>
                  </div>
                )}

                <div>
                  {/* Card Meta */}
                  <div className="flex items-center justify-between mb-3 font-editorial-mono text-[11px]">
                    <span className="text-brand font-bold">
                      {`#${tpl.id}`}
                    </span>
                    <span className="text-muted">
                      {tpl.category}
                    </span>
                  </div>

                  {/* Thumbnail Container */}
                  <div className="relative aspect-[3/4] bg-brand-tint rounded-2xl border-2 border-ink p-2 flex items-center justify-center overflow-hidden group">
                    <img
                      src={tpl.thumb}
                      alt={tpl.name}
                      className="h-full w-auto object-contain transition-transform duration-200 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-display text-lg text-ink uppercase mt-3 leading-snug line-clamp-1">
                    {tpl.name.replace(/^[^\w\s]+/, '').trim()}
                  </h3>
                </div>

                {/* Footer Tag */}
                <div className="mt-4 pt-3 border-t-2 border-ink flex items-center justify-between font-mono text-[11px]">
                  <span className="chip-brutal text-[10px] py-0.5 px-2">
                    {tpl.totalPhoto} POSES
                  </span>
                  <span className="font-bold text-brand">
                    {isSelected ? '✓ Terpilih' : 'Pilih ⟶'}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* ── FLOATING TACTILE ACTION DOCK (STICKY BOTTOM) ── */}
      <aside aria-label="Aksi konfirmasi template" className="fixed bottom-6 left-4 right-4 z-30 max-w-2xl mx-auto">
        <div className="bg-white border-[2.5px] border-ink rounded-3xl p-4 shadow-[8px_8px_0_#0e0b1f] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-12 rounded-xl border-2 border-ink bg-brand-tint overflow-hidden shrink-0 flex items-center justify-center p-1">
              <img
                src={selectedTpl.thumb}
                alt={selectedTpl.name}
                className="h-full w-auto object-contain"
              />
            </div>
            <div className="truncate">
              <span className="font-editorial-mono text-[10px] text-brand block">
                TEMPLATE TERPILIH
              </span>
              <h4 className="font-display text-sm text-ink uppercase truncate">
                {selectedTpl.name.replace(/^[^\w\s]+/, '').trim()}
              </h4>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              playClickSound();
              onConfirmTemplate();
            }}
            className="btn-brutal shrink-0 text-xs sm:text-sm py-3 px-5 shadow-stk-sm"
          >
            <Camera size={16} />
            <span>Buka Kamera Studio</span>
            <span>↗</span>
          </button>
        </div>
      </aside>
    </div>
  );
};
