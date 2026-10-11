"use client";

import { useEffect } from "react";
import { pushHistory } from "@/lib/library/store";

/** Mencatat kunjungan ke riwayat lokal (pencarian, pasal, chat, regulasi, artikel, kasus). */
export default function RememberVisit({ kind, label, href }: {
  kind: "search" | "pasal" | "chat" | "regulation" | "article" | "case";
  label: string;
  href: string;
}) {
  useEffect(() => {
    pushHistory({ kind, label, href });
  }, [kind, label, href]);
  return null;
}
