import { getStore } from "@/lib/data/store";
import { Breadcrumb, StatusBadge } from "@/components/ui";

export const metadata = { title: "Linimasa Regulasi" };

export default function Timeline() {
  const store = getStore();
  const regs = [...store.regulations()].sort((a, b) => a.tahun - b.tahun);
  const byYear = new Map<number, typeof regs>();
  for (const r of regs) byYear.set(r.tahun, [...(byYear.get(r.tahun) ?? []), r]);

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Linimasa regulasi" }]} />
        <h1>Linimasa Kronologis Regulasi</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Kronologi perjalanan evolusi {regs.length} instrumen hukum terkait rekam medis, informasi kesehatan, dan pelindungan data pribadi (dari tahun {regs[0]?.tahun} hingga {regs[regs.length - 1]?.tahun}).
        </p>
      </header>

      <ol className="space-y-8 border-l-2 border-slate-200 pl-6">
        {[...byYear.entries()].map(([year, list]) => (
          <li key={year} className="relative">
            <span
              className="absolute -left-[31px] top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-teal-600"
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-2">
              <h2 className="font-mono text-lg font-bold text-slate-900">{year}</h2>
              <span className="text-xs font-semibold text-slate-500">
                ({list.length} regulasi diundangkan)
              </span>
            </div>
            <div className="mt-3 grid gap-3">
              {list.map((r) => (
                <a
                  key={r.slug}
                  href={`/regulasi/${r.slug}`}
                  className="block rounded-xl border border-slate-200 bg-white p-4 transition-all duration-150 hover:border-teal-500 hover:bg-teal-50/20"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={r.status} />
                    <span className="font-mono text-xs font-semibold text-slate-500">
                      {store.shortRef(r.slug)} · {r.instansi}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-slate-900 hover:text-teal-700">{r.judul}</p>
                </a>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
