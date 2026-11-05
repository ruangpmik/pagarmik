import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { Breadcrumb, Disclaimer, StatusBadge } from "@/components/ui";
import { Markdown } from "@/components/Markdown";
import BookmarkButton from "@/components/BookmarkButton";
import RememberVisit from "@/components/RememberVisit";

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const a = getStore().article(params.slug);
  if (!a) return { title: "Artikel tidak ditemukan" };
  return {
    title: a.judul,
    description: a.ringkasan,
  };
}

export default function ArticleDetail({ params }: { params: { slug: string } }) {
  const store = getStore();
  const a = store.article(params.slug);
  if (!a) notFound();
  return (
    <article className="mx-auto max-w-4xl space-y-6">
      <RememberVisit kind="article" label={a.judul} href={`/artikel/${a.slug}`} />

      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Artikel", href: "/artikel" },
            { label: a.judul },
          ]}
        />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1>{a.judul}</h1>
            <p className="mt-2 text-xs font-semibold text-slate-500">
              Kajian Resmi PAGARMIK · Terverifikasi: {a.verifiedAt ?? "Belum tercatat"}
            </p>
          </div>
          <BookmarkButton type="artikel" slug={a.slug} title={a.judul} />
        </div>
      </header>

      <div className="section-card space-y-4">
        <p className="rounded-r-lg border-l-4 border-teal-600 bg-teal-50/50 p-4 text-sm font-medium leading-relaxed text-slate-800">
          {a.ringkasan}
        </p>
        <div className="border-t border-slate-100 pt-4">
          <Markdown text={a.konten} />
        </div>
      </div>

      <section className="section-card space-y-3" aria-labelledby="dasar-hukum-title">
        <h2 id="dasar-hukum-title" className="text-base font-bold text-slate-900">
          Dasar Regulasi Terkait ({a.dasarHukum.length})
        </h2>
        <ul className="divide-y divide-slate-100 text-sm">
          {a.dasarHukum.map((s) => {
            const r = store.regulation(s);
            return (
              <li key={s} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <a className="font-bold text-teal-700 hover:underline" href={`/regulasi/${s}`}>
                  {r?.judul ?? s}
                </a>
                {r && <StatusBadge status={r.status} />}
              </li>
            );
          })}
        </ul>
      </section>

      <div>
        <Disclaimer />
      </div>
    </article>
  );
}
