import type { Metadata } from "next";
import { SearchBar, StatusBadge } from "@/components/ui";
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
      { href: "/regulasi", label: "Semua regulasi", icon: "file" },
      { href: "/pasal", label: "Pasal dan ringkasan", icon: "list" },
      { href: "/bandingkan", label: "Bandingkan regulasi", icon: "compare" },
      { href: "/grafik", label: "Peta hubungan regulasi", icon: "network" },
      { href: "/timeline", label: "Linimasa regulasi", icon: "clock" },
    ],
  },
  {
    id: "research",
    title: "Riset dan analisis",
    links: [
      { href: "/topik/privasi", label: "Privasi dan data", icon: "tag" },
      { href: "/artikel", label: "Artikel", icon: "book" },
      { href: "/analisis-kasus", label: "Analisis kasus", icon: "scale" },
    ],
  },
] as const;

const sampleQuery = "Apa dasar hukum kerahasiaan rekam medis dan siapa yang bertanggung jawab menjaganya?";

export default function Home() {
  const store = getStore();
  const regulations = store.regulations();
  const featuredRegulations = regulations.slice(0, 4);
  const totalPasal = regulations.reduce((total, regulation) => total + store.pasalsOf(regulation.slug).length, 0);
  const counts = [
    { label: "Regulasi", value: regulations.length },
    { label: "Pasal tersedia", value: totalPasal },
    { label: "Topik", value: store.topics().length },
  ];
  const aiExample = "/ai?q=" + encodeURIComponent(sampleQuery);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PAGARMIK",
    url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
    potentialAction: { "@type": "SearchAction", target: "/legal-search?q={query}", "query-input": "required name=query" },
  };

  return (
    <div className="home-page space-y-9">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="grid gap-x-8 gap-y-6 border-b border-ink-100 pb-8 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] xl:items-center" aria-labelledby="home-title">
        <div className="min-w-0">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-pagar-700">Menjaga Batas · Melindungi Profesi</p>
          <h1 id="home-title" className="mt-3 max-w-[20ch]">Rujukan hukum RMIK</h1>
          <p className="mt-3 max-w-[58ch] text-base leading-relaxed text-ink-900/80">
            Telusuri aturan terkait rekam medis dan informasi kesehatan, lalu periksa status serta sumbernya.
          </p>
        </div>

        <div className="home-search-panel flex min-w-0 flex-col justify-center">
          <h2 className="mb-4 text-lg font-semibold text-pagar-800">Cari sumber hukum</h2>
          <SearchBar
            id="home-q"
            big
            showAiLink={false}
            label="Kata kunci, judul, nomor regulasi, atau pasal"
            placeholder="Contoh: Permenkes 24/2022 atau rahasia rekam medis"
            submitLabel="Cari"
          />
          <p className="mt-3 text-sm leading-relaxed text-ink-900/75">
            Pencarian membuka dokumen katalog; detail regulasi memuat status dan tautan sumber yang tercatat.
          </p>
        </div>

        <dl className="grid grid-cols-3 divide-x divide-ink-100 border-y border-ink-100 py-3 xl:col-span-2">
          {counts.map((item) => (
            <div key={item.label} className="min-w-0 px-3 first:pl-0 sm:px-5">
              <dt className="text-sm text-ink-900/75">{item.label}</dt>
              <dd className="mt-0.5 text-2xl font-semibold tabular-nums text-pagar-800">{item.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="grid gap-9 xl:grid-cols-[minmax(0,1.6fr)_minmax(260px,0.8fr)]">
        <section aria-labelledby="catalog-title">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-ink-100 pb-3">
            <div>
              <h2 id="catalog-title" className="text-xl font-semibold text-pagar-800">Regulasi dalam katalog</h2>
              <p className="mt-1 text-sm text-ink-900/75">Lihat ringkasan, status yang tercatat, dan sumber dokumen.</p>
            </div>
            <a href="/regulasi" className="inline-flex min-h-10 items-center font-semibold text-pagar-700 underline underline-offset-2">
              Buka katalog
            </a>
          </div>

          <ul>
            {featuredRegulations.map((regulation) => (
              <li key={regulation.slug} className="border-b border-ink-100 py-4 last:border-b-0">
                <article className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto] md:gap-6">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                      <StatusBadge status={regulation.status} />
                      <span className="text-sm text-ink-900/75">{store.shortRef(regulation.slug)}</span>
                    </div>
                    <a
                      href={"/regulasi/" + regulation.slug}
                      className="mt-2 block rounded-sm font-semibold leading-snug text-pagar-800 underline-offset-4 hover:underline focus-visible:outline"
                    >
                      {regulation.judul}
                    </a>
                    <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-ink-900/80">{regulation.ringkasan}</p>
                    <p className="mt-2 text-sm text-ink-900/75">{regulation.instansi}</p>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm md:min-w-40 md:flex-col md:items-start">
                    <span className="text-ink-900/75">
                      {regulation.verifiedAt ? "Verifikasi " + regulation.verifiedAt : "Verifikasi belum tercatat"}
                    </span>
                    {regulation.sumberResmi ? (
                      <a
                        href={regulation.sumberResmi}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-semibold text-pagar-700 underline underline-offset-2"
                      >
                        Sumber resmi
                        <span className="sr-only"> untuk {regulation.judul}, terbuka di tab baru</span>
                      </a>
                    ) : (
                      <span className="text-ink-900/70">Sumber resmi belum dicatat</span>
                    )}
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </section>

        <aside className="space-y-8">
          {EXPLORE.map((group) => (
            <section key={group.id} aria-labelledby={"explore-" + group.id}>
              <h2 id={"explore-" + group.id} className="border-b border-ink-100 pb-3 text-lg font-semibold text-pagar-800">
                {group.title}
              </h2>
              <ul className="divide-y divide-ink-100">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="flex min-h-11 items-center gap-3 py-2 font-medium text-ink-900 hover:text-pagar-700 focus-visible:outline"
                    >
                      <NavIcon name={link.icon} className="h-4 w-4 shrink-0 text-ink-900/60" />
                      <span>{link.label}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ))}

          <section className="border-t border-ink-100 pt-5" aria-labelledby="ai-example-title">
            <h2 id="ai-example-title" className="text-lg font-semibold text-pagar-800">Tanya PAGARMIK AI</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-900/80">
              Jawaban menampilkan sitasi yang tersedia dan menyatakan bila dasar hukum belum cukup.
            </p>
            <a href={aiExample} className="mt-3 inline-flex min-h-11 items-center font-semibold text-pagar-700 underline underline-offset-2">
              Contoh: kerahasiaan rekam medis
            </a>
          </section>
        </aside>
      </div>
    </div>
  );
}
