import { NextRequest, NextResponse } from "next/server";
import { answerQuestion } from "@/lib/rag/pipeline";
import { questionSchema, rateLimit } from "@/lib/security/guards";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`ai:${ip}`, 30);
  if (!rl.ok) return NextResponse.json({ error: "Batas AI tercapai, coba lagi." }, { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Body JSON tidak valid." }, { status: 400 }); }
  const parsed = questionSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Pertanyaan tidak valid (3–2000 karakter)." }, { status: 400 });

  const ans = await answerQuestion(parsed.data.question, { filters: parsed.data.filters });
  return NextResponse.json(ans);
}
