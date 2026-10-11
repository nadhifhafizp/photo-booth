'use client';

import React from 'react';
import { Check, Download, RefreshCw } from 'lucide-react';
import { FrameTemplate } from '@/app/photobooth/framesData';

interface ResultControlsProps {
  selectedTpl: FrameTemplate;
  templates: FrameTemplate[];
  onSwitchTemplate: (tpl: FrameTemplate) => void;
  onDownload: () => void;
  onReset: () => void;
}

export const ResultControls: React.FC<ResultControlsProps> = ({
  selectedTpl,
  templates,
  onSwitchTemplate,
  onDownload,
  onReset,
}) => {
  return (
    <div className="flex flex-col h-full justify-between gap-4 animate-in slide-in-from-right-8">
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--primary)' }}
          >
            <Check size={22} />
          </div>
          <div>
            <h2 className="text-xl font-black" style={{ color: 'var(--foreground)' }}>
              Strip Foto Siap!
            </h2>
            <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
              Frame: <strong style={{ color: 'var(--primary)' }}>{selectedTpl.name}</strong>
            </p>
          </div>
        </div>

        {/* Quick Change Frame Selector */}
        <div className="mt-3 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--muted-foreground)' }}>
              Coba Frame Lain (Tanpa Foto Ulang):
            </p>
            <span className="text-[10px] text-muted-foreground font-mono">
              {templates.length} Pilihan
            </span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 max-h-56 overflow-y-auto pr-0.5">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => onSwitchTemplate(t)}
                className="p-1 rounded-lg border text-left cursor-pointer transition hover:scale-105"
                style={{
                  borderColor: selectedTpl.id === t.id ? 'var(--primary)' : 'var(--border)',
                  background: selectedTpl.id === t.id ? 'rgba(34,197,94,0.1)' : 'var(--card)',
                }}
              >
                <img src={t.thumb} alt={t.name} className="w-full aspect-[3/4] object-cover rounded mb-1" />
                <p className="text-[9px] font-bold truncate" style={{ color: 'var(--foreground)' }}>
                  {t.name.split('–')[0]}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={onDownload}
          className="w-full py-4 rounded-xl font-black flex items-center justify-center gap-2 uppercase tracking-widest cursor-pointer transition hover:opacity-90 shadow-xl"
          style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
        >
          <Download size={18} /> Unduh Hasil Strip (HD PNG)
        </button>

        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl font-bold flex items-center justify-center gap-2 border cursor-pointer transition hover:opacity-80"
          style={{ background: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
        >
          <RefreshCw size={16} /> Ambil Foto Baru
        </button>
      </div>
    </div>
  );
};
