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
    // Magic-byte check: PDF asli diawali "%PDF". Tolak file samaran (mis. .exe ganti ekstensi).
    if (buf.length < 5 || buf.subarray(0, 4).toString("latin1") !== "%PDF") {
      return NextResponse.json({ error: "Berkas bukan PDF yang valid." }, { status: 400 });
    }
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
  // MERGE: slug yang sudah ada (seed/ingest sebelumnya) tidak diduplikasi —
  // hanya pasal baru yang ditambahkan ke regulasi tersebut.
  const { getStore } = await import("@/lib/data/store");
  const exists = getStore().regulation(regulation.slug);
  const merged = !!exists;
  if (!merged) {
    cur.regulations.push(regulation);
  } else {
    // Hindari pasal ganda bila ingest yang sama dijalankan ulang.
    const haveNomor = new Set(
      getStore().pasalsOf(regulation.slug).map((p) => p.nomor)
    );
    pasals.splice(0, pasals.length, ...pasals.filter((p) => !haveNomor.has(p.nomor)));
  }
  cur.pasals.push(...pasals);
  writeFileSync(path, JSON.stringify(cur, null, 2));

  // Lansung live: paksa store baca ulang agar hasil ingest tampil tanpa restart.
  const { resetStore } = await import("@/lib/data/store");
  resetStore();

  const wantsHtml = req.headers.get("accept")?.includes("text/html");
  if (wantsHtml) {
    // Submit form browser → kembali ke /admin dengan banner hasil.
    const url = new URL("/admin", req.url);
    url.searchParams.set("ok", regulation.slug);
    url.searchParams.set("pasal", String(pasals.length));
    if (merged) url.searchParams.set("merged", "1");
    return NextResponse.redirect(url, { status: 303 });
  }

  return NextResponse.json({
    ok: true,
    slug: regulation.slug,
    pasalCount: pasals.length,
    merged,
    status: merged ? getStore().regulation(regulation.slug)?.status : regulation.status,
    note: merged
      ? "Slug sudah ada: pasal baru digabungkan ke regulasi tersebut (tanpa duplikasi)."
      : "Tersimpan dan terindeks. Status BELUM_DIVERIFIKASI hingga verifikator meninjau.",
  });
}
