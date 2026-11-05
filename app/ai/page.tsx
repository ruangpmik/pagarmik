import { Fragment } from "react";
import { answerQuestion } from "@/lib/rag/pipeline";
import { TRUST_LABEL } from "@/lib/data/types";
import {
  Alert,
  Breadcrumb,
  ConfidenceBadge,
  Disclaimer,
  LegalBlock,
} from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import RememberVisit from "@/components/RememberVisit";

export const metadata = { title: "PAGARMIK AI" };

const AI_EXAMPLES = [
  "Apa dasar hukum kerahasiaan rekam medis dan siapa yang bertanggung jawab menjaganya?",
  "Apakah PMIK boleh memberikan salinan rekam medis kepada keluarga pasien?",
  "Apa kewajiban RME dan integrasi SATUSEHAT bagi rumah sakit?",
  "Bagaimana UU PDP mengatur data kesehatan sebagai data spesifik?",
];

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(\*\*.+?\*\*)/g).map((seg, j) =>
    seg.startsWith("**") && seg.endsWith("**") && seg.length > 4 ? (
      <strong key={`${keyPrefix}-b${j}`}>{seg.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-t${j}`}>{seg}</span>
    ),
  );
}

function renderWithCitations(text: string): React.ReactNode[] {
  const parts = text.split(/(\[[a-z0-9-]+:pasal-[\w-]+:\d+\])/gi);
  return parts.map((p, i) => {
    const m = p.match(/^\[([a-z0-9-]+):pasal-([\w-]+):(\d+)\]$/i);
    if (!m) return <Fragment key={`p${i}`}>{renderInline(p, `p${i}`)}</Fragment>;
    return (
      <a
        key={`c${i}`}
        href={`/regulasi/${m[1]}?tab=pasal`}
        className="mx-0.5 rounded-md bg-pagar-50 px-1.5 py-0.5 text-xs font-bold text-pagar-700 underline"
        title={`Buka sumber: ${m[1]}`}
      >
        [{m[1]}]
      </a>
    );
  });
}

export default async function AiPage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const q = (searchParams.q ?? "").trim();
  const ans = q ? await answerQuestion(q) : null;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tanya AI" }]} />
        <h1>PAGARMIK AI</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Riset dan penalaran yuridis untuk Perekam Medis dan Informasi Kesehatan (RMIK/MIK) berbasis sitasi dokumen hukum primer terverifikasi.
        </p>
      </header>

      {q ? (
        <RememberVisit
          kind="chat"
          label={q.slice(0, 80)}
          href={`/ai?q=${encodeURIComponent(q)}`}
        />
      ) : null}

      <form method="get" className="section-card space-y-3" role="search">
        <label htmlFor="aiq" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Pertanyaan Yuridis Anda <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="aiq"
          name="q"
          required
          minLength={3}
          rows={3}
          defaultValue={q}
          aria-describedby="ai-privacy-hint"
          placeholder="Contoh: Apakah PMIK berwenang menolak pemberian salinan berkas rekam medis jika pemohon tidak melampirkan surat kuasa sah?"
          className="form-input text-sm leading-relaxed"
        />
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
          <span className="font-bold">Privasi & Keamanan:</span>
          <span id="ai-privacy-hint">Jangan mencantumkan nama pasien riil, identitas personel fasyankes, atau data klinis sensitif. Pertanyaan disintesis berbasis sitasi repositori resmi.</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <SubmitButton
            loadingLabel="Menyusun jawaban..."
            progressSteps={[
              "Menelusuri sumber hukum primer di repositori...",
              "Memverifikasi kecocokan sitasi pasal...",
              "Menyusun jawaban berbasis bukti yuridis...",
            ]}
          >
            Kirim Pertanyaan
          </SubmitButton>
          {q && (
            <a href="/ai" className="btn-secondary">
              Bersihkan Formulir
            </a>
          )}
        </div>
      </form>

      {ans && (
        <article className="section-card space-y-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Jawaban Sistem</p>
              <h2 className="text-base font-bold text-slate-900">Analisis Sintesis Berbasis Regulasi</h2>
            </div>
            <ConfidenceBadge level={ans.confidence} />
          </div>

          <LegalBlock kind="ANALISIS HUKUM" title="Sintesis Yuridis Berdasarkan Dokumen Repositori">
            <div className="prose-pagar whitespace-pre-line text-sm leading-relaxed text-slate-800">
              {renderWithCitations(ans.answer)}
            </div>
          </LegalBlock>

          {ans.invalidCitationsDropped.length > 0 && (
            <Alert variant="warning" title="Sitasi tidak terverifikasi disaring">
              {ans.invalidCitationsDropped.length} rujukan yang tidak cocok dengan dokumen repositori telah dihapus otomatis demi menjaga integritas data yuridis.
            </Alert>
          )}

          <section aria-labelledby="sumber-ai-title" className="space-y-3">
            <h3 id="sumber-ai-title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Kutipan Sumber Hukum yang Digunakan ({ans.citations.length})
            </h3>
            {ans.citations.length === 0 ? (
              <p className="text-sm text-slate-500">
                Tidak ada kutipan pasal primer yang memenuhi ambang kecocokan minimum untuk pertanyaan ini.
              </p>
            ) : (
              <ul className="space-y-2.5">
                {ans.citations.map((c) => (
                  <li
                    key={c.chunkId}
                    className="rounded-xl border border-slate-200 bg-white p-4 text-sm"
                  >
                    <a
                      href={`/regulasi/${c.regulationSlug}?tab=pasal`}
                      className="font-bold text-teal-700 hover:underline"
                    >
                      {c.regulasiJudul}
                      {c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""}
                    </a>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-700">“{c.kutipan}…”</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>ID Kutipan: <strong className="font-mono text-slate-700">{c.chunkId}</strong></span>
                      <span>·</span>
                      <span className="font-semibold text-slate-600">{TRUST_LABEL[c.trustLevel] ?? c.trustLevel}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex flex-wrap gap-2.5 border-t border-slate-200 pt-4 text-sm">
            <a
              className="btn-secondary"
              href={`/analisis-kasus?kasus=${encodeURIComponent(q)}`}
            >
              Lanjutkan ke Analisis Kasus Operasional →
            </a>
            <a
              className="btn-secondary"
              href={`/legal-search?q=${encodeURIComponent(q)}`}
            >
              Cari Dokumen Terkait di Repositori
            </a>
          </div>

          <Disclaimer />
        </article>
      )}

      {!ans && (
        <section className="section-card space-y-4" aria-labelledby="contoh-ai-title">
          <h2 id="contoh-ai-title" className="text-base font-bold text-slate-900">
            Contoh Pertanyaan Riset Regulasi PMIK
          </h2>
          <p className="text-sm text-slate-600">
            Pilih salah satu pertanyaan di bawah ini untuk melihat bagaimana PAGARMIK menyajikan sintesis berbasis sitasi:
          </p>
          <div className="grid gap-2.5 text-sm">
            {AI_EXAMPLES.map((s) => (
              <a
                key={s}
                href={`/ai?q=${encodeURIComponent(s)}`}
                className="rounded-xl border border-slate-200 bg-white p-3.5 font-medium text-slate-800 transition-colors hover:border-teal-500 hover:bg-teal-50/20"
              >
                “{s}”
              </a>
            ))}
          </div>
          <div className="pt-2">
            <Disclaimer />
          </div>
        </section>
      )}
    </div>
  );
}
