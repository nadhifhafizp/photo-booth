'use client';

import { useState } from 'react';
import Link from 'next/link';
import { SnaporiaLogo } from '@/components/SnaporiaLogo';
import { SfxToggle } from '@/components/SfxToggle';
import { playClickSound } from '@/lib/sfx';

// ─── Data ───────────────────────────────────────────────────────────────────

const FEATURED_TEMPLATES = [
  {
    id: 'strip-4x1',
    title: 'Classic Strip 4×1',
    category: 'Photostrip',
    poses: 4,
    tag: 'LAYOUT',
    tagColor: 'bg-lime text-ink',
    desc: 'Empat pose vertikal memanjang ala photobooth klasik.',
    type: 'strip',
  },
  {
    id: 'grid-2x2',
    title: 'Quad Grid 2×2',
    category: 'Grid',
    poses: 4,
    tag: 'LAYOUT',
    tagColor: 'bg-pink text-white',
    desc: 'Kotak persegi empat pose pas untuk feed media sosial.',
    type: 'grid',
  },
  {
    id: 'polaroid',
    title: 'Retro Polaroid',
    category: 'Vintage',
    poses: 1,
    tag: 'LAYOUT',
    tagColor: 'bg-yellow text-ink',
    desc: 'Satu pose autentik dengan border bawah lebar untuk caption.',
    type: 'polaroid',
  },
  {
    id: 'wide-3x1',
    title: 'Cinematic Trio 3×1',
    category: 'Modern',
    poses: 3,
    tag: 'LAYOUT',
    tagColor: 'bg-cyan text-ink',
    desc: 'Tiga pose landscape sinematik dengan sentuhan editorial.',
    type: 'trio',
  },
];

const WORKFLOW_STEPS = [
  {
    num: '01',
    title: 'PICK A FRAME',
    desc: 'Jelajahi 80+ frame aesthetic viral: Retro Polaroid, Newspaper, Y2K, Cute, Music, Scrapbook, hingga Analog.',
    badge: '80+ DESIGNS',
  },
  {
    num: '02',
    title: 'POSE IN STUDIO',
    desc: 'Kamera memandu 3 atau 4 pose dengan timer otomatis, shutter audio fisik, dan filter live B&W.',
    badge: 'AUTO COUNTDOWN',
  },
  {
    num: '03',
    title: 'DOWNLOAD & SHARE',
    desc: 'Photostrip resolusi tinggi langsung jadi. Unduh instan dalam format PNG siap cetak tanpa watermark mengganggu.',
    badge: 'PRINT READY',
  },
];

const DIFFERENCES = [
  {
    badge: 'PRIVACY FIRST',
    title: '100% Client-Side Privacy',
    desc: 'Semua proses rendering berjalan langsung di perambanmu. Foto tidak pernah diunggah atau disimpan di server.',
  },
  {
    badge: 'ULTRA HD',
    title: 'Resolusi Siap Cetak 300 DPI',
    desc: 'Bukan sekadar screenshot resolusi rendah, strip foto dirender dalam piksel tajam berkualitas studio cetak.',
  },
  {
    badge: 'LIVE PREVIEW',
    title: 'Tone Filter Kamera Real-Time',
    desc: 'Pilihan tone B&W Noir, Warm Film, dan Soft Aesthetic langsung terlihat di viewfinder sebelum tombol shutter ditekan.',
  },
  {
    badge: 'ZERO BARRIER',
    title: 'Tanpa Login, Tanpa Berlangganan',
    desc: 'Buka web, izinkan kamera, dan langsung berpose. Tidak perlu kartu kredit atau membuat akun.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Clarissa & Kevin',
    role: 'Event Hosts',
    quote: 'Photobooth online ini seru banget! Tamu-tamu senang sekali bisa foto aesthetic langsung dari laptop tanpa harus bayar tiket mahal.',
    sticker: '★ FAVORITE',
  },
  {
    name: 'Sarah Nabila',
    role: 'Visual Designer',
    quote: 'Desain frame-nya detail dan estetik layaknya hasil photobooth Korea asli. Paling suka template Newspaper!',
    sticker: '✦ VERIFIED',
  },
  {
    name: 'Dimas Aditya',
    role: 'Creator & Photographer',
    quote: 'Fitur multi-pose dan filternya responsif. Hasil strip fotonya jernih dan proses download-nya super cepat.',
    sticker: '✓ RECOMMENDED',
  },
];

const FAQ_ITEMS = [
  {
    q: 'Apakah Snaporia gratis digunakan?',
    a: 'Ya! Snaporia sepenuhnya gratis digunakan tanpa pungutan biaya, tanpa kartu kredit, dan tanpa perlu mendaftar akun.',
  },
  {
    q: 'Apakah perlu install aplikasi tambahan?',
    a: 'Tidak perlu! Snaporia 100% berbasis peramban (browser). Cukup buka di laptop, PC, tablet, ataupun smartphone Anda.',
  },
  {
    q: 'Apakah foto saya tersimpan di server?',
    a: 'Sama sekali tidak. Seluruh pemrosesan canvas dan foto berjalan secara lokal di perangkat Anda (client-side). Privasi Anda terjaga sepenuhnya.',
  },
  {
    q: 'Format apa yang didapatkan saat mengunduh?',
    a: 'Foto diunduh dalam format PNG resolusi tinggi siap cetak atau dibagikan langsung ke Instagram Story dan TikTok.',
  },
  {
    q: 'Bisa digunakan di smartphone Android dan iPhone?',
    a: 'Bisa! Snaporia mendukung kamera depan maupun belakang ponsel dengan tata letak responsif dan ramah sentuhan.',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    playClickSound();
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-paper text-ink selection:bg-lime selection:text-ink">

      {/* ── 4.1 NAVBAR (NEO-BRUTALIST STICKY) ── */}
      <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b-[2.5px] border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Left: Brand Logo */}
          <Link href="/" onClick={playClickSound} className="focus:outline-none">
            <SnaporiaLogo size="md" />
          </Link>

          {/* Center: Editorial Mono Links (Desktop) */}
          <nav aria-label="Main Navigation" className="hidden lg:flex items-center gap-8">
            {[
              { href: '#templates', label: '01 / TEMPLATES' },
              { href: '#how-it-works', label: '02 / HOW IT WORKS' },
              { href: '#features', label: '03 / THE DIFFERENCE' },
              { href: '#faq', label: '04 / FAQ' },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                onClick={playClickSound}
                className="font-editorial-mono font-bold text-ink/75 hover:text-brand transition-colors hover:underline decoration-2 underline-offset-4"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Right: Sound Toggle + Start CTA */}
          <div className="hidden sm:flex items-center gap-4">
            <SfxToggle />
            <Link
              href="/photobooth"
              onClick={playClickSound}
              className="btn-brutal btn-brutal-brand text-xs sm:text-sm py-2.5 px-5"
            >
              <span>Start booth</span>
              <span>↗</span>
            </Link>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            aria-label="Buka menu navigasi"
            aria-expanded={mobileMenuOpen}
            className="lg:hidden p-2 rounded-xl border-2 border-ink bg-white shadow-stk-sm active:translate-x-0.5 active:translate-y-0.5"
          >
            <span className="font-display text-lg leading-none">{mobileMenuOpen ? '✕' : '☰'}</span>
          </button>
        </div>

        {/* Mobile Fullscreen Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-brand text-white border-b-[2.5px] border-ink p-6 flex flex-col gap-6 animate-in slide-in-from-top-2">
            <nav className="flex flex-col gap-4">
              {[
                { href: '#templates', label: '01 / TEMPLATES' },
                { href: '#how-it-works', label: '02 / HOW IT WORKS' },
                { href: '#features', label: '03 / THE DIFFERENCE' },
                { href: '#faq', label: '04 / FAQ' },
              ].map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => {
                    playClickSound();
                    setMobileMenuOpen(false);
                  }}
                  className="font-display text-2xl uppercase tracking-tight text-white hover:text-lime transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>

            <div className="pt-4 border-t border-white/20 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="font-editorial-mono text-xs text-white/80">Sound & Haptics</span>
                <SfxToggle />
              </div>

              <Link
                href="/photobooth"
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className="btn-brutal w-full justify-center text-center mt-2"
              >
                <span>Start a session</span>
                <span>↗</span>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ── 0. HERO SECTION (BIG & LOUD BRAND BACKGROUND) ── */}
      <section className="relative bg-brand text-white overflow-hidden border-b-[2.5px] border-ink pt-16 pb-20 md:pt-24 md:pb-28">
        {/* Decorative Grid Texture (subtle brutalist pattern) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, #ffffff 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

            {/* Left Column: Big Headlines & Badges (7 cols) */}
            <div className="lg:col-span-7 flex flex-col items-start gap-6">

              {/* Floating Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="badge-live">
                  <span className="badge-dot" />
                  <span>● LIVE BOOTH</span>
                </span>
                <span className="chip-brutal bg-yellow text-ink border-ink">
                  ✦ 60+ VIRAL FRAMES
                </span>
                <span className="chip-brutal bg-white text-ink border-ink">
                  ⚡ 100% FREE
                </span>
              </div>

              {/* Giant Headline */}
              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight uppercase text-white">
                SNAP YOUR <em className="accent-lime">moment</em>.<br />
                STRIP IT. SHARE IT.
              </h1>

              {/* Punchy Subheadline */}
              <p className="text-base sm:text-lg text-white/90 max-w-xl font-normal leading-relaxed">
                Photobooth online aesthetic ala Korea dengan 60+ frame Gen Z, filter kamera real-time, dan unduhan photostrip HD instan langsung dari browsermu.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/photobooth"
                  onClick={playClickSound}
                  className="btn-brutal text-base sm:text-lg py-4 px-8 shadow-stk"
                >
                  <span>Start booth</span>
                  <span>↗</span>
                </Link>

                <a
                  href="#templates"
                  onClick={playClickSound}
                  className="btn-brutal btn-brutal-ghost text-base sm:text-lg py-4 px-8 text-white border-white shadow-[4px_4px_0_#ffffff]"
                >
                  <span>See frames</span>
                  <span>⟶</span>
                </a>
              </div>

              {/* Editorial micro info */}
              <div className="flex items-center gap-4 pt-4 text-xs font-editorial-mono text-white/70">
                <span>◎ CLIENT-SIDE RENDER</span>
                <span>•</span>
                <span>✓ NO SIGNUP REQUIRED</span>
                <span>•</span>
                <span>⚡ INSTANT PNG</span>
              </div>
            </div>

            {/* Right Column: Tilted Realistic Photostrip Mockup (5 cols) */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
              {/* Floating Sticker 1 */}
              <div
                className="absolute -top-6 -left-4 sm:left-4 z-20 animate-sticker-float-1 bg-yellow text-ink font-mono font-bold text-xs px-3 py-1.5 rounded-full border-2 border-ink shadow-stk-sm"
                style={{ '--rot': '-8deg' } as React.CSSProperties}
              >
                ★ READY IN 30S
              </div>

              {/* Floating Sticker 2 */}
              <div
                className="absolute -bottom-4 right-2 sm:right-10 z-20 animate-sticker-float-2 bg-pink text-white font-mono font-bold text-xs px-3 py-1.5 rounded-full border-2 border-ink shadow-stk-sm"
                style={{ '--rot': '6deg' } as React.CSSProperties}
              >
                📸 4 POSES STRIP
              </div>

              {/* Neo-brutalist Strip Card Showcase */}
              <div
                className="relative bg-white text-ink p-4 sm:p-5 rounded-3xl border-[3px] border-ink shadow-[12px_12px_0_#0e0b1f] -rotate-2 hover:rotate-0 transition-transform duration-300 max-w-xs w-full"
              >
                <div className="flex items-center justify-between pb-3 border-b-2 border-ink mb-3">
                  <span className="font-editorial-mono font-bold text-[10px] text-brand">001 / PREVIEW STRIP</span>
                  <span className="font-mono text-[10px] text-muted">2026.10</span>
                </div>

                {/* 4 Photo Frames Stack */}
                <div className="flex flex-col gap-2.5 bg-paper p-2.5 rounded-2xl border-2 border-ink">
                  {[
                    { label: 'POSE 01', filter: 'grayscale(100%)' },
                    { label: 'POSE 02', filter: 'sepia(40%)' },
                    { label: 'POSE 03', filter: 'contrast(115%)' },
                    { label: 'POSE 04', filter: 'none' },
                  ].map((pose, i) => (
                    <div
                      key={i}
                      className="relative aspect-[16/10] bg-brand-tint rounded-xl border-2 border-ink overflow-hidden flex items-center justify-center"
                    >
                      <div
                        className="absolute inset-0 bg-gradient-to-br from-[#ece8ff] via-[#dcd5ff] to-[#c6b8ff]"
                      />
                      <span className="relative z-10 font-mono text-[10px] font-bold px-2 py-0.5 rounded-md bg-ink text-white shadow-sm">
                        {pose.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Strip Footer */}
                <div className="pt-3 mt-3 border-t-2 border-ink flex items-center justify-between font-mono text-[10px] font-bold">
                  <span>✦ SNAPORIA BOOTH</span>
                  <span className="text-brand">HD 300DPI</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ── 1. MARQUEE TICKER (FULL WIDTH NEON STRIP) ── */}
      <aside aria-label="Ticker highlights" className="w-full bg-ink text-white py-3.5 border-b-[2.5px] border-ink overflow-hidden select-none">
        <div className="animate-marquee-neo flex items-center gap-6 whitespace-nowrap font-display text-sm sm:text-base tracking-wider uppercase">
          {[1, 2].map(iteration => (
            <div key={iteration} className="flex items-center gap-6">
              <span className="text-lime">✦ PHOTO STRIPS</span>
              <span>✳ 80+ FRAMES VIRAL</span>
              <span className="text-yellow">⚡ LIVE FILTERS</span>
              <span>◎ INSTANT DOWNLOAD</span>
              <span className="text-pink">✓ NO LOGIN REQUIRED</span>
              <span>✦ CLIENT-SIDE PRIVACY</span>
              <span className="text-cyan">⚡ 100% FREE</span>
              <span>✳ SHOT WITH INTENT</span>
            </div>
          ))}
        </div>
      </aside>

      {/* ── 2. TEMPLATES SHOWCASE (`01 / PICK A LAYOUT`) ── */}
      <section id="templates" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14">
          <div>
            <p className="font-editorial-mono text-brand font-bold mb-2">01 / SELECTED WORK</p>
            <h2 className="text-4xl sm:text-6xl text-ink font-display">
              PICK YOUR <em className="accent">vibe</em>.
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-lg">
              Frame photostrip bernuansa Y2K, Cute, Newspaper, Music, hingga Analog siap pakai.
            </p>
          </div>

          <Link
            href="/photobooth"
            onClick={playClickSound}
            className="btn-brutal btn-brutal-brand text-xs sm:text-sm py-3 px-6 self-start md:self-auto"
          >
            <span>Buka Studio Photobooth</span>
            <span>↗</span>
          </Link>
        </div>

        {/* Templates Sticker Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_TEMPLATES.map((tpl, idx) => {
            const isOdd = idx % 2 === 1;
            return (
              <article
                key={tpl.id}
                className={`card-sticker ${isOdd ? 'card-tilt-odd' : 'card-tilt-even'} flex flex-col justify-between`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-editorial-mono text-brand font-bold">
                      {`0${idx + 1} / ${tpl.category.toUpperCase()}`}
                    </span>
                    <span className={`font-mono text-[10px] font-black px-2 py-0.5 rounded-full border border-ink ${tpl.tagColor}`}>
                      {tpl.tag}
                    </span>
                  </div>

                  {/* Template Mini-UI Preview (Neo-brutalist CSS illustrative UI) */}
                  <div className="relative aspect-[3/4] bg-brand-tint rounded-2xl border-2 border-ink p-4 flex items-center justify-center overflow-hidden group select-none">
                    {tpl.type === 'strip' && (
                      <div className="w-24 bg-white p-2 rounded-xl border-2 border-ink shadow-stk-sm flex flex-col gap-1.5 transition-transform duration-200 group-hover:scale-105">
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} className="h-6 bg-paper border border-ink rounded flex items-center justify-center font-mono text-[8px] text-muted font-bold">
                            P{n}
                          </div>
                        ))}
                      </div>
                    )}
                    {tpl.type === 'grid' && (
                      <div className="w-28 bg-white p-2 rounded-xl border-2 border-ink shadow-stk-sm grid grid-cols-2 gap-1.5 transition-transform duration-200 group-hover:scale-105">
                        {[1, 2, 3, 4].map(n => (
                          <div key={n} className="aspect-square bg-paper border border-ink rounded flex items-center justify-center font-mono text-[8px] text-muted font-bold">
                            P{n}
                          </div>
                        ))}
                      </div>
                    )}
                    {tpl.type === 'polaroid' && (
                      <div className="w-28 bg-white p-2 pb-5 rounded-xl border-2 border-ink shadow-stk-sm flex flex-col transition-transform duration-200 group-hover:scale-105">
                        <div className="aspect-square bg-paper border border-ink rounded flex items-center justify-center font-mono text-[9px] text-muted font-bold">
                          POLAROID
                        </div>
                      </div>
                    )}
                    {tpl.type === 'trio' && (
                      <div className="w-28 bg-white p-2 rounded-xl border-2 border-ink shadow-stk-sm flex flex-col gap-1.5 transition-transform duration-200 group-hover:scale-105">
                        {[1, 2, 3].map(n => (
                          <div key={n} className="h-7 bg-paper border border-ink rounded flex items-center justify-center font-mono text-[8px] text-muted font-bold">
                            SCENE {n}
                          </div>
                        ))}
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-ink text-white font-mono text-[10px] px-2 py-1 rounded-md">
                      {tpl.poses} POSES
                    </div>
                  </div>

                  {/* Card Title & Desc */}
                  <h3 className="font-display text-xl text-ink uppercase mt-4 leading-tight">
                    {tpl.title}
                  </h3>
                  <p className="text-muted text-xs mt-1">
                    {tpl.desc}
                  </p>
                </div>

                {/* Card Action Link */}
                <div className="mt-6 pt-4 border-t-2 border-ink flex items-center justify-between">
                  <span className="chip-brutal text-[11px] py-1 px-2.5">
                    {tpl.category}
                  </span>
                  <Link
                    href={`/photobooth?template=${tpl.id}`}
                    onClick={playClickSound}
                    className="font-mono font-bold text-xs text-brand hover:text-brand-dark flex items-center gap-1 group"
                  >
                    <span>Use frame</span>
                    <span className="transition-transform group-hover:translate-x-1">↗</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── 3. CARA KERJA (`02 / HOW IT WORKS`) ── */}
      <section id="how-it-works" className="py-20 md:py-28 bg-brand-tint border-y-[2.5px] border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="mb-14">
            <p className="font-editorial-mono text-brand font-bold mb-2">02 / THE WORKFLOW</p>
            <h2 className="text-4xl sm:text-6xl text-ink font-display">
              BUILT TO BE <em className="accent">used.</em>
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-lg">
              Tiga langkah praktis tanpa ribet install aplikasi ataupun daftar akun.
            </p>
          </div>

          {/* 3 Step Editorial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {WORKFLOW_STEPS.map((step) => (
              <div
                key={step.num}
                className="bg-white border-[2.5px] border-ink rounded-3xl p-6 sm:p-8 shadow-stk flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-display text-4xl text-brand leading-none">
                      {step.num}
                    </span>
                    <span className="font-editorial-mono font-bold text-[10px] bg-lime text-ink border border-ink px-2.5 py-1 rounded-full">
                      {step.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-2xl text-ink uppercase mb-2">
                    {step.title}
                  </h3>

                  <p className="text-muted text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>

                <div className="mt-8 pt-4 border-t-2 border-ink font-mono text-[11px] font-bold text-ink/60">
                  <span>STEP {step.num} OF 03</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. FITUR (`03 / THE DIFFERENCE`) ── */}
      <section id="features" className="py-20 md:py-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <p className="font-editorial-mono text-brand font-bold mb-2">03 / THE DIFFERENCE</p>
          <h2 className="text-4xl sm:text-6xl text-ink font-display">
            HONEST <em className="accent">craft.</em>
          </h2>
          <p className="text-muted text-sm sm:text-base mt-2 max-w-lg">
            Dibuat untuk kepuasan hasil cetak foto strip yang nyata dan aman di perangkatmu.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {DIFFERENCES.map((diff, i) => (
            <div
              key={i}
              className="bg-white border-[2.5px] border-ink rounded-3xl p-6 sm:p-8 shadow-stk flex flex-col justify-between"
            >
              <div>
                <span className="chip-brutal mb-4 text-[11px]">
                  {diff.badge}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl text-ink uppercase mb-2">
                  {diff.title}
                </h3>
                <p className="text-muted text-sm sm:text-base leading-relaxed">
                  {diff.desc}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2 font-mono text-xs font-bold text-brand">
                <span>✦ VERIFIED SYSTEM</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 5. TESTIMONIALS (`04 / REAL VOICES`) ── */}
      <section className="py-20 md:py-28 bg-paper border-t-[2.5px] border-ink">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="font-editorial-mono text-brand font-bold mb-2">04 / REAL VOICES</p>
            <h2 className="text-4xl sm:text-6xl text-ink font-display">
              SHOT WITH <em className="accent">intent.</em>
            </h2>
            <p className="text-muted text-sm sm:text-base mt-2 max-w-lg">
              Komentar autentik dari creator dan event host yang mengabadikan momennya.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => {
              const tilt = i % 2 === 0 ? '-rotate-1' : 'rotate-1';
              return (
                <div
                  key={i}
                  className={`bg-white border-[2.5px] border-ink rounded-3xl p-6 sm:p-7 shadow-stk ${tilt} hover:rotate-0 transition-transform duration-200 flex flex-col justify-between`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-full bg-yellow border border-ink text-ink">
                        {t.sticker}
                      </span>
                      <span className="font-editorial-mono text-[10px] text-muted">STORY #{i + 1}</span>
                    </div>

                    <p className="text-ink text-sm sm:text-base leading-relaxed mb-6 font-medium">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                  </div>

                  <div className="pt-4 border-t-2 border-ink flex items-center justify-between">
                    <div>
                      <h4 className="font-display text-base text-ink uppercase leading-none">
                        {t.name}
                      </h4>
                      <p className="font-mono text-[11px] text-muted mt-0.5">
                        {t.role}
                      </p>
                    </div>
                    <span className="font-mono text-lg text-brand">✦</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 6. FAQ ACCORDION (`05 / FAQ`) ── */}
      <section id="faq" className="py-20 md:py-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="mb-12 text-center">
          <p className="font-editorial-mono text-brand font-bold mb-2">05 / QUESTIONS & ANSWERS</p>
          <h2 className="text-4xl sm:text-6xl text-ink font-display">
            ALL YOU <em className="accent">need</em> TO KNOW.
          </h2>
        </div>

        <div className="flex flex-col gap-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border-[2.5px] border-ink rounded-2xl shadow-stk-sm overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 cursor-pointer focus:outline-none"
                >
                  <span className="font-display text-lg sm:text-xl text-ink uppercase leading-tight">
                    {item.q}
                  </span>
                  <span
                    className={`font-display text-2xl text-brand shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-45' : 'rotate-0'
                    }`}
                  >
                    +
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-sm sm:text-base text-muted leading-relaxed border-t-2 border-ink/10">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ── 7. PRE-FOOTER CTA MARQUEE ── */}
      <div className="w-full bg-lime text-ink py-4 border-y-[2.5px] border-ink overflow-hidden select-none">
        <div className="animate-marquee-neo flex items-center gap-6 whitespace-nowrap font-display text-base sm:text-lg tracking-wider uppercase">
          {[1, 2].map(iteration => (
            <div key={iteration} className="flex items-center gap-6">
              <span>READY TO POSE?</span>
              <span>✦</span>
              <span className="underline decoration-2">START YOUR SESSION ↗</span>
              <span>✦</span>
              <span>SAY CHEESE!</span>
              <span>✦</span>
              <span>SNAPORIA PHOTOBOOTH</span>
              <span>✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── 8. FOOTER ── */}
      <footer className="bg-ink text-white py-14 px-4 sm:px-6 lg:px-8 border-b-[2.5px] border-ink">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div className="flex flex-col gap-3">
            <SnaporiaLogo size="lg" theme="brand" />
            <p className="text-white/60 text-xs font-mono max-w-sm">
              Online aesthetic photobooth web application built with neo-brutalist precision.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-editorial-mono text-xs">
            <a href="#templates" onClick={playClickSound} className="hover:text-lime transition-colors">
              TEMPLATES
            </a>
            <a href="#how-it-works" onClick={playClickSound} className="hover:text-lime transition-colors">
              HOW IT WORKS
            </a>
            <a href="#features" onClick={playClickSound} className="hover:text-lime transition-colors">
              FEATURES
            </a>
            <a href="#faq" onClick={playClickSound} className="hover:text-lime transition-colors">
              FAQ
            </a>
            <Link href="/photobooth" onClick={playClickSound} className="text-lime hover:underline font-bold">
              OPEN BOOTH ↗
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <SfxToggle />
            <span className="font-editorial-mono text-[11px] text-white/50">
              © SNAPORIA. SHOT WITH INTENT.
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
