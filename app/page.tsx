import type { Metadata } from "next";
import { SearchBar, RegulationCard } from "@/components/ui";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = {
  title: "PAGARMIK — Menjaga Batas. Melindungi Profesi.",
  description: "Platform hukum dan regulasi untuk Perekam Medis dan Informasi Kesehatan: cari regulasi, telusuri pasal, tanya PAGARMIK AI.",
};

const EXPLORE = [
  { href: "/regulasi", icon: "📚", label: "Regulasi" },
  { href: "/pasal", icon: "⚖️", label: "Pasal" },
  { href: "/ai", icon: "🤖", label: "PAGARMIK AI" },
  { href: "/legal-search", icon: "🔍", label: "Legal Search" },
  { href: "/topik/privasi", icon: "🛡️", label: "Privasi & Data" },
  { href: "/analisis-kasus", icon: "📑", label: "Analisis Kasus" },
  { href: "/timeline", icon: "🧭", label: "Regulatory Timeline" },
  { href: "/artikel", icon: "📖", label: "Knowledge Base" },
];

export default function Home() {
  const store = getStore();
  const regs = store.regulations().slice(0, 4);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PAGARMIK",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    potentialAction: { "@type": "SearchAction", target: "/legal-search?q={query}", "query-input": "required name=query" },
  };

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      {/* HERO */}
      <section className="relative overflow-hidden rounded-3xl bg-pagar-950 px-6 py-12 text-white md:px-12 md:py-16">
        <div className="pagar-stripes absolute inset-y-0 left-0 w-2 opacity-60" aria-hidden />
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-pagar-200">Legal Intelligence · RMIK / MIK</p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">PAGARMIK</h1>
          <p className="mt-1 text-lg font-semibold text-pagar-100">Menjaga Batas. Melindungi Profesi.</p>
          <p className="mt-3 text-[15px] text-white/80">
            Platform hukum dan regulasi untuk Perekam Medis dan Informasi Kesehatan.
          </p>
          <div className="mt-6 rounded-2xl bg-white p-2">
            <SearchBar big />
          </div>
          <p className="mt-3 text-xs text-white/60">
            Setiap jawaban AI disertai sitasi ke sumber hukum terverifikasi — tanpa sumber, AI akan berkata jujur.
          </p>
        </div>
      </section>

      {/* EXPLORE */}
      <section className="mt-8" aria-label="Jelajahi PAGARMIK">
        <h2 className="text-lg font-extrabold">Jelajahi PAGARMIK</h2>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {EXPLORE.map((e) => (
            <a key={e.label} href={e.href} className="rounded-2xl border border-ink-100 bg-white p-4 text-center shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <span className="text-2xl" aria-hidden>{e.icon}</span>
              <span className="mt-1 block text-sm font-bold text-pagar-800">{e.label}</span>
            </a>
          ))}
        </div>
      </section>

      {/* REGULASI UNGGULAN */}
      <section className="mt-8" aria-label="Regulasi terbaru">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-extrabold">Regulasi Kunci</h2>
          <a href="/regulasi" className="text-sm font-bold text-pagar-700 underline">Lihat semua</a>
        </div>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {regs.map((r) => (
            <RegulationCard key={r.slug} r={r} />
          ))}
        </div>
      </section>

      {/* DEMO */}
      <section className="mt-8 rounded-2xl border border-pagar-200 bg-pagar-50 p-5" aria-label="Coba demo">
        <h2 className="font-extrabold text-pagar-800">Coba skenario demo</h2>
        <p className="mt-1 text-sm text-ink-900/70">
          “Apa dasar hukum kerahasiaan rekam medis dan siapa yang bertanggung jawab menjaganya?”
        </p>
        <a
          href="/ai?q=Apa%20dasar%20hukum%20kerahasiaan%20rekam%20medis%20dan%20siapa%20yang%20bertanggung%20jawab%20menjaganya%3F"
          className="mt-3 inline-block rounded-xl bg-pagar-700 px-4 py-2 text-sm font-bold text-white"
        >
          Jalankan di PAGARMIK AI →
        </a>
      </section>
    </div>
  );
}
