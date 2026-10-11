import { analyzeCase } from "@/lib/rag/pipeline";
import { ConfidenceBadge, Disclaimer } from "@/components/ui";

export const metadata = { title: "Analisis Kasus" };

export default async function CasePage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const kasus = (searchParams.kasus ?? "").trim();
  const res = kasus ? await analyzeCase(kasus) : null;

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-extrabold">📑 Analisis Kasus</h1>
      <p className="mt-1 text-sm text-ink-900/60">Tempel skenario → AI mengurai masalah, dasar hukum, risiko, dan rekomendasi. Norma hukum selalu dibedakan dari interpretasi.</p>
      <form method="get" className="mt-4">
        <textarea name="kasus" required minLength={10} rows={4} defaultValue={kasus}
          placeholder="Contoh: Pasien meminta rekam medis miliknya melalui istrinya. Apa yang harus dilakukan rumah sakit?"
          className="w-full rounded-2xl border border-ink-100 px-4 py-3 text-[15px] outline-none focus:border-pagar-500" />
        <button className="mt-2 w-full rounded-2xl bg-pagar-700 px-5 py-3 text-sm font-bold text-white">Analisis Kasus</button>
      </form>
      {res && (
        <div className="mt-5 rounded-2xl border border-ink-100 bg-white p-5">
          <ConfidenceBadge level={res.confidence} />
          {Object.entries(res.sections).map(([k, v]) => (
            <section key={k} className="mt-4">
              <h2 className="font-extrabold text-pagar-800">{k}</h2>
              <p className="mt-1 whitespace-pre-line text-[15px] leading-relaxed">{v}</p>
            </section>
          ))}
          <div className="mt-5"><Disclaimer /></div>
        </div>
      )}
    </div>
  );
}
