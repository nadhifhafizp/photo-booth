'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { REAL_TEMPLATES, DEFAULT_FALLBACK_TEMPLATE, FrameTemplate, FilterType, FILTERS } from './framesData';
import { renderRealStrip, logger } from '@/lib/canvasRenderer';
import { HeaderStepper } from '@/components/photobooth/HeaderStepper';
import { TemplateCatalogView } from '@/components/photobooth/TemplateCatalogView';
import { CameraStudioView } from '@/components/photobooth/CameraStudioView';
import { ResultCelebrationView } from '@/components/photobooth/ResultCelebrationView';

export default function PhotoboothPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Fallback initial template when REAL_TEMPLATES is empty
  const initialTpl = REAL_TEMPLATES[0] ?? DEFAULT_FALLBACK_TEMPLATE;

  // Stepper state: 'setup' (Catalog) -> 'capturing' (Camera Studio) -> 'result' (Celebration)
  const [step, setStep] = useState<'setup' | 'capturing' | 'result'>('setup');

  // Core capture session data
  const [stream, setStream]             = useState<MediaStream | null>(null);
  const [photos, setPhotos]             = useState<string[]>([]);
  const [finalImage, setFinalImage]     = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Template & filter preferences
  const [selectedTplId, setSelectedTplId]       = useState<number | string>(initialTpl.id);
  const [selectedFilter, setSelectedFilter]     = useState<FilterType>(initialTpl.defaultFilter ?? 'bnw');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery]           = useState<string>('');

  // Camera settings & controls
  const [timerDuration, setTimerDuration] = useState<number>(3);
  const [isMirrored, setIsMirrored]       = useState<boolean>(true);
  const [facingMode, setFacingMode]       = useState<'user' | 'environment'>('user');
  const [countdown, setCountdown]         = useState<number | null>(null);
  const [currentShot, setCurrentShot]     = useState(0);
  const [isFlash, setIsFlash]             = useState(false);
  const [cameraError, setCameraError]     = useState<string | null>(null);
  const [retryCount, setRetryCount]       = useState(0);
  const [isCapturing, setIsCapturing]     = useState(false);
  const [pendingReviewPhoto, setPendingReviewPhoto] = useState<{ index: number; dataUrl: string } | null>(null);

  // Refs for async timer callbacks
  const tplRef      = useRef(initialTpl);
  const filterRef   = useRef(selectedFilter);
  const photosRef   = useRef<string[]>([]);
  const timerDurRef = useRef(timerDuration);

  // Read URL query parameter for pre-selected template
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const tplParam = params.get('template');
      if (tplParam) {
        const found = REAL_TEMPLATES.find(t => String(t.id) === tplParam);
        if (found) {
          setSelectedTplId(found.id);
          if (found.defaultFilter) {
            setSelectedFilter(found.defaultFilter);
          }
        }
      }
    }
  }, []);

  const selectedTpl = REAL_TEMPLATES.find(t => t.id === selectedTplId) ?? initialTpl;

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

      logger.info(`Inisialisasi perangkat webcam Snaporia (facingMode: ${facingMode})...`);
      try {
        const ms = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        });
        activeStream = ms;
        setStream(ms);
        setCameraError(null);
        logger.info(`Webcam Snaporia berhasil aktif (${facingMode}).`);

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
  }, [isCameraNeeded, retryCount, facingMode]);

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
    setPendingReviewPhoto(null);
    setStep('capturing');
  };

  const toggleTimer = () => {
    setTimerDuration(curr => (curr === 3 ? 5 : 3));
  };

  const toggleMirror = () => {
    setIsMirrored(curr => !curr);
  };

  const toggleCameraFacing = () => {
    if (isCapturing) return;
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    logger.info(`Beralih kamera dari ${facingMode} ke ${nextMode}`);

    // Stop current stream before switching
    if (stream) {
      stream.getTracks().forEach(t => t.stop());
      setStream(null);
    }

    setFacingMode(nextMode);
    // Back camera defaults to unmirrored, front camera defaults to mirrored
    setIsMirrored(nextMode === 'user');
    setCameraError(null);
  };

  // Start countdown for the current shot pose
  const startCaptureSequence = () => {
    if (isCapturing || pendingReviewPhoto) return;
    logger.info(`Mulai pengambilan foto pose ke-${currentShot + 1}`);
    setIsCapturing(true);
    startCountdownForShot(currentShot);
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

      const capturedUrl = canvas.toDataURL('image/png');
      setPendingReviewPhoto({ index: shotIndex, dataUrl: capturedUrl });
      setIsCapturing(false);
      logger.info(`Pose ${shotIndex + 1} berhasil diambil, menunggu konfirmasi review.`);
    },
    [isMirrored]
  );

  const handleKeepPhoto = () => {
    if (!pendingReviewPhoto) return;
    const shotIndex = pendingReviewPhoto.index;
    const updatedPhotos = [...photos];
    updatedPhotos[shotIndex] = pendingReviewPhoto.dataUrl;
    setPhotos(updatedPhotos);
    photosRef.current = updatedPhotos;
    setPendingReviewPhoto(null);

    const neededCount = tplRef.current.totalPhoto;
    const filledCount = updatedPhotos.filter(Boolean).length;

    if (filledCount >= neededCount) {
      // All photos ready -> Generate photostrip
      setIsGenerating(true);
      stream?.getTracks().forEach(t => t.stop());
      setStream(null);

      const currentTpl = tplRef.current;
      const currentFilter = filterRef.current;

      setTimeout(async () => {
        try {
          await renderRealStrip(canvasRef.current!, updatedPhotos, currentTpl, currentFilter);
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
    } else {
      // Advance to the next unfilled slot
      let nextSlot = shotIndex + 1;
      if (nextSlot >= neededCount || updatedPhotos[nextSlot]) {
        const emptyIdx = updatedPhotos.findIndex((p, i) => i < neededCount && !p);
        nextSlot = emptyIdx !== -1 ? emptyIdx : shotIndex + 1;
      }
      setCurrentShot(nextSlot);
      logger.info(`Lanjut ke pose ke-${nextSlot + 1}. Kamera dapat diganti kapan saja.`);
    }
  };

  const handleRetakeCurrent = () => {
    logger.info(`Retake pose ke-${currentShot + 1}.`);
    setPendingReviewPhoto(null);
    setIsCapturing(false);
  };

  const handleRetakeSpecificPose = (index: number) => {
    if (isCapturing) return;
    logger.info(`Pilih retake pose spesifik ke-${index + 1}.`);
    setCurrentShot(index);
    setPendingReviewPhoto(null);
  };

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
    setPendingReviewPhoto(null);
    setCurrentShot(0);
    setIsCapturing(false);
    setStep('setup');
    setRetryCount(c => c + 1);
  };

  // Filter & Search categories
  const categories = ['All', 'Vintage', 'Newspaper', 'Music', 'Y2K', 'Cute', 'Aesthetic', 'Modern', 'Scrapbook', 'Grid', 'Photostrip'];
  const filteredTemplates = REAL_TEMPLATES.filter(t => {
    const matchesCat = selectedCategory === 'All' || t.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch =
      searchQuery.trim() === '' ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <main className="min-h-screen relative flex flex-col justify-between bg-paper text-ink">
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
          className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-ink/80 backdrop-blur-xs select-none"
        >
          <div className="w-14 h-14 border-4 border-lime border-t-transparent rounded-full animate-spin shadow-stk-sm" />
          <p className="font-display text-xl text-white uppercase tracking-tight text-center px-4">
            Developing your photostrip...
          </p>
          <span className="font-mono text-xs text-lime font-bold">
            ✦ HIGH RESOLUTION COMPOSITING
          </span>
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
            facingMode={facingMode}
            onToggleCameraFacing={toggleCameraFacing}
            onTriggerShutter={startCaptureSequence}
            isCapturing={isCapturing}
            pendingReviewPhoto={pendingReviewPhoto}
            onKeepPhoto={handleKeepPhoto}
            onRetakeCurrent={handleRetakeCurrent}
            onRetakeSpecificPose={handleRetakeSpecificPose}
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

      {/* Footer copyright (Neo-brutalist) */}
      <footer className="w-full py-4 text-center border-t-[2.5px] border-ink bg-white text-xs font-mono font-bold text-ink/70">
        © {new Date().getFullYear()} SNAPORIA. SHOT WITH INTENT.
      </footer>
    </main>
  );
}