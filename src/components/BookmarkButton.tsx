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
      title={saved ? "Hapus bookmark" : "Simpan ke bookmark"}
      className={`rounded-full border px-2.5 py-1 text-xs font-bold transition ${saved ? "border-pagar-600 bg-pagar-700 text-white" : "border-ink-100 bg-white text-pagar-700 hover:border-pagar-500"}`}
    >
      {saved ? "★ Tersimpan" : "☆ Simpan"}
    </button>
  );
}
