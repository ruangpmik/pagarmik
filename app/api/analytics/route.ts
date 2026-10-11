import { NextResponse } from "next/server";
import { getStore } from "@/lib/data/store";

export async function GET() {
  const store = getStore();
  const regs = store.regulations();
  const topikCount = new Map<string, number>();
  for (const r of regs) for (const t of r.topik) topikCount.set(t, (topikCount.get(t) ?? 0) + 1);

  return NextResponse.json({
    totalRegulations: regs.length,
    totalPasal: regs.reduce((a, r) => a + store.pasalsOf(r.slug).length, 0),
    totalChunks: store.allChunks().length,
    byStatus: Object.fromEntries(
      ["BERLAKU", "BERLAKU_DENGAN_CATATAN", "PERUBAHAN", "DICABUT", "BELUM_DIVERIFIKASI"].map((s) => [s, regs.filter((r) => r.status === s).length])
    ),
    topTopics: [...topikCount.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10),
    // Production: searches/day, AI questions/day, failed searches, no-source rate, citation accuracy — dari tabel SearchQuery/AiMessage.
    note: "Metrik behavioral (searches/day, no-source rate, citation accuracy) aktif saat PostgreSQL terhubung.",
  });
}
