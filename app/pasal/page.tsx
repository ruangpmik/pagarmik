import { hybridSearch } from "@/lib/search/hybrid";
import { getStore } from "@/lib/data/store";
import { Disclaimer } from "@/components/ui";
import RememberVisit from "@/components/RememberVisit";

export const metadata = { title: "Pasal Explorer" };

export default function PasalPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q ?? "").trim();
  const store = getStore();
  const hits = q ? hybridSearch(q, store.allChunks(), { topK: 12, regulationMeta: store.regulationMeta() }).filter((h) => h.chunk.pasalNomor && h.chunk.pasalNomor !== "umum") : [];

  return (
    <div>
      <h1>Penelusuran pasal</h1>
      {q ? <RememberVisit kind="pasal" label={`Pasal: ${q}`} href={`/pasal?q=${encodeURIComponent(q)}`} /> : null}
      <p className="mt-1 text-sm text-ink-900/60">Cari sampai tingkat pasal. Contoh: “Pasal kerahasiaan Permenkes 24 2022”.</p>
      <form method="get" className="mt-4 grid gap-2" role="search">
        <label htmlFor="pasal-query" className="text-sm font-semibold text-pagar-800">Cari pasal atau nomor regulasi</label>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input id="pasal-query" name="q" defaultValue={q} required minLength={2} placeholder="Contoh: Pasal 5 Permenkes 24/2022" className="min-h-11 min-w-0 flex-1 rounded-lg border border-ink-100 bg-white px-4 py-2.5 text-base text-ink-900 outline-none placeholder:text-ink-900/60 focus:border-pagar-500" />
          <button className="min-h-11 whitespace-nowrap rounded-lg bg-pagar-700 px-5 py-2.5 text-sm font-semibold text-white">Cari</button>
        </div>
      </form>
      <div className="mt-4 grid gap-3">
        {hits.map(({ chunk, score }) => (
          <article key={chunk.id} className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-900/60">
              <a href={`/regulasi/${chunk.regulationSlug}`} className="font-bold text-pagar-700 underline">{chunk.regulasiJudul}</a>
              <span>skor {score.toFixed(2)}</span>
            </div>
            <h2 className="mt-1 font-extrabold">Pasal {chunk.pasalNomor}</h2>
            <p className="mt-2 whitespace-pre-line font-serif text-[15px] leading-relaxed">{chunk.teks}</p>
            <div className="mt-2 flex gap-3 text-sm font-bold">
              <a className="text-pagar-700 underline" href={`/regulasi/${chunk.regulationSlug}?tab=pasal`}>Buka di regulasi →</a>
              <a className="text-pagar-700 underline underline-offset-2" href={`/ai?q=${encodeURIComponent(`Jelaskan Pasal ${chunk.pasalNomor} ${chunk.regulasiJudul}`)}`}>Jelaskan dengan PAGARMIK AI</a>
            </div>
          </article>
        ))}
      </div>
      {q && hits.length === 0 && <p className="mt-6 text-sm text-ink-900/60">Tidak ada pasal cocok. Coba kata kunci isi pasal, mis. “kerahasiaan”, “RME”, “data spesifik”.</p>}
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
