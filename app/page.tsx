import type { Metadata } from "next";
import { SearchBar, StatusBadge, StatisticCard } from "@/components/ui";
import { NavIcon } from "@/components/TopNav";
import { getStore } from "@/lib/data/store";

export const metadata: Metadata = {
  title: "Rujukan hukum untuk informasi kesehatan",
  description: "Cari regulasi dan pasal terkait rekam medis, periksa status, dan buka sumber hukum yang tercatat.",
};

const EXPLORE = [
  {
    id: "catalog",
    title: "Jelajahi katalog",
    links: [
      { href: "/regulasi", label: "Semua regulasi", desc: "Katalog + status keberlakuan", icon: "file" },
      { href: "/pasal", label: "Pasal dan ringkasan", desc: "Teks pasal + arti & risiko", icon: "list" },
      { href: "/bandingkan", label: "Bandingkan regulasi", desc: "Perbandingan + telaah AI", icon: "compare" },
      { href: "/grafik", label: "Peta hubungan", desc: "Relasi mencabut/melaksanakan", icon: "network" },
      { href: "/timeline", label: "Linimasa", desc: "Peristiwa hukum regulasi", icon: "clock" },
    ],
  },
  {
    id: "research",
    title: "Riset dan analisis",
    links: [
      { href: "/ai", label: "Tanya AI", desc: "Riset ber-sitasi, anti-halusinasi", icon: "spark" },
      { href: "/topik", label: "Topik", desc: "Telusuri per domain kepatuhan", icon: "tag" },
      { href: "/artikel", label: "Artikel", desc: "Artikel kepatuhan terverifikasi", icon: "book" },
      { href: "/analisis-kasus", label: "Analisis kasus", desc: "Uraian kasus + dalil + risiko", icon: "scale" },
    ],
  },
] as const;

const sampleQuery = "Apa dasar hukum kerahasiaan rekam medis dan siapa yang bertanggung jawab menjaganya?";

export default function Home() {
  const store = getStore();
  const regulations = store.regulations();
  const relations = store.relations();
  const topics = store.topics();
  const articles = store.articles();

  const totalPasal = regulations.reduce((total, r) => total + store.pasalsOf(r.slug).length, 0);
  const berlakuCount = regulations.filter((r) => r.status === "BERLAKU").length;
  const dicabutCount = regulations.filter((r) => r.status === "DICABUT").length;
  const perubahanCount = regulations.filter((r) => r.status === "PERUBAHAN").length;

  const featuredRegulations = regulations.slice(0, 4);
  const aiExample = "/ai?q=" + encodeURIComponent(sampleQuery);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PAGARMIK",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    potentialAction: { "@type": "SearchAction", target: "/legal-search?q={query}", "query-input": "required name=query" },
  };

  return (
    <div className="home-page space-y-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero Header & Search Center */}
      <section className="section-card border-slate-200" aria-labelledby="home-title">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" />
              <span>Pusat Intelijen Regulasi Kesehatan · RUANGPMIK</span>
            </div>
            <h1 id="home-title" className="mt-3">Rujukan hukum RMIK</h1>
            <p className="mt-2 text-sm md:text-base leading-relaxed text-slate-600">
              Basis data peraturan perundang-undangan dan instrumen kepatuhan rekam medis, informasi kesehatan, dan pelindungan data pribadi di fasilitas pelayanan kesehatan.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <a href="/bandingkan" className="btn-secondary text-xs">
              <NavIcon name="compare" className="h-4 w-4 text-slate-500" />
              <span>Bandingkan Regulasi</span>
            </a>
            <a href="/grafik" className="btn-secondary text-xs">
              <NavIcon name="network" className="h-4 w-4 text-slate-500" />
              <span>Peta Hubungan</span>
            </a>
            <a href="/ai" className="btn-primary text-xs">
              <NavIcon name="spark" className="h-4 w-4 text-white" />
              <span>Tanya AI</span>
            </a>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="pt-6">
          <SearchBar
            id="home-q"
            big
            showAiLink
            label="Pencarian Cepat Regulasi, Nomor, atau Pasal"
            placeholder="Ketik nomor peraturan atau kata kunci (contoh: Permenkes 24/2022, rahasia rekam medis, data spesifik)..."
            submitLabel="Cari Regulasi"
            helperText="Pencarian menjangkau judul resmi, nomor, tahun, substansi pasal, dan metadata keterkaitan antarperaturan."
          />
        </div>
      </section>

      {/* KPI Metrics Grid */}
      <section aria-labelledby="kpi-heading">
        <h2 id="kpi-heading" className="sr-only">Ringkasan Statistik Regulasi</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatisticCard
            title="Total Regulasi"
            value={regulations.length}
            description={`${berlakuCount} aktif berlaku · ${dicabutCount} dicabut`}
            icon={<NavIcon name="file" className="h-5 w-5" />}
          />
          <StatisticCard
            title="Pasal & Norma"
            value={totalPasal}
            description="Terindeks dan terverifikasi per ayat"
            icon={<NavIcon name="list" className="h-5 w-5" />}
          />
          <StatisticCard
            title="Relasi Hukum"
            value={relations.length}
            description="Mencabut, turunan, dan melaksanakan"
            icon={<NavIcon name="network" className="h-5 w-5" />}
          />
          <StatisticCard
            title="Domain Kompetensi"
            value={topics.length}
            description={`${articles.length} artikel kepatuhan terverifikasi`}
            icon={<NavIcon name="tag" className="h-5 w-5" />}
          />
        </div>
      </section>

      {/* Snapshot Keberlakuan Regulasi */}
      <section className="section-card border-slate-200" aria-labelledby="status-snapshot-title">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h2 id="status-snapshot-title" className="text-sm font-bold text-slate-900">
              Distribusi Status Keberlakuan Peraturan
            </h2>
            <p className="text-xs text-slate-500">
              Berdasarkan metadata resmi yang tercatat di JDIH dan lembaran negara
            </p>
          </div>
          <a href="/regulasi" className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline">
            Lihat semua katalog ({regulations.length}) →
          </a>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-3">
            <span className="text-xs font-semibold text-emerald-800">Berlaku Aktif</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-emerald-900">{berlakuCount}</span>
              <span className="text-[11px] font-semibold text-emerald-700">
                {Math.round((berlakuCount / regulations.length) * 100)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-emerald-800/80">Rujukan operasional sah</p>
          </div>

          <div className="rounded-lg border border-rose-200 bg-rose-50/50 p-3">
            <span className="text-xs font-semibold text-rose-800">Dicabut / Tidak Berlaku</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-rose-900">{dicabutCount}</span>
              <span className="text-[11px] font-semibold text-rose-700">
                {Math.round((dicabutCount / regulations.length) * 100)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-rose-800/80">Telah memiliki regulasi pengganti</p>
          </div>

          <div className="rounded-lg border border-sky-200 bg-sky-50/50 p-3">
            <span className="text-xs font-semibold text-sky-800">Perubahan / Transisi</span>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="font-mono text-xl font-bold text-sky-900">{perubahanCount}</span>
              <span className="text-[11px] font-semibold text-sky-700">
                {Math.round((perubahanCount / regulations.length) * 100)}%
              </span>
            </div>
            <p className="mt-1 text-[11px] text-sky-800/80">Terdapat naskah amandemen</p>
          </div>
        </div>
      </section>

      {/* Main Grid: Featured Regulations & Exploration Hub */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.7fr)_minmax(280px,0.9fr)]">
        {/* Left Column: Featured Regulations */}
        <section aria-labelledby="featured-title" className="space-y-4">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <h2 id="featured-title" className="text-base font-bold text-slate-900">
                Instrumen Hukum Pokok Terindeks
              </h2>
              <p className="text-xs text-slate-500">
                Regulasi utama yang sering dijadikan acuan tata kelola informasi kesehatan
              </p>
            </div>
            <a href="/regulasi" className="text-xs font-semibold text-teal-700 hover:text-teal-800 hover:underline">
              Buka Katalog Lengkap →
            </a>
          </div>

          <div className="grid gap-3.5">
            {featuredRegulations.map((reg) => (
              <article key={reg.slug} className="section-card border-slate-200 transition-colors hover:border-slate-300">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={reg.status} />
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {store.shortRef(reg.slug)}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {reg.verifiedAt ? `Terverifikasi: ${reg.verifiedAt}` : "Belum diverifikasi"}
                  </span>
                </div>

                <h3 className="mt-2.5 text-base font-semibold leading-snug text-slate-900">
                  <a href={`/regulasi/${reg.slug}`} className="hover:text-teal-700 hover:underline">
                    {reg.judul}
                  </a>
                </h3>

                <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-600">
                  {reg.ringkasan}
                </p>

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2.5 text-xs text-slate-500">
                  <span>{reg.instansi} ({reg.tahun})</span>
                  <div className="flex items-center gap-3">
                    <a
                      href={`/regulasi/${reg.slug}?tab=pasal`}
                      className="font-semibold text-teal-700 hover:underline"
                    >
                      Buka Pasal ({store.pasalsOf(reg.slug).length})
                    </a>
                    {reg.sumberResmi && (
                      <a
                        href={reg.sumberResmi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-400 hover:text-slate-700 hover:underline"
                      >
                        Sumber Resmi ↗
                      </a>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* Right Column: Exploration & Quick Access Sidebar */}
        <aside className="space-y-6">
          {EXPLORE.map((group) => (
            <div key={group.id} className="section-card border-slate-200">
              <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {group.title}
              </h2>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="group flex items-start gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-pagar-200 hover:bg-pagar-50 focus-visible:outline"
                    >
                      <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-pagar-50 text-pagar-700">
                        <NavIcon name={link.icon} className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold text-slate-800 group-hover:text-pagar-700">
                            {link.label}
                          </span>
                          <span className="text-slate-300">→</span>
                        </span>
                        <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                          {link.desc}
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* AI Research Callout */}
          <div className="section-card border-slate-200 bg-slate-50/50">
            <div className="flex items-center gap-2 text-teal-800">
              <NavIcon name="spark" className="h-4 w-4 text-teal-600" />
              <h2 className="text-xs font-bold uppercase tracking-wider">PAGARMIK AI Research</h2>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              Asisten riset hukum yang mengekstrak pasal, kewajiban, dan sanksi regulasi tanpa halusinasi.
            </p>
            <a
              href={aiExample}
              className="mt-3 block rounded-lg border border-slate-200 bg-white p-2.5 text-xs font-semibold text-teal-700 hover:border-teal-400 hover:bg-teal-50/30"
            >
              &ldquo;{sampleQuery.slice(0, 56)}...&rdquo; →
            </a>
          </div>
        </aside>
      </div>
    </div>
  );
}
