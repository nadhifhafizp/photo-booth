'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);

  // --- LOGIKA BARU: Deteksi Halaman Photobooth ---
  // Halaman-halaman ini WAJIB menggunakan Navbar putih (Solid) agar tulisan terbaca
  const isSolidPage = pathname === '/photobooth' || pathname === '/layanan' || pathname === '/profil';
  
  // Navbar jadi solid jika: Di-scroll, Menu dibuka, ATAU berada di halaman khusus (isSolidPage)
  const useSolidStyle = isScrolled || isOpen || isSolidPage;

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      // Sembunyikan navbar jika scroll ke bawah jauh, tampilkan jika naik
      if (currentScrollY > lastScrollY.current && currentScrollY > 100) {
        setIsVisible(false);
        setIsOpen(false); 
      } else {
        setIsVisible(true);
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (pathname === '/login' || pathname.startsWith('/admin')) {
    return null;
  }

  const navLinks = [
    { name: 'Beranda', href: '/' },
    { name: 'Profil', href: '/profil' },
    { name: 'Info Grafis', href: '/info-grafis' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Belanja', href: '/belanja' },
  ];

  return (
    <nav 
      className={clsx(
        // Z-Index tinggi agar selalu di atas
        "fixed top-0 left-0 right-0 z-[100] w-full transition-all duration-300",
        isVisible ? "translate-y-0" : "-translate-y-full",
        // UBAH STYLE BERDASARKAN KONDISI useSolidStyle
        useSolidStyle
          ? "bg-white shadow-md border-b border-slate-200 py-3" 
          : "bg-transparent py-5"
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 font-bold text-xl transition hover:opacity-80 group">
          <div className={clsx(
            "relative h-10 w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-105",
            (!useSolidStyle) ? "drop-shadow-[0_2px_4px_rgba(255,255,255,0.3)]" : ""
          )}>
             <Image 
               src="/images/logo.png" 
               alt="Logo Desa"
               fill
               className="object-contain"
               priority
             />
          </div>
          <span className={clsx(
            "transition-colors duration-300 hidden md:block",
            // Ubah warna teks: Putih jika transparan, Hitam jika solid
            (!useSolidStyle) ? "text-white drop-shadow-md" : "text-slate-800"
          )}>
            Desa Sukalaksana
          </span>
        </Link>
        
        {/* MENU DESKTOP */}
        <div className="hidden md:flex gap-1">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name}
                href={item.href} 
                className={clsx(
                  "px-4 py-2 text-sm font-medium rounded-full transition-all duration-300",
                  isActive 
                    ? (useSolidStyle ? "bg-green-100 text-green-700" : "bg-white/20 text-white backdrop-blur-sm")
                    : (useSolidStyle ? "text-slate-600 hover:text-green-700 hover:bg-green-50" : "text-white/90 hover:text-white hover:bg-white/10")
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* TOMBOL HAMBURGER MOBILE */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={clsx(
            "md:hidden p-2 rounded-lg transition relative",
            (!useSolidStyle) ? "text-white hover:bg-white/10" : "text-slate-700 hover:bg-slate-100"
          )}
          aria-label="Toggle Menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={clsx(
        "absolute top-0 left-0 w-full bg-white border-b border-slate-200 shadow-xl transition-all duration-300 ease-in-out md:hidden overflow-hidden",
        isOpen ? "max-h-screen opacity-100 pt-20 pb-6" : "max-h-0 opacity-0 pt-0 pb-0"
      )}>
        <div className="container mx-auto px-4 flex flex-col gap-2">
          {navLinks.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "px-4 py-3 rounded-xl font-medium transition flex items-center justify-between",
                  isActive 
                    ? "bg-green-50 text-green-700" 
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}