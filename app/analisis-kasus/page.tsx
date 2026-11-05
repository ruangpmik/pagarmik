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
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Analisis kasus" }]} />
        <h1>Analisis Kasus Operasional</h1>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
          Uji skenario operasional rekam medis untuk meninjau dasar yuridis, risiko kepatuhan hukum, dan rekomendasi teknis PMIK secara terstruktur.
        </p>
      </header>

      {kasus ? (
        <RememberVisit
          kind="case"
          label={kasus.slice(0, 80)}
          href={`/analisis-kasus?kasus=${encodeURIComponent(kasus)}`}
        />
      ) : null}

      <form method="get" className="section-card space-y-3">
        <label htmlFor="kasus" className="block text-xs font-semibold uppercase tracking-wider text-slate-500">
          Deskripsi Skenario Kasus (Minimal 10 Karakter) <span className="text-rose-500">*</span>
        </label>
        <textarea
          id="kasus"
          name="kasus"
          required
          minLength={10}
          rows={4}
          defaultValue={kasus}
          aria-describedby="kasus-privacy-hint"
          placeholder="Contoh: Pasien meminta salinan rekam medis miliknya melalui keluarga tanpa surat kuasa tertulis. Apa langkah yuridis dan prosedur verifikasi yang wajib dijalankan fasilitas pelayanan kesehatan?"
          className="form-input text-sm leading-relaxed"
        />
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-xs text-amber-900">
          <span className="font-bold">Perlindungan Data:</span>
          <span id="kasus-privacy-hint">Gunakan skenario hipotetis atau data tersamar. Dilarang mencantumkan nama pasien asli, NIK, tanggal lahir spesifik, atau nomor rekam medis riil.</span>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 pt-2">
          <SubmitButton
            loadingLabel="Menganalisis skenario..."
            progressSteps={[
              "Mengidentifikasi isu yuridis pada skenario...",
              "Menelusuri dasar regulasi di repositori...",
              "Menyusun analisis, risiko, dan rekomendasi kepatuhan...",
            ]}
          >
            Analisis Kasus
          </SubmitButton>
          {kasus && (
            <a href="/analisis-kasus" className="btn-secondary">
              Reset Skenario
            </a>
          )}
        </div>
      </form>

      {res && (
        <article className="section-card space-y-5" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Hasil Telaah Yuridis</p>
              <h2 className="text-base font-bold text-slate-900">Struktur Analisis & Kepatuhan PMIK</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <ConfidenceBadge level={res.confidence} />
              <div className="print:hidden">
                <PrintButton label="Cetak Lembar Telaah" />
              </div>
            </div>
          </div>

          <div className="grid gap-3.5">
            {Object.entries(res.sections).map(([k, v]) => (
              <LegalBlock key={k} kind={classifySectionKind(k)} title={k}>
                <div className="whitespace-pre-line text-sm leading-relaxed">
                  <InlineMarkdown text={v} />
                </div>
              </LegalBlock>
            ))}
          </div>

          <div className="flex flex-wrap gap-2.5 border-t border-slate-200 pt-4 text-sm">
            <a
              href={`/legal-search?q=${encodeURIComponent(kasus.slice(0, 60))}`}
              className="btn-secondary"
            >
              Telusuri Regulasi Terkait di Repositori →
            </a>
          </div>

          <Disclaimer />
        </article>
      )}

      {!res && (
        <section className="section-card space-y-4" aria-labelledby="contoh-kasus-title">
          <h2 id="contoh-kasus-title" className="text-base font-bold text-slate-900">
            Contoh Skenario Kasus Praktis
          </h2>
          <p className="text-sm text-slate-600">
            Pilih salah satu skenario dilema operasional rekam medis berikut untuk menelaah kajian hukum:
          </p>
          <div className="grid gap-2.5 text-sm">
            {CASE_EXAMPLES.map((sample) => (
              <a
                key={sample}
                href={`/analisis-kasus?kasus=${encodeURIComponent(sample)}`}
                className="rounded-xl border border-slate-200 bg-white p-4 font-medium leading-relaxed text-slate-800 transition-colors hover:border-teal-500 hover:bg-teal-50/20"
              >
                “{sample}”
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
