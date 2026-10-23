'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Download, Share2, Check, Camera, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { SnaporiaLogo } from '@/components/SnaporiaLogo';

interface SharedData {
  id: string;
  image: string;
  gif?: string | null;
  templateName?: string;
  createdAt?: number;
}

export default function SharedPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [data, setData] = useState<SharedData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMedia, setActiveMedia] = useState<'strip' | 'gif'>('strip');
  const [shared, setShared] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function fetchPhoto() {
      try {
        setIsLoading(true);
        setError(null);
        const res = await fetch(`/api/share/${id}`);
        if (!res.ok) {
          if (res.status === 404) {
            throw new Error('Photostrip tidak ditemukan atau sesi sudah kedaluwarsa.');
          }
          throw new Error('Gagal memuat photostrip. Silakan coba lagi.');
        }
        const json = await res.json();
        if (isMounted) {
          setData(json);
        }
      } catch (err: unknown) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    if (id) {
      fetchPhoto();
    }

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDownloadImage = () => {
    if (!data?.image) return;
    const a = document.createElement('a');
    a.href = data.image;
    a.download = `snaporia-photostrip-${id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleDownloadGif = () => {
    if (!data?.gif) return;
    const a = document.createElement('a');
    a.href = data.gif;
    a.download = `snaporia-motion-${id}.gif`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Snaporia Photostrip',
          text: 'Lihat photostrip kami dari Snaporia Photobooth!',
          url: window.location.href,
        });
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      } catch {
        // user cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    }
  };

  const isGifActive = activeMedia === 'gif' && Boolean(data?.gif);

  return (
    <div className="min-h-screen bg-cream text-ink flex flex-col selection:bg-brand selection:text-white">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b-[2.5px] border-ink px-4 py-3 sm:px-6">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <SnaporiaLogo size="sm" showText={false} />
            <span className="font-display text-lg sm:text-xl font-bold tracking-tight text-ink group-hover:text-brand transition-colors">
              SNAPORIA
            </span>
          </Link>
          <Link
            href="/photobooth"
            className="btn-brutal btn-brutal-brand text-xs py-2 px-3 sm:px-4 flex items-center gap-1.5 min-h-[40px]"
          >
            <Camera size={14} />
            <span className="hidden sm:inline">Buat Photostrip</span>
            <span className="sm:hidden">Foto Baru</span>
          </Link>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6 sm:py-10 max-w-2xl mx-auto w-full">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
            <div className="w-14 h-14 border-4 border-ink border-t-brand rounded-full animate-spin" />
            <div className="font-display text-lg text-ink">Mengambil Photostrip Anda...</div>
            <p className="font-mono text-xs text-muted">Sedang memuat gambar resolusi tinggi</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="w-full bg-white border-[2.5px] border-ink rounded-3xl p-6 sm:p-8 shadow-stk flex flex-col items-center text-center gap-4 animate-in fade-in">
            <div className="w-16 h-16 rounded-2xl bg-pink text-white flex items-center justify-center border-2 border-ink shadow-stk-sm">
              <AlertCircle size={32} />
            </div>
            <div>
              <h2 className="font-display text-xl sm:text-2xl text-ink">Foto Tidak Ditemukan</h2>
              <p className="font-mono text-xs text-muted mt-2 max-w-md leading-relaxed">{error}</p>
            </div>
            <Link
              href="/photobooth"
              className="btn-brutal btn-brutal-brand py-3 px-6 text-sm flex items-center gap-2 mt-2 min-h-[44px]"
            >
              <RefreshCw size={16} />
              <span>Mulai Foto di Photobooth</span>
            </Link>
          </div>
        )}

        {!isLoading && !error && data && (
          <div className="w-full flex flex-col items-center gap-5 sm:gap-6 animate-in fade-in duration-200">
            {/* Success Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-lime text-ink border-2 border-ink rounded-full shadow-stk-sm font-mono text-xs font-bold rotate-[-1deg]">
              <Sparkles size={14} />
              <span>PHOTOSTRIP BERHASIL DITERIMA ✓</span>
            </div>

            {/* Title / Description */}
            <div className="text-center">
              <h1 className="font-display text-2xl sm:text-4xl text-ink leading-tight">
                Simpan & Bagikan <em className="accent">Momenmu!</em>
              </h1>
              <p className="text-xs sm:text-sm text-muted mt-1 font-mono">
                Frame: <span className="text-ink font-bold">{data.templateName || 'Snaporia Custom'}</span>
              </p>
            </div>

            {/* Media Selector (Strip vs GIF) if GIF is available */}
            {data.gif && (
              <div className="inline-flex items-center gap-1.5 p-1 bg-white border-2 border-ink rounded-full shadow-stk-sm select-none">
                <button
                  type="button"
                  onClick={() => setActiveMedia('strip')}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
                    activeMedia === 'strip'
                      ? 'bg-brand text-white shadow-stk-sm'
                      : 'text-ink hover:text-brand'
                  }`}
                >
                  <span>📸 Strip Foto</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveMedia('gif')}
                  className={`px-3.5 py-1.5 rounded-full font-mono text-xs font-bold uppercase transition-all cursor-pointer flex items-center gap-1.5 min-h-[36px] ${
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

            {/* Photo / GIF Container */}
            <div className="relative w-full max-w-sm flex items-center justify-center p-3 sm:p-5 bg-white border-[2.5px] sm:border-[3px] border-ink rounded-2xl sm:rounded-3xl shadow-[8px_8px_0_#0e0b1f] sm:shadow-[12px_12px_0_#0e0b1f]">
              {isGifActive ? (
                <img
                  src={data.gif!}
                  alt="Snaporia Motion GIF"
                  className="max-h-[60vh] w-auto object-contain rounded-xl border-2 border-ink shadow-sm"
                />
              ) : (
                <img
                  src={data.image}
                  alt="Snaporia Photostrip"
                  className="max-h-[60vh] w-auto object-contain rounded-xl border-2 border-ink shadow-sm"
                />
              )}
            </div>

            {/* Download & Share Actions */}
            <div className="w-full max-w-sm flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleDownloadImage}
                className="btn-brutal btn-brutal-brand py-3.5 px-5 text-sm justify-center min-h-[44px]"
              >
                <Download size={18} />
                <span>Download Strip Foto (PNG)</span>
              </button>

              {data.gif && (
                <button
                  type="button"
                  onClick={handleDownloadGif}
                  className="btn-brutal btn-brutal-lime py-3.5 px-5 text-sm justify-center min-h-[44px]"
                >
                  <Download size={18} />
                  <span>Download Motion Loop (GIF)</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleShare}
                className="btn-brutal btn-brutal-white py-3 px-5 text-xs sm:text-sm justify-center min-h-[44px]"
              >
                {shared || copied ? <Check size={16} className="text-brand font-bold" /> : <Share2 size={16} />}
                <span>{shared || copied ? 'Tautan Berhasil Tersalin!' : 'Bagikan ke Teman / Sosmed'}</span>
              </button>
            </div>

            {/* Footer invite */}
            <div className="mt-4 pt-4 border-t-2 border-ink/20 text-center w-full max-w-sm">
              <p className="font-mono text-xs text-muted mb-2">Ingin coba gaya foto kamu sendiri?</p>
              <Link
                href="/photobooth"
                className="inline-flex items-center gap-1.5 font-display text-sm text-brand font-bold hover:underline"
              >
                <span>Buka Snaporia Studio Photobooth</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
