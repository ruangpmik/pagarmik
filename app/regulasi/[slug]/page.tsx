import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { StatusBadge, ConfidenceBadge, Disclaimer } from "@/components/ui";
import BookmarkButton from "@/components/BookmarkButton";
import RememberVisit from "@/components/RememberVisit";
import { answerQuestion } from "@/lib/rag/pipeline";

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const r = getStore().regulation(params.slug);
  if (!r) return { title: "Tidak ditemukan" };
  return {
    title: r.judul,
    description: r.ringkasan,
    alternates: { canonical: `/regulasi/${r.slug}` },
  };
}

export default async function RegulationDetail({ params, searchParams }: { params: { slug: string }; searchParams: Record<string, string | undefined> }) {
  const store = getStore();
  const reg = store.regulation(params.slug);
  if (!reg) notFound();
  const pasals = store.pasalsOf(reg.slug);
  const rels = store.relationsOf(reg.slug);
  const tab = searchParams.tab ?? "ringkasan";
  const pengganti = rels
    .filter((r) => r.to === reg.slug && (r.type === "MENCABUT" || r.type === "MENGUBAH"))
    .map((r) => store.regulation(r.from))
    .filter((r): r is NonNullable<typeof r> => !!r);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Legislation",
    name: reg.judul, legislationType: reg.jenis, datePublished: reg.tglPenetapan,
  };

  // AI Analysis tab: RAG asli atas regulasi ini
  let ai: Awaited<ReturnType<typeof answerQuestion>> | null = null;
  if (tab === "ai") {
    ai = await answerQuestion(`Jelaskan isi, kewajiban utama, dan implikasi ${reg.judul} bagi PMIK`, { topK: 6 });
  }

  const tabs = [
    ["ringkasan", "Ringkasan"], ["pasal", "Pasal"], ["hubungan", "Hubungan Regulasi"],
    ["terkait", "Related Topics"], ["ai", "AI Analysis"],
  ] as const;

  return (
    <div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <a href="/regulasi" className="text-sm font-bold text-pagar-700">← Semua regulasi</a>
      <RememberVisit kind="regulation" label={reg.judul} href={`/regulasi/${reg.slug}`} />
      <div className="mt-2 flex flex-wrap items-start justify-between gap-2">
        <h1 className="max-w-[75%] text-2xl font-extrabold leading-tight">{reg.judul}</h1>
        <BookmarkButton type="regulasi" slug={reg.slug} title={reg.judul} />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <StatusBadge status={reg.status} />
        <span className="text-xs text-ink-900/60">{reg.jenis} · {reg.instansi} · {reg.tahun}</span>
      </div>
      {(reg.status === "DICABUT" || reg.status === "PERUBAHAN") && (
        <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm" role="alert">
          <p className="font-extrabold text-red-800">
            ⚠️ {reg.status === "DICABUT" ? "Aturan ini sudah dicabut — jangan jadikan dasar tindakan." : "Aturan ini telah berubah — gunakan versi berlaku."}
          </p>
          {pengganti.length > 0 && (
            <p className="mt-1 text-red-900/80">
              Digantikan oleh: {pengganti.map((g, i) => (
                <span key={g.slug}>{i > 0 ? "; " : ""}<a className="font-bold underline" href={`/regulasi/${g.slug}`}>{g.judul}</a></span>
              ))}
            </p>
          )}
        </div>
      )}

      <dl className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-ink-100 bg-ink-50/50 p-4 text-sm md:grid-cols-4">
        {[["Nomor", reg.nomor], ["Tahun", String(reg.tahun)], ["Jenis", reg.jenis], ["Instansi", reg.instansi],
          ["Penetapan", reg.tglPenetapan ?? "—"], ["Berlaku", reg.tglBerlaku ?? "—"],
          ["Sumber resmi", reg.sumberResmi ?? "—"], ["Terverifikasi", reg.verifiedAt ?? "—"]].map(([k, v]) => (
          <div key={k}><dt className="text-xs text-ink-900/50">{k}</dt><dd className="font-semibold">{v}</dd></div>
        ))}
      </dl>

      <nav className="mt-4 flex gap-2 overflow-x-auto" aria-label="Tab regulasi">
        {tabs.map(([id, label]) => (
          <a key={id} href={`/regulasi/${reg.slug}?tab=${id}`}
            className={`whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-bold ${tab === id ? "bg-pagar-700 text-white" : "border border-ink-100 bg-white"}`}>
            {label}
          </a>
        ))}
      </nav>

      <div className="mt-4">
        {tab === "ringkasan" && (
          <div className="prose-pagar rounded-2xl border border-ink-100 bg-white p-5">
            <h2>Ringkasan</h2><p>{reg.ringkasan}</p>
            <h2>Topik</h2>
            <div className="flex flex-wrap gap-2">{reg.topik.map((t) => <a key={t} href={`/topik/${t}`} className="rounded-full bg-pagar-50 px-3 py-1 text-xs font-bold text-pagar-700">#{t}</a>)}</div>
          </div>
        )}
        {tab === "pasal" && (
          <div className="grid gap-3">
            {pasals.map((p) => (
              <article key={p.nomor} className="rounded-2xl border border-ink-100 bg-white p-4">
                <div className="flex items-start justify-between gap-2">
                  <h2 className="font-extrabold text-pagar-800">Pasal {p.nomor} {!p.isVerbatim && <span className="ml-1 rounded bg-amber-100 px-1.5 py-0.5 text-[11px] font-bold text-amber-800">ringkasan terverifikasi</span>}</h2>
                  <BookmarkButton type="pasal" slug={reg.slug} pasal={p.nomor} title={`${reg.judul}`} />
                </div>
                <p className="mt-2 font-serif text-[15px] leading-relaxed">{p.teksAsli}</p>
                <h3 className="mt-3 text-sm font-bold">Apa artinya?</h3>
                <p className="text-sm text-ink-900/80">{p.artiSederhana}</p>
                <h3 className="mt-2 text-sm font-bold">Relevansi untuk PMIK</h3>
                <p className="text-sm text-ink-900/80">{p.relevansiPmIK}</p>
                {p.risikoKepatuhan && (<><h3 className="mt-2 text-sm font-bold">⚠️ Risiko Kepatuhan</h3><p className="text-sm text-ink-900/80">{p.risikoKepatuhan}</p></>)}
                <a href={`/ai?q=${encodeURIComponent(`Jelaskan Pasal ${p.nomor} ${reg.judul} untuk PMIK`)}`} className="mt-3 inline-block text-sm font-bold text-pagar-700 underline">✦ Explain This Pasal dengan AI</a>
              </article>
            ))}
            {pasals.length === 0 && <p className="text-sm text-ink-900/60">Belum ada pasal terindeks untuk regulasi ini.</p>}
          </div>
        )}
        {tab === "hubungan" && (
          <div className="rounded-2xl border border-ink-100 bg-white p-5">
            <h2 className="font-extrabold">Hubungan Regulasi</h2>
            {rels.length === 0 && <p className="mt-2 text-sm">Belum ada relasi tercatat.</p>}
            <ul className="mt-2 space-y-2 text-sm">
              {rels.map((r, i) => {
                const other = r.from === reg.slug ? r.to : r.from;
                const dir = r.from === reg.slug ? "→" : "←";
                const target = store.regulation(other);
                return <li key={i} className="rounded-xl bg-ink-50/60 p-3"><span className="font-bold">{r.type}</span> {dir} <a className="font-bold text-pagar-700 underline" href={`/regulasi/${other}`}>{target?.judul ?? other}</a></li>;
              })}
            </ul>
            <a href="/grafik" className="mt-3 inline-block text-sm font-bold text-pagar-700 underline">Lihat relationship graph →</a>
          </div>
        )}
        {tab === "terkait" && (
          <div className="rounded-2xl border border-ink-100 bg-white p-5">
            <h2 className="font-extrabold">Related Topics</h2>
            <div className="mt-2 flex flex-wrap gap-2">{reg.topik.map((t) => <a key={t} href={`/topik/${t}`} className="rounded-full bg-pagar-50 px-3 py-1 text-xs font-bold text-pagar-700">#{t}</a>)}</div>
          </div>
        )}
        {tab === "ai" && ai && (
          <div className="rounded-2xl border border-ink-100 bg-white p-5">
            <div className="flex items-center gap-3"><h2 className="font-extrabold">AI Analysis</h2><ConfidenceBadge level={ai.confidence} /></div>
            <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed">{ai.answer}</p>
            <h3 className="mt-4 text-sm font-bold">Sumber</h3>
            <ul className="mt-1 space-y-1 text-sm">
              {ai.citations.map((c) => <li key={c.chunkId}>[{c.chunkId}] {c.regulasiJudul}{c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""} <span className="text-xs text-ink-900/50">({c.trustLevel})</span></li>)}
            </ul>
          </div>
        )}
      </div>
      <div className="mt-6"><Disclaimer /></div>
    </div>
  );
}
