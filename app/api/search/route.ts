import { NextRequest, NextResponse } from "next/server";
import { hybridSearch } from "@/lib/search/hybrid";
import { getStore } from "@/lib/data/store";
import { rateLimit } from "@/lib/security/guards";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`search:${ip}`, Number(process.env.RATE_LIMIT_PER_MINUTE ?? 60));
  if (!rl.ok) return NextResponse.json({ error: "Terlalu banyak permintaan." }, { status: 429 });

  const q = req.nextUrl.searchParams.get("q") ?? "";
  if (q.trim().length < 2) return NextResponse.json({ error: "Query minimal 2 karakter." }, { status: 400 });

  const store = getStore();
  const rawTahun = req.nextUrl.searchParams.get("tahun");
  const tahunNum = rawTahun ? Number(rawTahun) : undefined;
  const filters = {
    jenis: req.nextUrl.searchParams.get("jenis") ?? undefined,
    tahun: tahunNum !== undefined && !Number.isNaN(tahunNum) ? tahunNum : undefined,
    status: req.nextUrl.searchParams.get("status") ?? undefined,
    topik: req.nextUrl.searchParams.get("topik") ?? undefined,
  };
  const hits = hybridSearch(q, store.allChunks(), { filters, topK: 20, regulationMeta: store.regulationMeta() });
  return NextResponse.json({
    query: q,
    hits: hits.map((h) => ({
      chunkId: h.chunk.id, regulationSlug: h.chunk.regulationSlug, regulasiJudul: h.chunk.regulasiJudul,
      pasalNomor: h.chunk.pasalNomor, kutipan: h.chunk.teks.slice(0, 300), trustLevel: h.chunk.trustLevel,
      score: Number(h.score.toFixed(3)), breakdown: h.breakdown,
    })),
  });
}
