import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getMatterStore, type MatterPriority, type MatterTipe } from "@/lib/matters/store";

const TIPE: MatterTipe[] = ["RMIK", "PDP", "RME", "KEBIJAKAN_INTERNAL", "LAIN"];
const PRIORITAS: MatterPriority[] = ["TINGGI", "SEDANG", "RENDAH"];

export async function POST(req: NextRequest) {
  const user = await readSession(req.cookies.get("pagarmik_session")?.value);
  if (!user) return NextResponse.redirect(new URL("/masuk?next=/kepatuhan/intake", req.url));

  const fail = () => NextResponse.redirect(new URL("/kepatuhan/intake?error=validation", req.url));

  const form = await req.formData().catch(() => null);
  const judul = String(form?.get("judul") ?? "").trim();
  const deskripsi = String(form?.get("deskripsi") ?? "").trim();
  const tipe = String(form?.get("tipe") ?? "") as MatterTipe;
  const prioritas = String(form?.get("prioritas") ?? "") as MatterPriority;
  const tenggat = String(form?.get("tenggat") ?? "").trim();

  if (judul.length < 3 || judul.length > 200) return fail();
  if (deskripsi.length < 10 || deskripsi.length > 4000) return fail();
  if (!TIPE.includes(tipe)) return fail();
  if (!PRIORITAS.includes(prioritas)) return fail();
  if (tenggat && !/^\d{4}-\d{2}-\d{2}$/.test(tenggat)) return fail();

  const matter = getMatterStore().create({
    judul,
    deskripsi,
    tipe,
    prioritas,
    tenggat: tenggat || undefined,
    ownedBy: user.email,
    ownerName: user.name,
  });

  return NextResponse.redirect(new URL(`/kepatuhan/${matter.id}`, req.url));
}