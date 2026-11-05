"use client";

import { useState } from "react";
import { useFeedback } from "@/components/FeedbackProvider";

export default function CopyCitationButton({
  citation,
  label = "Salin kutipan",
}: {
  citation: string;
  label?: string;
}) {
  const { toast } = useFeedback();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(citation);
      } else {
        // Fallback for older environments
        const textArea = document.createElement("textarea");
        textArea.value = citation;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopied(true);
      toast({
        type: "success",
        title: "Kutipan Tersalin",
        message: "Teks pasal berhasil disalin ke papan klip.",
        duration: 2500,
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        type: "error",
        title: "Gagal Menyalin",
        message: "Izin clipboard tidak tersedia di peramban Anda.",
      });
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="print:hidden inline-flex items-center gap-1.5 rounded border border-ink-100 bg-white px-2 py-1 text-xs font-medium text-ink-900/80 transition-colors hover:border-pagar-300 hover:bg-pagar-50 hover:text-pagar-800 focus-visible:outline"
      aria-label={`${label}: ${citation.slice(0, 40)}...`}
    >
      {copied ? (
        <>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-status-success" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <span className="text-status-success font-semibold">Tersalin!</span>
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 text-ink-900/60" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

