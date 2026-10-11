// Ingestion pipeline: PDF/text → cleaning → metadata → pasal split → chunking → index.
// Pasal splitter: regex "Pasal N" + fallback per paragraf. Chunking: 800 char overlap 120.

import type { Pasal, Regulation } from "@/lib/data/types";

export interface IngestedPasal extends Pasal {
  regulationSlug: string;
}

export function cleanText(raw: string): string {
  return raw
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/(\w)-\n(\w)/g, "$1$2")
    .trim();
}

const PASAL_RE = /^\s*Pasal\s+(\d+[A-Za-z]?)\s*$/gim;

export function splitPasal(fullText: string, regulationSlug: string): IngestedPasal[] {
  const text = cleanText(fullText);
  const matches = [...text.matchAll(PASAL_RE)];
  if (matches.length === 0) {
    // Fallback: pecah per ~1500 karakter sebagai "bagian"
    const parts = chunkText(text, 1500, 150);
    return parts.map((t, i) => ({
      regulationSlug,
      nomor: `bagian-${i + 1}`,
      teksAsli: t,
      isVerbatim: true,
      artiSederhana: "Bagian hasil ekstraksi otomatis — menunggu telaah dan penjelasan editor.",
      relevansiPmIK: "Menunggu telaah relevansi oleh tim verifikator.",
    }));
  }
  const out: IngestedPasal[] = [];
  for (let i = 0; i < matches.length; i++) {
    const start = (matches[i].index ?? 0) + matches[i][0].length;
    const end = i + 1 < matches.length ? (matches[i + 1].index ?? text.length) : text.length;
    const body = text.slice(start, end).trim().slice(0, 4000);
    if (body.length < 20) continue;
    out.push({
      regulationSlug,
      nomor: matches[i][1],
      teksAsli: body,
      isVerbatim: true,
      artiSederhana: "Hasil ekstraksi otomatis — menunggu penjelasan editor.",
      relevansiPmIK: "Menunggu telaah relevansi oleh tim verifikator.",
    });
  }
  return out;
}

export function chunkText(text: string, size = 800, overlap = 120): string[] {
  const chunks: string[] = [];
  let i = 0;
  while (i < text.length) {
    chunks.push(text.slice(i, i + size));
    i += size - overlap;
  }
  return chunks.filter((c) => c.trim().length > 40);
}

export function buildSlug(judul: string, nomor: string, tahun: number): string {
  return `${judul.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40)}-${nomor.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 20)}-${tahun}`;
}

export function toRegulation(input: {
  slug: string; judul: string; nomor: string; tahun: number; jenis: string;
  instansi: string; ringkasan: string; topik: string[]; sumberResmi?: string;
}): Regulation {
  return {
    slug: input.slug, judul: input.judul, nomor: input.nomor, tahun: input.tahun,
    jenis: input.jenis, instansi: input.instansi, status: "BELUM_DIVERIFIKASI",
    sumberResmi: input.sumberResmi || undefined, ringkasan: input.ringkasan, topik: input.topik,
  };
}
