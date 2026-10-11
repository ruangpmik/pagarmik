import { NextRequest, NextResponse } from "next/server";
import { analyzeCase } from "@/lib/rag/pipeline";
import { rateLimit } from "@/lib/security/guards";
import { z } from "zod";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`case:${ip}`, 20);
  if (!rl.ok) return NextResponse.json({ error: "Batas tercapai." }, { status: 429 });

  const body = await req.json().catch(() => null);
  const parsed = z.object({ kasus: z.string().min(10).max(3000) }).safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Skenario minimal 10 karakter." }, { status: 400 });

  return NextResponse.json(await analyzeCase(parsed.data.kasus));
}
