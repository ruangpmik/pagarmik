import { getStore } from "@/lib/data/store";

export const metadata = { title: "Topik" };

export default function Topics() {
  const topics = getStore().topics();
  return (
    <div>
      <h1 className="text-2xl font-extrabold">Topic Hub</h1>
      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
        {topics.map((t) => (
          <a key={t.slug} href={`/topik/${t.slug}`} className="rounded-2xl border border-ink-100 bg-white p-4 hover:shadow-md">
            <span className="text-2xl" aria-hidden>{t.ikon}</span>
            <p className="mt-1 font-bold text-pagar-800">{t.nama}</p>
            <p className="text-xs text-ink-900/60">{t.deskripsi}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
