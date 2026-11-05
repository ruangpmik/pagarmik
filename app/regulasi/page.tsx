import {
  Breadcrumb,
  EmptyState,
  RegulationCard,
  SearchBar,
  StatisticCard,
  StatusSwitcher,
} from "@/components/ui";
import { getStore } from "@/lib/data/store";

export const metadata = { title: "Repositori Regulasi Rekam Medis" };

export default function RegulasiList({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const status = searchParams.status ?? "";
  const store = getStore();
  const all = store.regulations();
  const counts: Record<string, number> = { ALL: all.length };
  for (const r of all) counts[r.status] = (counts[r.status] ?? 0) + 1;
  const regs = status ? all.filter((r) => r.status === status) : all;
  const berlaku = counts["BERLAKU"] ?? 0;
  const dicabut = counts["DICABUT"] ?? 0;
  const perubahan = counts["PERUBAHAN"] ?? 0;

  return (
    <div className="space-y-6">
      <header className="page-header flex flex-wrap items-start justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Regulasi" }]} />
          <h1>Repositori Regulasi</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Katalog peraturan perundang-undangan dan instrumen kepatuhan rekam medis serta informasi kesehatan terverifikasi secara yuridis.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <a href="/bandingkan" className="btn-secondary">
            Bandingkan Regulasi
          </a>
          <a href="/grafik" className="btn-secondary">
            Peta Hubungan
          </a>
        </div>
      </header>

      {/* Snapshot Statistik Regulasi */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard
          title="Total Terindeks"
          value={all.length}
          description="Instrumen hukum terkatalog"
        />
        <StatisticCard
          title="Status Berlaku"
          value={berlaku}
          description="Dasar hukum operasional aktif"
          badge={
            <span className="inline-flex items-center rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
              Aktif
            </span>
          }
        />
        <StatisticCard
          title="Mengalami Perubahan"
          value={perubahan}
          description="Terdapat amandemen pasal"
          badge={
            <span className="inline-flex items-center rounded-md border border-sky-200 bg-sky-50 px-2 py-0.5 text-xs font-semibold text-sky-800">
              Parsial
            </span>
          }
        />
        <StatisticCard
          title="Telah Dicabut"
          value={dicabut}
          description="Tidak berlaku lagi"
          badge={
            <span className="inline-flex items-center rounded-md border border-rose-200 bg-rose-50 px-2 py-0.5 text-xs font-semibold text-rose-800">
              Inaktif
            </span>
          }
        />
      </div>

      {/* Filter & Search Panel */}
      <div className="section-card space-y-4">
        <SearchBar
          id="regulasi-search-q"
          label="Pencarian Cepat Repositori"
          placeholder="Cari berdasarkan nomor, tahun, atau kata kunci judul (misal: PMK 24/2022, UU Kesehatan)..."
          submitLabel="Cari"
          helperText="Penelusuran mencakup judul, abstraksi, nomor, dan klasifikasi topik peraturan."
        />
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
            Saring Menurut Status Keberlakuan
          </label>
          <StatusSwitcher base="/regulasi" current={status} counts={counts} />
        </div>
      </div>

      {/* Grid Regulasi */}
      <div>
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <span>
            Menampilkan <strong className="text-slate-800">{regs.length}</strong> dari {all.length} regulasi
            {status ? ` (filter: ${status})` : ""}
          </span>
          {status && (
            <a href="/regulasi" className="font-semibold text-teal-700 hover:underline">
              Reset filter
            </a>
          )}
        </div>

        {regs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {regs.map((r) => (
              <RegulationCard key={r.slug} r={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Tidak ada regulasi dengan status ini"
            description="Belum ada catatan regulasi pada filter status keberlakuan yang dipilih."
            actionLabel="Tampilkan semua regulasi"
            actionHref="/regulasi"
          />
        )}
      </div>
    </div>
  );
}
