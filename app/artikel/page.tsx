import { getStore } from "@/lib/data/store";
import { Breadcrumb, EmptyState } from "@/components/ui";

export const metadata = { title: "Artikel Edukasi Hukum" };

export default function Articles() {
  const arts = getStore().articles();
  return (
    <div>
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Artikel" }]} />
        <h1>Artikel</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-900/80">
          Artikel edukasi hukum terverifikasi dengan rujukan dasar peraturan dan panduan kepatuhan praktis bagi PMIK.
        </p>
      </header>

      {arts.length === 0 ? (
        <EmptyState
          title="Belum ada artikel"
          description="Belum ada artikel edukasi yang dipublikasikan pada katalog."
          actionLabel="Telusuri regulasi"
          actionHref="/regulasi"
        />
      ) : (
        <div className="grid gap-4">
          {arts.map((a) => (
            <article
              key={a.slug}
              className="rounded-xl border border-ink-100 bg-white p-5 transition-colors hover:border-pagar-300"
            >
              <h2 className="text-lg font-semibold text-pagar-800">
                <a href={`/artikel/${a.slug}`} className="underline-offset-4 hover:underline">
                  {a.judul}
                </a>
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-900/75">{a.ringkasan}</p>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-ink-100 pt-3 text-xs text-ink-900/70">
                <span>
                  Terverifikasi PAGARMIK · {a.verifiedAt ?? "Belum tercatat"} ·{" "}
                  {a.dasarHukum.length} dasar hukum
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {a.topik.map((t) => (
                    <a
                      key={t}
                      href={`/topik/${t}`}
                      className="rounded-full bg-pagar-50 px-2.5 py-0.5 font-semibold text-pagar-700 hover:bg-pagar-100"
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
