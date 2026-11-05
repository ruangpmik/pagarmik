"use client";

import { useState } from "react";
import type { Citation } from "@/lib/data/types";
import { Alert, ConfidenceBadge } from "@/components/ui";
import { InlineMarkdown } from "@/components/Markdown";
import { useFeedback } from "@/components/FeedbackProvider";

interface ExplainApiResponse {
  answer: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  citations: Citation[];
  error?: string;
}

export default function ExplainPasalButton({
  slug,
  pasal,
  regulasiJudul,
}: {
  slug: string;
  pasal: string;
  regulasiJudul: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ExplainApiResponse | null>(null);
  const { isOffline } = useFeedback();

  const fetchExplanation = async () => {
    if (loading) return;
    setOpen(true);
    if (result && !error) return;

    if (isOffline) {
      setError("Koneksi jaringan sedang terputus. Periksa jaringan Anda lalu coba kembali.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/ai/explain-pasal?slug=${encodeURIComponent(slug)}&pasal=${encodeURIComponent(pasal)}`,
        { headers: { Accept: "application/json" } },
      );

      if (res.status === 429) {
        setError("Batas permintaan penjelasan AI tercapai. Tunggu beberapa saat lalu coba lagi.");
        return;
      }

      const data = (await res.json().catch(() => null)) as ExplainApiResponse | null;
      if (!res.ok || !data || data.error) {
        setError(data?.error ?? "Gagal memuat penjelasan pasal dari server.");
        return;
      }

      setResult(data);
    } catch {
      setError("Gagal menghubungi layanan penjelasan pasal. Periksa koneksi jaringan Anda lalu coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (open && result && !loading) {
      setOpen(false);
      return;
    }
    void fetchExplanation();
  };

  return (
    <div className="mt-2">
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleToggle}
          disabled={loading}
          aria-expanded={open}
          aria-busy={loading}
          className="btn-secondary min-h-9 px-3 py-1.5 text-xs"
        >
          {loading && (
            <svg
              viewBox="0 0 24 24"
              className="pagar-spinner h-3.5 w-3.5 shrink-0"
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
              ? "Memuat penjelasan..."
              : open && result
                ? "Sembunyikan penjelasan AI"
                : "Ringkasan AI di tempat"}
          </span>
        </button>

        <a
          href={`/ai?q=${encodeURIComponent(`Jelaskan Pasal ${pasal} ${regulasiJudul} untuk PMIK`)}`}
          className="inline-flex min-h-9 items-center text-xs font-semibold text-pagar-700 underline underline-offset-2"
        >
          Buka di ruang Tanya AI →
        </a>
      </div>

      {open && (
        <div className="mt-3 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 text-sm">
          {loading && (
            <div className="space-y-2" role="status" aria-live="polite">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
                <div className="pagar-progress-bar h-full w-2/5 rounded-full bg-pagar-700" />
              </div>
              <p className="text-xs text-ink-900/70">
                Menyusun penjelasan Pasal {pasal} berbasis katalog...
              </p>
            </div>
          )}

          {error && (
            <Alert
              variant="error"
              title="Gagal memuat penjelasan pasal"
              action={
                <button
                  type="button"
                  onClick={() => {
                    setResult(null);
                    void fetchExplanation();
                  }}
                  className="btn-secondary text-xs"
                >
                  Coba lagi
                </button>
              }
            >
              {error}
            </Alert>
          )}

          {result && !loading && (
            <div className="space-y-2" aria-live="polite">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-pagar-800">
                  Penjelasan Kilat — Pasal {pasal}
                </span>
                <ConfidenceBadge level={result.confidence} />
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-900/85">
                <InlineMarkdown text={result.answer} />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

