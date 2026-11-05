"use client";

import { useEffect, useState } from "react";
import { toggleBookmark, isBookmarked } from "@/lib/library/store";
import { useFeedback } from "@/components/FeedbackProvider";

export default function BookmarkButton({
  type,
  slug,
  pasal,
  title,
}: {
  type: "regulasi" | "pasal" | "artikel";
  slug: string;
  pasal?: string;
  title: string;
}) {
  const [saved, setSaved] = useState(false);
  const { toast } = useFeedback();

  useEffect(() => {
    setSaved(isBookmarked(type, slug, pasal));
  }, [type, slug, pasal]);

  const handleToggle = () => {
    const next = toggleBookmark({ type, slug, pasal, title });
    setSaved(next);
    const label = pasal ? `Pasal ${pasal} (${title})` : title;
    toast({
      type: next ? "success" : "info",
      title: next ? "Tersimpan ke markah" : "Dihapus dari markah",
      message: next
        ? `${label} disimpan di peramban ini.`
        : `${label} dihapus dari daftar simpanan.`,
    });
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-pressed={saved}
      className="btn-secondary min-h-10 px-3 py-2 text-sm"
    >
      <svg
        viewBox="0 0 24 24"
        className="h-4 w-4 shrink-0"
        fill={saved ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.7"
        aria-hidden="true"
      >
        <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21z" />
      </svg>
      <span>{saved ? "Tersimpan" : "Simpan"}</span>
    </button>
  );
}
