import {
  Breadcrumb,
  EmptyState,
  RegulationCard,
  SearchBar,
  StatusSwitcher,
} from "@/components/ui";
import { getStore } from "@/lib/data/store";

export const metadata = { title: "Regulasi" };

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

  return (
    <div>
      <header className="page-header flex flex-wrap items-start justify-between gap-4">
        <div>
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Regulasi" }]} />
          <h1>Repository regulasi</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-900/75">
            {all.length} regulasi terindeks ·{" "}
            <span className="font-semibold" style={{ color: "var(--success)" }}>
              {berlaku} berlaku
            </span>{" "}
            ·{" "}
            <span className="font-semibold" style={{ color: "var(--danger)" }}>
              {dicabut} dicabut
            </span>{" "}
            · status ditentukan dari metadata terverifikasi, bukan oleh AI.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <a href="/bandingkan" className="btn-secondary">
            Bandingkan regulasi
          </a>
          <a href="/grafik" className="btn-secondary">
            Peta hubungan
          </a>
        </div>
      </header>

      <div className="section-card">
        <SearchBar id="regulasi-search-q" />
        <div className="mt-3">
          <StatusSwitcher base="/regulasi" current={status} counts={counts} />
        </div>
      </div>

      {regs.length > 0 ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {regs.map((r) => (
            <RegulationCard key={r.slug} r={r} />
          ))}
        </div>
      ) : (
        <div className="mt-5">
          <EmptyState
            title="Tidak ada regulasi dengan status ini"
            description="Belum ada catatan regulasi pada filter status keberlakuan yang dipilih."
            actionLabel="Tampilkan semua regulasi"
            actionHref="/regulasi"
          />
        </div>
      )}
    </div>
  );
}
