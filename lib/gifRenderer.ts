import { GIFEncoder, quantize, applyPalette } from 'gifenc';
import { FilterType, FILTERS } from '@/app/photobooth/framesData';

export interface GenerateGifOptions {
  photos: string[]; // dataUrls
  filter?: FilterType;
  delayMs?: number; // default 550ms
  width?: number; // default 500px
  height?: number; // default 650px
  templateName?: string;
}

/**
 * Generate an animated GIF from a sequence of captured photobooth poses.
 * Completely client-side using gifenc.
 */
export async function generatePhotoboothGif({
  photos,
  filter = 'normal',
  delayMs = 550,
  width = 480,
  height = 640,
  templateName = 'Snaporia Booth',
}: GenerateGifOptions): Promise<string> {
  if (!photos || photos.length === 0) {
    throw new Error('Tidak ada foto untuk membuat GIF.');
  }

  // Preload all pose images
  const loadedImages: HTMLImageElement[] = await Promise.all(
    photos.map(
      src =>
        new Promise<HTMLImageElement>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Gagal memuat pose foto untuk GIF'));
          img.src = src;
        })
    )
  );

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('Tidak dapat membuat 2D canvas context untuk GIF');

  const gif = GIFEncoder();
  const filterDef = FILTERS.find(f => f.id === filter);
  const filterCss = filterDef?.css ?? 'none';

  // Format date
  const now = new Date();
  const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(
    now.getDate()
  ).padStart(2, '0')}`;

  for (let i = 0; i < loadedImages.length; i++) {
    const img = loadedImages[i];

    // Clear canvas
    ctx.filter = 'none';
    ctx.fillStyle = '#0e0b1f'; // dark brutalist base
    ctx.fillRect(0, 0, width, height);

    // Inner paper container
    const margin = 18;
    const cardW = width - margin * 2;
    const cardH = height - margin * 2;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(margin, margin, cardW, cardH, 20);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#0e0b1f';
    ctx.stroke();

    // Top Header
    ctx.fillStyle = '#5637f2'; // brand purple
    ctx.font = 'bold 12px monospace';
    ctx.fillText('SNAPORIA • LIVE MOTION', margin + 14, margin + 26);

    ctx.fillStyle = '#6b6785';
    ctx.font = 'bold 11px monospace';
    ctx.textAlign = 'right';
    ctx.fillText(dateStr, margin + cardW - 14, margin + 26);
    ctx.textAlign = 'left';

    // Photo Area
    const photoTop = margin + 38;
    const photoH = cardH - 85;
    const photoW = cardW - 24;
    const photoX = margin + 12;

    // Apply filter
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(photoX, photoTop, photoW, photoH, 14);
    ctx.clip();

    ctx.filter = filterCss;

    // Draw photo cover (aspect fill)
    const imgAspect = img.width / img.height;
    const targetAspect = photoW / photoH;
    let sW = img.width;
    let sH = img.height;
    let sX = 0;
    let sY = 0;

    if (imgAspect > targetAspect) {
      sW = img.height * targetAspect;
      sX = (img.width - sW) / 2;
    } else {
      sH = img.width / targetAspect;
      sY = (img.height - sH) / 2;
    }

    ctx.drawImage(img, sX, sY, sW, sH, photoX, photoTop, photoW, photoH);
    ctx.restore();

    // Photo border
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#0e0b1f';
    ctx.beginPath();
    ctx.roundRect(photoX, photoTop, photoW, photoH, 14);
    ctx.stroke();

    // Bottom Footer
    ctx.fillStyle = '#0e0b1f';
    ctx.font = 'bold 12px sans-serif';
    ctx.fillText(templateName.toUpperCase(), margin + 14, margin + cardH - 16);

    // Pose Pill Badge
    const badgeText = `POSE ${i + 1} OF ${loadedImages.length}`;
    ctx.font = 'bold 10px monospace';
    const textMetrics = ctx.measureText(badgeText);
    const badgeW = textMetrics.width + 16;
    const badgeH = 22;
    const badgeX = margin + cardW - badgeW - 12;
    const badgeY = margin + cardH - 28;

    ctx.fillStyle = '#c6ff3d'; // lime accent
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 12);
    ctx.fill();
    ctx.lineWidth = 1.8;
    ctx.strokeStyle = '#0e0b1f';
    ctx.stroke();

    ctx.fillStyle = '#0e0b1f';
    ctx.fillText(badgeText, badgeX + 8, badgeY + 15);

    // Extract frame pixels
    const frameData = ctx.getImageData(0, 0, width, height);

    // Quantize & apply palette
    const palette = quantize(frameData.data, 256);
    const index = applyPalette(frameData.data, palette);

    gif.writeFrame(index, width, height, {
      palette,
      delay: delayMs,
    });
  }

  gif.finish();
  const bytes = gif.bytes();
  const blob = new Blob([bytes as unknown as BlobPart], { type: 'image/gif' });
  return URL.createObjectURL(blob);
}
