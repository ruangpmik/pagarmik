import { hybridSearch } from "@/lib/search/hybrid";
import { getStore } from "@/lib/data/store";
import type { Regulation } from "@/lib/data/types";
import { SearchBar, StatusBadge, Disclaimer, ScoreBar, StatusSwitcher } from "@/components/ui";
import RememberVisit from "@/components/RememberVisit";

export const metadata = { title: "Pencarian hukum" };

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
      <h1>Pencarian hukum</h1>
      {q ? <RememberVisit kind="search" label={q.slice(0, 80)} href={`/legal-search?q=${encodeURIComponent(q)}`} /> : null}
      <p className="mt-1 text-base leading-relaxed text-ink-900/80">Cari regulasi dan pasal berdasarkan kata kunci serta metadata sumber.</p>
      <div className="mt-4"><SearchBar /></div>

      <div className="mt-3">
        <StatusSwitcher
          base="/legal-search"
          current={filters.status}
          extra={{
            q,
            ...(filters.jenis ? { jenis: filters.jenis } : {}),
            ...(filters.tahun ? { tahun: String(filters.tahun) } : {}),
            ...(filters.topik ? { topik: filters.topik } : {}),
          }}
        />
      </div>

      <form method="get" className="mt-3 grid grid-cols-2 gap-3 rounded-2xl border border-ink-100 bg-ink-50/50 p-3 md:grid-cols-4" aria-label="Filter pencarian">
        <input type="hidden" name="q" value={q} />
        {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
        <div className="grid gap-1">
          <label htmlFor="filter-jenis" className="text-sm font-medium text-ink-900">Jenis regulasi</label>
          <select id="filter-jenis" name="jenis" defaultValue={filters.jenis ?? ""} className="min-h-11 min-w-0 rounded-lg border border-ink-100 bg-white px-2 py-2 text-sm text-ink-900">
            <option value="">Semua jenis</option>
            {JENIS.map((j) => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div className="grid gap-1">
          <label htmlFor="filter-tahun" className="text-sm font-medium text-ink-900">Tahun</label>
          <input id="filter-tahun" name="tahun" defaultValue={filters.tahun ?? ""} inputMode="numeric" className="min-h-11 min-w-0 rounded-lg border border-ink-100 bg-white px-2 py-2 text-sm text-ink-900" />
        </div>
        <div className="grid gap-1">
          <label htmlFor="filter-topik" className="text-sm font-medium text-ink-900">Topik</label>
          <input id="filter-topik" name="topik" defaultValue={filters.topik ?? ""} className="min-h-11 min-w-0 rounded-lg border border-ink-100 bg-white px-2 py-2 text-sm text-ink-900" />
        </div>
        <button className="min-h-11 self-end rounded-lg bg-pagar-700 px-3 py-2 text-sm font-semibold text-white">Terapkan filter</button>
      </form>

      {q && (
        <p className="mt-4 text-sm" role="status">
          <strong>{grouped.length}</strong> regulasi relevan untuk “{q}”
        </p>
      )}

      <div className="mt-4 grid gap-4">
        {grouped.map(({ reg, best, pasals }) => (
          <a key={reg.slug} href={`/regulasi/${reg.slug}`} className="block rounded-2xl border border-ink-100 bg-white p-5 underline-offset-4 hover:border-pagar-300">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={reg.status} />
              <span className="text-xs text-ink-900/60">{reg.jenis} · {reg.nomor}/{reg.tahun}</span>
              <ScoreBar score={best} />
            </div>
            <h2 className="mt-2 font-semibold text-pagar-800">{reg.judul}</h2>
            <p className="mt-1 text-sm text-ink-900/70">{reg.ringkasan}</p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-900/60">
              <span>Instansi: {reg.instansi}</span>
              <span>Tanggal berlaku: {reg.tglBerlaku ?? "Belum tercatat"}</span>
              <span>Topik: {reg.topik.join(", ") || "Belum diklasifikasikan"}</span>
              {pasals.length > 0 && <span>Pasal relevan: {pasals.join(", ")}</span>}
              <span>Sumber resmi: {reg.sumberResmi ?? "Belum tercatat"}</span>
              <span>Verifikasi: {reg.verifiedAt ?? "Belum tercatat"}</span>
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
