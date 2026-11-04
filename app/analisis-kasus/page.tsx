import { analyzeCase } from "@/lib/rag/pipeline";
import { ConfidenceBadge, Disclaimer } from "@/components/ui";
import { InlineMarkdown } from "@/components/Markdown";
import RememberVisit from "@/components/RememberVisit";

export const metadata = { title: "Analisis Kasus" };

export default async function CasePage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const kasus = (searchParams.kasus ?? "").trim();
  const res = kasus ? await analyzeCase(kasus) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <h1>Analisis kasus</h1>
      {kasus ? <RememberVisit kind="case" label={kasus.slice(0, 80)} href={`/analisis-kasus?kasus=${encodeURIComponent(kasus)}`} /> : null}
      <p className="mt-1 text-base leading-relaxed text-ink-900/80">Masukkan skenario untuk meninjau masalah, dasar hukum, risiko, dan rekomendasi. Norma hukum dipisahkan dari interpretasi.</p>
      <form method="get" className="mt-4">
        <label htmlFor="kasus" className="mb-1 block text-sm font-semibold text-pagar-800">Skenario kasus</label>
        <textarea id="kasus" name="kasus" required minLength={10} rows={4} defaultValue={kasus}
          placeholder="Contoh: Pasien meminta rekam medis miliknya melalui istrinya. Apa yang harus dilakukan rumah sakit?"
          className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-base outline-none focus:border-pagar-500" />
        <button className="mt-3 min-h-11 rounded-lg bg-pagar-700 px-5 py-2.5 text-sm font-semibold text-white">Analisis kasus</button>
      </form>
      {res && (
        <div className="mt-5 rounded-2xl border border-ink-100 bg-white p-5">
          <ConfidenceBadge level={res.confidence} />
          {Object.entries(res.sections).map(([k, v]) => (
            <section key={k} className="mt-4">
              <h2 className="font-extrabold text-pagar-800">{k}</h2>
              <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed"><InlineMarkdown text={v} /></p>
            </section>
          ))}
          <div className="mt-5"><Disclaimer /></div>
        </div>
      )}
    </div>
  );
}
