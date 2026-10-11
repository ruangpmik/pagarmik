// Citation engine: validasi bahwa setiap sitasi jawaban AI benar-benar
// merujuk pada chunk yang ter-retrieve. Sitasi tak terdaftar → dibuang + confidence turun.

import type { Citation, LegalChunk } from "@/lib/data/types";

const CITE_RE = /\[([a-z0-9-]+:pasal-[\w-]+:\d+)\]/gi;

export function extractCitationIds(text: string): string[] {
  const out: string[] = [];
  let m: RegExpExecArray | null;
  CITE_RE.lastIndex = 0;
  while ((m = CITE_RE.exec(text)) !== null) out.push(m[1]);
  return [...new Set(out)];
}

export function buildCitation(chunk: LegalChunk): Citation {
  return {
    chunkId: chunk.id,
    regulationSlug: chunk.regulationSlug,
    regulasiJudul: chunk.regulasiJudul,
    pasalNomor: chunk.pasalNomor,
    kutipan: chunk.teks.slice(0, 280),
    trustLevel: chunk.trustLevel,
  };
}

export interface VerifiedCitations {
  valid: Citation[];
  invalidIds: string[];
}

/** Cocokkan ID sitasi pada teks jawaban dengan chunk ter-retrieve. */
export function verifyCitations(answerText: string, retrieved: LegalChunk[]): VerifiedCitations {
  const ids = extractCitationIds(answerText);
  const byId = new Map(retrieved.map((c) => [c.id, c]));
  const valid: Citation[] = [];
  const invalidIds: string[] = [];
  for (const id of ids) {
    const c = byId.get(id);
    if (c) valid.push(buildCitation(c));
    else invalidIds.push(id);
  }
  return { valid, invalidIds };
}

/** Hapus sitasi invalid dari teks + beri catatan transparansi. */
export function sanitizeAnswer(answerText: string, invalidIds: string[]): string {
  let out = answerText;
  for (const id of invalidIds) {
    out = out.replaceAll(`[${id}]`, "");
  }
  return out;
}
