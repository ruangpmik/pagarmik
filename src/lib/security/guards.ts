// Security baseline: rate limiting (in-memory, per-IP), validasi input (zod),
// sanitasi output, dan isolasi dokumen upload user.

import { z } from "zod";

const buckets = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, perMinute = 60): { ok: boolean; retryAfterSec: number } {
  // Eviksi sederhana agar map tak tumbuh tanpa batas pada proses lama.
  if (buckets.size > 5000) buckets.clear();
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || now > b.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + 60_000 });
    return { ok: true, retryAfterSec: 0 };
  }
  b.count += 1;
  if (b.count > perMinute) return { ok: false, retryAfterSec: Math.ceil((b.resetAt - now) / 1000) };
  return { ok: true, retryAfterSec: 0 };
}

export const questionSchema = z.object({
  question: z.string().min(3).max(2000),
  filters: z.object({
    jenis: z.string().optional(),
    tahun: z.coerce.number().optional(),
    status: z.string().optional(),
    topik: z.string().optional(),
  }).optional(),
});

export const ingestSchema = z.object({
  slug: z.string().min(2).max(80),
  judul: z.string().min(5).max(300),
  nomor: z.string().min(1).max(80),
  tahun: z.coerce.number().min(1945).max(2100),
  jenis: z.string().min(2).max(30),
  instansi: z.string().min(2).max(200),
  ringkasan: z.string().min(20).max(5000),
  topik: z.array(z.string()).max(12).default([]),
  sumberResmi: z.string().url().optional().or(z.literal("")),
  fullText: z.string().min(50).max(500_000),
});

/** Escape HTML untuk merender teks AI/regulasi dengan aman (XSS prevention). */
export function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/** Validasi upload PDF: tipe + ukuran + batas. Malware scanning: hook ClamAV di production (lihat docs). */
export function validateUpload(file: File): string | null {
  if (file.type !== "application/pdf") return "Hanya berkas PDF yang diterima.";
  if (file.size > 25 * 1024 * 1024) return "Ukuran maksimum 25 MB.";
  return null;
}
