import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";
import FeedbackProvider from "@/components/FeedbackProvider";
import { DONATE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: { default: "PAGARMIK by RUANGPMIK — Menjaga Batas. Melindungi Profesi.", template: "%s | PAGARMIK" },
  description: "Platform hukum dan regulasi untuk Perekam Medis dan Informasi Kesehatan: pencarian regulasi, pasal, dan AI legal research berbasis sumber terverifikasi.",
  openGraph: {
    title: "PAGARMIK by RUANGPMIK — Menjaga Batas. Melindungi Profesi.",
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
        <FeedbackProvider>
          <a href="#konten" className="skip-link print:hidden">
            Lewati ke konten
          </a>
          <div className="app-shell">
            <TopNav />
            <div className="app-workspace">
              <header className="app-topbar print:hidden bg-navy-950 text-white border-b border-teal-900/60">
                <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
                  <a href="/" className="flex min-w-0 items-center gap-2.5 lg:hidden" aria-label="PAGARMIK beranda">
                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-white/10 ring-1 ring-white/20 p-0.5 flex items-center justify-center">
                      <Image src="/icon.png" alt="" width={24} height={24} priority className="object-contain" />
                    </div>
                    <span className="text-sm font-bold tracking-tight text-white">
                      PAGAR<span className="text-teal-400">MIK</span>
                    </span>
                    <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-pmik-orange text-navy-950">
                      RUANGPMIK
                    </span>
                  </a>

                  <form action="/legal-search" method="get" role="search" className="global-search hidden lg:flex">
                    <label htmlFor="workspace-search" className="sr-only">Cari regulasi, nomor, atau pasal</label>
                    <div className="flex h-8 w-full items-center rounded-lg border border-teal-500/30 bg-navy-900 px-2 text-white focus-within:border-teal-400 focus-within:ring-1 focus-within:ring-teal-400">
                      <input
                        id="workspace-search"
                        name="q"
                        type="search"
                        required
                        minLength={3}
                        placeholder="Cari regulasi, nomor, atau pasal (mis. Permenkes 24/2022)..."
                        className="h-full min-w-0 flex-1 rounded-md border-0 bg-transparent px-2 text-xs text-white outline-none placeholder:text-slate-400"
                      />
                      <button
                        type="submit"
                        className="inline-flex h-6 w-6 items-center justify-center rounded text-slate-300 hover:text-teal-300 focus-visible:outline"
                        aria-label="Jalankan pencarian"
                      >
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                          <circle cx="10.8" cy="10.8" r="6.6" />
                          <path d="m16 16 4.5 4.5" />
                        </svg>
                      </button>
                    </div>
                  </form>

                  <nav className="hidden items-center gap-5 text-xs font-semibold text-slate-200 lg:flex" aria-label="Akses cepat">
                    <a href="/bandingkan" className="hover:text-teal-300 transition-colors">Bandingkan</a>
                    <a href="/ai" className="hover:text-teal-300 transition-colors flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
                      Tanya AI
                    </a>
                    <a href="/profil" className="hover:text-teal-300 transition-colors">Profil</a>
                  </nav>
                  <a href="/legal-search" className="inline-flex min-h-8 items-center rounded-md px-2.5 text-xs font-semibold bg-teal-500 text-navy-950 hover:bg-teal-400 transition-colors lg:hidden">
                    Cari hukum
                  </a>
                </div>
              </header>

              <div className="app-sheet">
                <main id="konten" className="min-h-[70vh] w-full px-5 pb-28 pt-6 md:px-7 md:pt-7 lg:pb-9 print:p-0 print:min-h-0">
                  {children}
                </main>
                <footer className="border-t border-ink-100 bg-white print:border-black print:mt-8">
                  <div className="px-5 py-6 text-sm text-ink-900/75 md:px-7 print:px-0">
                    <p className="font-bold text-pagar-800 print:text-black">PAGARMIK by RUANGPMIK</p>
                    <p className="mt-1 max-w-3xl leading-relaxed print:text-xs">
                      PAGARMIK adalah platform informasi dan edukasi hukum. Informasi dari sistem AI bukan pendapat hukum profesional dan tidak menggantikan konsultasi dengan advokat atau ahli hukum yang kompeten.
                    </p>
                    <p className="mt-3 text-xs text-ink-900/70 print:hidden">
                      © 2026 PAGARMIK · <a className="underline underline-offset-2" href="/tentang">Tentang</a> · <a className="underline underline-offset-2" href="/masukan">Masukan</a> · <a className="underline underline-offset-2" href={DONATE_URL} target="_blank" rel="noopener noreferrer">Traktir Kopi</a> · <a className="underline underline-offset-2" href="/sitemap.xml">Sitemap</a> · <a className="underline underline-offset-2" href="/robots.txt">Robots</a>
                    </p>
                  </div>
                </footer>
              </div>
            </div>
            <div className="print:hidden">
              <BottomNav />
            </div>
          </div>
        </FeedbackProvider>
      </body>
    </html>
  );
}
