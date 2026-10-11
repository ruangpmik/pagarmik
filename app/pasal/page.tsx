import { hybridSearch } from "@/lib/search/hybrid";
import { getStore } from "@/lib/data/store";
import { Disclaimer } from "@/components/ui";

export const metadata = { title: "Pasal Explorer" };

export default function PasalPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q ?? "").trim();
  const store = getStore();
  const hits = q ? hybridSearch(q, store.allChunks(), { topK: 12, regulationMeta: store.regulationMeta() }).filter((h) => h.chunk.pasalNomor && h.chunk.pasalNomor !== "umum") : [];

  return (
    <div>
      <h1 className="text-2xl font-extrabold">⚖️ Pasal Explorer</h1>
      <p className="mt-1 text-sm text-ink-900/60">Cari sampai tingkat pasal. Contoh: “Pasal kerahasiaan Permenkes 24 2022”.</p>
      <form method="get" className="mt-4 flex gap-2" role="search">
        <input name="q" defaultValue={q} required minLength={2} placeholder="Pasal 5 Permenkes 24/2022…" className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-sm shadow-sm outline-none focus:border-pagar-500" />
        <button className="rounded-2xl bg-pagar-700 px-5 py-3 text-sm font-bold text-white">Cari</button>
      </form>
      <div className="mt-4 grid gap-3">
        {hits.map(({ chunk, score }) => (
          <article key={chunk.id} className="rounded-2xl border border-ink-100 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2 text-xs text-ink-900/60">
              <a href={`/regulasi/${chunk.regulationSlug}`} className="font-bold text-pagar-700 underline">{chunk.regulasiJudul}</a>
              <span>skor {score.toFixed(2)}</span>
            </div>
            <h2 className="mt-1 font-extrabold">Pasal {chunk.pasalNomor}</h2>
            <p className="mt-2 whitespace-pre-line font-serif text-[15px] leading-relaxed">{chunk.teks}</p>
            <div className="mt-2 flex gap-3 text-sm font-bold">
              <a className="text-pagar-700 underline" href={`/regulasi/${chunk.regulationSlug}?tab=pasal`}>Buka di regulasi →</a>
              <a className="text-pagar-700 underline" href={`/ai?q=${encodeURIComponent(`Jelaskan Pasal ${chunk.pasalNomor} ${chunk.regulasiJudul}`)}`}>✦ Explain →</a>
            </div>
          </article>
        ))}
      </div>
      {q && hits.length === 0 && <p className="mt-6 text-sm text-ink-900/60">Tidak ada pasal cocok. Coba kata kunci isi pasal, mis. “kerahasiaan”, “RME”, “data spesifik”.</p>}
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
