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
    <article className="mx-auto max-w-4xl">
      <RememberVisit kind="article" label={a.judul} href={`/artikel/${a.slug}`} />

      <header className="page-header">
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
            <p className="mt-2 text-xs font-medium text-ink-900/70">
              Terverifikasi PAGARMIK · {a.verifiedAt ?? "Belum tercatat"}
            </p>
          </div>
          <BookmarkButton type="artikel" slug={a.slug} title={a.judul} />
        </div>
      </header>

      <div className="section-card">
        <p className="border-l-4 border-pagar-700 pl-3.5 text-[15px] font-medium leading-relaxed text-ink-900/85">
          {a.ringkasan}
        </p>
        <div className="mt-4 border-t border-ink-100 pt-4">
          <Markdown text={a.konten} />
        </div>
      </div>

      <section className="mt-6 section-card" aria-labelledby="dasar-hukum-title">
        <h2 id="dasar-hukum-title" className="text-lg font-semibold text-pagar-800">
          Dasar Hukum ({a.dasarHukum.length})
        </h2>
        <ul className="mt-3 divide-y divide-ink-100 text-sm">
          {a.dasarHukum.map((s) => {
            const r = store.regulation(s);
            return (
              <li key={s} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                <a className="font-semibold text-pagar-700 underline underline-offset-2" href={`/regulasi/${s}`}>
                  {r?.judul ?? s}
                </a>
                {r && <StatusBadge status={r.status} />}
              </li>
            );
          })}
        </ul>
      </section>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </article>
  );
}
