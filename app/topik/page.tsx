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
    <div>
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Topik" }]} />
        <h1>Topik</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-900/80">
          Telusuri pengelompokan regulasi dan artikel edukasi berdasarkan domain kompetensi Perekam Medis dan Informasi Kesehatan.
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
              className="flex flex-col justify-between rounded-xl border border-ink-100 bg-white p-5 transition-colors hover:border-pagar-300 hover:bg-pagar-50"
            >
              <div>
                <div className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-pagar-50 text-pagar-800">
                  <NavIcon name="tag" className="h-4 w-4" />
                </div>
                <h2 className="mt-3 text-lg font-semibold text-pagar-800">{t.nama}</h2>
                <p className="mt-1 text-sm leading-relaxed text-ink-900/75">{t.deskripsi}</p>
              </div>
              <p className="mt-4 border-t border-ink-100 pt-3 text-xs font-semibold text-pagar-700">
                {regCount} regulasi · {artCount} artikel →
              </p>
            </a>
          );
        })}
      </div>
    </div>
  );
}
