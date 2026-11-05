import { hybridSearch } from "@/lib/search/hybrid";
import { getStore } from "@/lib/data/store";
import { Breadcrumb, Disclaimer, EmptyState, ScoreBar } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import ExplainPasalButton from "@/components/ExplainPasalButton";
import RememberVisit from "@/components/RememberVisit";

export const metadata = { title: "Penelusuran Pasal" };

const PASAL_EXAMPLES = [
  "Pasal kerahasiaan Permenkes 24 2022",
  "data kesehatan spesifik UU 27 2022",
  "penyimpanan rekam medis elektronik",
  "hak pasien atas isi rekam medis",
];

export default function PasalPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const q = (searchParams.q ?? "").trim();
  const store = getStore();
  const hits = q
    ? hybridSearch(q, store.allChunks(), {
        topK: 12,
        regulationMeta: store.regulationMeta(),
      }).filter((h) => h.chunk.pasalNomor && h.chunk.pasalNomor !== "umum")
    : [];

  return (
    <div>
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Pasal" }]} />
        <h1>Penelusuran pasal</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-900/80">
          Cari langsung ke tingkat pasal dan ayat untuk menemukan norma hukum spesifik beserta rujukan peraturannya.
        </p>
      </header>

      {q ? (
        <RememberVisit
          kind="pasal"
          label={`Pasal: ${q}`}
          href={`/pasal?q=${encodeURIComponent(q)}`}
        />
      ) : null}

      <form method="get" className="section-card grid gap-2" role="search">
        <label htmlFor="pasal-query" className="text-sm font-semibold text-pagar-800">
          Cari bunyi pasal, topik norma, atau nomor regulasi
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="pasal-query"
            name="q"
            type="search"
            defaultValue={q}
            required
            minLength={2}
            placeholder="Contoh: Pasal kerahasiaan Permenkes 24/2022"
            className="min-h-11 min-w-0 flex-1 rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-base text-ink-900 outline-none placeholder:text-ink-900/60 focus:border-pagar-500"
          />
          <SubmitButton loadingLabel="Mencari pasal..." className="whitespace-nowrap px-5 py-2.5">
            Cari pasal
          </SubmitButton>
        </div>
      </form>

      {!q && (
        <section className="mt-6 section-card" aria-labelledby="contoh-pasal">
          <h2 id="contoh-pasal" className="text-base font-semibold text-pagar-800">
            Contoh penelusuran tingkat pasal
          </h2>
          <p className="mt-1 text-sm text-ink-900/75">
            Pilih salah satu topik di bawah ini untuk melihat kutipan pasal yang terindeks:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {PASAL_EXAMPLES.map((example) => (
              <a
                key={example}
                href={`/pasal?q=${encodeURIComponent(example)}`}
                className="btn-secondary min-h-9 px-3 py-1.5 text-xs"
              >
                {example}
              </a>
            ))}
          </div>
        </section>
      )}

      {q && hits.length > 0 && (
        <div className="mt-5 grid gap-3">
          <p className="text-sm text-ink-900/80" role="status">
            Ditemukan <strong>{hits.length}</strong> kutipan pasal untuk <strong>“{q}”</strong>
          </p>
          {hits.map(({ chunk, score }) => (
            <article key={chunk.id} className="section-card">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-ink-900/65">
                <a
                  href={`/regulasi/${chunk.regulationSlug}`}
                  className="font-bold text-pagar-700 underline underline-offset-2"
                >
                  {chunk.regulasiJudul}
                </a>
                <ScoreBar score={score} />
              </div>
              <h2 className="mt-2 text-lg font-semibold text-pagar-800">
                Pasal {chunk.pasalNomor}
              </h2>
              <p className="mt-2 whitespace-pre-line font-serif text-[15px] leading-relaxed text-ink-900/90">
                {chunk.teks}
              </p>
              <div className="mt-3 border-t border-ink-100 pt-3">
                <a
                  className="text-xs font-semibold text-pagar-700 underline underline-offset-2"
                  href={`/regulasi/${chunk.regulationSlug}?tab=pasal`}
                >
                  Buka dalam konteks regulasi →
                </a>
                {chunk.pasalNomor && (
                  <ExplainPasalButton
                    slug={chunk.regulationSlug}
                    pasal={chunk.pasalNomor}
                    regulasiJudul={chunk.regulasiJudul}
                  />
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {q && hits.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title={`Tidak ada pasal yang cocok dengan "${q}"`}
            description="Coba gunakan kata kunci substansi pasal seperti kerahasiaan, RME, pelepasan informasi, atau data spesifik."
            actionLabel="Cari di seluruh dokumen regulasi"
            actionHref={`/legal-search?q=${encodeURIComponent(q)}`}
          />
        </div>
      )}

      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
