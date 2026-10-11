import { answerQuestion } from "@/lib/rag/pipeline";
import { ConfidenceBadge, Disclaimer } from "@/components/ui";
import RememberVisit from "@/components/RememberVisit";

export const metadata = { title: "PAGARMIK AI" };

import { Fragment } from "react";

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(\*\*.+?\*\*)/g).map((seg, j) =>
    seg.startsWith("**") && seg.endsWith("**") && seg.length > 4 ? (
      <strong key={`${keyPrefix}-b${j}`}>{seg.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-t${j}`}>{seg}</span>
    )
  );
}

function renderWithCitations(text: string): React.ReactNode[] {
  const parts = text.split(/(\[[a-z0-9-]+:pasal-[\w-]+:\d+\])/gi);
  return parts.map((p, i) => {
    const m = p.match(/^\[([a-z0-9-]+):pasal-([\w-]+):(\d+)\]$/i);
    if (!m) return <Fragment key={`p${i}`}>{renderInline(p, `p${i}`)}</Fragment>;
    return (
      <a key={`c${i}`} href={`/regulasi/${m[1]}?tab=pasal`} className="mx-0.5 rounded-md bg-pagar-50 px-1.5 py-0.5 text-xs font-bold text-pagar-700 underline" title={`Buka sumber: ${m[1]}`}>
        [{m[1]}]
      </a>
    );
  });
}

export default async function AiPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = (searchParams.q ?? "").trim();
  const ans = q ? await answerQuestion(q) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold">🤖 PAGARMIK AI</h1>
      {q ? <RememberVisit kind="chat" label={q.slice(0, 80)} href={`/ai?q=${encodeURIComponent(q)}`} /> : null}
      <p className="mt-1 text-sm text-ink-900/60">AI Legal Research Assistant for MIK — menjawab dengan sitasi terverifikasi, bukan karangan.</p>

      <form method="get" className="mt-4" role="search">
        <label htmlFor="aiq" className="sr-only">Tanya PAGARMIK AI</label>
        <textarea id="aiq" name="q" required minLength={3} rows={3} defaultValue={q}
          placeholder="Contoh: Apakah PMIK boleh memberikan salinan rekam medis kepada keluarga pasien?"
          className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-[15px] shadow-sm outline-none focus:border-pagar-500" />
        <button className="mt-2 w-full rounded-2xl bg-pagar-700 px-5 py-3 text-sm font-bold text-white hover:bg-pagar-600">
          Tanya PAGARMIK AI ✦
        </button>
      </form>

      {ans && (
        <article className="mt-5 rounded-2xl border border-ink-100 bg-white p-5 shadow-sm" aria-live="polite">
          <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 pb-3">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-pagar-700 text-white" aria-hidden>✦</span>
            <div>
              <p className="text-sm font-extrabold">PAGARMIK AI</p>
              <ConfidenceBadge level={ans.confidence} />
            </div>
          </div>
          <div className="prose-pagar mt-3 whitespace-pre-line text-[15px]">{renderWithCitations(ans.answer)}</div>
          <h2 className="mt-5 text-sm font-extrabold uppercase tracking-wide text-pagar-800">Evidence — sumber yang digunakan</h2>
          <ul className="mt-2 space-y-2">
            {ans.citations.map((c) => (
              <li key={c.chunkId} className="rounded-xl bg-ink-50/60 p-3 text-sm">
                <a href={`/regulasi/${c.regulationSlug}?tab=pasal`} className="font-bold text-pagar-700 underline">
                  {c.regulasiJudul}{c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""}
                </a>
                <p className="mt-1 text-ink-900/75">{c.kutipan}…</p>
                <p className="mt-1 font-mono text-[11px] text-ink-900/50">[{c.chunkId}] · {c.trustLevel}</p>
              </li>
            ))}
          </ul>
          {ans.invalidCitationsDropped.length > 0 && (
            <p className="mt-2 text-xs text-amber-700">🛡️ {ans.invalidCitationsDropped.length} sitasi tak terverifikasi dibuang otomatis demi anti-halusinasi.</p>
          )}
          <div className="mt-4 flex gap-2 text-sm">
            <a className="rounded-xl border px-3 py-1.5 font-bold text-pagar-700" href={`/analisis-kasus?kasus=${encodeURIComponent(q)}`}>📑 Jadikan Analisis Kasus</a>
            <a className="rounded-xl border px-3 py-1.5 font-bold text-pagar-700" href={`/legal-search?q=${encodeURIComponent(q)}`}>🔍 Cari manual</a>
          </div>
          <div className="mt-4"><Disclaimer /></div>
        </article>
      )}

      {!ans && (
        <div className="mt-5 grid gap-2 text-sm">
          {["Apa dasar hukum kerahasiaan rekam medis dan siapa yang bertanggung jawab menjaganya?",
            "Apakah PMIK boleh memberikan salinan rekam medis kepada keluarga pasien?",
            "Apa kewajiban RME dan integrasi SATUSEHAT bagi rumah sakit?",
            "Bagaimana UU PDP mengatur data kesehatan sebagai data spesifik?"].map((s) => (
            <a key={s} href={`/ai?q=${encodeURIComponent(s)}`} className="rounded-2xl border border-ink-100 bg-white p-3 hover:shadow-sm">“{s}” →</a>
          ))}
        </div>
      )}
    </div>
  );
}
