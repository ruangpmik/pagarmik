import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, can } from "@/lib/auth/session";

const ALLOWED = ["BERLAKU", "BERLAKU_DENGAN_CATATAN", "PERUBAHAN", "DICABUT", "BELUM_DIVERIFIKASI"];

// Demo: verification intent tercatat sebagai audit event (production: tulis VerificationRecord via Prisma).
export async function GET(req: NextRequest) {
  const user = await readSession(cookies().get("pagarmik_session")?.value);
  if (!user || !can(user, "VERIFIER")) return NextResponse.json({ error: "Butuh peran VERIFIER/ADMIN." }, { status: 403 });

  const slug = req.nextUrl.searchParams.get("slug") ?? "";
  const status = req.nextUrl.searchParams.get("status") ?? "";
  if (!slug || !ALLOWED.includes(status)) return NextResponse.json({ error: "Parameter tidak valid." }, { status: 400 });

  // TODO production: prisma.verificationRecord.create + regulation.update
  return NextResponse.json({
    ok: true,
    verification: { regulationSlug: slug, status, verifiedBy: user.email, at: new Date().toISOString() },
    note: "Tercatat. Di production, status ditulis ke DB + audit log dan tampil di halaman regulasi.",
  });
}
