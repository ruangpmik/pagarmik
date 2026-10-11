import { getStore } from "@/lib/data/store";

export const metadata = { title: "Knowledge Base" };

export default function Articles() {
  const arts = getStore().articles();
  return (
    <div>
      <h1 className="text-2xl font-extrabold">📖 Knowledge Base</h1>
      <p className="mt-1 text-sm text-ink-900/60">Artikel edukasi terverifikasi dengan dasar hukum dan contoh kasus.</p>
      <div className="mt-4 grid gap-3">
        {arts.map((a) => (
          <a key={a.slug} href={`/artikel/${a.slug}`} className="block rounded-2xl border border-ink-100 bg-white p-4 hover:shadow-md">
            <h2 className="font-bold text-pagar-800">{a.judul}</h2>
            <p className="mt-1 text-sm text-ink-900/70">{a.ringkasan}</p>
            <p className="mt-2 text-xs text-ink-900/50">✅ Verified by PAGARMIK · {a.verifiedAt ?? "—"} · #{a.topik.join(" #")}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
