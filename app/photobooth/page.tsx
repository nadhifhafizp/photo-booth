'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, Download, RefreshCw, Image as ImageIcon, Grid, LayoutTemplate, Check, Sparkles } from 'lucide-react';
import clsx from 'clsx';

// --- KONFIGURASI LAYOUT & BACKGROUND ---
type LayoutType = 'single' | 'grid4' | 'grid6';
type BgTheme = 'green' | 'white' | 'dark' | 'batik';

const LAYOUTS = [
  { id: 'single', label: 'Single', count: 1, icon: <ImageIcon size={24} /> },
  { id: 'grid4', label: 'Grid 2x2', count: 4, icon: <Grid size={24} /> },
  { id: 'grid6', label: 'Grid 2x3', count: 6, icon: <LayoutTemplate size={24} /> },
];

const BACKGROUNDS = [
  { id: 'green', label: 'Hijau Desa', color: '#16a34a', textColor: '#ffffff' },
  { id: 'white', label: 'Putih Bersih', color: '#ffffff', textColor: '#166534' },
  { id: 'dark', label: 'Elegan', color: '#111827', textColor: '#f3f4f6' },
  { id: 'batik', label: 'Krem Klasik', color: '#fef3c7', textColor: '#78350f' }, 
];

export default function PhotoboothPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [photos, setPhotos] = useState<string[]>([]);
  const [finalImage, setFinalImage] = useState<string | null>(null);
  
  const [step, setStep] = useState<'setup' | 'capturing' | 'result'>('setup');
  const [selectedLayout, setSelectedLayout] = useState<LayoutType>('grid4');
  const [selectedBg, setSelectedBg] = useState<BgTheme>('green');
  
  const [countdown, setCountdown] = useState<number | null>(null);
  const [currentShot, setCurrentShot] = useState(0);
  const [isFlash, setIsFlash] = useState(false);

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) videoRef.current.srcObject = mediaStream;
    } catch (err) {
      console.error("Gagal akses kamera:", err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const startSession = () => {
    setStep('capturing');
    setPhotos([]);
    setCurrentShot(0);
    startCountdown(0);
  };

  const startCountdown = (shotIndex: number) => {
    setCurrentShot(shotIndex);
    setCountdown(3);
    
    let count = 3;
    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        takePhoto(shotIndex);
      }
    }, 1000);
  };

  const takePhoto = (shotIndex: number) => {
    if (!videoRef.current || !canvasRef.current) return;

    setIsFlash(true);
    setTimeout(() => setIsFlash(false), 200);

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      // Mirroring
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.setTransform(1, 0, 0, 1, 0, 0);

      const dataUrl = canvas.toDataURL('image/png');
      setPhotos(prev => [...prev, dataUrl]);

      const targetCount = LAYOUTS.find(l => l.id === selectedLayout)?.count || 1;
      
      if (shotIndex + 1 < targetCount) {
        setTimeout(() => startCountdown(shotIndex + 1), 1500);
      } else {
        const allPhotos = [...photos, dataUrl];
        setTimeout(() => generateFinalLayout(selectedLayout, selectedBg, allPhotos), 500);
      }
    }
  };

  const generateFinalLayout = async (layout: LayoutType, bgId: BgTheme, images: string[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let finalWidth = 1200;
    let finalHeight = 1800; 
    if (layout === 'single') finalHeight = 1600;

    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const bgConfig = BACKGROUNDS.find(b => b.id === bgId);
    ctx.fillStyle = bgConfig?.color || '#ffffff';
    ctx.fillRect(0, 0, finalWidth, finalHeight);

    const loadedImages = await Promise.all(images.map(src => {
        return new Promise<HTMLImageElement>((resolve) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.src = src;
        });
    }));

    const padding = 60;
    const footerSpace = 300; 
    const availableWidth = finalWidth - (padding * 2);
    const availableHeight = finalHeight - (padding * 2) - footerSpace;

    if (layout === 'single') {
        const imgH = availableWidth * 0.75; 
        const y = padding + (availableHeight - imgH) / 2;
        ctx.drawImage(loadedImages[0], padding, y, availableWidth, imgH);
    } 
    else if (layout === 'grid4') {
        const gap = 30;
        const imgW = (availableWidth - gap) / 2;
        const imgH = imgW * 0.75;
        const totalContentH = (imgH * 2) + gap;
        const startY = padding + (availableHeight - totalContentH) / 2;

        loadedImages.forEach((img, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = padding + col * (imgW + gap);
            const y = startY + row * (imgH + gap);
            ctx.drawImage(img, x, y, imgW, imgH);
        });
    } 
    else if (layout === 'grid6') {
        const gap = 20;
        const imgW = (availableWidth - gap) / 2;
        const imgH = imgW * 0.75;
        const startY = padding + 20;

        loadedImages.forEach((img, i) => {
            const col = i % 2;
            const row = Math.floor(i / 2);
            const x = padding + col * (imgW + gap);
            const y = startY + row * (imgH + gap);
            ctx.drawImage(img, x, y, imgW, imgH);
        });
    }

    // --- WATERMARK TULISAN ---
    ctx.fillStyle = bgConfig?.textColor || '#000000';
    ctx.textAlign = 'center';
    
    // Judul Besar
    ctx.font = 'bold 60px Inter, sans-serif';
    ctx.fillText('KKN UNSIKA', finalWidth / 2, finalHeight - 180);
    
    // Sub Judul
    ctx.font = '500 40px Inter, sans-serif';
    ctx.fillText('Desa Sukalaksana', finalWidth / 2, finalHeight - 120);

    // Tulisan Spesifik
    ctx.font = 'italic 24px Inter, sans-serif';
    ctx.globalAlpha = 0.8;
    ctx.fillText('Photobooth by KKN UNSIKA Desa Sukalaksana', finalWidth / 2, finalHeight - 50);

    setFinalImage(canvas.toDataURL('image/png'));
    setStep('result');
  };

  const downloadPhoto = () => {
    if (finalImage) {
      const link = document.createElement('a');
      link.href = finalImage;
      link.download = `photobooth-kkn-unsika-${Date.now()}.png`;
      link.click();
    }
  };

  return (
    // TAMBAHKAN CLASS 'pt-28' DI SINI
    // Ini memberi jarak padding-top agar konten turun ke bawah Navbar
    <main className="min-h-screen bg-slate-50 pt-28 pb-10 relative overflow-hidden font-sans">
      
      <div className="absolute inset-0 opacity-5 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] z-0 pointer-events-none"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-green-200/40 rounded-full blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] bg-green-300/30 rounded-full blur-3xl z-0 pointer-events-none"></div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center">
        
        {/* Header Teks */}
        <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Photobooth KKN</h1>
            <p className="text-green-600 font-medium">Abadikan Momen di Lokakarya Kecamatan</p>
        </div>

        {/* CONTAINER UTAMA */}
        <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-6xl overflow-hidden border border-slate-100 flex flex-col lg:flex-row min-h-[600px] lg:h-[700px]">
            
            {/* PANEL VISUAL */}
            <div className="relative w-full lg:w-2/3 bg-slate-900 flex items-center justify-center overflow-hidden group">
                <div className={clsx("absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300", isFlash ? "opacity-100" : "opacity-0")}></div>

                {step !== 'result' ? (
                    <div className="relative w-full h-full">
                        <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]" />
                        
                        {countdown !== null && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-40 animate-in fade-in">
                            <span className="text-[12rem] font-bold text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] animate-pulse">{countdown}</span>
                          </div>
                        )}

                        {step === 'capturing' && (
                            <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md text-white px-6 py-2 rounded-full font-bold shadow-lg border border-white/20">
                                Pose {currentShot + 1} / {LAYOUTS.find(l=>l.id===selectedLayout)?.count}
                            </div>
                        )}
                        <div className="absolute inset-0 opacity-20 pointer-events-none border-[12px] border-white/10"></div>
                    </div>
                ) : (
                    <div className="relative w-full h-full bg-slate-100 p-8 flex items-center justify-center">
                        <div className="relative h-full shadow-2xl transform transition hover:scale-[1.02] duration-300">
                           {finalImage && <img src={finalImage} alt="Hasil Foto" className="h-full w-auto object-contain rounded-sm bg-white" />}
                        </div>
                    </div>
                )}
                <canvas ref={canvasRef} className="hidden" />
            </div>

            {/* PANEL KONTROL */}
            <div className="w-full lg:w-1/3 bg-white p-6 lg:p-8 flex flex-col border-l border-slate-100 overflow-y-auto">
                {step === 'setup' && (
                    <div className="flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
                        <div className="mb-4">
                           <span className="text-green-600 font-bold uppercase text-xs tracking-wider">Langkah 1</span>
                           <h3 className="text-xl font-bold text-slate-800">Pilih Layout</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                            {LAYOUTS.map((l) => (
                                <button key={l.id} onClick={() => setSelectedLayout(l.id as LayoutType)} className={clsx("flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border transition-all duration-200", selectedLayout === l.id ? "border-green-600 bg-green-50 text-green-700 shadow-md scale-105" : "border-slate-200 bg-white text-slate-400 hover:border-green-300 hover:bg-slate-50")}>
                                    {l.icon}
                                    <span className="text-xs font-bold">{l.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mb-4">
                           <span className="text-green-600 font-bold uppercase text-xs tracking-wider">Langkah 2</span>
                           <h3 className="text-xl font-bold text-slate-800">Pilih Bingkai</h3>
                        </div>
                        <div className="flex flex-col gap-2 mb-auto">
                            {BACKGROUNDS.map((bg) => (
                                <button key={bg.id} onClick={() => setSelectedBg(bg.id as BgTheme)} className={clsx("flex items-center gap-3 p-3 px-4 rounded-xl border transition-all duration-200 w-full", selectedBg === bg.id ? "border-green-600 bg-white ring-1 ring-green-600 shadow-sm" : "border-slate-100 hover:bg-slate-50 hover:border-slate-300")}>
                                    <div className="w-8 h-8 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: bg.color }}></div>
                                    <span className={clsx("text-sm font-bold", selectedBg === bg.id ? "text-slate-900" : "text-slate-600")}>{bg.label}</span>
                                    {selectedBg === bg.id && <Check size={18} className="ml-auto text-green-600" />}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8">
                            <button onClick={startSession} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all active:scale-95 flex items-center justify-center gap-3">
                                <Camera size={24} /> Mulai Foto
                            </button>
                        </div>
                    </div>
                )}

                {step === 'capturing' && (
                    <div className="flex flex-col h-full items-center justify-center text-center animate-in zoom-in-95 duration-300">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-green-200 rounded-full blur-xl opacity-50 animate-pulse"></div>
                            <div className="relative bg-white p-4 rounded-full shadow-lg">
                                <Sparkles className="text-green-500 w-12 h-12 animate-spin-slow" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-800 mb-2">Bersiaplah!</h3>
                        <p className="text-slate-500 mb-6">Tahan senyum...</p>
                        <div className="flex gap-2 justify-center">
                             {Array.from({ length: LAYOUTS.find(l=>l.id===selectedLayout)?.count || 1 }).map((_, idx) => (
                                <div key={idx} className={clsx("w-3 h-3 rounded-full transition-colors", idx < photos.length ? "bg-green-500" : "bg-slate-200")}></div>
                             ))}
                        </div>
                    </div>
                )}

                {step === 'result' && (
                    <div className="flex flex-col h-full animate-in slide-in-from-right-8">
                        <div className="flex-1 flex flex-col items-center justify-center text-center">
                            <div className="bg-green-100 text-green-700 p-5 rounded-full mb-6 shadow-sm"><Check size={48} /></div>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Selesai!</h2>
                            <p className="text-slate-500 mb-8 text-sm">Foto siap disimpan.</p>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button onClick={downloadPhoto} className="w-full py-4 bg-green-600 hover:bg-green-700 text-white rounded-full font-bold shadow-lg hover:shadow-green-500/30 transition flex items-center justify-center gap-2 group">
                                <Download size={22} className="group-hover:-translate-y-1 transition" /> Simpan Foto
                            </button>
                            <button onClick={() => setStep('setup')} className="w-full py-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-full font-bold transition flex items-center justify-center gap-2">
                                <RefreshCw size={20} /> Foto Lagi
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
        
        {/* TULISAN DI UI HALAMAN BAWAH */}
        <p className="mt-8 text-slate-500 font-semibold text-sm">
             Photobooth by KKN UNSIKA Desa Sukalaksana
        </p>

      </div>
    </main>
  );
}