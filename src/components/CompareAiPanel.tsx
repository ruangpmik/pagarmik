"use client";

import { useState } from "react";
import type { Citation } from "@/lib/data/types";
import { Alert, ConfidenceBadge, LegalBlock } from "@/components/ui";
import { InlineMarkdown } from "@/components/Markdown";
import { useFeedback } from "@/components/FeedbackProvider";

interface CompareApiResponse {
  answer: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  citations: Citation[];
  error?: string;
}

export default function CompareAiPanel({
  slugA,
  slugB,
  labelA,
  labelB,
}: {
  slugA: string;
  slugB: string;
  labelA: string;
  labelB: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CompareApiResponse | null>(null);
  const { toast, isOffline } = useFeedback();

  const runComparison = async () => {
    if (loading) return;
    if (isOffline) {
      setError("Koneksi jaringan sedang terputus. Periksa jaringan Anda lalu coba kembali.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/ai/compare?a=${encodeURIComponent(slugA)}&b=${encodeURIComponent(slugB)}`,
        { headers: { Accept: "application/json" } },
      );

      if (res.status === 429) {
        setError("Batas permintaan sintesis AI tercapai. Tunggu beberapa saat lalu coba lagi.");
        return;
      }

      const data = (await res.json().catch(() => null)) as CompareApiResponse | null;
      if (!res.ok || !data || data.error) {
        setError(data?.error ?? "Gagal memuat sintesis perbandingan dari server.");
        return;
      }

      setResult(data);
      toast({
        type: "success",
        title: "Sintesis perbandingan selesai",
        message: `Perbandingan ${labelA} dan ${labelB} berhasil dimuat.`,
      });
    } catch {
      setError("Gagal menghubungi layanan perbandingan. Periksa koneksi jaringan Anda lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mt-5 section-card space-y-4" aria-labelledby="ai-compare-heading">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 id="ai-compare-heading" className="text-base font-semibold text-pagar-800">
            Sintesis Perbandingan Substansi (PAGARMIK AI)
          </h2>
          <p className="mt-0.5 text-xs text-ink-900/70">
            Menyusun ringkasan perbedaan definisi, kewajiban, hak, dan sanksi berdasarkan kutipan pasal yang tersedia di katalog.
          </p>
        </div>
        <button
          type="button"
          onClick={runComparison}
          disabled={loading}
          aria-busy={loading}
          className="btn-primary"
        >
          {loading && (
            <svg
              viewBox="0 0 24 24"
              className="pagar-spinner h-4 w-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
              <path d="M12 3a9 9 0 0 1 9 9" />
            </svg>
          )}
          <span>
            {loading
              ? "Menyusun perbandingan..."
              : result
                ? "Muat ulang sintesis AI"
                : "Bandingkan substansi dengan AI"}
          </span>
        </button>
      </div>

      {loading && (
        <div className="space-y-3 pt-1" role="status" aria-live="polite">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
            <div className="pagar-progress-bar h-full w-2/5 rounded-full bg-pagar-700" />
          </div>
          <div className="space-y-2 rounded-xl border border-ink-100 bg-ink-50/50 p-4">
            <div className="h-4 w-48 rounded bg-ink-100" />
            <div className="h-3.5 w-full rounded bg-ink-100/80" />
            <div className="h-3.5 w-5/6 rounded bg-ink-100/80" />
          </div>
          <p className="text-xs text-ink-900/70">
            Menarik kutipan pasal dari {labelA} dan {labelB}...
          </p>
        </div>
      )}

      {error && (
        <Alert
          variant="error"
          title="Sintesis perbandingan belum berhasil"
          action={
            <button type="button" onClick={runComparison} className="btn-secondary text-xs">
              Coba lagi
            </button>
          }
        >
          {error}
        </Alert>
      )}

      {result && !loading && (
        <div className="space-y-3 border-t border-ink-100 pt-3" aria-live="polite">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-semibold text-ink-900/70">
              Perbandingan: {labelA} vs {labelB}
            </span>
            <ConfidenceBadge level={result.confidence} />
          </div>
          <LegalBlock kind="ANALISIS HUKUM" title="Perbandingan substansi pasal terindeks">
            <p className="whitespace-pre-line text-[15px] leading-relaxed">
              <InlineMarkdown text={result.answer} />
            </p>
          </LegalBlock>
          {result.citations.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-pagar-800">
                Rujukan pasal yang dibandingkan ({result.citations.length})
              </h3>
              <ul className="mt-1.5 space-y-1 text-xs text-ink-900/75">
                {result.citations.map((c) => (
                  <li key={c.chunkId}>
                    <a
                      href={`/regulasi/${c.regulationSlug}?tab=pasal`}
                      className="font-semibold text-pagar-700 underline"
                    >
                      {c.regulasiJudul}
                      {c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""}
                    </a>{" "}
                    <span className="font-mono text-[11px] text-ink-900/60">[{c.chunkId}]</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

