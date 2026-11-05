import { analyzeCase } from "@/lib/rag/pipeline";
import {
  Breadcrumb,
  ConfidenceBadge,
  Disclaimer,
  LegalBlock,
} from "@/components/ui";
import { InlineMarkdown } from "@/components/Markdown";
import { SubmitButton } from "@/components/SubmitButton";
import RememberVisit from "@/components/RememberVisit";
import PrintButton from "@/components/PrintButton";

export const metadata = { title: "Analisis Kasus" };

const CASE_EXAMPLES = [
  "Pasien meminta salinan rekam medis miliknya melalui istrinya tanpa surat kuasa tertulis. Apa prosedur yang sah bagi rumah sakit?",
  "Penyidik kepolisian meminta pembukaan rekam medis pasien untuk penyelidikan pidana. Dokumen apa yang wajib diperiksa PMIK?",
  "Rumah sakit beralih ke Rekam Medis Elektronik (RME) dan berencana memusnahkan berkas rekam medis kertas yang berusia 6 tahun.",
];

function classifySectionKind(
  heading: string,
): "FAKTA HUKUM" | "ANALISIS HUKUM" | "RISIKO KEPATUHAN" | "REKOMENDASI KEPATUHAN" {
  const lower = heading.toLowerCase();
  if (lower.includes("dasar") || lower.includes("regulasi") || lower.includes("pasal")) {
    return "FAKTA HUKUM";
  }
  if (lower.includes("risiko") || lower.includes("sanksi")) {
    return "RISIKO KEPATUHAN";
  }
  if (lower.includes("rekomendasi") || lower.includes("langkah") || lower.includes("tindakan")) {
    return "REKOMENDASI KEPATUHAN";
  }
  return "ANALISIS HUKUM";
}

export default async function CasePage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const kasus = (searchParams.kasus ?? "").trim();
  const res = kasus ? await analyzeCase(kasus) : null;

  return (
    <div className="mx-auto max-w-4xl">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Analisis kasus" }]} />
        <h1>Analisis kasus</h1>
        <p className="mt-2 max-w-3xl text-base leading-relaxed text-ink-900/80">
          Masukkan skenario operasional rekam medis untuk meninjau pokok masalah, dasar hukum, risiko kepatuhan, dan rekomendasi tindakan. Norma hukum dipisahkan secara tegas dari interpretasi.
        </p>
      </header>

      {kasus ? (
        <RememberVisit
          kind="case"
          label={kasus.slice(0, 80)}
          href={`/analisis-kasus?kasus=${encodeURIComponent(kasus)}`}
        />
      ) : null}

      <form method="get" className="section-card grid gap-2.5">
        <label htmlFor="kasus" className="text-sm font-semibold text-pagar-800">
          Skenario kasus (minimal 10 karakter) <span className="text-status-danger">*</span>
        </label>
        <textarea
          id="kasus"
          name="kasus"
          required
          minLength={10}
          rows={4}
          defaultValue={kasus}
          aria-describedby="kasus-privacy-hint"
          placeholder="Contoh: Pasien meminta rekam medis miliknya melalui istrinya. Apa yang harus dilakukan rumah sakit?"
          className="form-input py-2.5 text-base"
        />
        <p id="kasus-privacy-hint" className="text-xs leading-relaxed text-ink-900/70">
          Privasi: Gunakan skenario hipotetis atau anonim. Jangan mencantumkan nama pasien, NIK, atau nomor rekam medis asli.
        </p>
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <SubmitButton
            loadingLabel="Menganalisis skenario..."
            progressSteps={[
              "Mengidentifikasi isu hukum pada skenario...",
              "Menelusuri dasar regulasi di katalog...",
              "Menyusun analisis, risiko, dan rekomendasi kepatuhan...",
            ]}
          >
            Analisis kasus
          </SubmitButton>
          {kasus && (
            <a href="/analisis-kasus" className="btn-secondary">
              Reset skenario
            </a>
          )}
        </div>
      </form>

      {res && (
        <article className="mt-6 section-card space-y-4" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 pb-3">
            <h2 className="text-lg font-semibold text-pagar-800">Hasil Telaah Skenario</h2>
            <div className="flex flex-wrap items-center gap-2">
              <ConfidenceBadge level={res.confidence} />
              <div className="print:hidden">
                <PrintButton label="Cetak Lembar Telaah" />
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {Object.entries(res.sections).map(([k, v]) => (
              <LegalBlock key={k} kind={classifySectionKind(k)} title={k}>
                <p className="whitespace-pre-line text-[15px] leading-relaxed">
                  <InlineMarkdown text={v} />
                </p>
              </LegalBlock>
            ))}
          </div>

          <div className="flex flex-wrap gap-2 border-t border-ink-100 pt-4 text-sm">
            <a
              href={`/legal-search?q=${encodeURIComponent(kasus.slice(0, 60))}`}
              className="btn-secondary"
            >
              Telusuri regulasi terkait di katalog
            </a>
          </div>

          <Disclaimer />
        </article>
      )}

      {!res && (
        <section className="mt-6 section-card" aria-labelledby="contoh-kasus-title">
          <h2 id="contoh-kasus-title" className="text-base font-semibold text-pagar-800">
            Contoh skenario kasus operasional
          </h2>
          <p className="mt-1 text-sm text-ink-900/75">
            Klik salah satu skenario di bawah ini untuk memuat telaah terstruktur:
          </p>
          <div className="mt-3 grid gap-2 text-sm">
            {CASE_EXAMPLES.map((sample) => (
              <a
                key={sample}
                href={`/analisis-kasus?kasus=${encodeURIComponent(sample)}`}
                className="rounded-xl border border-ink-100 bg-ink-50/50 p-3.5 font-medium leading-relaxed text-pagar-800 transition-colors hover:border-pagar-300 hover:bg-pagar-50"
              >
                “{sample}”
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
