"use client";

import { useEffect, useState } from "react";
import { getBookmarks, getHistory, removeBookmark, type BookmarkItem, type HistoryItem } from "@/lib/library/store";

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function LibraryView() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setBookmarks(getBookmarks());
    setHistory(getHistory());
  }, []);

  const searches = history.filter((h) => h.kind === "search" || h.kind === "pasal" || h.kind === "chat" || h.kind === "case");
  const reads = history.filter((h) => h.kind === "regulation" || h.kind === "article");

  return (
    <div>
      <h2 className="mt-6 font-extrabold">🔖 Bookmark ({bookmarks.length})</h2>
      {bookmarks.length === 0 ? (
        <p className="mt-1 text-sm text-ink-900/60">Belum ada. Ketuk ☆ Simpan pada regulasi, pasal, atau artikel.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {bookmarks.map((b) => (
            <li key={`${b.type}:${b.slug}:${b.pasal ?? ""}`} className="flex items-center gap-2 rounded-2xl border border-ink-100 bg-white p-3 text-sm">
              <a
                href={b.type === "regulasi" ? `/regulasi/${b.slug}?tab=pasal` : b.type === "pasal" ? `/regulasi/${b.slug}?tab=pasal` : `/artikel/${b.slug}`}
                className="flex-1 font-bold text-pagar-700"
              >
                {b.type === "pasal" ? `Pasal ${b.pasal} — ` : ""}{b.title}
                <span className="block text-[11px] font-normal text-ink-900/50">{fmtDate(b.at)}</span>
              </a>
              <button
                onClick={() => setBookmarks(removeBookmark(b.type, b.slug, b.pasal))}
                className="rounded-full border px-2 py-1 text-xs font-bold text-red-700"
                aria-label={`Hapus bookmark ${b.title}`}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-6 font-extrabold">🕘 Riwayat Pencarian & AI ({searches.length})</h2>
      {searches.length === 0 ? (
        <p className="mt-1 text-sm text-ink-900/60">Jejak pencarian dan pertanyaan AI tercatat otomatis di perangkat ini.</p>
      ) : (
        <ul className="mt-2 space-y-1.5 text-sm">
          {searches.map((h) => (
            <li key={h.href + h.at}>
              <a href={h.href} className="block truncate rounded-xl bg-ink-50/60 px-3 py-2 hover:bg-pagar-50">
                <span className="mr-1.5 rounded bg-white px-1.5 py-0.5 text-[10px] font-bold uppercase text-pagar-700">{h.kind}</span>
                {h.label} <span className="text-[11px] text-ink-900/50">· {fmtDate(h.at)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}

      <h2 className="mt-6 font-extrabold">📖 Terakhir Dibaca ({reads.length})</h2>
      {reads.length > 0 && (
        <ul className="mt-2 space-y-1.5 text-sm">
          {reads.slice(0, 10).map((h) => (
            <li key={h.href + h.at}>
              <a href={h.href} className="block truncate rounded-xl bg-ink-50/60 px-3 py-2 hover:bg-pagar-50">
                {h.label} <span className="text-[11px] text-ink-900/50">· {fmtDate(h.at)}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-4 text-xs text-ink-900/50">Tersimpan lokal di perangkat ini. Sinkronisasi akun (PostgreSQL) hadir di tahap berikut.</p>
    </div>
  );
}
