import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Snaporia – Online Photobooth & Aesthetic Strip Camera",
  description:
    "Photobooth online modern dengan watermark resmi Snaporia. 60+ frame aesthetic Gen Z, filter real-time, cetak instan HD langsung dari browser.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Archivo+Black&family=Caveat:wght@600;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=Instrument+Serif:ital@0;1&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700;800&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&family=UnifrakturMaguntia&display=swap"
          rel="stylesheet"
        />
        <meta name="theme-color" content="#5637f2" />
      </head>
      <body className="antialiased selection:bg-[#c6ff3d] selection:text-[#0e0b1f]">{children}</body>
    </html>
  );
}
