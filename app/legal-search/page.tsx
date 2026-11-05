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
    <div>
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Pencarian hukum" }]} />
        <h1>Pencarian hukum</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-900/80">
          Cari regulasi dan pasal berdasarkan kata kunci, nomor peraturan, tahun penetapan, atau status keberlakuan.
        </p>
      </header>

      {q ? (
        <RememberVisit
          kind="search"
          label={q.slice(0, 80)}
          href={`/legal-search?q=${encodeURIComponent(q)}`}
        />
      ) : null}

      <div className="section-card">
        <SearchBar
          id="legal-search-q"
          defaultValue={q}
          helperText="Masukkan minimal 3 karakter. Input Anda tetap tersimpan saat menerapkan filter di bawah."
        />

        <div className="mt-4">
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
          className="mt-3 grid grid-cols-1 gap-3 rounded-xl border border-ink-100 bg-ink-50/50 p-3.5 sm:grid-cols-2 md:grid-cols-4"
          aria-label="Filter pencarian"
        >
          <input type="hidden" name="q" value={q} />
          {filters.status ? <input type="hidden" name="status" value={filters.status} /> : null}
          <div className="grid gap-1">
            <label htmlFor="filter-jenis" className="text-xs font-semibold text-ink-900">
              Jenis regulasi
            </label>
            <select
              id="filter-jenis"
              name="jenis"
              defaultValue={filters.jenis ?? ""}
              className="form-input"
            >
              <option value="">Semua jenis</option>
              {JENIS.map((j) => (
                <option key={j} value={j}>
                  {j}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-1">
            <label htmlFor="filter-tahun" className="text-xs font-semibold text-ink-900">
              Tahun penetapan
            </label>
            <input
              id="filter-tahun"
              name="tahun"
              defaultValue={filters.tahun ?? ""}
              inputMode="numeric"
              placeholder="Mis. 2022"
              className="form-input"
            />
          </div>
          <div className="grid gap-1">
            <label htmlFor="filter-topik" className="text-xs font-semibold text-ink-900">
              Topik
            </label>
            <input
              id="filter-topik"
              name="topik"
              defaultValue={filters.topik ?? ""}
              placeholder="Mis. privasi"
              className="form-input"
            />
          </div>
          <div className="flex items-end gap-2">
            <SubmitButton loadingLabel="Memfilter..." className="flex-1">
              Terapkan filter
            </SubmitButton>
            {hasActiveFilters && (
              <a href={resetHref} className="btn-secondary">
                Reset
              </a>
            )}
          </div>
        </form>
      </div>

      {!q && (
        <section className="mt-6 section-card" aria-labelledby="panduan-pencarian">
          <h2 id="panduan-pencarian" className="text-base font-semibold text-pagar-800">
            Mulai pencarian hukum
          </h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-900/75">
            Ketik kata kunci pada kolom pencarian di atas atau pilih salah satu penelusuran populer berikut:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {QUICK_QUERIES.map((sample) => (
              <a
                key={sample}
                href={`/legal-search?q=${encodeURIComponent(sample)}`}
                className="btn-secondary min-h-9 px-3 py-1.5 text-xs"
              >
                {sample}
              </a>
            ))}
          </div>
        </section>
      )}

      {q && (
        <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-ink-900/80" role="status" aria-live="polite">
            Menampilkan <strong>{grouped.length}</strong> regulasi relevan untuk kata kunci{" "}
            <strong>“{q}”</strong>
          </p>
          {hasActiveFilters && (
            <a href={resetHref} className="text-xs font-semibold text-pagar-700 underline">
              Hapus semua filter aktif
            </a>
          )}
        </div>
      )}

      {q && grouped.length > 0 && (
        <div className="mt-4 grid gap-4">
          {grouped.map(({ reg, best, pasals }) => (
            <article
              key={reg.slug}
              className="rounded-xl border border-ink-100 bg-white p-5 transition-colors hover:border-pagar-300"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge status={reg.status} />
                  <span className="text-xs font-medium text-ink-900/70">
                    {reg.jenis} No. {reg.nomor} Tahun {reg.tahun}
                  </span>
                </div>
                <ScoreBar score={best} />
              </div>
              <h2 className="mt-2.5 text-lg font-semibold leading-snug text-pagar-800">
                <a href={`/regulasi/${reg.slug}`} className="underline-offset-4 hover:underline">
                  {reg.judul}
                </a>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-900/75">{reg.ringkasan}</p>
              <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 border-t border-ink-100 pt-3 text-xs text-ink-900/70">
                <div>
                  <dt className="inline font-semibold">Instansi: </dt>
                  <dd className="inline">{reg.instansi}</dd>
                </div>
                <div>
                  <dt className="inline font-semibold">Mulai berlaku: </dt>
                  <dd className="inline">{reg.tglBerlaku ?? "Belum tercatat"}</dd>
                </div>
                {pasals.length > 0 && (
                  <div>
                    <dt className="inline font-semibold">Pasal relevan: </dt>
                    <dd className="inline">{pasals.join(", ")}</dd>
                  </div>
                )}
                <div>
                  <dt className="inline font-semibold">Verifikasi: </dt>
                  <dd className="inline">{reg.verifiedAt ?? "Belum tercatat"}</dd>
                </div>
              </dl>
            </article>
          ))}
        </div>
      )}

      {q && grouped.length === 0 && (
        <div className="mt-6">
          <EmptyState
            title={`Tidak ditemukan hasil untuk "${q}"`}
            description="Coba gunakan kata kunci yang lebih umum (seperti kerahasiaan, RME, atau data kesehatan) atau kurangi filter status/jenis yang sedang aktif."
            actionLabel={hasActiveFilters ? "Reset filter pencarian" : "Lihat seluruh katalog regulasi"}
            actionHref={hasActiveFilters ? resetHref : "/regulasi"}
          />
        </div>
      )}

      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
