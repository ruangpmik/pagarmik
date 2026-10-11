// Data store: kontrak tunggal dengan dua implementasi.
// - JsonStore: membaca prisma/seed.json (+ hasil ingest admin di data/custom.json). Mode demo tanpa DB.
// - Production: ganti getStore() dengan PrismaStore (pgvector) tanpa mengubah pemanggil.

import { readFileSync, existsSync } from "fs";
import { join } from "path";
import type { LegalChunk, Pasal, Regulation, Topic, KnowledgeArticle, Relation, TrustLevel } from "@/lib/data/types";

interface SeedFile {
  regulations: Regulation[];
  pasals: Pasal[];
  topics: Topic[];
  relations: Relation[];
  articles: KnowledgeArticle[];
}

const AUTH_W: Record<string, number> = { UU: 1, PP: 0.9, Perpres: 0.85, Permenkes: 0.8, Kepmenkes: 0.7 };

function loadSeed(): SeedFile {
  const path = join(process.cwd(), "prisma", "seed.json");
  const raw = JSON.parse(readFileSync(path, "utf-8"));
  // Merge hasil ingest admin (opsional)
  const customPath = join(process.cwd(), "data", "custom.json");
  if (existsSync(customPath)) {
    try {
      const c = JSON.parse(readFileSync(customPath, "utf-8"));
      raw.regulations.push(...(c.regulations ?? []));
      raw.pasals.push(...(c.pasals ?? []));
    } catch { /* abaikan file korup */ }
  }
  return raw;
}

function chunkId(slug: string, pasal: string, idx: number): string {
  const safe = pasal.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 24) || "umum";
  return `${slug}:pasal-${safe}:${idx}`;
}

export class JsonStore {
  private seed: SeedFile;
  private chunks: LegalChunk[];

  constructor() {
    this.seed = loadSeed();
    this.chunks = [];
    const regBySlug = new Map(this.seed.regulations.map((r) => [r.slug, r]));
    this.seed.pasals.forEach((p, i) => {
      const reg = regBySlug.get(p.regulationSlug);
      if (!reg) return;
      const trust = reg.trustLevel ?? ("L1_PRIMER" as TrustLevel);
      const teks = `${p.teksAsli}\n\nPenjelasan: ${p.artiSederhana}\nRelevansi PMIK: ${p.relevansiPmIK}${p.risikoKepatuhan ? `\nRisiko kepatuhan: ${p.risikoKepatuhan}` : ""}`;
      this.chunks.push({
        id: chunkId(p.regulationSlug, p.nomor, 0),
        regulationSlug: p.regulationSlug,
        regulasiJudul: reg.judul,
        pasalNomor: p.nomor,
        teks,
        topik: reg.topik,
        trustLevel: trust,
        authority: AUTH_W[reg.jenis] ?? 0.6,
        tahun: reg.tahun,
      });
      void i;
    });
    // Chunk ringkasan tiap regulasi (untuk pertanyaan umum "apa itu ...")
    for (const r of this.seed.regulations) {
      this.chunks.push({
        id: `${r.slug}:pasal-umum:0`,
        regulationSlug: r.slug,
        regulasiJudul: r.judul,
        teks: `${r.judul}. Status: ${r.status}. Ringkasan: ${r.ringkasan}`,
        topik: r.topik,
        trustLevel: r.trustLevel ?? "L2_REPOSITORI_RESMI",
        authority: AUTH_W[r.jenis] ?? 0.6,
        tahun: r.tahun,
      });
    }
  }

  regulations(): Regulation[] {
    return [...this.seed.regulations].sort((a, b) => b.tahun - a.tahun);
  }
  regulation(slug: string): Regulation | undefined {
    return this.seed.regulations.find((r) => r.slug === slug);
  }
  pasalsOf(slug: string): Pasal[] {
    return this.seed.pasals.filter((p) => p.regulationSlug === slug);
  }
  topics(): Topic[] { return this.seed.topics; }
  articles(): KnowledgeArticle[] { return this.seed.articles; }
  article(slug: string): KnowledgeArticle | undefined {
    return this.seed.articles.find((a) => a.slug === slug);
  }
  relations(): Relation[] { return this.seed.relations; }
  relationsOf(slug: string): Relation[] {
    return this.seed.relations.filter((r) => r.from === slug || r.to === slug);
  }
  allChunks(): LegalChunk[] { return this.chunks; }
  /** Label singkat untuk sitasi, mis. "Permenkes 24/2022", "UU 17/2023". */
  shortRef(slug: string): string {
    const r = this.regulation(slug);
    if (!r) return slug;
    // Nomor seperti "269/MENKES/PER/III/2008" sudah memuat tahun → jangan digandakan.
    const hasYear = /\d{4}/.test(r.nomor);
    return hasYear ? `${r.jenis} ${r.nomor}` : `${r.jenis} ${r.nomor}/${r.tahun}`;
  }
  regulationMeta(): Map<string, { jenis: string; status: string; tahun: number }> {
    return new Map(this.seed.regulations.map((r) => [r.slug, { jenis: r.jenis, status: r.status, tahun: r.tahun }]));
  }
}

let instance: JsonStore | null = null;
export function getStore(): JsonStore {
  if (!instance) instance = new JsonStore();
  return instance;
}
