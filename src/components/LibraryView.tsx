"use client";

import { useEffect, useState } from "react";
import {
  clearHistory,
  getBookmarks,
  getHistory,
  removeBookmark,
  type BookmarkItem,
  type HistoryItem,
} from "@/lib/library/store";
import { useFeedback } from "@/components/FeedbackProvider";
import { EmptyState } from "@/components/ui";

function fmtDate(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

const KIND_LABEL: Record<HistoryItem["kind"], string> = {
  search: "Pencarian",
  pasal: "Pasal",
  chat: "Tanya AI",
  regulation: "Regulasi",
  article: "Artikel",
  case: "Analisis kasus",
};

export default function LibraryView() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const { toast, confirm } = useFeedback();

  useEffect(() => {
    setBookmarks(getBookmarks());
    setHistory(getHistory());
  }, []);

  const searches = history.filter(
    (item) =>
      item.kind === "search" ||
      item.kind === "pasal" ||
      item.kind === "chat" ||
      item.kind === "case",
  );
  const reads = history.filter(
    (item) => item.kind === "regulation" || item.kind === "article",
  );

  const handleRemoveBookmark = async (bookmark: BookmarkItem) => {
    const label = bookmark.type === "pasal" ? `Pasal ${bookmark.pasal} (${bookmark.title})` : bookmark.title;
    const ok = await confirm({
      title: "Hapus simpanan?",
      description: `"${label}" akan dihapus dari daftar simpanan lokal di peramban ini.`,
      confirmLabel: "Hapus simpanan",
      cancelLabel: "Batal",
      tone: "danger",
    });
    if (!ok) return;
    setBookmarks(removeBookmark(bookmark.type, bookmark.slug, bookmark.pasal));
    toast({
      type: "info",
      title: "Simpanan dihapus",
      message: `${label} telah dihapus dari daftar simpanan.`,
    });
  };

  const handleClearHistory = async () => {
    const ok = await confirm({
      title: "Bersihkan riwayat lokal?",
      description:
        "Seluruh riwayat pencarian, pertanyaan AI, dan dokumen terakhir dibaca pada peramban ini akan dihapus. Simpanan markah tidak ikut terhapus.",
      confirmLabel: "Bersihkan riwayat",
      cancelLabel: "Batal",
      tone: "danger",
    });
    if (!ok) return;
    setHistory(clearHistory());
    toast({
      type: "success",
      title: "Riwayat dibersihkan",
      message: "Riwayat pencarian dan bacaan lokal pada peramban ini telah dihapus.",
    });
  };

  return (
    <div className="space-y-8">
      <section aria-labelledby="saved-title" className="section-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 pb-3">
          <h2 id="saved-title" className="text-lg font-semibold text-pagar-800">
            Simpanan <span className="font-normal text-ink-900/70">({bookmarks.length})</span>
          </h2>
        </div>
        {bookmarks.length === 0 ? (
          <div className="mt-4">
            <EmptyState
              title="Belum ada dokumen tersimpan"
              description="Gunakan tombol Simpan pada halaman regulasi, pasal, atau artikel untuk menyimpannya di peramban ini."
              actionLabel="Telusuri katalog regulasi"
              actionHref="/regulasi"
            />
          </div>
        ) : (
          <ul className="divide-y divide-ink-100">
            {bookmarks.map((bookmark) => (
              <li
                key={bookmark.type + ":" + bookmark.slug + ":" + (bookmark.pasal ?? "")}
                className="flex items-start justify-between gap-3 py-3.5"
              >
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
                  {bookmark.type === "pasal" ? "Pasal " + bookmark.pasal + " · " : ""}
                  {bookmark.title}
                  <span className="mt-1 block text-xs font-normal text-ink-900/70">
                    Jenis: {bookmark.type.toUpperCase()} · Disimpan {fmtDate(bookmark.at)}
                  </span>
                </a>
                <button
                  type="button"
                  onClick={() => handleRemoveBookmark(bookmark)}
                  className="inline-flex min-h-10 min-w-10 items-center justify-center rounded-md border border-ink-100 px-2.5 text-xs font-semibold text-status-danger hover:bg-pagar-50 focus-visible:outline"
                  aria-label={"Hapus bookmark " + bookmark.title}
                >
                  Hapus
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="search-history-title" className="section-card">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 pb-3">
          <h2 id="search-history-title" className="text-lg font-semibold text-pagar-800">
            Riwayat pencarian dan AI{" "}
            <span className="font-normal text-ink-900/70">({searches.length})</span>
          </h2>
          {history.length > 0 && (
            <button
              type="button"
              onClick={handleClearHistory}
              className="btn-danger min-h-9 px-3 py-1.5 text-xs"
            >
              Bersihkan riwayat
            </button>
          )}
        </div>
        {searches.length === 0 ? (
          <p className="py-4 text-sm text-ink-900/75">
            Belum ada riwayat pencarian. Jejak pencarian regulasi, pasal, dan pertanyaan AI akan tercatat otomatis di peramban ini.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {searches.map((item) => (
              <li key={item.href + item.at}>
                <a
                  href={item.href}
                  className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-sm hover:text-pagar-700"
                >
                  <span className="font-semibold text-pagar-800">{item.label}</span>
                  <span className="text-xs text-ink-900/70">
                    {KIND_LABEL[item.kind] ?? item.kind} · {fmtDate(item.at)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-labelledby="recent-reads-title" className="section-card">
        <h2
          id="recent-reads-title"
          className="border-b border-ink-100 pb-3 text-lg font-semibold text-pagar-800"
        >
          Terakhir dibaca <span className="font-normal text-ink-900/70">({reads.length})</span>
        </h2>
        {reads.length === 0 ? (
          <p className="py-4 text-sm text-ink-900/75">
            Belum ada dokumen yang dibuka pada sesi peramban ini.
          </p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {reads.slice(0, 10).map((item) => (
              <li key={item.href + item.at}>
                <a
                  href={item.href}
                  className="flex min-h-11 flex-wrap items-center justify-between gap-x-3 gap-y-1 py-3 text-sm hover:text-pagar-700"
                >
                  <span className="font-semibold text-pagar-800">{item.label}</span>
                  <span className="text-xs text-ink-900/70">
                    {KIND_LABEL[item.kind] ?? item.kind} · {fmtDate(item.at)}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        )}
      </section>

      <p className="text-xs text-ink-900/70">
        Privasi: Simpanan dan riwayat disimpan lokal di peramban (localStorage) perangkat ini dan tidak dikirim ke pihak ketiga.
      </p>
    </div>
  );
}
