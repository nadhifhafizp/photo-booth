'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { REAL_TEMPLATES, FrameTemplate, FilterType, FILTERS } from './framesData';
import { renderRealStrip, logger } from '@/lib/canvasRenderer';
import { HeaderStepper } from '@/components/photobooth/HeaderStepper';
import { TemplateCatalogView } from '@/components/photobooth/TemplateCatalogView';
import { CameraStudioView } from '@/components/photobooth/CameraStudioView';
import { ResultCelebrationView } from '@/components/photobooth/ResultCelebrationView';

export default function PhotoboothPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Stepper state: 'setup' (Catalog) -> 'capturing' (Camera Studio) -> 'result' (Celebration)
  const [step, setStep] = useState<'setup' | 'capturing' | 'result'>('setup');

  // Core capture session data
  const [stream, setStream]             = useState<MediaStream | null>(null);
  const [photos, setPhotos]             = useState<string[]>([]);
  const [finalImage, setFinalImage]     = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Template & filter preferences
  const [selectedTplId, setSelectedTplId]       = useState<number | string>(REAL_TEMPLATES[0].id);
  const [selectedFilter, setSelectedFilter]     = useState<FilterType>(REAL_TEMPLATES[0].defaultFilter ?? 'bnw');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery]           = useState<string>('');

  // Camera settings & controls
  const [timerDuration, setTimerDuration] = useState<number>(3);
  const [isMirrored, setIsMirrored]       = useState<boolean>(true);
  const [countdown, setCountdown]         = useState<number | null>(null);
  const [currentShot, setCurrentShot]     = useState(0);
  const [isFlash, setIsFlash]             = useState(false);
  const [cameraError, setCameraError]     = useState<string | null>(null);
  const [retryCount, setRetryCount]       = useState(0);
  const [isCapturing, setIsCapturing]     = useState(false);

  // Refs for async timer callbacks
  const tplRef      = useRef(REAL_TEMPLATES[0]);
  const filterRef   = useRef(selectedFilter);
  const photosRef   = useRef<string[]>([]);
  const timerDurRef = useRef(timerDuration);

  const selectedTpl = REAL_TEMPLATES.find(t => t.id === selectedTplId) ?? REAL_TEMPLATES[0];

  useEffect(() => { tplRef.current = selectedTpl; }, [selectedTpl]);
  useEffect(() => { filterRef.current = selectedFilter; }, [selectedFilter]);
  useEffect(() => { timerDurRef.current = timerDuration; }, [timerDuration]);

  // Sync live webcam preview CSS filter
  useEffect(() => {
    if (videoRef.current) {
      const f = FILTERS.find(f => f.id === selectedFilter);
      videoRef.current.style.filter = f?.css ?? 'none';
    }
  }, [selectedFilter]);

  const isCameraNeeded = step === 'setup' || step === 'capturing';

  // Crucial: sync stream to video element whenever entering 'capturing' step
  useEffect(() => {
    if (step === 'capturing' && videoRef.current && stream) {
      if (videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
      }
      videoRef.current.play().catch(err => logger.error('Video play error on step sync:', err));
    }
  }, [step, stream]);

  // Camera stream lifecycle
  useEffect(() => {
    let activeStream: MediaStream | null = null;

    const initCamera = async () => {
      if (!isCameraNeeded) return;

      if (stream?.active) {
        if (videoRef.current && videoRef.current.srcObject !== stream) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => logger.error('Video play error:', err));
        }
        return;
      }

      logger.info('Inisialisasi perangkat webcam Snaporia...');
      try {
        const ms = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });
        activeStream = ms;
        setStream(ms);
        setCameraError(null);
        logger.info('Webcam Snaporia berhasil aktif.');

        if (videoRef.current) {
          videoRef.current.srcObject = ms;
          await videoRef.current.play().catch(err => logger.error('Video play error:', err));
        }
      } catch (err: unknown) {
        logger.error('Gagal mengakses kamera:', err);
        const denied = err instanceof DOMException && (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');
        setCameraError(
          denied
            ? 'Izin kamera ditolak. Izinkan akses kamera di peramban Anda.'
            : 'Gagal akses kamera. Pastikan kamera terpasang & tidak digunakan aplikasi lain.'
        );
      }
    };

    initCamera();

    return () => {
      if (!isCameraNeeded && activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
    };
  }, [isCameraNeeded, retryCount]);

  const useDemoCamera = () => {
    logger.info('Mengaktifkan kamera demo simulasi Snaporia...');
    const off = document.createElement('canvas');
    off.width = 1280;
    off.height = 720;
    const ctx = off.getContext('2d')!;
    let frame = 0;
    const renderDemoFrame = () => {
      frame++;
      const grad = ctx.createLinearGradient(0, 0, 1280, 720);
      grad.addColorStop(0, '#1c1917');
      grad.addColorStop(1, '#09090b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1280, 720);

      // Cute animated avatar
      ctx.fillStyle = '#ff2e7e';
      ctx.beginPath();
      ctx.arc(640, 320, 130, 0, Math.PI * 2);
      ctx.fill();

      // Eyes & smile
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(590, 300, 16, 0, Math.PI * 2);
      ctx.arc(690, 300, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.arc(640, 335, 55, 0.2 * Math.PI, 0.8 * Math.PI);
      ctx.stroke();

      ctx.font = 'bold 30px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Snaporia Studio • Live Demo Mode', 640, 530);

      requestAnimationFrame(renderDemoFrame);
    };
    renderDemoFrame();

    const demoStream = off.captureStream(30);
    setStream(demoStream);
    setCameraError(null);
    if (videoRef.current) {
      videoRef.current.srcObject = demoStream;
      videoRef.current.play().catch(e => logger.error('Demo video play error:', e));
    }
  };

  const handleSelectTemplate = (tpl: FrameTemplate) => {
    logger.info(`Pilih template: ${tpl.name} (${tpl.id})`);
    setSelectedTplId(tpl.id);
    if (tpl.defaultFilter) {
      setSelectedFilter(tpl.defaultFilter);
    }
  };

  const handleConfirmTemplate = () => {
    logger.info(`Konfirmasi template: ${selectedTpl.name}. Lanjut ke Studio Foto.`);
    setPhotos([]);
    photosRef.current = [];
    setCurrentShot(0);
    setStep('capturing');
  };

  const toggleTimer = () => {
    setTimerDuration(curr => (curr === 3 ? 5 : 3));
  };

  const toggleMirror = () => {
    setIsMirrored(curr => !curr);
  };

  // Capture sequence
  const startCaptureSequence = () => {
    if (isCapturing) return;
    logger.info(`Mulai sesi foto beruntun (${selectedTpl.totalPhoto} pose).`);
    setPhotos([]);
    photosRef.current = [];
    setIsCapturing(true);
    startCountdownForShot(0);
  };

  const startCountdownForShot = useCallback((shotIndex: number) => {
    setCurrentShot(shotIndex);
    let count = timerDurRef.current;
    setCountdown(count);

    const timer = setInterval(() => {
      count -= 1;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        snapPhoto(shotIndex);
      }
    }, 1000);
  }, []);

  const snapPhoto = useCallback(
    (shotIndex: number) => {
      if (!videoRef.current || !canvasRef.current) return;
      setIsFlash(true);
      setTimeout(() => setIsFlash(false), 200);

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = video.videoWidth || 1280;
      canvas.height = video.videoHeight || 720;

      // Handle mirror orientation
      if (isMirrored) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      ctx.resetTransform();

      const newPhotos = [...photosRef.current, canvas.toDataURL('image/png')];
      photosRef.current = newPhotos;
      setPhotos(newPhotos);
      logger.info(`Foto pose ${shotIndex + 1} tersimpan.`);

      const neededCount = tplRef.current.totalPhoto;

      if (shotIndex + 1 < neededCount) {
        // Pause 1.4s between poses so users have time to change position
        setTimeout(() => startCountdownForShot(shotIndex + 1), 1400);
      } else {
        // All photos captured -> Render photostrip with authentic Snaporia watermark
        setIsGenerating(true);
        setIsCapturing(false);
        stream?.getTracks().forEach(t => t.stop());
        setStream(null);

        const currentTpl = tplRef.current;
        const currentFilter = filterRef.current;

        setTimeout(async () => {
          try {
            await renderRealStrip(canvasRef.current!, photosRef.current, currentTpl, currentFilter);
            setFinalImage(canvasRef.current!.toDataURL('image/png', 1.0));
            setStep('result');
          } catch (err) {
            logger.error('Gagal generate strip photobooth:', err);
            alert('Gagal membuat strip foto. Coba ulangi kembali.');
            setStep('capturing');
          } finally {
            setIsGenerating(false);
          }
        }, 600);
      }
    },
    [stream, isMirrored, startCountdownForShot]
  );

  // Instant switch in result view
  const switchTemplateInResult = async (tpl: FrameTemplate) => {
    logger.info(`Ganti template instan: ${tpl.name}`);
    setSelectedTplId(tpl.id);
    setIsGenerating(true);
    try {
      let photosToUse = [...photosRef.current];
      if (photosToUse.length < tpl.totalPhoto) {
        while (photosToUse.length < tpl.totalPhoto) {
          photosToUse.push(photosToUse[photosToUse.length - 1]);
        }
      } else if (photosToUse.length > tpl.totalPhoto) {
        photosToUse = photosToUse.slice(0, tpl.totalPhoto);
      }
      await renderRealStrip(canvasRef.current!, photosToUse, tpl, selectedFilter);
      setFinalImage(canvasRef.current!.toDataURL('image/png', 1.0));
    } catch (e) {
      logger.error('Gagal switch template:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const switchFilterInResult = async (filter: FilterType) => {
    logger.info(`Ganti filter instan: ${filter}`);
    setSelectedFilter(filter);
    setIsGenerating(true);
    try {
      await renderRealStrip(canvasRef.current!, photosRef.current, selectedTpl, filter);
      setFinalImage(canvasRef.current!.toDataURL('image/png', 1.0));
    } catch (e) {
      logger.error('Gagal switch filter:', e);
    } finally {
      setIsGenerating(false);
    }
  };

  const download = () => {
    if (!finalImage) return;
    const cleanTplName = selectedTpl.name.replace(/^[^\w\s]+/, '').replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
    const a = document.createElement('a');
    a.href = finalImage;
    a.download = `snaporia-${cleanTplName}-${Date.now()}.png`;
    a.click();
    logger.info('Hasil photostrip Snaporia berhasil diunduh.');
  };

  const reset = () => {
    logger.info('Reset sesi Snaporia.');
    setFinalImage(null);
    setPhotos([]);
    photosRef.current = [];
    setIsCapturing(false);
    setStep('setup');
    setRetryCount(c => c + 1);
  };

  // Filter & Search categories
  const categories = ['All', 'Y2K', 'Cute', 'Aesthetic', 'Newspaper', 'Vintage', 'Music', 'Modern', 'Scrapbook'];
  const filteredTemplates = REAL_TEMPLATES.filter(t => {
    const matchesCat = selectedCategory === 'All' || t.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main
      className="min-h-screen relative flex flex-col justify-between"
      style={{ background: 'var(--background)' }}
    >
      {/* ── TOP STEPPER HEADER ── */}
      <HeaderStepper
        step={step}
        onGoToStep={setStep}
        onBackToTemplates={() => setStep('setup')}
        onResetSession={reset}
        canViewResult={!!finalImage}
      />

      {/* ── FULL SCREEN LOADING OVERLAY (DURING GENERATION) ── */}
      {isGenerating && (
        <div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)' }}
        >
          <div className="w-10 h-10 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
          <p className="font-semibold text-base text-white">
            Memasang foto ke frame &amp; mencetak watermark Snaporia...
          </p>
        </div>
      )}

      {/* ── MAIN CONTENT VIEWS ── */}
      <div className="flex-1 flex flex-col">
        {step === 'setup' && (
          <TemplateCatalogView
            selectedTpl={selectedTpl}
            onSelectTemplate={handleSelectTemplate}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={categories}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            filteredTemplates={filteredTemplates}
            totalTemplatesCount={REAL_TEMPLATES.length}
            onConfirmTemplate={handleConfirmTemplate}
          />
        )}

        {step === 'capturing' && (
          <CameraStudioView
            videoRef={videoRef}
            cameraError={cameraError}
            onRetryCamera={() => {
              setCameraError(null);
              setRetryCount(c => c + 1);
            }}
            onUseDemoCamera={useDemoCamera}
            countdown={countdown}
            isFlash={isFlash}
            isStreaming={!!stream?.active}
            currentShot={currentShot}
            totalPhoto={selectedTpl.totalPhoto}
            photos={photos}
            selectedTpl={selectedTpl}
            selectedFilter={selectedFilter}
            onSelectFilter={setSelectedFilter}
            timerDuration={timerDuration}
            onToggleTimer={toggleTimer}
            isMirrored={isMirrored}
            onToggleMirror={toggleMirror}
            onTriggerShutter={startCaptureSequence}
            isCapturing={isCapturing}
          />
        )}

        {step === 'result' && finalImage && (
          <ResultCelebrationView
            finalImage={finalImage}
            selectedTpl={selectedTpl}
            templates={REAL_TEMPLATES}
            onSwitchTemplate={switchTemplateInResult}
            onDownload={download}
            onReset={reset}
            selectedFilter={selectedFilter}
            onChangeFilter={switchFilterInResult}
            onBackToCatalog={() => setStep('setup')}
          />
        )}
      </div>

      {/* Hidden high-res canvas used by 2D canvas compositor */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Footer copyright */}
      <footer className="w-full py-4 text-center border-t text-xs font-medium text-neutral-400" style={{ borderColor: 'var(--border)' }}>
        © {new Date().getFullYear()} Snaporia — Authentic Online Photobooth
      </footer>
    </main>
  );
}