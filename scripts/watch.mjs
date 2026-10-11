// Regulation Watch: pemantau pembaruan regulasi nasional + JDIH Kemenkes.
// Membandingkan daftar terbaru Database Peraturan (server-rendered) dan JDIH
// dengan korpus PAGARMIK, lalu melaporkan kandidat MIK yang belum terindeks.
// Jalankan: npm run watch (ideal: cron harian di production)
// Catatan: hanya mendeteksi kandidat; kurasi + verifikasi tetap oleh editor.

import { readFileSync } from "fs";
import { join } from "path";

const SOURCES = [
  { url: "https://peraturan.go.id/permen", base: "https://peraturan.go.id" },
  { url: "https://peraturan.go.id/pp", base: "https://peraturan.go.id" },
  { url: "https://peraturan.go.id/perban", base: "https://peraturan.go.id" },
  { url: "https://peraturan.go.id/uu", base: "https://peraturan.go.id" },
  { url: "https://jdih.kemkes.go.id/", base: "https://jdih.kemkes.go.id" },
];

const KEYWORDS = [
  "rumah sakit", "rekam medis", "informasi kesehatan", "data kesehatan",
  "telemedicine", "kesehatan digital", "satusehat", "simrs", "rme",
  "kearsipan", "retensi", "perlindungan data", "pribadi", "tenaga kesehatan",
  "perekam medis", "perangkat lunak", "alat kesehatan", "kolegium", "konsil",
  "sistem elektronik", "transaksi elektronik", "keterbukaan informasi",
  "puskesmas", "klinik", "fasilitas pelayanan kesehatan", "nakes",
];

async function main() {
  const seed = JSON.parse(readFileSync(join(process.cwd(), "prisma", "seed.json"), "utf-8"));
  const known = seed.regulations.map((r) => r.judul.toLowerCase());
  const isKnown = (low) => known.some((t) => low.includes(t.slice(0, 25)) || t.includes(low.slice(0, 30)));

  const found = new Map();
  for (const s of SOURCES) {
    try {
      const html = await (await fetch(s.url)).text();
      const links = [...html.matchAll(/<a[^>]*href="((?:\/id\/|\/documents\/)[A-Za-z0-9+_.-]+)"[^>]*>([^<]{15,200})<\/a>/gi)];
      for (const m of links) {
        const title = m[2].replace(/\s+/g, " ").trim();
        const key = s.base + m[1];
        if (!found.has(key) && title.length > 15) found.set(key, { title, from: s.url });
      }
    } catch (e) {
      console.log(`(lewati ${s.url}: ${e.message})`);
    }
  }

  console.log(`Terpantau ${found.size} dokumen; korpus PAGARMIK: ${seed.regulations.length} regulasi.\n`);
  let n = 0;
  for (const [url, { title, from }] of found) {
    const low = title.toLowerCase();
    if (KEYWORDS.some((k) => low.includes(k)) && !isKnown(low)) {
      n++;
      console.log(`[KANDIDAT] ${title}\n           ${url}\n           (sumber daftar: ${from})\n`);
    }
  }
  if (!n) console.log("Tidak ada kandidat MIK baru yang terdeteksi. Korpus mutakhir.");
  console.log(`Selesai. Kandidat: ${n}. Langkah lanjut: verifikasi + ingest via /admin.`);
}

main().catch((e) => { console.error("Watch gagal:", e.message); process.exit(1); });
