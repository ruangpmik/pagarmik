import { getStore } from "@/lib/data/store";
import { Breadcrumb, StatusBadge } from "@/components/ui";

export const metadata = { title: "Linimasa Regulasi" };

export default function Timeline() {
  const store = getStore();
  const regs = [...store.regulations()].sort((a, b) => a.tahun - b.tahun);
  const byYear = new Map<number, typeof regs>();
  for (const r of regs) byYear.set(r.tahun, [...(byYear.get(r.tahun) ?? []), r]);

  return (
    <div className="mx-auto max-w-4xl">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Linimasa regulasi" }]} />
        <h1>Linimasa regulasi</h1>
        <p className="mt-2 text-base leading-relaxed text-ink-900/80">
          Kronologi perkembangan {regs.length} instrumen hukum terkait rekam medis, informasi kesehatan, dan pelindungan data pribadi ({regs[0]?.tahun} hingga {regs[regs.length - 1]?.tahun}).
        </p>
      </header>

      <ol className="mt-6 space-y-6 border-l-2 border-pagar-200 pl-5">
        {[...byYear.entries()].map(([year, list]) => (
          <li key={year} className="relative">
            <span
              className="absolute -left-[27px] top-1.5 h-3 w-3 rounded-full bg-pagar-600"
              aria-hidden="true"
            />
            <div className="flex items-baseline gap-2">
              <h2 className="text-xl font-semibold text-pagar-800">{year}</h2>
              <span className="text-xs font-medium text-ink-900/65">
                ({list.length} regulasi)
              </span>
            </div>
            <div className="mt-2.5 grid gap-3">
              {list.map((r) => (
                <a
                  key={r.slug}
                  href={`/regulasi/${r.slug}`}
                  className="block rounded-xl border border-ink-100 bg-white p-4 transition-colors hover:border-pagar-300 hover:bg-pagar-50"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge status={r.status} />
                    <span className="text-xs font-medium text-ink-900/70">
                      {store.shortRef(r.slug)} · {r.instansi}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm font-semibold text-pagar-800">{r.judul}</p>
                </a>
              ))}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
