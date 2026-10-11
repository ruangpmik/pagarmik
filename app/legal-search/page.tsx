import { hybridSearch } from "@/lib/search/hybrid";
import { getStore } from "@/lib/data/store";
import type { Regulation } from "@/lib/data/types";
import { SearchBar, StatusBadge, Disclaimer, ScoreBar } from "@/components/ui";

export const metadata = { title: "Legal Search" };

const JENIS = ["UU", "PP", "Perpres", "Permenkes", "Permenkominfo", "Perka ANRI", "PeranRI", "Peraturan BSSN", "Putusan MK", "Putusan MA", "Kepmenkes", "SE", "Pedoman", "Standar"];

export default function LegalSearch({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q ?? "").trim();
  const filters = {
    jenis: searchParams.jenis || undefined,
    tahun: searchParams.tahun ? Number(searchParams.tahun) : undefined,
    status: searchParams.status || undefined,
    topik: searchParams.topik || undefined,
  };
  const store = getStore();
  const results = q ? hybridSearch(q, store.allChunks(), { filters, topK: 20, regulationMeta: store.regulationMeta() }) : [];

  // Kelompokkan per regulasi untuk tampilan metadata kaya
  const seen = new Map<string, { reg: Regulation; best: number; pasals: string[] }>();
  for (const r of results) {
    const reg = store.regulation(r.chunk.regulationSlug);
    if (!reg) continue;
    const e = seen.get(reg.slug) ?? { reg, best: 0, pasals: [] };
    e.best = Math.max(e.best, r.score);
    if (r.chunk.pasalNomor && !e.pasals.includes(r.chunk.pasalNomor)) e.pasals.push(r.chunk.pasalNomor);
    seen.set(reg.slug, e);
  }
  const grouped = [...seen.values()].sort((a, b) => b.best - a.best);

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Legal Search</h1>
      <p className="mt-1 text-sm text-ink-900/60">Hybrid search: keyword + semantik + filter metadata, dengan reranking otoritas dan trust level.</p>
      <div className="mt-4"><SearchBar /></div>

      <form method="get" className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-ink-100 bg-ink-50/50 p-3 md:grid-cols-5" aria-label="Filter">
        <input type="hidden" name="q" value={q} />
        <select name="jenis" defaultValue={filters.jenis ?? ""} className="rounded-lg border border-ink-100 bg-white px-2 py-2 text-sm text-ink-900">
          <option value="">Semua jenis</option>
          {JENIS.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>
        <input name="tahun" defaultValue={filters.tahun ?? ""} placeholder="Tahun" inputMode="numeric" className="rounded-lg border border-ink-100 bg-white px-2 py-2 text-sm text-ink-900" />
        <select name="status" defaultValue={filters.status ?? ""} className="rounded-lg border border-ink-100 bg-white px-2 py-2 text-sm text-ink-900">
          <option value="">Semua status</option>
          <option value="BERLAKU">🟢 Berlaku</option>
          <option value="BERLAKU_DENGAN_CATATAN">🟡 Berlaku dgn catatan</option>
          <option value="PERUBAHAN">🟠 Perubahan</option>
          <option value="DICABUT">🔴 Dicabut</option>
          <option value="BELUM_DIVERIFIKASI">⚪ Belum diverifikasi</option>
        </select>
        <input name="topik" defaultValue={filters.topik ?? ""} placeholder="Topik (mis. privasi)" className="rounded-lg border border-ink-100 bg-white px-2 py-2 text-sm text-ink-900" />
        <button className="rounded-lg bg-pagar-700 px-3 py-2 text-sm font-bold text-white">Terapkan</button>
      </form>

      {q && (
        <p className="mt-4 text-sm" role="status">
          <strong>{grouped.length}</strong> regulasi relevan untuk “{q}”
        </p>
      )}

      <div className="mt-3 grid gap-3">
        {grouped.map(({ reg, best, pasals }) => (
          <a key={reg.slug} href={`/regulasi/${reg.slug}`} className="block rounded-2xl border border-ink-100 bg-white p-4 shadow-sm hover:shadow-md">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={reg.status} />
              <span className="text-xs text-ink-900/60">{reg.jenis} · {reg.nomor}/{reg.tahun}</span>
              <ScoreBar score={best} />
            </div>
            <h2 className="mt-1 font-bold text-pagar-800">{reg.judul}</h2>
            <p className="mt-1 text-sm text-ink-900/70">{reg.ringkasan}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-900/60">
              <span>🏛️ {reg.instansi}</span>
              <span>📅 Berlaku: {reg.tglBerlaku ?? "—"}</span>
              <span>🏷️ {reg.topik.join(", ")}</span>
              {pasals.length > 0 && <span>⚖️ Pasal relevan: {pasals.join(", ")}</span>}
              <span>🔗 {reg.sumberResmi ?? "—"}</span>
              <span>✅ Terverifikasi: {reg.verifiedAt ?? "—"}</span>
            </div>
          </a>
        ))}
      </div>
      {q && grouped.length === 0 && (
        <div className="mt-6 rounded-2xl border p-6 text-center text-sm text-ink-900/70">
          Tidak ada hasil. Coba kata kunci lain seperti “kerahasiaan”, “RME”, atau “data kesehatan”.
        </div>
      )}
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
