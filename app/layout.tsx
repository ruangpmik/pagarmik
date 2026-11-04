import type { Metadata } from "next";
import Image from "next/image";
import { Inter, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import BottomNav from "@/components/BottomNav";
import TopNav from "@/components/TopNav";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Source_Serif_4({ subsets: ["latin"], variable: "--font-serif", display: "swap" });

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
    <html lang="id" className={`${sans.variable} ${serif.variable}`}>
      <body>
        <a href="#konten" className="skip-link">
          Lewati ke konten
        </a>
        <div className="app-shell">
          <TopNav />
          <div className="app-workspace">
            <header className="app-topbar">
              <div className="flex h-full items-center justify-between gap-4 px-4 md:px-6">
                <a href="/" className="flex min-w-0 items-center gap-2 lg:hidden" aria-label="PAGARMIK beranda">
                  <Image src="/icon.png" alt="" width={32} height={32} priority />
                  <span className="text-sm font-bold tracking-tight text-pagar-800">PAGARMIK</span>
                </a>

                <form action="/legal-search" method="get" role="search" className="global-search hidden lg:flex">
                  <label htmlFor="workspace-search" className="sr-only">Cari regulasi, nomor, atau pasal</label>
                  <div className="flex h-8 w-full items-center rounded-md border border-[var(--control-border)] bg-white">
                    <input
                      id="workspace-search"
                      name="q"
                      type="search"
                      required
                      minLength={3}
                      placeholder="Cari regulasi, nomor, atau pasal"
                      className="h-full min-w-0 flex-1 rounded-md border-0 bg-transparent px-3 text-sm outline-none placeholder:text-ink-900/65"
                    />
                    <button
                      type="submit"
                      className="mr-1 inline-flex h-6 w-7 items-center justify-center rounded text-ink-900/70 hover:bg-pagar-50 hover:text-pagar-800 focus-visible:outline"
                      aria-label="Jalankan pencarian"
                    >
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <circle cx="10.8" cy="10.8" r="6.6" />
                        <path d="m16 16 4.5 4.5" />
                      </svg>
                    </button>
                  </div>
                </form>

                <nav className="hidden items-center gap-5 text-sm font-medium lg:flex" aria-label="Akses cepat">
                  <a href="/ai" className="text-ink-900/75 hover:text-pagar-800">Tanya AI</a>
                  <a href="/profil" className="text-ink-900/75 hover:text-pagar-800">Profil</a>
                </nav>
                <a href="/legal-search" className="inline-flex min-h-10 items-center rounded-md px-3 text-sm font-semibold text-pagar-700 hover:bg-white lg:hidden">
                  Cari hukum
                </a>
              </div>
            </header>

            <div className="app-sheet">
              <main id="konten" className="min-h-[70vh] w-full px-5 pb-28 pt-6 md:px-7 md:pt-7 lg:pb-9">
                {children}
              </main>
              <footer className="border-t border-ink-100 bg-white">
                <div className="px-5 py-6 text-sm text-ink-900/75 md:px-7">
                  <p className="font-bold text-pagar-800">PAGARMIK by RUANGPMIK</p>
                  <p className="mt-1 max-w-3xl leading-relaxed">
                    PAGARMIK adalah platform informasi dan edukasi hukum. Informasi dari sistem AI bukan pendapat hukum profesional dan tidak menggantikan konsultasi dengan advokat atau ahli hukum yang kompeten.
                  </p>
                  <p className="mt-3 text-xs text-ink-900/70">
                    © 2026 PAGARMIK · <a className="underline underline-offset-2" href="/sitemap.xml">Sitemap</a> · <a className="underline underline-offset-2" href="/robots.txt">Robots</a>
                  </p>
                </div>
              </footer>
            </div>
          </div>
          <BottomNav />
        </div>
      </body>
    </html>
  );
}
