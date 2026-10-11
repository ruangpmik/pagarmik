import { RegulationCard, SearchBar, StatusSwitcher } from "@/components/ui";
import { getStore } from "@/lib/data/store";

export const metadata = { title: "Regulasi" };

export default function RegulasiList({ searchParams }: { searchParams: Record<string, string | undefined> }) {
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
      <h1 className="text-2xl font-extrabold">Repository Regulasi</h1>
      <p className="mt-1 text-sm text-ink-900/60">
        {all.length} regulasi terindeks · <span className="font-bold text-emerald-700">{berlaku} berlaku</span> ·{" "}
        <span className="font-bold text-red-700">{dicabut} dicabut</span> · status dari metadata terverifikasi, bukan dari AI.
      </p>
      <div className="mt-4"><SearchBar /></div>
      <div className="mt-3">
        <StatusSwitcher base="/regulasi" current={status} counts={counts} />
      </div>
      {regs.length > 0 ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {regs.map((r) => <RegulationCard key={r.slug} r={r} />)}
        </div>
      ) : (
        <div className="mt-4 rounded-2xl border border-dashed border-ink-100 bg-white p-8 text-center">
          <p className="text-3xl" aria-hidden>🗂️</p>
          <p className="mt-2 text-sm font-bold">Tidak ada regulasi berstatus ini.</p>
          <a href="/regulasi" className="mt-1 inline-block text-sm font-bold text-pagar-700 underline">Tampilkan semua →</a>
        </div>
      )}
    </div>
  );
}
