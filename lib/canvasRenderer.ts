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

  // 5. Watermark disabled per user request ("gausah kasih watermark snaporia dulu")
  // drawPhotoboothWatermark(ctx, tpl);

  logger.info('Render strip selesai dengan sukses.');
}

/**
 * Photobooth watermark disabled per user request.
 */
export function drawPhotoboothWatermark(
  _ctx: CanvasRenderingContext2D,
  _tpl: FrameTemplate
) {
  // Watermark stamp disabled per user request: "gausah kasih watermark snaporia dulu, comot dari funcam dulu aja"
  return;
}

