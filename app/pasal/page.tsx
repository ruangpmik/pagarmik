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
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Pasal" }]} />
        <h1>Penelusuran Pasal & Norma</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Penelusuran langsung ke tingkat pasal dan ayat untuk menemukan rumusan norma hukum spesifik beserta rujukan peraturannya.
        </p>
      </header>

      {q ? (
        <RememberVisit
          kind="pasal"
          label={`Pasal: ${q}`}
          href={`/pasal?q=${encodeURIComponent(q)}`}
        />
      ) : null}

      <form method="get" className="section-card space-y-3" role="search">
        <label htmlFor="pasal-query" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Cari Bunyi Pasal, Subjek Norma, atau Nomor Regulasi
        </label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            id="pasal-query"
            name="q"
            type="search"
            defaultValue={q}
            required
            minLength={2}
            placeholder="Contoh: Pasal kerahasiaan Permenkes 24/2022, pemusnahan berkas..."
            className="form-input flex-1"
          />
          <SubmitButton loadingLabel="Mencari pasal..." className="whitespace-nowrap px-5 py-2.5">
            Cari Pasal
          </SubmitButton>
        </div>
      </form>

      {!q && (
        <section className="section-card space-y-3" aria-labelledby="contoh-pasal">
          <h2 id="contoh-pasal" className="text-base font-bold text-slate-900">
            Contoh Penelusuran Tingkat Pasal
          </h2>
          <p className="text-sm text-slate-600">
            Pilih salah satu frasa di bawah ini untuk melihat kutipan pasal terverifikasi:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {PASAL_EXAMPLES.map((example) => (
              <a
                key={example}
                href={`/pasal?q=${encodeURIComponent(example)}`}
                className="btn-secondary text-xs font-semibold"
              >
                {example}
              </a>
            ))}
          </div>
        </section>
      )}

      {q && hits.length > 0 && (
        <div className="space-y-4">
          <p className="text-xs text-slate-500" role="status">
            Ditemukan <strong className="text-slate-800">{hits.length}</strong> kutipan pasal untuk <strong className="text-slate-900">“{q}”</strong>
          </p>
          {hits.map(({ chunk, score }) => (
            <article key={chunk.id} className="section-card space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2.5 text-xs text-slate-500">
                <a
                  href={`/regulasi/${chunk.regulationSlug}`}
                  className="font-bold text-teal-700 hover:underline"
                >
                  {chunk.regulasiJudul}
                </a>
                <ScoreBar score={score} />
              </div>
              <h2 className="text-base font-bold text-slate-900">
                Pasal {chunk.pasalNomor}
              </h2>
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">
                  {chunk.teks}
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <a
                  className="text-xs font-bold text-teal-700 hover:underline"
                  href={`/regulasi/${chunk.regulationSlug}?tab=pasal#pasal-${chunk.pasalNomor}`}
                >
                  Buka dalam konteks regulasi penuh →
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
        <EmptyState
          title={`Tidak ada pasal yang cocok dengan "${q}"`}
          description="Coba gunakan kata kunci substansi pasal seperti kerahasiaan, RME, pelepasan informasi, atau data spesifik."
          actionLabel="Cari di seluruh repositori regulasi"
          actionHref={`/legal-search?q=${encodeURIComponent(q)}`}
        />
      )}

      <div>
        <Disclaimer />
      </div>
    </div>
  );
}
