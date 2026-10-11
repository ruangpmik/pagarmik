import { notFound } from "next/navigation";
import { getStore } from "@/lib/data/store";
import { RegulationCard } from "@/components/ui";

export function generateStaticParams() {
  return getStore().topics().map((t) => ({ slug: t.slug }));
}

export default function TopicHub({ params }: { params: { slug: string } }) {
  const store = getStore();
  const topic = store.topics().find((t) => t.slug === params.slug);
  if (!topic) notFound();
  const regs = store.regulations().filter((r) => r.topik.includes(topic.slug));
  const arts = store.articles().filter((a) => a.topik.includes(topic.slug));

  return (
    <div>
      <p className="text-3xl" aria-hidden>{topic.ikon}</p>
      <h1 className="mt-1 text-2xl font-extrabold">{topic.nama}</h1>
      <p className="mt-1 text-sm text-ink-900/60">{topic.deskripsi}</p>
      <h2 className="mt-6 font-extrabold">Regulasi terkait ({regs.length})</h2>
      <div className="mt-2 grid gap-3 md:grid-cols-2">{regs.map((r) => <RegulationCard key={r.slug} r={r} />)}</div>
      {arts.length > 0 && (
        <>
          <h2 className="mt-6 font-extrabold">Artikel terkait</h2>
          <div className="mt-2 grid gap-2">
            {arts.map((a) => <a key={a.slug} href={`/artikel/${a.slug}`} className="rounded-2xl border p-3 text-sm font-bold text-pagar-700">📖 {a.judul}</a>)}
          </div>
        </>
      )}
    </div>
  );
}
