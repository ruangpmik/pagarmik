// Hybrid Search: BM25 (keyword) + TF-IDF cosine (semantik ringan) + metadata filter + rerank.
// Berjalan di atas LegalChunk[] — dipakai JsonFileDb (demo) maupun hasil query Prisma (production).
// Skor rerank: semantic 0.45, keyword 0.30, authority 0.10, recency 0.05, trust 0.10.

import { tokenize, expandQuery, detectTopics } from "@/lib/nlp/tokenize";
import type { LegalChunk } from "@/lib/data/types";

export interface SearchFilters {
  jenis?: string;
  tahun?: number;
  status?: string;
  topik?: string;
  trustLevel?: string;
}

export interface ScoredChunk {
  chunk: LegalChunk;
  score: number;
  breakdown: { keyword: number; semantic: number; authority: number; recency: number; trust: number };
}

const AUTHORITY: Record<string, number> = {
  "UU": 1.0, "PP": 0.9, "Perpres": 0.85, "Permenkes": 0.8, "Permenkominfo": 0.8,
  "Perka ANRI": 0.7, "PeranRI": 0.7, "Putusan MK": 0.75, "Putusan MA": 0.75,
  "Kepmenkes": 0.7, "SE": 0.5, "Pedoman": 0.55, "Standar": 0.55,
};
const TRUST_W: Record<string, number> = {
  L1_PRIMER: 1.0, L2_REPOSITORI_RESMI: 0.85, L3_PUTUSAN_INSTITUSI: 0.75, L4_AKADEMIK: 0.55, L5_KOMENTAR_SEKUNDER: 0.35,
};

function authorityOf(judul: string): number {
  for (const [k, v] of Object.entries(AUTHORITY)) {
    if (judul.includes(k) || judul.startsWith("Undang")) return k === "UU" || judul.startsWith("Undang") ? 1.0 : v;
  }
  return 0.6;
}

function tf(tokens: string[]): Map<string, number> {
  const m = new Map<string, number>();
  for (const t of tokens) m.set(t, (m.get(t) ?? 0) + 1);
  const len = tokens.length || 1;
  for (const [k, v] of m) m.set(k, v / len);
  return m;
}

function cosine(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, na = 0, nb = 0;
  for (const [k, v] of a) {
    na += v * v;
    const w = b.get(k);
    if (w) dot += v * w;
  }
  for (const [, v] of b) nb += v * v;
  if (!na || !nb) return 0;
  return dot / (Math.sqrt(na) * Math.sqrt(nb));
}

function bm25(queryTokens: string[], docTokens: string[], avgLen: number, docCount: number, docFreq: Map<string, number>): number {
  const k1 = 1.5, b = 0.75;
  const dl = docTokens.length || 1;
  let s = 0;
  const counts = new Map<string, number>();
  for (const t of docTokens) counts.set(t, (counts.get(t) ?? 0) + 1);
  for (const t of new Set(queryTokens)) {
    const f = counts.get(t) ?? 0;
    if (!f) continue;
    const df = docFreq.get(t) ?? 1;
    const idf = Math.log(1 + (docCount - df + 0.5) / (df + 0.5));
    s += idf * ((f * (k1 + 1)) / (f + k1 * (1 - b + (b * dl) / avgLen)));
  }
  return s;
}

export function hybridSearch(
  query: string,
  chunks: LegalChunk[],
  opts: { filters?: SearchFilters; topK?: number; regulationMeta?: Map<string, { jenis: string; status: string; tahun: number }> } = {}
): ScoredChunk[] {
  const { filters = {}, topK = 8, regulationMeta } = opts;
  const expanded = expandQuery(query);
  const qTokens = tokenize(expanded);
  if (!qTokens.length) return [];

  // Metadata filtering
  let pool = chunks;
  if (regulationMeta) {
    pool = pool.filter((c) => {
      const meta = regulationMeta.get(c.regulationSlug);
      if (!meta) return true;
      if (filters.jenis && meta.jenis !== filters.jenis) return false;
      if (filters.tahun && meta.tahun !== filters.tahun) return false;
      if (filters.status && meta.status !== filters.status) return false;
      return true;
    });
  }
  if (filters.topik) pool = pool.filter((c) => c.topik.includes(filters.topik!));
  if (filters.trustLevel) pool = pool.filter((c) => c.trustLevel === filters.trustLevel);
  if (!pool.length) return [];

  const qTopics = detectTopics(query);
  const docTokensList = pool.map((c) => tokenize(c.teks + " " + c.regulasiJudul + " " + (c.pasalNomor ?? "") + " " + c.topik.join(" ")));
  const avgLen = docTokensList.reduce((a, d) => a + d.length, 0) / docTokensList.length || 1;
  const docFreq = new Map<string, number>();
  for (const d of docTokensList) for (const t of new Set(d)) docFreq.set(t, (docFreq.get(t) ?? 0) + 1);

  // TF-IDF cosine: token langka yang dibagikan (mis. "audit", "trail") berbobot lebih
  // tinggi daripada token umum ("rekam", "medis") — presisi ala analis hukum.
  const N = pool.length;
  const idf = (t: string) => {
    const df = docFreq.get(t) ?? 1;
    return Math.log(1 + (N - df + 0.5) / (df + 0.5));
  };
  const tfidf = (tokens: string[]): Map<string, number> => {
    const v = tf(tokens);
    for (const [k, f] of v) v.set(k, f * idf(k));
    return v;
  };
  const qVec = tfidf(qTokens);
  const maxYear = Math.max(...pool.map((c) => c.tahun), 2000);
  const scored: ScoredChunk[] = pool.map((chunk, i) => {
    const dt = docTokensList[i];
    const rawBm = bm25(qTokens, dt, avgLen, pool.length, docFreq);
    const keyword = Math.min(1, rawBm / 5);
    const semantic = cosine(qVec, tfidf(dt));
    // Boost topik yang terdeteksi
    const topicBoost = qTopics.length && qTopics.some((t) => chunk.topik.includes(t)) ? 0.15 : 0;
    const authority = authorityOf(chunk.regulasiJudul) * (chunk.authority || 1);
    const recency = 0.5 + 0.5 * ((chunk.tahun - 2000) / Math.max(1, maxYear - 2000));
    const trust = TRUST_W[chunk.trustLevel] ?? 0.5;
    const score =
      0.45 * Math.min(1, semantic + topicBoost) +
      0.30 * keyword +
      0.10 * authority +
      0.05 * recency +
      0.10 * trust;
    return { chunk, score, breakdown: { keyword, semantic, authority, recency, trust } };
  });

  return scored
    .filter((s) => (s.breakdown.keyword > 0 || s.breakdown.semantic > 0) && s.score > 0.05)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
