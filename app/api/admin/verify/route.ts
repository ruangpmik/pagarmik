import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { canVerifyRegulationStatus, readSession } from "@/lib/auth/session";
import { z } from "zod";
import { getStore, resetStore } from "@/lib/data/store";
import { getVerificationStore } from "@/lib/data/verification-store";
import { isSameOrigin } from "@/lib/security/guards";

const verificationSchema = z.object({
  slug: z.string().min(2).max(80),
  status: z.enum(["BERLAKU", "BELUM_BERLAKU", "BERLAKU_DENGAN_CATATAN", "PERUBAHAN", "DICABUT", "BELUM_DIVERIFIKASI"]),
  catatan: z.string().trim().min(5).max(1000),
  sumberUrl: z.string().url().optional().or(z.literal("")),
});

function errorResponse(req: NextRequest, message: string, status: number) {
  if (req.headers.get("accept")?.includes("text/html")) {
    const url = new URL("/admin", req.url);
    url.searchParams.set("verifyError", message);
    return NextResponse.redirect(url, { status: 303 });
  }
  return NextResponse.json({ error: message }, { status });
}

async function verifier() {
  const user = await readSession(cookies().get("pagarmik_session")?.value);
  return canVerifyRegulationStatus(user) ? user : null;
}

// Read-only endpoint for the authorized verification audit history.
export async function GET(req: NextRequest) {
  const user = await verifier();
  if (!user) return errorResponse(req, "Butuh peran VERIFIER/ADMIN.", 403);

  const slug = req.nextUrl.searchParams.get("slug") ?? undefined;
  return NextResponse.json({ records: getVerificationStore().records(slug) });
}

export async function POST(req: NextRequest) {
  const user = await verifier();
  if (!user) return errorResponse(req, "Butuh peran VERIFIER/ADMIN.", 403);

  if (!isSameOrigin(req.headers.get("origin"), req.nextUrl.origin)) {
    return errorResponse(req, "Origin permintaan tidak valid.", 403);
  }

  let body: unknown;
  try {
    body = req.headers.get("content-type")?.includes("application/json")
      ? await req.json()
      : Object.fromEntries(await req.formData());
  } catch {
    return errorResponse(req, "Body permintaan tidak valid.", 400);
  }

  const parsed = verificationSchema.safeParse(body);
  if (!parsed.success) {
    return errorResponse(req, "Data verifikasi tidak valid.", 400);
  }
  const regulation = getStore().regulation(parsed.data.slug);
  if (!regulation) return errorResponse(req, "Regulasi tidak ditemukan.", 404);

  try {
    const record = getVerificationStore().record({
      regulationSlug: regulation.slug,
      status: parsed.data.status,
      catatan: parsed.data.catatan,
      sumberUrl: parsed.data.sumberUrl || undefined,
      verifiedBy: user.email,
    });
    resetStore();

    if (req.headers.get("accept")?.includes("text/html")) {
      const url = new URL("/admin", req.url);
      url.searchParams.set("verified", regulation.slug);
      return NextResponse.redirect(url, { status: 303 });
    }
    return NextResponse.json({ ok: true, verification: record });
  } catch {
    return errorResponse(req, "Verifikasi gagal disimpan.", 500);
  }
}
