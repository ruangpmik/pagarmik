import { RegulationCard, SearchBar } from "@/components/ui";
import { getStore } from "@/lib/data/store";

export const metadata = { title: "Regulasi" };

export default function RegulasiList() {
  const regs = getStore().regulations();
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Repository Regulasi</h1>
      <p className="mt-1 text-sm text-ink-900/60">{regs.length} regulasi terindeks · status dari metadata terverifikasi, bukan dari AI.</p>
      <div className="mt-4"><SearchBar /></div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {regs.map((r) => <RegulationCard key={r.slug} r={r} />)}
      </div>
    </div>
  );
}
