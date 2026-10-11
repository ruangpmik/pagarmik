import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/rag/pipeline";
import { rateLimit } from "@/lib/security/guards";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`compare:${ip}`, 30);
  if (!rl.ok) return NextResponse.json({ error: "Batas tercapai." }, { status: 429 });

  const a = req.nextUrl.searchParams.get("a") ?? "";
  const b = req.nextUrl.searchParams.get("b") ?? "";
  if (!a || !b) return NextResponse.json({ error: "Parameter a & b (slug regulasi) wajib." }, { status: 400 });

  const ans = await answerQuestion(`Bandingkan regulasi ${a} dengan ${b} dari sisi definisi, kewajiban, hak, dan sanksi. Soroti perbedaan.`, { topK: 10 });
  return NextResponse.json({ feature: "compare", regulasiA: a, regulasiB: b, ...ans });
}
