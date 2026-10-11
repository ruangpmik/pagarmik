import { notFound } from "next/navigation";
import { getStore } from "@/lib/data/store";
import { Disclaimer } from "@/components/ui";
import BookmarkButton from "@/components/BookmarkButton";
import RememberVisit from "@/components/RememberVisit";

export default function ArticleDetail({ params }: { params: { slug: string } }) {
  const store = getStore();
  const a = store.article(params.slug);
  if (!a) notFound();
  return (
    <article className="mx-auto max-w-3xl">
      <a href="/artikel" className="text-sm font-bold text-pagar-700">← Knowledge Base</a>
      <RememberVisit kind="article" label={a.judul} href={`/artikel/${a.slug}`} />
      <div className="mt-2 flex items-start justify-between gap-2">
        <h1 className="max-w-[80%] text-2xl font-extrabold leading-tight">{a.judul}</h1>
        <BookmarkButton type="artikel" slug={a.slug} title={a.judul} />
      </div>
      <p className="mt-2 rounded-xl bg-pagar-50 p-3 text-sm">✅ Verified by PAGARMIK · {a.verifiedAt ?? "—"}</p>
      <p className="mt-3 border-l-4 border-pagar-500 pl-3 text-[15px] italic">{a.ringkasan}</p>
      <div className="prose-pagar mt-2 whitespace-pre-line">{a.konten}</div>
      <h2 className="mt-6 font-extrabold">Dasar Hukum</h2>
      <ul className="mt-1 space-y-1 text-sm">
        {a.dasarHukum.map((s) => {
          const r = store.regulation(s);
          return <li key={s}>⚖️ <a className="font-bold text-pagar-700 underline" href={`/regulasi/${s}`}>{r?.judul ?? s}</a></li>;
        })}
      </ul>
      <div className="mt-5"><Disclaimer /></div>
    </article>
  );
}
