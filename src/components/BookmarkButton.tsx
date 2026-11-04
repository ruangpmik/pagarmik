"use client";

import { useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "@/lib/library/store";

export default function BookmarkButton({ type, slug, pasal, title }: {
  type: "regulasi" | "pasal" | "artikel";
  slug: string;
  pasal?: string;
  title: string;
}) {
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isBookmarked(type, slug, pasal));
  }, [type, slug, pasal]);

  return (
    <button
      type="button"
      onClick={() => setSaved(toggleBookmark({ type, slug, pasal, title }))}
      aria-pressed={saved}
      className="inline-flex min-h-10 items-center gap-2 rounded-md border border-ink-100 bg-white px-3 py-2 text-sm font-medium text-ink-900 transition-colors hover:bg-pagar-50"
    >
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill={saved ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21z" />
      </svg>
      <span>{saved ? "Tersimpan" : "Simpan"}</span>
    </button>
  );
}
