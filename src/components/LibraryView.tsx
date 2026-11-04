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

  const searches = history.filter((item) => item.kind === "search" || item.kind === "pasal" || item.kind === "chat" || item.kind === "case");
  const reads = history.filter((item) => item.kind === "regulation" || item.kind === "article");

  return (
    <div className="space-y-8">
      <section aria-labelledby="saved-title">
        <h2 id="saved-title" className="border-b border-ink-100 pb-3 text-xl font-semibold text-pagar-800">
          Simpanan <span className="font-normal text-ink-900/70">({bookmarks.length})</span>
        </h2>
        {bookmarks.length === 0 ? (
          <p className="py-4 text-sm text-ink-900/75">
            Belum ada simpanan. Gunakan tombol Simpan pada regulasi, pasal, atau artikel untuk menyimpannya.
          </p>
        ) : (
          <ul>
            {bookmarks.map((bookmark) => (
              <li key={bookmark.type + ":" + bookmark.slug + ":" + (bookmark.pasal ?? "")} className="flex items-start gap-3 border-b border-ink-100 py-4">
                <a
                  href={
                    bookmark.type === "regulasi"
                      ? "/regulasi/" + bookmark.slug + "?tab=pasal"
                      : bookmark.type === "pasal"
                        ? "/regulasi/" + bookmark.slug + "?tab=pasal"
                        : "/artikel/" + bookmark.slug
                  }
                  className="min-h-11 min-w-0 flex-1 rounded-sm py-1 font-semibold text-pagar-800 hover:underline focus-visible:outline"
                >
                  {bookmark.type === "pasal" ? "Pasal " + bookmark.pasal + " — " : ""}
                  {bookmark.title}
                  <span className="mt-1 block text-sm font-normal text-ink-900/70">{fmtDate(bookmark.at)}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setBookmarks(removeBookmark(bookmark.type, bookmark.slug, bookmark.pasal))}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md text-ink-900/70 hover:bg-pagar-50 focus-visible:outline"
                  style={{ color: "var(--danger)" }}
                  aria-label={"Hapus bookmark " + bookmark.title}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                    <path d="m6 6 12 12M18 6 6 18" />
                  </svg>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="search-history-title">
        <h2 id="search-history-title" className="border-b border-ink-100 pb-3 text-xl font-semibold text-pagar-800">
          Riwayat pencarian dan AI <span className="font-normal text-ink-900/70">({searches.length})</span>
        </h2>
        {searches.length === 0 ? (
          <p className="py-4 text-sm text-ink-900/75">
            Jejak pencarian dan pertanyaan AI tersimpan otomatis di browser ini.
          </p>
        ) : (
          <ul>
            {searches.map((item) => (
              <li key={item.href + item.at} className="border-b border-ink-100">
                <a href={item.href} className="flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 py-3 text-sm hover:text-pagar-700">
                  <span className="font-semibold text-pagar-800">{item.label}</span>
                  <span className="text-ink-900/70">{item.kind} · {fmtDate(item.at)}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="recent-reads-title">
        <h2 id="recent-reads-title" className="border-b border-ink-100 pb-3 text-xl font-semibold text-pagar-800">
          Terakhir dibaca <span className="font-normal text-ink-900/70">({reads.length})</span>
        </h2>
        {reads.length === 0 ? (
          <p className="py-4 text-sm text-ink-900/75">Dokumen yang Anda buka akan tercatat di sini.</p>
        ) : (
          <ul>
            {reads.slice(0, 10).map((item) => (
              <li key={item.href + item.at} className="border-b border-ink-100">
                <a href={item.href} className="flex min-h-11 flex-wrap items-center gap-x-2 gap-y-1 py-3 text-sm hover:text-pagar-700">
                  <span className="font-semibold text-pagar-800">{item.label}</span>
                  <span className="text-ink-900/70">{item.kind} · {fmtDate(item.at)}</span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-sm text-ink-900/70">Simpanan dan riwayat tersimpan lokal di browser ini.</p>
    </div>
  );
}
