import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/rag/pipeline";
import { rateLimit } from "@/lib/security/guards";

export async function GET(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`explain:${ip}`, 30);
  if (!rl.ok) return NextResponse.json({ error: "Batas tercapai." }, { status: 429 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const pasal = req.nextUrl.searchParams.get("pasal") ?? "";
  if (!slug || !pasal) return NextResponse.json({ error: "Parameter slug & pasal wajib." }, { status: 400 });

  const ans = await answerQuestion(`Jelaskan Pasal ${pasal} pada regulasi ${slug}: teks, arti sederhana, relevansi PMIK, risiko kepatuhan`, { topK: 5 });
  return NextResponse.json({ feature: "explain-pasal", ...ans });
}
