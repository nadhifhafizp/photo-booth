import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { FrameTemplate, FilterType, FILTERS } from '@/app/photobooth/framesData';
import { loadImage, drawImageCover, applyFilterToImage } from '@/lib/canvasRenderer';

export interface GenerateGifOptions {
  photos: string[]; // Final static photos as fallback
  burstPhotos?: string[][]; // Motion burst frames per slot: burstPhotos[slotIndex] = [frame0, frame1, ...]
  template: FrameTemplate; // Photostrip template with coordinates & frame graphic
  filter?: FilterType;
  delayMs?: number; // Delay per frame in ms (default 120ms)
  maxGifWidth?: number; // Maximum width of the output GIF strip (default 400px)
}

/**
 * Generate an animated GIF photostrip from captured motion frames.
 * Motion remains strictly inside the chosen photostrip template frame,
 * preserving cutouts, coordinate rotations, filters, and overlay art.
 */
export async function generatePhotoboothGif({
  photos,
  burstPhotos,
  template,
  filter = 'normal',
  delayMs = 120,
  maxGifWidth = 400,
}: GenerateGifOptions): Promise<string> {
  if (!photos || photos.length === 0) {
    throw new Error('Tidak ada foto untuk membuat motion strip.');
  }

  // 1. Load template overlay image
  const templateImg = await loadImage(template.template);

  // 2. Normalize motion frames for each slot
  // If a slot has recorded motion frames, use them; otherwise fallback to the still photo
  const slotFramesSrc: string[][] = template.coordinates.map((_, i) => {
    const burst = burstPhotos && burstPhotos[i] && burstPhotos[i].length > 0 ? burstPhotos[i] : null;
    if (burst && burst.length > 0) {
      return burst;
    }
    const still = photos[i] || photos[0];
    return [still];
  });

  // Preload all unique images to ensure synchronous canvas drawing
  const allUniqueSrcs = Array.from(new Set(slotFramesSrc.flat()));
  const loadedMap = new Map<string, HTMLImageElement>();
  await Promise.all(
    allUniqueSrcs.map(async src => {
      try {
        const img = await loadImage(src);
        loadedMap.set(src, img);
      } catch (err) {
        console.warn('Gagal memuat salah satu frame motion:', err);
      }
    })
  );

  // Map slot sources to loaded Image elements
  const slotImages: HTMLImageElement[][] = slotFramesSrc.map(srcs => {
    const imgs = srcs.map(s => loadedMap.get(s)).filter((img): img is HTMLImageElement => !!img);
    if (imgs.length === 0) {
      // Emergency fallback to first loaded image
      const fallback = loadedMap.values().next().value;
      return fallback ? [fallback] : [];
    }
    return imgs;
  });

  // 3. Calculate scaled dimensions for the output GIF
  const scale = maxGifWidth / template.width;
  const gifWidth = Math.round(maxGifWidth);
  const gifHeight = Math.round(template.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = gifWidth;
  canvas.height = gifHeight;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Tidak dapat membuat context 2D untuk motion GIF');

  const filterCfg = FILTERS.find(f => f.id === filter) ?? FILTERS[0];
  const hasFilter = filterCfg.canvas && filterCfg.canvas !== 'none';

  // 4. Construct sequence of frame indices (smooth boomerang or loop)
  const maxBurstLength = Math.max(...slotImages.map(imgs => imgs.length));
  const sequence: number[] = [];

  if (maxBurstLength > 2) {
    // Boomerang: 0 -> 1 -> ... -> N-1 -> N-2 -> ... -> 1
    for (let i = 0; i < maxBurstLength; i++) sequence.push(i);
    for (let i = maxBurstLength - 2; i > 0; i--) sequence.push(i);
  } else {
    // Simple 1-2 frames loop
    for (let i = 0; i < Math.max(maxBurstLength, 1); i++) sequence.push(i);
  }

  // 5. Initialize GIFEncoder
  const gif = GIFEncoder();

  for (let step = 0; step < sequence.length; step++) {
    const frameIdx = sequence[step];

    // Clear background
    ctx.filter = 'none';
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, gifWidth, gifHeight);

    // Draw user motion frame inside each slot coordinate
    template.coordinates.forEach((coord, slotIdx) => {
      const imgsForSlot = slotImages[slotIdx];
      if (!imgsForSlot || imgsForSlot.length === 0) return;

      const img = imgsForSlot[frameIdx % imgsForSlot.length];
      if (!img) return;

      const filtered = hasFilter ? applyFilterToImage(img, filterCfg.canvas) : img;

      const slotX = coord.x * scale;
      const slotY = coord.y * scale;
      const slotW = coord.width * scale;
      const slotH = coord.height * scale;
      const cx = slotX + slotW / 2;
      const cy = slotY + slotH / 2;

      ctx.save();
      if (coord.rotate) {
        ctx.translate(cx, cy);
        ctx.rotate((coord.rotate * Math.PI) / 180);
        ctx.translate(-cx, -cy);
      }

      ctx.beginPath();
      ctx.rect(slotX, slotY, slotW, slotH);
      ctx.clip();

      drawImageCover(ctx, filtered, slotX, slotY, slotW, slotH);
      ctx.restore();
    });

    // Draw the template overlay graphic on top
    ctx.drawImage(templateImg, 0, 0, gifWidth, gifHeight);

    // Extract frame pixels & quantize
    const frameData = ctx.getImageData(0, 0, gifWidth, gifHeight);
    const palette = quantize(frameData.data, 192);
    const index = applyPalette(frameData.data, palette);

    // Hold the peak frame (the snap moment at maxBurstLength - 1) slightly longer
    const isPeakSnapFrame = frameIdx === maxBurstLength - 1;
    const currentFrameDelay = isPeakSnapFrame ? Math.round(delayMs * 2.2) : delayMs;

    gif.writeFrame(index, gifWidth, gifHeight, {
      palette,
      delay: currentFrameDelay,
    });
  }

  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'image/gif' });
  return URL.createObjectURL(blob);
}
