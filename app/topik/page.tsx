import { getStore } from "@/lib/data/store";
import { Breadcrumb } from "@/components/ui";
import { NavIcon } from "@/components/TopNav";

export const metadata = { title: "Topik Hukum" };

export default function Topics() {
  const store = getStore();
  const topics = store.topics();
  const regs = store.regulations();
  const arts = store.articles();

  return (
    <div className="space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Topik" }]} />
        <h1>Topik Regulasi & Standar</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Telusuri pengelompokan regulasi dan artikel edukasi berdasarkan domain tata kelola Perekam Medis dan Informasi Kesehatan.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => {
          const regCount = regs.filter((r) => r.topik.includes(t.slug)).length;
          const artCount = arts.filter((a) => a.topik.includes(t.slug)).length;
          return (
            <a
              key={t.slug}
              href={`/topik/${t.slug}`}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-teal-500 hover:bg-teal-50/20"
            >
              <div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-800">
                  <NavIcon name="tag" className="h-4 w-4" />
                </div>
                <h2 className="mt-3 text-base font-bold text-slate-900">{t.nama}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-600">{t.deskripsi}</p>
              </div>
              <p className="mt-4 border-t border-slate-100 pt-3 text-xs font-bold text-teal-700">
                {regCount} regulasi · {artCount} artikel →
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
