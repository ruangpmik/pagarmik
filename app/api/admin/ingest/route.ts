import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { readSession, can } from "@/lib/auth/session";
import { ingestSchema, validateUpload } from "@/lib/security/guards";
import { splitPasal, toRegulation } from "@/lib/ingest/pipeline";
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

export async function POST(req: NextRequest) {
  const user = await readSession(cookies().get("pagarmik_session")?.value);
  if (!can(user, "EDITOR")) return NextResponse.json({ error: "Butuh peran EDITOR/ADMIN." }, { status: 403 });

  const form = await req.formData();
  let fullText = String(form.get("fullText") ?? "");

  const pdf = form.get("pdf");
  if (pdf instanceof File && pdf.size > 0) {
    const err = validateUpload(pdf);
    if (err) return NextResponse.json({ error: err }, { status: 400 });
    // Ekstraksi teks PDF (server-only). Catatan: hasil mentah → cleaning → pasal split.
    const { default: pdfParse } = await import("pdf-parse");
    const buf = Buffer.from(await pdf.arrayBuffer());
    try {
      const parsed = await pdfParse(buf);
      fullText = parsed.text || fullText;
    } catch {
      return NextResponse.json({ error: "Gagal mengekstrak PDF. Tempel full text manual." }, { status: 422 });
    }
  }

  const parsed = ingestSchema.safeParse({
    slug: String(form.get("slug") ?? `${Date.now()}`),
    judul: form.get("judul"), nomor: form.get("nomor"), tahun: form.get("tahun"),
    jenis: form.get("jenis"), instansi: form.get("instansi"), ringkasan: form.get("ringkasan"),
    topik: String(form.get("topik") ?? "").split(",").map((s) => s.trim()).filter(Boolean),
    sumberResmi: form.get("sumberResmi") ?? "", fullText,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: "Metadata tidak valid.", issues: parsed.error.flatten() }, { status: 400 });
  }

  const { fullText: text, ...meta } = parsed.data;
  const regulation = toRegulation(meta);
  const pasals = splitPasal(text, regulation.slug);

  // Persist demo: data/custom.json (production: Prisma create + pgvector insert)
  const dir = join(process.cwd(), "data");
  mkdirSync(dir, { recursive: true });
  const path = join(dir, "custom.json");
  const cur = existsSync(path) ? JSON.parse(readFileSync(path, "utf-8")) : { regulations: [], pasals: [] };
  cur.regulations.push(regulation);
  cur.pasals.push(...pasals);
  writeFileSync(path, JSON.stringify(cur, null, 2));

  return NextResponse.json({
    ok: true,
    slug: regulation.slug,
    pasalCount: pasals.length,
    status: regulation.status,
    note: "Tersimpan dan terindeks. Status BELUM_DIVERIFIKASI hingga verifikator meninjau.",
  });
}
