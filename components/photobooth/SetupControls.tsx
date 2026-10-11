'use client';

import React from 'react';
import { Camera, Layers, Sliders, Search, Check, X } from 'lucide-react';
import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';

interface SetupControlsProps {
  selectedTpl: FrameTemplate;
  onSelectTemplate: (tpl: FrameTemplate) => void;
  selectedFilter: FilterType;
  onSelectFilter: (f: FilterType) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories: string[];
  searchQuery: string;
  onSearchQueryChange: (q: string) => void;
  filteredTemplates: FrameTemplate[];
  totalTemplatesCount: number;
  onStartSession: () => void;
  canStart: boolean;
}

export const SetupControls: React.FC<SetupControlsProps> = ({
  selectedTpl,
  onSelectTemplate,
  selectedFilter,
  onSelectFilter,
  selectedCategory,
  onSelectCategory,
  categories,
  searchQuery,
  onSearchQueryChange,
  filteredTemplates,
  totalTemplatesCount,
  onStartSession,
  canStart,
}) => {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Title */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-black text-lg" style={{ color: 'var(--foreground)' }}>
            Pilih Frame Template
          </h3>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'var(--muted)', color: 'var(--primary)' }}
          >
            {selectedTpl.totalPhoto} Pose Foto
          </span>
        </div>
        <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
          Pilih dari {totalTemplatesCount} frame viral di bawah. Foto akan otomatis terpasang persis di bingkainya.
        </p>
      </div>

      {/* Search Input */}
      <div className="flex items-center gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs"
          style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
        >
          <Search size={14} style={{ color: 'var(--muted-foreground)' }} />
          <input
            type="text"
            placeholder="Cari frame (receipt, newspaper, snoopy, 1975...)"
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
            className="bg-transparent w-full text-xs outline-none"
            style={{ color: 'var(--foreground)' }}
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="text-[10px] text-muted-foreground hover:text-foreground font-bold px-1 flex items-center justify-center"
              aria-label="Hapus pencarian"
            >
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => onSelectCategory(cat)}
            className="px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0"
            style={{
              background: selectedCategory === cat ? 'var(--primary)' : 'var(--muted)',
              color: selectedCategory === cat ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            }}
          >
            {cat === 'All' ? 'Semua' : cat}
          </button>
        ))}
      </div>

      {/* Template Grid */}
      <div>
        <div
          className="flex items-center justify-between mb-2 pb-1.5 border-b text-xs font-semibold"
          style={{ borderColor: 'var(--border)', color: 'var(--muted-foreground)' }}
        >
          <div className="flex items-center gap-1.5">
            <Layers size={14} />
            <span>Katalog Frame ({filteredTemplates.length})</span>
          </div>
          <span className="text-xs font-mono opacity-70">
            Total {totalTemplatesCount} Frame
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2.5 max-h-72 overflow-y-auto pr-1">
          {filteredTemplates.map(tpl => {
            const isSelected = selectedTpl.id === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => onSelectTemplate(tpl)}
                className="relative rounded-xl overflow-hidden border-2 transition-all text-left group cursor-pointer"
                style={{
                  borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                }}
              >
                {/* Thumbnail */}
                <div className="aspect-[3/4] relative bg-neutral-900 overflow-hidden">
                  <img
                    src={tpl.thumb}
                    alt={tpl.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute bottom-1.5 left-1.5 px-1.5 py-0.5 rounded text-xs font-semibold backdrop-blur-sm"
                    style={{ background: 'rgba(0,0,0,0.7)', color: '#ffffff' }}
                  >
                    {tpl.totalPhoto} Pose
                  </div>
                  <div
                    className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-xs font-semibold backdrop-blur-sm"
                    style={{ background: 'rgba(0,0,0,0.65)', color: '#ffffff' }}
                  >
                    {tpl.category}
                  </div>
                </div>

                {/* Footer Label */}
                <div className="px-2 py-1.5 flex items-center justify-between" style={{ background: 'var(--card)' }}>
                  <span className="text-xs font-semibold truncate" style={{ color: 'var(--foreground)' }}>
                    {tpl.name}
                  </span>
                  {isSelected && (
                    <div
                      className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 ml-1"
                      style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
                    >
                      <Check size={10} />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tone Selector */}
      <div>
        <div
          className="flex items-center gap-1.5 text-xs font-semibold mb-1.5"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Sliders size={13} />
          <span>Tone Foto</span>
        </div>
        <div className="grid grid-cols-4 gap-1.5">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => onSelectFilter(f.id)}
              className="py-2 rounded-lg border text-xs font-semibold transition cursor-pointer"
              style={{
                borderColor: selectedFilter === f.id ? 'var(--primary)' : 'var(--border)',
                background: selectedFilter === f.id ? 'var(--primary)' : 'var(--card)',
                color: selectedFilter === f.id ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Start Button */}
      <button
        onClick={onStartSession}
        disabled={!canStart}
        className="mt-auto w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all hover:bg-pink-600 active:scale-95 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        <Camera size={18} />
        Mulai Foto ({selectedTpl.totalPhoto} Pose)
      </button>
    </div>
  );
};
