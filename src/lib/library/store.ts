// Penyimpanan lokal Bookmark & Riwayat (client-side).
// Kontrak ini 1:1 dengan model Prisma Bookmark/SearchQuery/AiConversation,
// sehingga migrasi ke PostgreSQL hanya mengganti implementasi.

export interface BookmarkItem {
  type: "regulasi" | "pasal" | "artikel";
  slug: string;
  pasal?: string;
  title: string;
  at: string;
}

export interface HistoryItem {
  kind: "search" | "pasal" | "chat" | "regulation" | "article" | "case";
  label: string;
  href: string;
  at: string;
}

const B_KEY = "pagarmik:bookmarks:v1";
const H_KEY = "pagarmik:history:v1";
const MAX_H = 30;

function hasWindow(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

function read<T>(key: string, fallback: T): T {
  if (!hasWindow()) return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  if (!hasWindow()) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch { /* penyimpanan penuh/nonaktif — abaikan */ }
}

export function getBookmarks(): BookmarkItem[] {
  return read<BookmarkItem[]>(B_KEY, []);
}

export function isBookmarked(type: BookmarkItem["type"], slug: string, pasal?: string): boolean {
  return getBookmarks().some((b) => b.type === type && b.slug === slug && (b.pasal ?? "") === (pasal ?? ""));
}

export function toggleBookmark(item: Omit<BookmarkItem, "at">): boolean {
  const list = getBookmarks();
  const idx = list.findIndex(
    (b) => b.type === item.type && b.slug === item.slug && (b.pasal ?? "") === (item.pasal ?? "")
  );
  if (idx >= 0) {
    list.splice(idx, 1);
    write(B_KEY, list);
    return false;
  }
  list.unshift({ ...item, at: new Date().toISOString() });
  write(B_KEY, list);
  return true;
}

export function removeBookmark(type: BookmarkItem["type"], slug: string, pasal?: string): BookmarkItem[] {
  const list = getBookmarks().filter(
    (b) => !(b.type === type && b.slug === slug && (b.pasal ?? "") === (pasal ?? ""))
  );
  write(B_KEY, list);
  return list;
}

export function getHistory(): HistoryItem[] {
  return read<HistoryItem[]>(H_KEY, []);
}

export function pushHistory(item: Omit<HistoryItem, "at">): void {
  const list = getHistory().filter((h) => h.href !== item.href);
  list.unshift({ ...item, at: new Date().toISOString() });
  write(H_KEY, list.slice(0, MAX_H));
}
