import { hybridSearch } from "@/lib/search/hybrid";
import { getStore } from "@/lib/data/store";
import type { Regulation } from "@/lib/data/types";
import {
  SearchBar,
  StatusBadge,
  Disclaimer,
  ScoreBar,
  StatusSwitcher,
  Breadcrumb,
  EmptyState,
} from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import RememberVisit from "@/components/RememberVisit";

export const metadata = { title: "Pencarian hukum" };

const JENIS = [
  "UU",
  "PP",
  "Perpres",
  "Permenkes",
  "Permenkominfo",
  "Perka ANRI",
  "PeranRI",
  "Peraturan BSSN",
  "Putusan MK",
  "Putusan MA",
  "Kepmenkes",
  "SE",
  "Pedoman",
  "Standar",
];

const QUICK_QUERIES = [
  "kerahasiaan rekam medis",
  "Permenkes 24/2022",
  "data kesehatan spesifik",
  "retensi rekam medis",
];

export default function LegalSearch({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const q = (searchParams.q ?? "").trim();
  const filters = {
    jenis: searchParams.jenis || undefined,
    tahun: searchParams.tahun ? Number(searchParams.tahun) : undefined,
    status: searchParams.status || undefined,
    topik: searchParams.topik || undefined,
  };
  const hasActiveFilters = Boolean(
    filters.jenis || filters.tahun || filters.status || filters.topik,
  );
  const store = getStore();
  const results = q
    ? hybridSearch(q, store.allChunks(), {
        filters,
        topK: 20,
        regulationMeta: store.regulationMeta(),
      })
    : [];

  // Kelompokkan per regulasi untuk tampilan metadata kaya
  const seen = new Map<string, { reg: Regulation; best: number; pasals: string[] }>();
  for (const r of results) {
    const reg = store.regulation(r.chunk.regulationSlug);
    if (!reg) continue;
    const e = seen.get(reg.slug) ?? { reg, best: 0, pasals: [] };
    e.best = Math.max(e.best, r.score);
    if (r.chunk.pasalNomor && !e.pasals.includes(r.chunk.pasalNomor)) {
      e.pasals.push(r.chunk.pasalNomor);
    }
    seen.set(reg.slug, e);
  }
  const grouped = [...seen.values()].sort((a, b) => b.best - a.best);

  const resetHref = q ? `/legal-search?q=${encodeURIComponent(q)}` : "/legal-search";

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Pencarian hukum" }]} />
        <h1>Pencarian Regulasi & Norma Hukum</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Penelusuran hibrida regulasi dan pasal rekam medis berdasarkan kata kunci konteks, nomor peraturan, instansi, atau klasifikasi topik.
        </p>
      </header>

      {q ? (
        <RememberVisit
          kind="search"
          label={q.slice(0, 80)}
          href={`/legal-search?q=${encodeURIComponent(q)}`}
        />
      ) : null}

      <div className="section-card space-y-4">
        <SearchBar
          id="legal-search-q"
          defaultValue={q}
          label="Kata Kunci Pencarian"
          placeholder="Ketik topik atau pertanyaan (contoh: kerahasiaan rekam medis, masa retensi berkas)..."
          helperText="Masukkan minimal 3 karakter. Filter di bawah dapat dikombinasikan untuk menyaring hasil."
        />

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Saring Status Keberlakuan
          </label>
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

        <form
          method="get"
          className="grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2 md:grid-cols-4"
          aria-label="Filter pencarian"
        >
          <input type="hidden" name="q" value={q} />
          {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
          <div className="grid gap-1.5">
            <label htmlFor="filter-jenis" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Jenis Regulasi
            </label>
            <select
              id="filter-jenis"
              name="jenis"
              defaultValue={filters.jenis ?? ""}
              className="form-input text-xs"
            >
              <option value="">Semua jenis</option>
              {JENIS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="filter-tahun" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tahun Penetapan
            </label>
            <input
              id="filter-tahun"
              name="tahun"
              defaultValue={filters.tahun ?? ""}
              inputMode="numeric"
              placeholder="Contoh: 2022"
              className="form-input text-xs"
            />
          </div>
          <div className="grid gap-1.5">
            <label htmlFor="filter-topik" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Topik Spesifik
            </label>
            <input
              id="filter-topik"
              name="topik"
              defaultValue={filters.topik ?? ""}
              placeholder="Contoh: privasi"
              className="form-input text-xs"
            />
          </div>
          <div className="flex items-end gap-2">
            <SubmitButton loadingLabel="Memfilter..." className="flex-1 text-xs">
              Terapkan Filter
            </SubmitButton>
            {hasActiveFilters && (
              <a href={resetHref} className="btn-secondary text-xs">
                Reset
              </a>
            )}
          </div>
        </form>
      </div>

      {!q && (
        <section className="section-card space-y-3" aria-labelledby="panduan-pencarian">
          <h2 id="panduan-pencarian" className="text-base font-bold text-slate-900">
            Penelusuran Regulasi Populer
          </h2>
          <p className="text-sm text-slate-600">
            Ketik kata kunci pada formulir di atas atau pilih salah satu frasa pencarian rujukan berikut:
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {QUICK_QUERIES.map((sample) => (
              <a
                key={sample}
                href={`/legal-search?q=${encodeURIComponent(sample)}`}
                className="btn-secondary text-xs font-semibold"
              >
                {sample}
              </a>
            ))}
          </div>
        </section>
      )}

      {q && (
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
          <p role="status" aria-live="polite">
            Menampilkan <strong className="text-slate-800">{grouped.length}</strong> regulasi relevan untuk kata kunci{" "}
            <strong className="text-slate-900">“{q}”</strong>
          </p>
          {hasActiveFilters && (
            <a href={resetHref} className="font-semibold text-teal-700 hover:underline">
              Hapus semua filter aktif
            </a>
          )}
        </div>
      )}

      {q && grouped.length > 0 && (
        <div className="grid gap-4">
          {grouped.map(({ reg, best, pasals }) => (
            <article
              key={reg.slug}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-colors hover:border-teal-500"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={reg.status} />
                  <span className="font-mono text-xs font-semibold text-slate-500">
                    {reg.jenis} No. {reg.nomor}/{reg.tahun}
                  </span>
                </div>
                <ScoreBar score={best} />
              </div>
              <h2 className="mt-2.5 text-base font-bold leading-snug text-slate-900">
                <a href={`/regulasi/${reg.slug}`} className="hover:text-teal-700 underline-offset-4 hover:underline">
                  {reg.judul}
                </a>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{reg.ringkasan}</p>
              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <div>
                  <dt className="inline font-semibold text-slate-700">Instansi: </dt>
                  <dd className="inline">{reg.instansi}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold text-slate-700">Mulai Berlaku: </dt>
                  <dd className="inline">{reg.tglBerlaku ?? "Belum tercatat"}</dd>
                </div>
                {pasals.length > 0 && (
                  <div>
                    <dt className="inline font-semibold text-slate-700">Pasal Relevan: </dt>
                    <dd className="inline font-mono font-medium text-teal-700">{pasals.join(", ")}</dd>
                  </div>
                )}
                <div>
                  <dt className="inline font-semibold text-slate-700">Verifikasi: </dt>
                  <dd className="inline">{reg.verifiedAt ?? "Belum tercatat"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      {q && grouped.length === 0 && (
        <EmptyState
          title={`Tidak ditemukan hasil untuk "${q}"`}
          description="Coba gunakan kata kunci yang lebih umum (seperti kerahasiaan, RME, atau data kesehatan) atau sesuaikan filter status/jenis yang sedang aktif."
          actionLabel={hasActiveFilters ? "Reset filter pencarian" : "Lihat seluruh repositori regulasi"}
          actionHref={hasActiveFilters ? resetHref : "/regulasi"}
        />
      )}

      <div>
        <Disclaimer />
      </div>
    </div>
  );
}
