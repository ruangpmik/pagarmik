import { NextRequest, NextResponse } from "next/server";
import { sendMasukan } from "@/lib/email/send";
import { rateLimit } from "@/lib/security/guards";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`masukan:${ip}`, 5);
  if (!rl.ok) {
    return NextResponse.json(
      { error: "Terlalu sering mengirim. Coba lagi sebentar." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body tidak valid." }, { status: 400 });
  }

  const b = (body ?? {}) as Record<string, unknown>;
  const nama = String(b.nama ?? "").trim();
  const email = String(b.email ?? "").trim();
  const subjek = String(b.subjek ?? "").trim();
  const pesan = String(b.pesan ?? "").trim();

  if (!subjek || subjek.length > 200) {
    return NextResponse.json({ error: "Subjek wajib diisi (maks 200 karakter)." }, { status: 400 });
  }
  if (!pesan || pesan.length > 4000) {
    return NextResponse.json({ error: "Pesan wajib diisi (maks 4000 karakter)." }, { status: 400 });
  }
  if (email && !/^\S+@\S+\.\S+$/.test(email)) {
    return NextResponse.json({ error: "Alamat email tidak valid." }, { status: 400 });
  }

  try {
    await sendMasukan({ nama, email: email || undefined, subjek, pesan });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Gagal mengirim email. Silakan coba lagi nanti." }, { status: 500 });
  }
}