import { NextRequest, NextResponse } from 'next/server';
import os from 'os';
import fs from 'fs';
import path from 'path';

// In-memory cache for ultra-fast lookup & serverless resilience
interface ShareItem {
  id: string;
  image: string; // base64 dataUrl or buffer
  gif?: string | null;
  templateName?: string;
  createdAt: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __SNAPORIA_SHARES__: Map<string, ShareItem> | undefined;
}

if (!globalThis.__SNAPORIA_SHARES__) {
  globalThis.__SNAPORIA_SHARES__ = new Map<string, ShareItem>();
}

const sharesMap = globalThis.__SNAPORIA_SHARES__;

// Helper to determine local network IPv4 address for local mobile access
function getLocalLanIp(): string {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    const ifaceList = interfaces[name];
    if (!ifaceList) continue;
    for (const iface of ifaceList) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// Persistent directory on local disk
const STORAGE_DIR = path.join(process.cwd(), '.data', 'shares');

function ensureStorageDir(): void {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true });
    }
  } catch (err) {
    console.warn('Unable to create storage directory:', err);
  }
}

// Cleanup shares older than 24 hours to prevent disk bloating
function cleanupOldShares(): void {
  try {
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

    // In-memory cleanup
    for (const [id, item] of sharesMap.entries()) {
      if (item.createdAt < oneDayAgo) {
        sharesMap.delete(id);
      }
    }

    // Disk cleanup
    if (fs.existsSync(STORAGE_DIR)) {
      const dirs = fs.readdirSync(STORAGE_DIR);
      for (const dirName of dirs) {
        const itemDir = path.join(STORAGE_DIR, dirName);
        const metaFile = path.join(itemDir, 'meta.json');
        if (fs.existsSync(metaFile)) {
          const meta = JSON.parse(fs.readFileSync(metaFile, 'utf8'));
          if (meta.createdAt && meta.createdAt < oneDayAgo) {
            fs.rmSync(itemDir, { recursive: true, force: true });
          }
        }
      }
    }
  } catch (err) {
    console.warn('Share cleanup error:', err);
  }
}

function generateShareId(): string {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  let id = '';
  for (let i = 0; i < 8; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { image, gif, templateName } = body;

    if (!image || typeof image !== 'string') {
      return NextResponse.json({ error: 'Data foto (image) wajib disertakan' }, { status: 400 });
    }

    const id = generateShareId();
    const createdAt = Date.now();

    // Save in memory
    sharesMap.set(id, {
      id,
      image,
      gif: gif || null,
      templateName: templateName || 'Snaporia Custom',
      createdAt,
    });

    // Save to disk
    try {
      ensureStorageDir();
      const itemDir = path.join(STORAGE_DIR, id);
      fs.mkdirSync(itemDir, { recursive: true });

      // Save photo PNG
      const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
      fs.writeFileSync(path.join(itemDir, 'photo.png'), Buffer.from(base64Data, 'base64'));

      // Save motion GIF if present
      if (gif && typeof gif === 'string') {
        const gifBase64 = gif.replace(/^data:image\/\w+;base64,/, '');
        fs.writeFileSync(path.join(itemDir, 'motion.gif'), Buffer.from(gifBase64, 'base64'));
      }

      // Save metadata
      fs.writeFileSync(
        path.join(itemDir, 'meta.json'),
        JSON.stringify(
          {
            id,
            templateName: templateName || 'Snaporia Custom',
            hasGif: Boolean(gif),
            createdAt,
          },
          null,
          2
        )
      );
    } catch (diskErr) {
      console.warn('Gagal menyimpan share ke disk, tetap menggunakan in-memory:', diskErr);
    }

    // Async cleanup of old files
    setTimeout(cleanupOldShares, 500);

    const lanIp = getLocalLanIp();
    const port = req.nextUrl.port || '3000';
    const lanHost = `${lanIp}:${port}`;

    return NextResponse.json({
      success: true,
      id,
      sharePath: `/share/${id}`,
      lanHost,
      createdAt,
    });
  } catch (err) {
    console.error('Error creating share:', err);
    return NextResponse.json({ error: 'Gagal membuat tautan berbagi' }, { status: 500 });
  }
}

export async function GET() {
  const lanIp = getLocalLanIp();
  return NextResponse.json({
    status: 'ok',
    lanIp,
    totalActiveShares: sharesMap.size,
  });
}
