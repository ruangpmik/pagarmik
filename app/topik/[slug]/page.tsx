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
    <div className="space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Topik", href: "/topik" },
            { label: topic.nama },
          ]}
        />
        <h1>{topic.nama}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          {topic.deskripsi}
        </p>
      </header>

      <section aria-labelledby="regulasi-topik-title" className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
          <h2 id="regulasi-topik-title" className="text-base font-bold text-slate-900">
            Regulasi Terkait Topik ({regs.length})
          </h2>
          <span className="text-xs text-slate-500">Terverifikasi di repositori</span>
        </div>
        {regs.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {regs.map((r) => (
              <RegulationCard key={r.slug} r={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="Belum ada regulasi pada topik ini"
            description="Belum ada instrumen regulasi di repositori yang diklasifikasikan dengan topik ini."
            actionLabel="Lihat semua regulasi"
            actionHref="/regulasi"
          />
        )}
      </section>

      {arts.length > 0 && (
        <section aria-labelledby="artikel-topik-title" className="space-y-4 pt-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h2 id="artikel-topik-title" className="text-base font-bold text-slate-900">
              Artikel Edukasi Terkait ({arts.length})
            </h2>
            <span className="text-xs text-slate-500">Kajian praktis MIK</span>
          </div>
          <div className="grid gap-3">
            {arts.map((a) => (
              <a
                key={a.slug}
                href={`/artikel/${a.slug}`}
                className="block rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-500 hover:bg-teal-50/20"
              >
                <p className="font-bold text-slate-900">{a.judul}</p>
                <p className="mt-1 text-xs leading-relaxed text-slate-600">{a.ringkasan}</p>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
