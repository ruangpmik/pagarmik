import { NextRequest, NextResponse } from "next/server";
import { readSession } from "@/lib/auth/session";
import { getMatterStore, type MatterStatus } from "@/lib/matters/store";

const STATUS: MatterStatus[] = ["BARU", "TINDAK_LANJUT", "SELESAI"];

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const user = await readSession(req.cookies.get("pagarmik_session")?.value);
  if (!user) return NextResponse.redirect(new URL("/masuk", req.url));

  const store = getMatterStore();
  const matter = store.get(params.id);
  if (!matter) return new NextResponse("Mater tidak ditemukan.", { status: 404 });
  if (matter.ownedBy !== user.email && user.role !== "ADMIN") {
    return new NextResponse("Akses ditolak.", { status: 403 });
  }

  const form = await req.formData().catch(() => null);
  const actor = `${user.name} <${user.email}>`;

  if (String(form?.get("_action") ?? "") === "note") {
    const teks = String(form?.get("note") ?? "").trim();
    if (teks.length < 1 || teks.length > 1000) {
      return NextResponse.redirect(new URL(`/kepatuhan/${matter.id}?error=note`, req.url));
    }
    store.addNote(matter.id, teks, actor);
    return NextResponse.redirect(new URL(`/kepatuhan/${matter.id}`, req.url));
  }

  const status = String(form?.get("status") ?? "") as MatterStatus;
  if (!STATUS.includes(status)) {
    return NextResponse.redirect(new URL(`/kepatuhan/${matter.id}?error=status`, req.url));
  }
  store.updateStatus(matter.id, status, actor);
  return NextResponse.redirect(new URL(`/kepatuhan/${matter.id}`, req.url));
}