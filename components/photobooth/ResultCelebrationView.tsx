'use client';

import React, { useState, useEffect } from 'react';
import {
  Download,
  Share2,
  Check,
  Printer,
  RotateCcw,
  Palette,
  ArrowRight,
  QrCode,
  Maximize2,
  Copy,
  ExternalLink,
  X,
  Loader2,
} from 'lucide-react';
import QRCode from 'qrcode';
import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';
import { playClickSound } from '@/lib/sfx';

interface ResultCelebrationViewProps {
  finalImage: string;
  finalGif?: string | null;
  selectedTpl: FrameTemplate;
  templates: FrameTemplate[];
  onSwitchTemplate: (tpl: FrameTemplate) => void;
  onDownload: () => void;
  onDownloadGif?: () => void;
  onReset: () => void;
  selectedFilter: FilterType;
  onChangeFilter: (f: FilterType) => void;
  onBackToCatalog: () => void;
}

export const ResultCelebrationView: React.FC<ResultCelebrationViewProps> = ({
  finalImage,
  finalGif,
  selectedTpl,
  templates,
  onSwitchTemplate,
  onDownload,
  onDownloadGif,
  onReset,
  selectedFilter,
  onChangeFilter,
}) => {
  const [activeMedia, setActiveMedia] = useState<'strip' | 'gif'>('strip');
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [showFilterPicker, setShowFilterPicker] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);

  // Dynamic QR Code & Share State
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string | null>(null);
  const [isUploadingShare, setIsUploadingShare] = useState<boolean>(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Auto-generate share link & barcode when final image is available
  useEffect(() => {
    let isMounted = true;

    async function generateMobileShare() {
      if (!finalImage) return;

      setIsUploadingShare(true);
      setShareError(null);

      try {
        const res = await fetch('/api/share', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: finalImage,
            gif: finalGif || null,
            templateName: selectedTpl.name,
          }),
        });

        if (!res.ok) {
          throw new Error('Gagal menyiapkan tautan barcode');
        }

        const data = await res.json();
        if (!isMounted) return;

        // If running locally, prefer local LAN address so smartphones on Wi-Fi can scan and open
        const isLocal =
          typeof window !== 'undefined' &&
          (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

        const resolvedOrigin =
          isLocal && data.lanHost
            ? `${window.location.protocol}//${data.lanHost}`
            : window.location.origin;

        const targetUrl = `${resolvedOrigin}${data.sharePath}`;
        setShareUrl(targetUrl);

        const qrData = await QRCode.toDataURL(targetUrl, {
          width: 360,
          margin: 2,
          color: {
            dark: '#0e0b1f',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        });

        if (isMounted) {
          setQrCodeDataUrl(qrData);
        }
      } catch (err: unknown) {
        if (isMounted) {
          console.error('Gagal membuat barcode share:', err);
          setShareError('Gagal membuat barcode. Coba lagi.');
        }
      } finally {
        if (isMounted) {
          setIsUploadingShare(false);
        }
      }
    }

    generateMobileShare();

    return () => {
      isMounted = false;
    };
  }, [finalImage, finalGif, selectedTpl.name]);

  const handleCopyLink = async () => {
    playClickSound();
    const urlToCopy = shareUrl || window.location.href;
    try {
      await navigator.clipboard.writeText(urlToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleShare = async () => {
    playClickSound();
    const urlToShare = shareUrl || window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Snaporia Photobooth Strip',
          text: 'Lihat photostrip dan animated GIF kami yang baru saja dibuat di Snaporia!',
          url: urlToShare,
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

  const isGifActive = activeMedia === 'gif' && !!finalGif;

  // Keyboard accessibility for QR modal (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowQrModal(false);
      }
    };
    if (showQrModal) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showQrModal]);

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-8 pb-20 sm:pb-28 flex flex-col lg:flex-row gap-6 sm:gap-10 lg:gap-14 items-center justify-center animate-in fade-in duration-200">

      {/* ── LEFT: PHOTOSTRIP / GIF DISPLAY ── */}
      <div className="w-full lg:w-[46%] flex flex-col items-center justify-center relative gap-3">
        {/* Media Switcher Pills (PHOTOSTRIP vs GIF) */}
        {finalGif && (
          <div className="inline-flex items-center gap-1.5 p-1 bg-white border-2 border-ink rounded-full shadow-stk-sm z-30 select-none">
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveMedia('strip');
              }}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMedia === 'strip'
                  ? 'bg-brand text-white shadow-stk-sm'
                  : 'text-ink hover:text-brand'
              }`}
            >
              <span>📸 Strip Foto</span>
            </button>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setActiveMedia('gif');
              }}
              className={`px-3.5 py-1.5 rounded-full font-mono text-[11px] font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMedia === 'gif'
                  ? 'bg-lime text-ink shadow-stk-sm'
                  : 'text-ink hover:text-brand'
              }`}
            >
              <span>🎬 Motion GIF</span>
              <span className="bg-ink text-lime text-[9px] px-1 rounded-full font-black">LIVE</span>
            </button>
          </div>
        )}

        <div className="relative w-full flex items-center justify-center">
          {/* Floating Sticker: READY */}
          <div className="absolute -top-3 -left-1 sm:-top-4 sm:-left-2 z-20 bg-lime text-ink font-mono font-black text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border-2 border-ink shadow-stk-sm rotate-[-6deg]">
            {isGifActive ? 'MOTION LOOP 🎬' : 'READY ✓'}
          </div>

          {/* Floating Sticker: Format */}
          <div className="absolute -bottom-2.5 -right-1 sm:-bottom-3 sm:-right-2 z-20 bg-yellow text-ink font-mono font-black text-[10px] sm:text-xs px-2.5 sm:px-3.5 py-1 sm:py-1.5 rounded-full border-2 border-ink shadow-stk-sm rotate-[4deg]">
            {isGifActive ? '★ ANIMATED GIF' : '★ 300 DPI HD'}
          </div>

          {/* Media Container */}
          <div className="bg-white border-[2.5px] sm:border-[3px] border-ink p-3 sm:p-6 rounded-2xl sm:rounded-3xl shadow-[8px_8px_0_#0e0b1f] sm:shadow-[12px_12px_0_#0e0b1f] max-w-xs sm:max-w-sm w-full flex items-center justify-center rotate-0 sm:-rotate-2 hover:rotate-0 transition-transform duration-300">
            {isGifActive ? (
              <img
                src={finalGif}
                alt="Hasil Animated GIF Snaporia"
                className="max-h-[55vh] sm:max-h-[70vh] w-auto object-contain rounded-lg sm:rounded-xl border-2 border-ink shadow-sm"
              />
            ) : (
              <img
                src={finalImage}
                alt="Hasil Photostrip Snaporia"
                className="max-h-[55vh] sm:max-h-[70vh] w-auto object-contain rounded-lg sm:rounded-xl border-2 border-ink shadow-sm"
              />
            )}
          </div>
        </div>
      </div>

      {/* ── RIGHT: CELEBRATION ACTIONS & DETAILS ── */}
      <div className="w-full lg:w-[54%] flex flex-col gap-4 sm:gap-6">
        {/* Main Headline */}
        <div>
          <p className="font-editorial-mono text-brand font-bold mb-1.5 sm:mb-2 text-[11px] sm:text-xs">
            03 / FINAL {isGifActive ? 'MOTION GIF' : 'PHOTOSTRIP'}
          </p>
          <h1 className="text-3xl sm:text-5xl md:text-6xl text-ink font-display leading-[0.95]">
            {isGifActive ? 'MOTION IS ' : 'STRIP IS '}
            <em className="accent">ready.</em>
          </h1>
          <p className="text-muted text-xs sm:text-base mt-2 max-w-lg leading-relaxed">
            {isGifActive
              ? 'Animated Boomerang GIF siap diunduh dan dibagikan ke Instagram Story & TikTok.'
              : 'Simpan photostrip ini dalam resolusi tinggi atau cetak langsung.'}
          </p>
        </div>

        {/* Action Buttons Grid (Neo-brutalist) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 max-w-md w-full">
          {/* Download Strip Foto (PNG) Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              onDownload();
            }}
            className={`btn-brutal py-3 sm:py-3.5 px-4 sm:px-5 text-xs sm:text-sm min-h-[44px] ${
              !isGifActive ? 'bg-lime text-ink shadow-stk-sm' : 'btn-brutal-white'
            }`}
          >
            <Download size={18} />
            <span>Download Foto (PNG)</span>
          </button>

          {/* Download Motion Strip (GIF) Button */}
          {finalGif ? (
            <button
              type="button"
              onClick={() => {
                playClickSound();
                onDownloadGif?.();
              }}
              className={`btn-brutal py-3 sm:py-3.5 px-4 sm:px-5 text-xs sm:text-sm min-h-[44px] ${
                isGifActive ? 'bg-lime text-ink shadow-stk-sm' : 'btn-brutal-brand'
              }`}
            >
              <Download size={18} />
              <span>Download Motion (GIF)</span>
            </button>
          ) : (
            <button
              type="button"
              disabled
              className="btn-brutal btn-brutal-white opacity-60 cursor-not-allowed py-3 sm:py-3.5 px-4 sm:px-5 text-xs sm:text-sm min-h-[44px]"
            >
              <Download size={18} />
              <span>Motion Sedang Diproses</span>
            </button>
          )}

          {/* Print Button (Photostrip) */}
          <button
            type="button"
            onClick={handlePrint}
            className="btn-brutal btn-brutal-white py-3 sm:py-3.5 px-5 sm:px-6 text-xs sm:text-sm min-h-[44px]"
          >
            <Printer size={18} />
            <span>Cetak ⎙</span>
          </button>

          {/* Tone Selector Trigger */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setShowFilterPicker(!showFilterPicker);
            }}
            className="btn-brutal btn-brutal-white py-2.5 sm:py-3 px-4 sm:px-5 text-xs min-h-[44px]"
          >
            <Palette size={16} />
            <span>Ganti Tone ✦</span>
          </button>

          {/* Copy / Share */}
          <button
            type="button"
            onClick={handleShare}
            className="btn-brutal btn-brutal-white py-2.5 sm:py-3 px-4 sm:px-5 text-xs min-h-[44px]"
          >
            {shared || copied ? <Check size={16} className="text-brand font-bold" /> : <Share2 size={16} />}
            <span>{shared || copied ? 'Tersalin!' : 'Bagikan ↗'}</span>
          </button>
        </div>

        {/* Tone Picker Expansion (if opened) */}
        {showFilterPicker && (
          <div className="p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border-[2.5px] border-ink shadow-stk-sm flex flex-col gap-2 max-w-md animate-in fade-in duration-150">
            <span className="font-editorial-mono text-[10px] sm:text-[11px] text-ink font-bold uppercase">
              UBAH TONE PHOTOSTRIP (INSTAN):
            </span>
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
              {FILTERS.map(f => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onChangeFilter(f.id);
                  }}
                  className={`py-2 px-1 rounded-xl font-mono text-[11px] sm:text-xs font-bold border-2 border-ink transition-all cursor-pointer text-center select-none min-h-[38px] ${
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

        {/* Real Dynamic QR Code Sticker Card for Mobile Transfer */}
        <div className="max-w-md p-4 sm:p-5 bg-white rounded-2xl sm:rounded-3xl border-[2.5px] border-ink shadow-stk flex flex-col gap-3">
          <div className="flex items-center gap-3 sm:gap-4">
            {/* QR Thumbnail */}
            <button
              type="button"
              onClick={() => {
                if (qrCodeDataUrl) {
                  playClickSound();
                  setShowQrModal(true);
                }
              }}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl border-2 border-ink bg-yellow p-1.5 shrink-0 flex items-center justify-center shadow-stk-sm relative cursor-pointer group hover:scale-105 transition-transform"
              title="Klik untuk perbesar barcode QR"
              aria-label="Perbesar barcode QR"
            >
              {isUploadingShare ? (
                <div className="flex flex-col items-center justify-center text-ink gap-1">
                  <Loader2 size={20} className="animate-spin text-ink" />
                  <span className="font-mono text-[8px] font-bold">PROSES</span>
                </div>
              ) : qrCodeDataUrl ? (
                <>
                  <img
                    src={qrCodeDataUrl}
                    alt="Barcode QR Snaporia"
                    className="w-full h-full object-contain rounded-lg"
                  />
                  <div className="absolute inset-0 bg-ink/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 size={16} className="text-ink bg-white/90 p-0.5 rounded shadow-sm" />
                  </div>
                </>
              ) : (
                <QrCode size={28} className="text-ink" />
              )}
            </button>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className="font-display text-sm sm:text-base text-ink uppercase leading-tight">
                  Scan Barcode ke HP
                </h4>
                {qrCodeDataUrl && (
                  <span className="bg-lime text-ink font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-ink">
                    AKTIF ✓
                  </span>
                )}
              </div>
              <p className="text-[11px] sm:text-xs text-muted mt-1 leading-relaxed">
                Arahkan kamera ponsel Anda ke barcode untuk langsung melihat dan mengunduh photostrip ini di HP.
              </p>
            </div>
          </div>

          {/* Quick Share Link & Expand Action Buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-ink/20">
            {qrCodeDataUrl && (
              <button
                type="button"
                onClick={() => {
                  playClickSound();
                  setShowQrModal(true);
                }}
                className="btn-brutal btn-brutal-white text-[11px] py-1.5 px-3 flex-1 justify-center min-h-[36px]"
              >
                <Maximize2 size={12} />
                <span>Perbesar Barcode</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyLink}
              className="btn-brutal btn-brutal-white text-[11px] py-1.5 px-3 flex-1 justify-center min-h-[36px]"
            >
              {copied ? <Check size={12} className="text-brand" /> : <Copy size={12} />}
              <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
            </button>

            {shareUrl && (
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="btn-brutal btn-brutal-white text-[11px] py-1.5 px-2.5 justify-center min-h-[36px] inline-flex items-center"
                title="Buka langsung tautan di tab baru"
              >
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Reset / Switch Template Options */}
        <div className="pt-2 border-t-2 border-ink max-w-md flex flex-col gap-2.5 sm:gap-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-bold text-muted">Mau coba gaya lain?</span>
            <button
              type="button"
              onClick={() => {
                playClickSound();
                setShowTemplatePicker(!showTemplatePicker);
              }}
              className="font-mono text-xs font-bold text-brand hover:underline flex items-center gap-1 cursor-pointer min-h-[36px]"
            >
              <span>Pilih frame baru</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {showTemplatePicker && (
            <div className="grid grid-cols-4 gap-1.5 sm:gap-2 pt-1 animate-in fade-in duration-150">
              {templates.slice(0, 8).map(tpl => (
                <button
                  key={tpl.id}
                  type="button"
                  onClick={() => {
                    playClickSound();
                    onSwitchTemplate(tpl);
                  }}
                  className={`p-1 sm:p-1.5 rounded-xl border-2 border-ink text-center transition cursor-pointer hover:scale-105 bg-white ${
                    selectedTpl.id === tpl.id ? 'ring-2 ring-brand' : ''
                  }`}
                >
                  <img src={tpl.thumb} alt={tpl.name} className="w-full aspect-[9/16] object-contain rounded mb-1" />
                  <span className="font-mono text-[8px] sm:text-[9px] font-bold block truncate text-ink">
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
            className="btn-brutal btn-brutal-brand text-xs py-3 px-5 justify-center mt-1 sm:mt-2 min-h-[44px]"
          >
            <RotateCcw size={14} />
            <span>Mulai Sesi Baru</span>
            <span>↺</span>
          </button>
        </div>

      </div>

      {/* ── EXPANDED QR CODE MODAL ── */}
      {showQrModal && qrCodeDataUrl && (
        <div
          className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-white border-[3px] border-ink rounded-3xl p-6 sm:p-8 max-w-sm w-full shadow-stk flex flex-col items-center gap-4 relative"
            onClick={e => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full border-2 border-ink bg-paper hover:bg-brand hover:text-white transition cursor-pointer"
              aria-label="Tutup"
            >
              <X size={16} />
            </button>

            <div className="text-center">
              <span className="bg-yellow text-ink font-mono text-[10px] font-bold px-2 py-0.5 rounded-full border border-ink uppercase">
                MOBILE TRANSFER INSTAN
              </span>
              <h3 className="font-display text-xl sm:text-2xl text-ink mt-1.5">
                Scan Barcode ini di HP
              </h3>
              <p className="text-xs text-muted mt-1 font-mono">
                Buka kamera ponsel & arahkan langsung ke barcode
              </p>
            </div>

            {/* Large QR Display */}
            <div className="p-3 bg-white border-2 border-ink rounded-2xl shadow-stk-sm">
              <img
                src={qrCodeDataUrl}
                alt="Barcode QR Snaporia"
                className="w-56 h-56 sm:w-64 sm:h-64 object-contain"
              />
            </div>

            {/* Instruction Steps */}
            <div className="w-full bg-cream border border-ink/30 rounded-xl p-3 text-[11px] font-mono text-ink space-y-1">
              <div>1. Buka aplikasi Kamera di ponsel Anda.</div>
              <div>2. Arahkan lensa kamera ke barcode di atas.</div>
              <div>3. Tekan tautan yang muncul untuk membuka & mengunduh foto.</div>
            </div>

            {/* Actions */}
            <div className="w-full flex gap-2">
              <button
                type="button"
                onClick={handleCopyLink}
                className="btn-brutal btn-brutal-brand text-xs py-2.5 px-4 flex-1 justify-center min-h-[40px]"
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Tersalin!' : 'Salin Tautan'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowQrModal(false)}
                className="btn-brutal btn-brutal-white text-xs py-2.5 px-4 justify-center min-h-[40px]"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
