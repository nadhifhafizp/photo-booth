'use client';

import { useState, useRef, useEffect } from 'react';
import NextImage from 'next/image'; 
import Link from 'next/link';
import { Camera, Download, RefreshCw, Check, Sparkles, ChevronLeft, Palette, RectangleVertical } from 'lucide-react';
import clsx from 'clsx';
import FadeIn from '@/components/FadeIn';

// --- IMPORT FONT ---
import { Playfair_Display, DM_Sans } from 'next/font/google';

const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' });
const dmSans = DM_Sans({ subsets: ['latin'], variable: '--font-dm-sans' });

// --- KONFIGURASI LAYOUT ---
type LayoutType = 'strip';
const LAYOUTS = [
  { id: 'strip', label: 'Strip 1x3', count: 3, icon: <RectangleVertical size={20} /> },
];

// --- KONFIGURASI BACKGROUND ---
const BACKGROUNDS = [
  { 
    id: 'cute-paper', 
    label: 'Kertas & Stiker', 
    imageUrl: 'https://images.unsplash.com/photo-1606726426777-162c0569d5cb?q=80&w=1800&auto=format&fit=crop',
    thumbUrl: 'https://images.unsplash.com/photo-1606726426777-162c0569d5cb?q=80&w=100&auto=format&fit=crop',
    text: '#1e293b', 
    frameColor: '#ffffff',
    fallbackColor: '#f1f5f9'
  },
  { 
    id: 'vintage-floral', 
    label: 'Vintage Floral', 
    imageUrl: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=1800&auto=format&fit=crop',
    thumbUrl: 'https://images.unsplash.com/photo-1553531384-cc64ac80f931?q=80&w=100&auto=format&fit=crop',
    text: '#4a0404',
    frameColor: '#fffbeb',
    fallbackColor: '#fff7ed'
  },
  { 
    id: 'aesthetic-grid', 
    label: 'Jurnal Grid', 
    imageUrl: 'https://images.unsplash.com/photo-1616628188550-808682f3926d?q=80&w=1800&auto=format&fit=crop',
    thumbUrl: 'https://images.unsplash.com/photo-1616628188550-808682f3926d?q=80&w=100&auto=format&fit=crop',
    text: '#334155',
    frameColor: '#ffffff',
    fallbackColor: '#f8fafc'
  },
  { 
    id: 'pink-dream', 
    label: 'Pink Awan', 
    imageUrl: 'https://images.unsplash.com/photo-1603922412158-090254737077?q=80&w=1800&auto=format&fit=crop',
    thumbUrl: 'https://images.unsplash.com/photo-1603922412158-090254737077?q=80&w=100&auto=format&fit=crop',
    text: '#831843',
    frameColor: '#fdf2f8',
    fallbackColor: '#fce7f3'
  },
];

// --- FUNGSI HELPER YANG LEBIH AMAN ---
const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        // Hanya set crossOrigin jika URL eksternal (bukan base64 data)
        if (src.startsWith('http')) {
            img.crossOrigin = "anonymous";
        }
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`Gagal load gambar: ${src.substring(0, 30)}...`));
        img.src = src;
    });
};

export default function PhotoboothPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  const [step, setStep] = useState<'setup' | 'capturing' | 'result'>('setup');
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [selectedLayout] = useState<LayoutType>('strip'); 
  const [selectedBgId, setSelectedBgId] = useState<string>(BACKGROUNDS[0].id);

  const bgIdRef = useRef(selectedBgId);
  const photosRef = useRef<string[]>([]); 

  useEffect(() => { bgIdRef.current = selectedBgId; }, [selectedBgId]);

  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShot, setCurrentShot] = useState(0);
  const [isFlash, setIsFlash] = useState(false);

  // --- INIT KAMERA ---
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    const initCamera = async () => {
      if (step !== 'setup' && step !== 'capturing') return;
      try {
        if (stream) stream.getTracks().forEach(t => t.stop());
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        activeStream = mediaStream;
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.play().catch(console.error);
        }
      } catch (err) { console.error("Camera Error:", err); }
    };
    initCamera();
    return () => { if (activeStream) activeStream.getTracks().forEach(t => t.stop()); };
  }, [step]); 

  // --- LOGIKA SESI FOTO ---
  const startSession = () => {
    setPhotos([]); photosRef.current = []; 
    setStep('capturing'); setCurrentShot(0); startCountdown(0);
  };

  const startCountdown = (shotIndex: number) => {
    setCurrentShot(shotIndex); setCountdown(3);
    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) setCountdown(count);
      else { clearInterval(timer); setCountdown(null); takePhoto(shotIndex); }
    }, 1000);
  };

  const takePhoto = (shotIndex: number) => {
    if (!videoRef.current || !canvasRef.current) return;
    setIsFlash(true); setTimeout(() => setIsFlash(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth; canvas.height = video.videoHeight;
      ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const dataUrl = canvas.toDataURL('image/png');
      const newPhotos = [...photosRef.current, dataUrl];
      photosRef.current = newPhotos; setPhotos(newPhotos);

      const targetCount = LAYOUTS[0].count; 
      
      if (shotIndex + 1 < targetCount) setTimeout(() => startCountdown(shotIndex + 1), 1500);
      else {
         setIsGenerating(true);
         // Beri jeda sedikit agar state terupdate sebelum generate
         setTimeout(() => generateStripLayout(bgIdRef.current, photosRef.current), 500);
      }
    }
  };

  // --- GENERATOR GAMBAR ---
  const drawImageCover = (ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) => {
    const rSrc = img.width / img.height;
    const rDest = w / h;
    let sx = 0, sy = 0, sW = img.width, sH = img.height;
    if (rSrc > rDest) { sW = img.height * rDest; sx = (img.width - sW) / 2; } 
    else { sH = img.width / rDest; sy = (img.height - sH) / 2; }
    
    ctx.shadowColor = "rgba(0,0,0,0.08)"; ctx.shadowBlur = 8; ctx.shadowOffsetX = 2; ctx.shadowOffsetY = 2;
    ctx.drawImage(img, sx, sy, sW, sH, x, y, w, h);
    ctx.shadowColor = "transparent";
  };

  const generateStripLayout = async (bgId: string, images: string[]) => {
    try {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const fW = 600; const fH = 1800;
        canvas.width = fW; canvas.height = fH;

        const bgConfig = BACKGROUNDS.find(b => b.id === bgId) || BACKGROUNDS[0];

        // 1. Load Foto User (Wajib)
        const userPhotosImg = await Promise.all(images.map(src => loadImage(src)));

        // 2. Load Background (Opsional - dengan Fallback)
        let bgImg: HTMLImageElement | null = null;
        try {
            bgImg = await loadImage(bgConfig.imageUrl);
        } catch (e) {
            console.warn("Gagal load background, menggunakan warna solid.", e);
        }

        // 3. Draw Background
        if (bgImg) {
            drawImageCover(ctx, bgImg, 0, 0, fW, fH);
        } else {
            // Fallback jika gambar gagal
            ctx.fillStyle = bgConfig.fallbackColor || '#eeeeee';
            ctx.fillRect(0, 0, fW, fH);
        }

        // 4. Draw Foto User
        const paddingX = 55; const paddingTop = 60; const footerH = 260; const gap = 35;
        const availableH = fH - paddingTop - footerH;
        const photoW = fW - (paddingX * 2);
        const photoH = (availableH - (gap * 2)) / 3;

        userPhotosImg.forEach((img, i) => {
            const y = paddingTop + i * (photoH + gap);
            ctx.fillStyle = bgConfig.frameColor;
            ctx.shadowColor = "rgba(0,0,0,0.05)"; ctx.shadowBlur = 4;
            ctx.fillRect(paddingX - 12, y - 12, photoW + 24, photoH + 24);
            ctx.shadowColor = "transparent";
            drawImageCover(ctx, img, paddingX, y, photoW, photoH);
        });

        // 5. Watermark
        ctx.fillStyle = bgConfig.text; ctx.textAlign = 'center';
        ctx.font = 'bold 42px "Playfair Display", serif'; 
        ctx.fillText('KKN UNSIKA', fW/2, fH - 170);
        ctx.font = '500 24px "DM Sans", sans-serif'; 
        ctx.fillText('Desa Sukalaksana', fW/2, fH - 120);
        ctx.font = 'italic 16px "DM Sans", sans-serif'; ctx.globalAlpha = 0.6;
        ctx.fillText(`${new Date().toLocaleDateString('id-ID', {day: 'numeric', month: 'long', year: 'numeric'})}`, fW/2, fH - 70);

        setFinalImage(canvas.toDataURL('image/png', 1.0));
        setStep('result');
    } catch (error) {
        console.error("Gagal generate final layout:", error);
        alert("Terjadi kesalahan saat memproses foto.");
        setStep('setup'); // Kembali ke awal jika error fatal
    } finally {
        setIsGenerating(false);
    }
  };

  const download = () => {
    if(!finalImage) return;
    const a = document.createElement('a'); a.href = finalImage; 
    a.download = `photostrip-${Date.now()}.png`; a.click();
  };

  return (
    <main className={clsx("min-h-screen relative overflow-hidden pt-24 pb-10 flex flex-col items-center", playfair.variable, dmSans.variable, "font-sans")}>
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 z-0">
         <NextImage src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" alt="bg" fill className="object-cover" priority />
         <div className="absolute inset-0 bg-slate-900/60 mix-blend-multiply" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center h-full">
        <div className="w-full max-w-5xl mb-6">
            <Link href="/" className="inline-flex items-center gap-2 text-white/70 hover:text-white transition font-medium text-sm">
                <ChevronLeft size={16} /> Kembali
            </Link>
        </div>

        <FadeIn>
            <div className="text-center mb-8">
                <h1 className="text-5xl md:text-6xl font-bold text-white font-serif tracking-tight drop-shadow-2xl mb-2">
                    Photobooth <span className="text-green-400 italic font-light">Studio</span>
                </h1>
                <p className="text-slate-300 font-light tracking-widest text-sm uppercase">Premium Strip • Desa Sukalaksana</p>
            </div>
        </FadeIn>

        {/* INTERFACE */}
        <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl w-full max-w-5xl flex flex-col lg:flex-row overflow-hidden min-h-150 animate-in zoom-in-95 duration-500 relative">
            
            {isGenerating && (
                 <div className="absolute inset-0 z-60 bg-black/50 backdrop-blur-md flex flex-col items-center justify-center text-white animate-in fade-in">
                     <Sparkles size={40} className="animate-spin-slow mb-4 text-green-400"/>
                     <p className="font-serif text-xl">Sedang mencetak kenangan...</p>
                 </div>
            )}

            {/* KIRI: VISUAL */}
            <div className="relative w-full lg:w-2/3 bg-black/40 flex items-center justify-center p-6">
                
                {step !== 'result' ? (
                    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-white/10 shadow-inner bg-slate-900 aspect-3/4 max-w-125">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                        
                        {countdown !== null && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                            <span className="text-[10rem] font-serif font-bold text-white animate-ping">{countdown}</span>
                          </div>
                        )}

                        <div className={clsx("absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-150", isFlash ? "opacity-100" : "opacity-0")}></div>

                        {step === 'capturing' && (
                            <div className="absolute top-4 right-4 bg-red-500/90 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg animate-pulse">
                                REC • {currentShot + 1}/3
                            </div>
                        )}
                        
                        <div className="absolute inset-0 border-2 border-white/20 grid grid-rows-3 pointer-events-none">
                            <div className="border-b border-white/20"></div><div className="border-b border-white/20"></div>
                        </div>
                    </div>
                ) : (
                    <div className="relative h-full flex items-center justify-center p-4 animate-in fade-in zoom-in duration-500">
                        {finalImage && <img src={finalImage} alt="Hasil" className="h-full w-auto object-contain rounded shadow-2xl border-4 border-white" />}
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* KANAN: KONTROL */}
            <div className="w-full lg:w-1/3 bg-white/90 backdrop-blur-xl p-8 flex flex-col border-l border-white/20">
                
                {step === 'setup' && (
                    <div className="flex flex-col h-full animate-in slide-in-from-right-8">
                        <div className="mb-2 text-center">
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-full text-green-700 mb-2"><RectangleVertical size={24} /></div>
                            <h3 className="text-xl font-bold text-slate-800">Strip Photomatic</h3>
                            <p className="text-xs text-slate-500 mb-6">Tiga pose, satu cerita.</p>
                        </div>

                        <div className="mb-auto">
                            <div className="flex items-center gap-2 mb-3 text-slate-500 border-b pb-2">
                                <Palette size={16} /> <span className="text-xs font-bold uppercase tracking-widest">Tema Latar</span>
                            </div>
                            <div className="space-y-2 h-70 overflow-y-auto pr-1 custom-scrollbar">
                                {BACKGROUNDS.map(bg => (
                                    <button key={bg.id} onClick={()=>setSelectedBgId(bg.id)}
                                        className={clsx("w-full flex items-center gap-3 p-2 rounded-xl border transition-all relative overflow-hidden group", 
                                        selectedBgId === bg.id ? "border-green-500 ring-2 ring-green-500" : "border-slate-200 hover:border-green-300")}>
                                        <div className="w-12 h-12 rounded-lg shadow-sm relative overflow-hidden shrink-0 bg-slate-100">
                                            <NextImage src={bg.thumbUrl} alt={bg.label} fill className="object-cover" />
                                        </div>
                                        <div className="text-left flex-1 z-10">
                                            <div className={clsx("text-sm font-bold", selectedBgId===bg.id ? "text-slate-900":"text-slate-600")}>{bg.label}</div>
                                        </div>
                                        {selectedBgId===bg.id && <div className="bg-green-500 rounded-full p-1 text-white shadow-sm z-10"><Check size={14}/></div>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button onClick={startSession} disabled={isGenerating} className="mt-6 w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50">
                            <Camera size={20} /> Mulai Foto
                        </button>
                    </div>
                )}

                {/* LOGIKA TAMPILAN CAPTURING & RESULT SAMA SEPERTI SEBELUMNYA */}
                {step === 'capturing' && (
                    <div className="flex flex-col h-full justify-center items-center text-center animate-in zoom-in-95">
                        <div className="mb-6 relative">
                            <div className="absolute inset-0 bg-green-400 blur-xl opacity-30 animate-pulse rounded-full"></div>
                            <Sparkles size={48} className="text-green-600 relative z-10 animate-spin-slow" />
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-800">Bersiaplah!</h3>
                        <p className="text-slate-500 mb-8">Pose terbaikmu...</p>
                        <div className="flex flex-col gap-2 items-center">
                            {Array.from({length: 3}).map((_,i) => (
                                <div key={i} className={clsx("w-3 h-3 rounded-full transition-all", i<photos.length ? "bg-green-500 scale-125":"bg-slate-200")}></div>
                            ))}
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div className="flex flex-col h-full justify-center animate-in slide-in-from-right-8">
                        <div className="text-center mb-8">
                            <div className="inline-block p-4 rounded-full bg-green-100 text-green-700 mb-4 shadow-sm"><Check size={32}/></div>
                            <h2 className="text-2xl font-serif font-bold text-slate-800">Selesai!</h2>
                            <p className="text-slate-500 text-sm">Siap dicetak & dibagikan.</p>
                        </div>
                        <div className="space-y-3">
                            <button onClick={download} className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition shadow-lg">
                                <Download size={18} /> Simpan
                            </button>
                            <button onClick={() => { setFinalImage(null); setPhotos([]); photosRef.current=[]; setStep('setup'); }} 
                                className="w-full py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-50 transition">
                                <RefreshCw size={18} /> Ulangi
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
        <p className="mt-8 text-white/50 font-light text-[10px] tracking-widest uppercase">© 2026 KKN UNSIKA Desa Sukalaksana</p>
      </div>
    </main>
  );
}