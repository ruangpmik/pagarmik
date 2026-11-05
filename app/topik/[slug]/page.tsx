import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { Breadcrumb, EmptyState, RegulationCard } from "@/components/ui";

export function generateStaticParams() {
  return getStore().topics().map((t) => ({ slug: t.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const topic = getStore().topics().find((t) => t.slug === params.slug);
  if (!topic) return { title: "Topik tidak ditemukan" };
  return {
    title: `Topik: ${topic.nama}`,
    description: topic.deskripsi,
  };
}

export default function TopicHub({ params }: { params: { slug: string } }) {
  const store = getStore();
  const topic = store.topics().find((t) => t.slug === params.slug);
  if (!topic) notFound();
  const regs = store.regulations().filter((r) => r.topik.includes(topic.slug));
  const arts = store.articles().filter((a) => a.topik.includes(topic.slug));

  return (
    <div>
      <header className="page-header">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Topik", href: "/topik" },
            { label: topic.nama },
          ]}
        />
        <h1>{topic.nama}</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-900/80">
          {topic.deskripsi}
        </p>
      </header>

      <section aria-labelledby="regulasi-topik-title">
        <h2 id="regulasi-topik-title" className="text-lg font-semibold text-pagar-800">
          Regulasi terkait ({regs.length})
        </h2>
        {regs.length > 0 ? (
          <div className="mt-3 grid gap-4 md:grid-cols-2">
            {regs.map((r) => (
              <RegulationCard key={r.slug} r={r} />
            ))}
          </div>
        ) : (
          <div className="mt-3">
            <EmptyState
              title="Belum ada regulasi pada topik ini"
              description="Belum ada instrumen regulasi di katalog yang ditandai dengan topik ini."
              actionLabel="Lihat semua regulasi"
              actionHref="/regulasi"
            />
          </div>
        )}
      </section>

      {arts.length > 0 && (
        <section className="mt-8" aria-labelledby="artikel-topik-title">
          <h2 id="artikel-topik-title" className="text-lg font-semibold text-pagar-800">
            Artikel edukasi terkait ({arts.length})
          </h2>
          <div className="mt-3 grid gap-3">
            {arts.map((a) => (
              <a
                key={a.slug}
                href={`/artikel/${a.slug}`}
                className="block rounded-xl border border-ink-100 bg-white p-4 transition-colors hover:border-pagar-300 hover:bg-pagar-50"
              >
                <p className="font-semibold text-pagar-800">{a.judul}</p>
                <p className="mt-1 text-sm text-ink-900/75">{a.ringkasan}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
