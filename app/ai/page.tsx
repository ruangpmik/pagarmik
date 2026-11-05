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
    <div className="mx-auto max-w-4xl">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tanya AI" }]} />
        <h1>PAGARMIK AI</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-900/80">
          Riset hukum untuk Perekam Medis dan Informasi Kesehatan (RMIK/MIK) berbasis sumber katalog yang dapat ditelusuri.
        </p>
      </header>

      {q ? (
        <RememberVisit
          kind="chat"
          label={q.slice(0, 80)}
          href={`/ai?q=${encodeURIComponent(q)}`}
        />
      ) : null}

      <form method="get" className="section-card grid gap-2.5" role="search">
        <label htmlFor="aiq" className="text-sm font-semibold text-pagar-800">
          Pertanyaan hukum Anda <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <textarea
          id="aiq"
          name="q"
          required
          minLength={3}
          rows={3}
          defaultValue={q}
          aria-describedby="ai-privacy-hint"
          placeholder="Contoh: Apakah PMIK boleh memberikan salinan rekam medis kepada keluarga pasien?"
          className="form-input py-2.5 text-base"
        />
        <p id="ai-privacy-hint" className="text-xs leading-relaxed text-ink-900/70">
          Privasi: Jangan masukkan nama pasien, nomor rekam medis asli, atau data pribadi sensitif. Riwayat pertanyaan disimpan lokal di peramban ini.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <SubmitButton
            loadingLabel="Menyusun jawaban..."
            progressSteps={[
              "Menelusuri sumber hukum primer di katalog...",
              "Memverifikasi kecocokan sitasi pasal...",
              "Menyusun jawaban berbasis bukti...",
            ]}
          >
            Kirim pertanyaan
          </SubmitButton>
          {q && (
            <a href="/ai" className="btn-secondary">
              Bersihkan pertanyaan
            </a>
          )}
        </div>
      </form>

      {ans && (
        <article className="mt-6 section-card space-y-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-ink-100 pb-3">
            <h2 className="text-lg font-semibold text-pagar-800">Jawaban PAGARMIK AI</h2>
            <ConfidenceBadge level={ans.confidence} />
          </div>

          <LegalBlock kind="ANALISIS HUKUM" title="Sintesis berbasis dokumen katalog">
            <div className="prose-pagar whitespace-pre-line text-[15px]">
              {renderWithCitations(ans.answer)}
            </div>
          </LegalBlock>

          {ans.invalidCitationsDropped.length > 0 && (
            <Alert variant="warning" title="Sitasi tidak terverifikasi disaring">
              {ans.invalidCitationsDropped.length} rujukan yang tidak cocok dengan dokumen katalog telah dihapus otomatis demi menjaga akurasi sumber.
            </Alert>
          )}

          <section aria-labelledby="sumber-ai-title">
            <h3 id="sumber-ai-title" className="text-base font-semibold text-pagar-800">
              Sumber hukum yang digunakan ({ans.citations.length})
            </h3>
            {ans.citations.length === 0 ? (
              <p className="mt-2 text-sm text-ink-900/75">
                Tidak ada kutipan pasal primer yang memenuhi ambang kecocokan untuk pertanyaan ini.
              </p>
            ) : (
              <ul className="mt-2.5 space-y-2.5">
                {ans.citations.map((c) => (
                  <li
                    key={c.chunkId}
                    className="rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 text-sm"
                  >
                    <a
                      href={`/regulasi/${c.regulationSlug}?tab=pasal`}
                      className="font-bold text-pagar-700 underline underline-offset-2"
                    >
                      {c.regulasiJudul}
                      {c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""}
                    </a>
                    <p className="mt-1 leading-relaxed text-ink-900/80">{c.kutipan}…</p>
                    <p className="mt-1.5 text-xs text-ink-900/65">
                      ID Kutipan: <span className="font-mono">{c.chunkId}</span> ·{" "}
                      {TRUST_LABEL[c.trustLevel] ?? c.trustLevel}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <div className="flex flex-wrap gap-2 border-t border-ink-100 pt-4 text-sm">
            <a
              className="btn-secondary"
              href={`/analisis-kasus?kasus=${encodeURIComponent(q)}`}
            >
              Lanjutkan ke analisis kasus
            </a>
            <a
              className="btn-secondary"
              href={`/legal-search?q=${encodeURIComponent(q)}`}
            >
              Cari sumber hukum terkait
            </a>
          </div>

          <Disclaimer />
        </article>
      )}

      {!ans && (
        <section className="mt-6 section-card" aria-labelledby="contoh-ai-title">
          <h2 id="contoh-ai-title" className="text-base font-semibold text-pagar-800">
            Contoh pertanyaan riset hukum RMIK
          </h2>
          <p className="mt-1 text-sm text-ink-900/75">
            Pilih salah satu pertanyaan di bawah ini untuk melihat bagaimana PAGARMIK AI menautkan sitasi pasal:
          </p>
          <div className="mt-3 grid gap-2 text-sm">
            {AI_EXAMPLES.map((s) => (
              <a
                key={s}
                href={`/ai?q=${encodeURIComponent(s)}`}
                className="rounded-xl border border-ink-100 bg-ink-50/50 p-3 font-medium text-pagar-800 transition-colors hover:border-pagar-300 hover:bg-pagar-50"
              >
                “{s}”
              </a>
            ))}
          </div>
          <div className="mt-5">
            <Disclaimer />
          </div>
        </section>
      )}
    </div>
  );
}
