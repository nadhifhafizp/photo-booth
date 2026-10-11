'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { SnaporiaLogo } from '@/components/SnaporiaLogo';

// ─── Data ───────────────────────────────────────────────────────────────────

const TRENDING_TEMPLATES = [
  {
    id: 150, title: 'Camera – Foto Series', category: 'Newspaper', users: '6,650',
    img: '/images/frames/thumb_150.webp',
    shift: 'md:translate-y-3',
  },
  {
    id: 145, title: 'Photo Options (Dark)', category: 'Modern', users: '6,030',
    img: '/images/frames/thumb_145.webp',
    shift: 'md:-translate-y-3',
  },
  {
    id: 630, title: 'Receipt / Struk Kasir', category: 'Modern', users: '4,280',
    img: '/images/frames/thumb_630.webp',
    shift: 'md:translate-y-3',
  },
  {
    id: 154, title: 'The 1975 – About You', category: 'Music', users: '3,840',
    img: '/images/frames/thumb_154.webp',
    shift: 'md:-translate-y-3',
  },
  {
    id: 144, title: 'Albums Night Mode', category: 'Modern', users: '3,502',
    img: '/images/frames/thumb_144.webp',
    shift: 'md:translate-y-3',
  },
  {
    id: 589, title: 'Fotofiti Analog', category: 'Vintage', users: '2,856',
    img: '/images/frames/thumb_589.webp',
    shift: 'md:-translate-y-3',
  },
  {
    id: 361, title: 'Pinkiesh Leopard', category: 'Cute', users: '2,574',
    img: '/images/frames/thumb_361.webp',
    shift: 'md:translate-y-3',
  },
  {
    id: 147, title: 'Breaking News: Coming Soon', category: 'Newspaper', users: '2,333',
    img: '/images/frames/thumb_147.webp',
    shift: 'md:-translate-y-3',
  },
  {
    id: 1477, title: 'Monyet Lucu', category: 'Cute', users: '2,219',
    img: '/images/frames/thumb_1477.webp',
    shift: 'md:translate-y-3',
  },
  {
    id: 292, title: 'Rawrrrr Leopard', category: 'Aesthetic', users: '1,968',
    img: '/images/frames/thumb_292.webp',
    shift: 'md:-translate-y-3',
  },
  {
    id: 616, title: 'Pink Leopard Print', category: 'Y2K', users: '1,776',
    img: '/images/frames/thumb_616.webp',
    shift: 'md:translate-y-3',
  },
  {
    id: 136, title: 'Wanna Be Yours', category: 'Cute', users: '1,292',
    img: '/images/frames/thumb_136.webp',
    shift: 'md:-translate-y-3',
  },
];

const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pilih Vibe & Template',
    desc: 'Jelajahi 60+ frame aesthetic Gen Z (Y2K, Cute, Newspaper, Music, Scrapbook, Modern, Vintage).',
    icon: 'lucide:layout-grid',
  },
  {
    step: '02',
    title: 'Pose di Studio Kamera',
    desc: 'Kamera otomatis memandu 3 atau 4 pose dengan timer hitung mundur. Dilengkapi live filter B&W, Warm, dan Soft.',
    icon: 'lucide:camera',
  },
  {
    step: '03',
    title: 'Unduh Photostrip HD',
    desc: 'Hasil strip foto langsung jadi dengan watermark resmi Snaporia. Unduh instan dalam resolusi tinggi atau scan via HP.',
    icon: 'lucide:sparkles',
  },
];

const TESTIMONIALS = [
  { initials: 'CL', name: 'Clarissa & Kevin',  role: 'Event Host',           text: 'Photobooth online ini seru banget! Tamu-tamu senang sekali bisa langsung foto aesthetic dari laptop tanpa ribet bayar atau install aplikasi.' },
  { initials: 'SA', name: 'Sarah Nabila',       role: 'Creative Designer',     text: 'Desain templatenya kece-kece dan watermark Snaporianya rapi layaknya hasil photobooth Korea asli.' },
  { initials: 'MA', name: 'Maya Anggraini',     role: 'Personal Creator',      text: 'Simple, elegan, dan gampang dioperasikan. Foto bareng bestie jadi ada kenang-kenangannya.' },
  { initials: 'DI', name: 'Dimas Aditya',       role: 'Photographer',          text: 'Fitur multi-pose dan filternya responsif. Hasil strip fotonya jernih dan proses download-nya super cepat!' },
];

const FAQ = [
  { q: 'Apakah Snaporia gratis digunakan?', a: 'Ya! Snaporia saat ini sepenuhnya gratis untuk digunakan tanpa pungutan biaya, tanpa kartu kredit, dan tanpa perlu mendaftar akun.' },
  { q: 'Apakah perlu install aplikasi tambahan?', a: 'Tidak perlu! Snaporia 100% berbasis peramban (browser). Cukup buka di laptop, PC, tablet, atau smartphone Anda.' },
  { q: 'Apakah foto saya tersimpan di server?', a: 'Tidak. Privasi Anda terlindungi penuh. Semua proses rendering berlangsung secara lokal (client-side) di perangkat Anda. Foto tidak dikirim ke server manapun.' },
  { q: 'Format apa yang didapatkan saat download?', a: 'Foto diunduh dalam format PNG resolusi tinggi siap cetak atau dibagikan ke media sosial favorit Anda.' },
  { q: 'Bisa digunakan di perangkat HP / Mobile?', a: 'Ya! Snaporia mendukung kamera depan smartphone (Android & iOS) dengan tampilan responsif.' },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen w-full flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>

      {/* ── NAVBAR ── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 md:px-10 border-b backdrop-blur-md"
        style={{ background: 'rgba(10, 10, 10, 0.9)', borderColor: 'var(--border)' }}
      >
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <SnaporiaLogo size="sm" />
        </Link>

        <div className="hidden md:flex items-center gap-7 text-xs font-bold uppercase tracking-widest">
          {[
            { href: '#about', label: 'Tentang' },
            { href: '#templates', label: 'Template' },
            { href: '#how-it-works', label: 'Cara Kerja' },
            { href: '#features', label: 'Fitur' },
            { href: '#faq', label: 'FAQ' },
          ].map(({ href, label }) => (
            <a
              key={href}
              href={href}
              className="transition-colors hover:text-white"
              style={{ color: 'var(--muted-foreground)' }}
            >
              {label}
            </a>
          ))}

          <Link
            href="/photobooth"
            className="px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider transition-all hover:scale-105 active:scale-95 shadow-lg shadow-pink-500/25"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
          >
            Buka Photobooth →
          </Link>
        </div>

        <button
          aria-label="Toggle Menu"
          onClick={() => setMobileMenuOpen(o => !o)}
          className="md:hidden font-bold text-xs uppercase tracking-widest p-2"
          style={{ color: 'var(--foreground)' }}>
          {mobileMenuOpen ? 'TUTUP' : 'MENU'}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-[57px] z-40 flex flex-col gap-5 p-8 shadow-2xl"
          style={{ background: 'var(--card)', borderTop: '1px solid var(--border)' }}>
          {[
            { href: '#about', label: 'Tentang' },
            { href: '#templates', label: 'Template' },
            { href: '#how-it-works', label: 'Cara Kerja' },
            { href: '#features', label: 'Fitur' },
            { href: '#faq', label: 'FAQ' },
          ].map(({ href, label }) => (
            <a key={href} href={href} onClick={() => setMobileMenuOpen(false)}
              className="text-lg font-bold" style={{ color: 'var(--foreground)' }}>
              {label}
            </a>
          ))}
          <Link href="/photobooth" onClick={() => setMobileMenuOpen(false)}
            className="mt-4 py-3.5 rounded-xl font-black text-center uppercase tracking-widest"
            style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
            Mulai Foto Sekarang →
          </Link>
        </div>
      )}

      {/* ── HERO ── */}
      <section id="about" className="relative overflow-hidden" style={{ background: 'var(--background)' }}>
        {/* Glow blobs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -left-24 h-[32rem] w-[32rem] rounded-full opacity-20 blur-3xl" style={{ background: 'var(--primary)' }} />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full opacity-10 blur-3xl" style={{ background: 'var(--primary)' }} />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-20 md:px-12 md:pt-24 md:pb-28 text-center">
          <h1 className="mb-6 text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] text-white">
            Photobooth Online <br />
            <span style={{ color: 'var(--primary)' }}>&amp; Webcam Studio</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-base md:text-lg font-normal leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
            Ambil foto aesthetic bareng bestie langsung dari browser. Tanpa registrasi, tanpa biaya langganan, dan siap cetak strip HD dengan watermark resmi Snaporia.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/photobooth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:opacity-90 active:scale-95 shadow-sm"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              <Icon icon="lucide:camera" width={18} /> Mulai Foto Gratis →
            </Link>
            <a href="#templates"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-sm border transition-all hover:bg-neutral-900"
              style={{ borderColor: 'var(--border)', color: 'var(--foreground)', background: 'var(--card)' }}>
              Lihat Koleksi Template
            </a>
          </div>

          {/* Highlights Strip */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {[
              { val: '60+ Frame', label: 'Koleksi Gen Z' },
              { val: '100% Free', label: 'Bebas Dipakai' },
              { val: 'HD Strip',  label: 'Watermark Resmi' },
              { val: '0 App',     label: 'Langsung Browser' },
            ].map(s => (
              <div key={s.val} className="rounded-2xl border p-4 text-center"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="text-2xl font-black" style={{ color: 'var(--primary)' }}>{s.val}</div>
                <div className="text-xs font-semibold mt-0.5" style={{ color: 'var(--muted-foreground)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HIGHLIGHT FEATURE STRIP ── */}
      <div className="py-4 border-y" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-6xl px-6 flex flex-wrap items-center justify-around gap-6 text-xs md:text-sm font-semibold" style={{ color: 'var(--muted-foreground)' }}>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:sparkles" width={16} style={{ color: 'var(--primary)' }} />
            <span>60+ Frame Aesthetic Gen Z</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:camera" width={16} style={{ color: 'var(--primary)' }} />
            <span>Langsung dari Webcam Laptop / HP</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:shield-check" width={16} style={{ color: 'var(--primary)' }} />
            <span>100% Gratis &amp; Privasi Lokal</span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon="lucide:download" width={16} style={{ color: 'var(--primary)' }} />
            <span>Unduh Instan Photostrip HD</span>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS (3 EASY STEPS) ── */}
      <section id="how-it-works" className="py-20 md:py-28" style={{ background: 'var(--background)' }}>
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              3 Langkah Mudah <span style={{ color: 'var(--primary)' }}>Abadikan Momen</span>
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-xl mx-auto font-medium">
              Dirancang persis seperti pengalaman photobooth komersial modern, langsung dari perangkat Anda.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {HOW_IT_WORKS.map(item => (
              <div
                key={item.step}
                className="rounded-3xl border p-8 flex flex-col gap-5 relative transition-all hover:border-neutral-700"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
              >
                <div className="flex items-center justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
                    style={{ background: 'var(--primary)' }}
                  >
                    <Icon icon={item.icon} width={24} />
                  </div>
                  <span className="text-2xl font-bold opacity-30 font-mono">
                    {item.step}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--foreground)' }}>
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/photobooth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:opacity-90 shadow-sm"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <Icon icon="lucide:camera" width={18} /> Coba Photobooth Sekarang →
            </Link>
          </div>
        </div>
      </section>

      {/* ── TRENDING TEMPLATES ── */}
      <section id="templates" className="py-20 md:py-28 overflow-hidden border-t" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">60+ Frame Aesthetic <span style={{ color: 'var(--primary)' }}>Koleksi Gen Z</span></h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-5 items-start">
            {TRENDING_TEMPLATES.map(t => (
              <div key={t.id} className={`group relative rounded-2xl overflow-hidden border transition-all hover:border-pink-500/50 cursor-pointer ${t.shift}`}
                style={{ borderColor: 'var(--border)', background: '#0a0a0a' }}>
                <img src={t.img} alt={t.title} className="w-full object-cover" loading="lazy" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3.5"
                  style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.92), transparent)' }}>
                  <h3 className="text-sm font-bold truncate text-white">{t.title}</h3>
                  <div className="flex items-center justify-between mt-1.5">
                    <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>{t.category}</span>
                    <span className="text-xs text-white/80">{t.users} foto</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link href="/photobooth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:opacity-90 shadow-sm"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
              Pilih Frame &amp; Foto Sekarang <Icon icon="lucide:arrow-right" width={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 md:py-28" style={{ background: 'var(--background)' }}>
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Photobooth Praktis, <span style={{ color: 'var(--primary)' }}>Kualitas Maksimal</span></h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {[
              { icon: 'lucide:camera', title: 'Webcam Langsung', desc: 'Foto langsung dari webcam laptop atau kamera HP tanpa download software apa pun.' },
              { icon: 'lucide:frame', title: 'Frame Variatif', desc: 'Pilihan tema mulai dari newspaper vintage, pinkiesh cute, receipt belanja, hingga music album.' },
              { icon: 'lucide:download', title: 'Download Instan', desc: 'Hasil strip foto siap diunduh dalam format PNG resolusi tinggi dengan watermark resmi.' },
              { icon: 'lucide:sliders-horizontal', title: 'Live Tone Filter', desc: 'Pilihan filter B&W Noir, Warm Tone, dan Soft Film yang diterapkan langsung secara real-time.' },
              { icon: 'lucide:qr-code', title: 'QR Transfer Mudah', desc: 'Kemudahan scan QR code untuk mengambil hasil foto langsung ke smartphone Anda.' },
              { icon: 'lucide:shield-check', title: 'Privasi 100% Terjaga', desc: 'Semua proses foto terjadi lokal di peramban Anda. Foto pribadi tidak disimpan ke server luar.' },
            ].map((f, i) => (
              <div key={i} className="rounded-2xl border p-6 flex flex-col gap-4 transition-all hover:border-neutral-700 group"
                style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-sm"
                  style={{ background: 'var(--primary)' }}>
                  <Icon icon={f.icon} width={20} />
                </div>
                <div>
                  <h3 className="font-bold text-base mb-1.5" style={{ color: 'var(--foreground)' }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 md:py-28 border-t" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-6xl px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Kesan Pengguna <span style={{ color: 'var(--primary)' }}>Snaporia</span>
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="rounded-2xl border p-5 flex flex-col gap-3.5"
                style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}>
                    {t.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>{t.name}</p>
                    <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>{t.role}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} icon="lucide:star" width={13} style={{ color: 'var(--primary)', fill: 'var(--primary)' }} />
                  ))}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: 'var(--muted-foreground)' }}>&ldquo;{t.text}&rdquo;</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-20 md:py-28" style={{ background: 'var(--background)' }}>
        <div className="mx-auto max-w-4xl px-6 md:px-12">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Pertanyaan <span style={{ color: 'var(--primary)' }}>Umum</span></h2>
          </div>

          <div className="flex flex-col gap-3">
            {FAQ.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i} className="rounded-xl border overflow-hidden transition-all"
                  style={{ background: 'var(--card)', borderColor: isOpen ? 'var(--primary)' : 'var(--border)' }}>
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full p-4 md:p-5 text-left font-bold text-sm md:text-base flex items-center justify-between gap-4 cursor-pointer"
                    style={{ color: 'var(--foreground)' }}>
                    <span>{item.q}</span>
                    <Icon
                      icon={isOpen ? 'lucide:chevron-up' : 'lucide:chevron-down'}
                      width={18}
                      className="shrink-0 transition-transform"
                      style={{ color: 'var(--primary)' }}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 md:px-5 md:pb-5 text-xs md:text-sm leading-relaxed border-t pt-3"
                      style={{ color: 'var(--muted-foreground)', borderColor: 'var(--border)' }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-20 border-t" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-4xl px-6 text-center space-y-6">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Siap Abadikan <span style={{ color: 'var(--primary)' }}>Senyummu?</span>
          </h2>
          <p className="text-base text-muted-foreground max-w-lg mx-auto">
            Langsung coba studio photobooth Snaporia tanpa antre dan tanpa ribet.
          </p>
          <div className="pt-2">
            <Link
              href="/photobooth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide transition-all hover:opacity-90 active:scale-95 shadow-sm"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              <Icon icon="lucide:camera" width={18} /> Mulai Foto Sekarang →
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-10 border-t" style={{ background: 'var(--background)', borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-6xl px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="hover:opacity-90 transition-opacity">
            <SnaporiaLogo size="sm" />
          </Link>
          <p className="text-xs font-medium text-neutral-400">
            © {new Date().getFullYear()} Snaporia — Free &amp; Aesthetic Online Photobooth
          </p>
          <div className="flex items-center gap-4 text-xs font-semibold" style={{ color: 'var(--muted-foreground)' }}>
            <a href="#about" className="hover:underline">Tentang</a>
            <a href="#templates" className="hover:underline">Template</a>
            <Link href="/photobooth" style={{ color: 'var(--primary)' }}>Launch App →</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
