import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

interface ShareItem {
  id: string;
  image: string;
  gif?: string | null;
  templateName?: string;
  createdAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __SNAPORIA_SHARES__: Map<string, ShareItem> | undefined;
}

const STORAGE_DIR = path.join(process.cwd(), '.data', 'shares');

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'ID tidak valid' }, { status: 400 });
    }

    // 1. Check in-memory store
    const sharesMap = globalThis.__SNAPORIA_SHARES__;
    if (sharesMap && sharesMap.has(id)) {
      const item = sharesMap.get(id)!;
      return NextResponse.json({
        success: true,
        id: item.id,
        image: item.image,
        gif: item.gif || null,
        templateName: item.templateName || 'Snaporia Photostrip',
        createdAt: item.createdAt,
      });
    }

    // 2. Check disk store
    const itemDir = path.join(STORAGE_DIR, id);
    const photoPath = path.join(itemDir, 'photo.png');
    const metaPath = path.join(itemDir, 'meta.json');
    const motionPath = path.join(itemDir, 'motion.gif');

    if (fs.existsSync(photoPath) && fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
      const photoBuffer = fs.readFileSync(photoPath);
      const photoBase64 = `data:image/png;base64,${photoBuffer.toString('base64')}`;

      let gifBase64: string | null = null;
      if (fs.existsSync(motionPath)) {
        const gifBuffer = fs.readFileSync(motionPath);
        gifBase64 = `data:image/gif;base64,${gifBuffer.toString('base64')}`;
      }

      // Re-populate in-memory cache for subsequent requests
      if (sharesMap) {
        sharesMap.set(id, {
          id,
          image: photoBase64,
          gif: gifBase64,
          templateName: meta.templateName,
          createdAt: meta.createdAt,
        });
      }

      return NextResponse.json({
        success: true,
        id,
        image: photoBase64,
        gif: gifBase64,
        templateName: meta.templateName || 'Snaporia Photostrip',
        createdAt: meta.createdAt,
      });
    }

    return NextResponse.json(
      { error: 'Foto tidak ditemukan atau sudah kedaluwarsa' },
      { status: 404 }
    );
  } catch (err) {
    console.error('Error fetching share item:', err);
    return NextResponse.json({ error: 'Gagal mengambil data foto' }, { status: 500 });
  }
}
