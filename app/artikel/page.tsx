import { getStore } from "@/lib/data/store";
import { Breadcrumb, EmptyState } from "@/components/ui";

export const metadata = { title: "Artikel Edukasi Hukum" };

export default function Articles() {
  const arts = getStore().articles();
  return (
    <div className="space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Artikel" }]} />
        <h1>Artikel & Panduan Hukum PMIK</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Kajian yuridis terverifikasi dengan rujukan regulasi resmi dan panduan kepatuhan praktis bagi profesional perekam medis.
        </p>
      </header>

      {arts.length === 0 ? (
        <EmptyState
          title="Belum ada artikel"
          description="Belum ada artikel edukasi yang dipublikasikan pada repositori."
          actionLabel="Telusuri repositori regulasi"
          actionHref="/regulasi"
        />
      ) : (
        <div className="grid gap-4">
          {arts.map((a) => (
            <article
              key={a.slug}
              className="rounded-xl border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-teal-500 hover:bg-teal-50/10"
            >
              <h2 className="text-base font-bold text-slate-900">
                <a href={`/artikel/${a.slug}`} className="hover:text-teal-700 underline-offset-4 hover:underline">
                  {a.judul}
                </a>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.ringkasan}</p>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                <span className="font-medium">
                  Terverifikasi PAGARMIK · {a.verifiedAt ?? "Belum tercatat"} ·{" "}
                  {a.dasarHukum.length} dasar regulasi
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {a.topik.map((t) => (
                    <a
                      key={t}
                      href={`/topik/${t}`}
                      className="rounded-md border border-teal-200 bg-teal-50 px-2 py-0.5 text-[11px] font-bold text-teal-800 hover:bg-teal-100"
                    >
                      #{t}
                    </a>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
