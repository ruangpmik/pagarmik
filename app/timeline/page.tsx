import { getStore } from "@/lib/data/store";
import { StatusBadge } from "@/components/ui";

export const metadata = { title: "Regulatory Timeline" };

export default function Timeline() {
  const regs = [...getStore().regulations()].sort((a, b) => a.tahun - b.tahun);
  const byYear = new Map<number, typeof regs>();
  for (const r of regs) byYear.set(r.tahun, [...(byYear.get(r.tahun) ?? []), r]);

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold">🧭 Regulatory Timeline</h1>
      <p className="mt-1 text-sm text-ink-900/60">Evolusi aturan MIK — dari era kertas hingga RME dan UU Kesehatan.</p>
      <ol className="mt-6 space-y-6 border-l-2 border-pagar-200 pl-5">
        {[...byYear.entries()].map(([year, list]) => (
          <li key={year} className="relative">
            <span className="absolute -left-[27px] top-1 h-3 w-3 rounded-full bg-pagar-600" aria-hidden />
            <p className="text-xl font-extrabold text-pagar-800">{year}</p>
            <div className="mt-2 grid gap-2">
              {list.map((r) => (
                <a key={r.slug} href={`/regulasi/${r.slug}`} className="rounded-2xl border border-ink-100 bg-white p-3 hover:shadow-sm">
                  <StatusBadge status={r.status} />
                  <p className="mt-1 text-sm font-bold">{r.judul}</p>
                </a>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
