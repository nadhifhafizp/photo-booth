import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';

// ============================================================
// STRUCTURED LOGGER
// ============================================================

export const logger = {
  info: (msg: string, ...args: unknown[]) =>
    console.log(`%c[Snaporia]%c ${msg}`, 'color:#ff2e7e;font-weight:bold', 'color:inherit', ...args),
  warn: (msg: string, ...args: unknown[]) =>
    console.warn(`[Snaporia:Warn] ${msg}`, ...args),
  error: (msg: string, ...args: unknown[]) =>
    console.error(`[Snaporia:Error] ${msg}`, ...args),
};

// ============================================================
// IMAGE & CANVAS HELPERS
// ============================================================

/**
 * Safely loads an image element asynchronously
 */
export const loadImage = (src: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    if (src.startsWith('http')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => resolve(img);
    img.onerror = () => {
      logger.error(`Gagal memuat gambar: ${src}`);
      reject(new Error(`Gagal memuat gambar: ${src}`));
    };
    img.src = src;
  });
};

/**
 * Applies CSS filter to an image via offscreen canvas
 */
export const applyFilterToImage = (
  img: HTMLImageElement,
  filter: string
): HTMLCanvasElement | HTMLImageElement => {
  if (!filter || filter === 'none') return img;
  const off = document.createElement('canvas');
  off.width = img.naturalWidth || img.width;
  off.height = img.naturalHeight || img.height;
  const ctx = off.getContext('2d')!;
  ctx.filter = filter;
  ctx.drawImage(img, 0, 0);
  ctx.filter = 'none';
  return off;
};

/**
 * Draws image with 'cover' aspect ratio preservation (no distortion)
 */
export const drawImageCover = (
  ctx: CanvasRenderingContext2D,
  img: HTMLCanvasElement | HTMLImageElement,
  x: number,
  y: number,
  w: number,
  h: number
) => {
  const srcW = 'naturalWidth' in img ? img.naturalWidth || img.width : img.width;
  const srcH = 'naturalHeight' in img ? img.naturalHeight || img.height : img.height;
  const rSrc = srcW / srcH;
  const rDest = w / h;
  let sx = 0, sy = 0, sW = srcW, sH = srcH;
  if (rSrc > rDest) {
    sW = srcH * rDest;
    sx = (srcW - sW) / 2;
  } else {
    sH = srcW / rDest;
    sy = (srcH - sH) / 2;
  }
  ctx.drawImage(img, sx, sy, sW, sH, x, y, w, h);
};

/**
 * Renders complete photobooth strip onto canvas:
 * 1. Resizes canvas to exact template resolution
 * 2. Draws user photos with filters inside slot coordinates
 * 3. Draws template graphic overlay with cutouts on top
 */
export async function renderRealStrip(
  canvas: HTMLCanvasElement,
  photos: string[],
  tpl: FrameTemplate,
  filter: FilterType
): Promise<void> {
  logger.info(`Render strip: ${tpl.name} (${tpl.width}x${tpl.height}) [${photos.length} foto]`);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context tidak tersedia');

  canvas.width = tpl.width;
  canvas.height = tpl.height;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';

  // 1. Clear background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, tpl.width, tpl.height);

  // 2. Load user photos concurrently
  const filterCfg = FILTERS.find(f => f.id === filter) ?? FILTERS[0];
  const userImgs = await Promise.all(photos.map(src => loadImage(src)));

  // 3. Draw user photos at template slot coordinates
  tpl.coordinates.forEach((coord, i) => {
    const img = userImgs[i];
    if (!img) return;

    const filtered = filterCfg.canvas !== 'none' ? applyFilterToImage(img, filterCfg.canvas) : img;

    ctx.save();
    const cx = coord.x + coord.width / 2;
    const cy = coord.y + coord.height / 2;

    if (coord.rotate) {
      ctx.translate(cx, cy);
      ctx.rotate((coord.rotate * Math.PI) / 180);
      ctx.translate(-cx, -cy);
    }

    ctx.beginPath();
    ctx.rect(coord.x, coord.y, coord.width, coord.height);
    ctx.clip();

    drawImageCover(ctx, filtered, coord.x, coord.y, coord.width, coord.height);
    ctx.restore();
  });

  // 4. Draw frame overlay on top
  try {
    const templateImg = await loadImage(tpl.template);
    ctx.drawImage(templateImg, 0, 0, tpl.width, tpl.height);
  } catch (err) {
    logger.error(`Gagal memuat template overlay (${tpl.template}):`, err);
  }

  // 5. Draw authentic Snaporia photobooth watermark stamp at the footer
  drawPhotoboothWatermark(ctx, tpl);

  logger.info('Render strip selesai dengan sukses.');
}

/**
 * Renders an authentic commercial photobooth watermark at the footer of the strip:
 * - Brand title: 'snaporia.'
 * - Subtitle: 'PHOTOBOOTH • [YYYY.MM.DD]'
 * - Adaptive brightness: dark text on light backgrounds, crisp white on dark backgrounds
 */
export function drawPhotoboothWatermark(
  ctx: CanvasRenderingContext2D,
  tpl: FrameTemplate
) {
  try {
    // Skip frames that already have integrated official Snaporia branding or rich interactive UI controls
    // to prevent watermark text from blindly covering essential design elements (e.g. shutter button, music player, barcodes)
    const FRAMES_WITH_CUSTOM_OR_INTEGRATED_FOOTER = new Set<number | string>([
      150, 148, 147, 149, 292, 306, 304, 321, 309, 136, 1221,
      131, 132, 133, 134, 1640, 390, 727,
      146, 144, 145, 142, 630, 80, 432, 1302, 457, 1480, 325, 154
    ]);

    if (FRAMES_WITH_CUSTOM_OR_INTEGRATED_FOOTER.has(Number(tpl.id)) || FRAMES_WITH_CUSTOM_OR_INTEGRATED_FOOTER.has(tpl.id) || tpl.hasCustomFooter) {
      return;
    }

    // Find bottom-most photo coordinate to locate the bottom footer zone
    const maxY = tpl.coordinates.reduce((max, c) => Math.max(max, c.y + c.height), 0);
    const footerSpace = tpl.height - maxY;

    // Calculate vertical center for watermark
    let centerY: number;
    if (footerSpace >= 65) {
      centerY = maxY + footerSpace / 2;
    } else {
      centerY = tpl.height - Math.max(26, Math.round(tpl.height * 0.018));
    }

    const centerX = tpl.width / 2;

    // Sample background brightness in the footer zone
    const samplePx = ctx.getImageData(
      Math.round(centerX),
      Math.min(tpl.height - 4, Math.max(0, Math.round(centerY))),
      1,
      1
    ).data;
    const brightness = (samplePx[0] * 299 + samplePx[1] * 587 + samplePx[2] * 114) / 1000;
    const isLightBg = brightness > 135;

    const primaryColor = isLightBg ? 'rgba(24, 24, 27, 0.88)' : 'rgba(255, 255, 255, 0.92)';
    const subColor = isLightBg ? 'rgba(82, 82, 91, 0.72)' : 'rgba(212, 212, 216, 0.75)';

    // Font sizing scaled proportionally with template width
    const brandSize = Math.max(18, Math.round(tpl.width * 0.038));
    const subSize = Math.max(10, Math.round(brandSize * 0.38));

    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // 1. Draw brand logo text: "snaporia."
    ctx.font = `900 ${brandSize}px "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = primaryColor;

    if (footerSpace >= 80) {
      ctx.fillText('snaporia.', centerX, centerY - subSize * 0.65);

      // 2. Draw subline: "PHOTOBOOTH • YYYY.MM.DD"
      const now = new Date();
      const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
      ctx.font = `700 ${subSize}px "Plus Jakarta Sans", -apple-system, sans-serif`;
      ctx.fillStyle = subColor;
      ctx.fillText(`PHOTOBOOTH • ${dateStr}`, centerX, centerY + brandSize * 0.65);
    } else {
      ctx.fillText('snaporia.', centerX, centerY);
    }

    ctx.restore();
  } catch (e) {
    logger.warn('Watermark stamp skipped:', e);
  }
}
