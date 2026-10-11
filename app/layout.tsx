import type { Metadata } from "next";
import "./globals.css";
import BottomNav from "@/components/BottomNav";

export const metadata: Metadata = {
  title: { default: "PAGARMIK — Menjaga Batas. Melindungi Profesi.", template: "%s | PAGARMIK" },
  description: "Platform hukum dan regulasi untuk Perekam Medis dan Informasi Kesehatan: pencarian regulasi, pasal, dan AI legal research berbasis sumber terverifikasi.",
  openGraph: {
    title: "PAGARMIK — Menjaga Batas. Melindungi Profesi.",
    description: "Legal intelligence platform untuk RMIK/MIK: regulasi, pasal, dan PAGARMIK AI.",
    type: "website",
    locale: "id_ID",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <a href="#konten" className="sr-only focus:not-sr-only focus:absolute focus:p-2 focus:bg-pagar-700 focus:text-white">
          Lewati ke konten
        </a>
        <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
            <a href="/" className="flex items-center gap-2" aria-label="PAGARMIK beranda">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-pagar-700 text-white" aria-hidden>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2l8 3v6c0 5-3.5 9.5-8 11-4.5-1.5-8-6-8-11V5l8-3z" />
                  <path d="M8 8v8M12 7v10M16 8v8M6 8h12" strokeLinecap="round" />
                </svg>
              </span>
              <span className="leading-tight">
                <span className="block text-[17px] font-extrabold tracking-tight text-pagar-800">PAGARMIK</span>
                <span className="block text-[11px] text-ink-900/60">Menjaga Batas. Melindungi Profesi.</span>
              </span>
            </a>
            <nav className="ml-auto hidden items-center gap-4 text-sm font-medium md:flex" aria-label="Navigasi utama">
              <a className="hover:text-pagar-700" href="/legal-search">Legal Search</a>
              <a className="hover:text-pagar-700" href="/regulasi">Regulasi</a>
              <a className="hover:text-pagar-700" href="/pasal">Pasal</a>
              <a className="hover:text-pagar-700" href="/topik">Topik</a>
              <a className="hover:text-pagar-700" href="/artikel">Knowledge Base</a>
              <a className="rounded-lg bg-pagar-700 px-3 py-1.5 text-white hover:bg-pagar-600" href="/ai">Tanya AI</a>
            </nav>
          </div>
          <div className="pagar-stripes h-1 w-full opacity-70" aria-hidden />
        </header>
        <main id="konten" className="mx-auto min-h-[70vh] w-full max-w-5xl px-4 pb-28 pt-6 md:pb-12">
          {children}
        </main>
        <footer className="border-t border-ink-100 bg-ink-50/60">
          <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-ink-900/70">
            <p className="font-bold text-pagar-800">PAGARMIK</p>
            <p className="mt-1 max-w-2xl">
              PAGARMIK adalah platform informasi dan edukasi hukum. Informasi yang diberikan oleh sistem AI bukan
              merupakan pendapat hukum profesional dan tidak menggantikan konsultasi dengan advokat atau ahli hukum
              yang kompeten.
            </p>
            <p className="mt-3 text-xs">© 2026 PAGARMIK · <a className="underline" href="/sitemap.xml">Sitemap</a> · <a className="underline" href="/robots.txt">Robots</a></p>
          </div>
        </footer>
        <BottomNav />
      </body>
    </html>
  );
}
