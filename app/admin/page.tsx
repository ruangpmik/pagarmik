import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, type SessionUser } from "@/lib/auth/session";
import { getStore } from "@/lib/data/store";

export const metadata = { title: "Administrasi" };

export default async function Admin({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  const token = cookies().get("pagarmik_session")?.value;
  const user = await readSession(token);
  if (!user) redirect("/masuk?next=/admin");
  if (!["ADMIN", "EDITOR", "VERIFIER"].includes(user.role)) {
    return <p className="text-sm">Akses ditolak. Butuh peran EDITOR, VERIFIER, atau ADMIN. Masuk sebagai {user.email} ({user.role}).</p>;
  }

  return <AdminBody user={user} searchParams={searchParams} />;
}

function AdminBody({ user, searchParams }: { user: SessionUser; searchParams?: Record<string, string | undefined> }) {
  const store = getStore();
  const regs = store.regulations();
  const okSlug = searchParams?.ok;
  const verifiedSlug = searchParams?.verified;
  const verifyError = searchParams?.verifyError;
  const okPasal = searchParams?.pasal;
  const merged = searchParams?.merged === "1";
  const canIngest = user.role === "ADMIN" || user.role === "EDITOR";
  const canVerify = user.role === "ADMIN" || user.role === "VERIFIER";
  const latestVerifications = new Map(
    store.verificationRecords().map((record) => [record.regulationSlug, record] as const)
  );

  return (
    <div>
      <h1>Administrasi</h1>
      <p className="mt-1 text-sm text-ink-900/60">Masuk sebagai {user.name} ({user.role}) · {regs.length} regulasi · {store.allChunks().length} chunk terindeks</p>

      {okSlug ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm" role="status">
          <p className="font-extrabold text-emerald-800">Ingest berhasil: {okPasal} pasal terindeks{merged ? " (digabungkan ke regulasi yang sudah ada)" : ""}.</p>
          <p className="mt-1 text-emerald-900/70">
            Lihat: <a className="font-bold underline" href={`/regulasi/${okSlug}`}>{okSlug}</a> · Hasil langsung live tanpa restart.
          </p>
        </div>
      ) : null}
      {verifiedSlug ? (
        <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900" role="status">
          Status regulasi {verifiedSlug} berhasil diperbarui dan dicatat.
        </p>
      ) : null}
      {verifyError ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">
          Verifikasi gagal: {verifyError}
        </p>
      ) : null}

      <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">
        {[["Regulasi", String(regs.length)], ["Chunk terindeks", String(store.allChunks().length)],
          ["Pasal", String(regs.reduce((a, r) => a + store.pasalsOf(r.slug).length, 0))],
          ["Artikel", String(store.articles().length)]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-ink-100 bg-white p-4"><p className="text-2xl font-extrabold text-pagar-800">{v}</p><p className="text-xs text-ink-900/60">{k}</p></div>
        ))}
      </div>

      {canIngest ? <section className="mt-6 rounded-2xl border border-ink-100 bg-white p-5">
        <h2 className="font-extrabold">Unggah regulasi</h2>
        <p id="ingest-hint" className="mt-1 text-sm text-ink-900/70">
          Slug yang sudah ada akan digabungkan, bukan diduplikasi. Format PDF asli, maksimal 25 MB.
        </p>
        <p id="ingest-privacy" className="mt-1 text-sm font-medium text-amber-900">
          Unggah hanya dokumen regulasi publik. Jangan unggah rekam medis atau data pasien.
        </p>
        <form action="/api/admin/ingest" method="post" encType="multipart/form-data" className="mt-3 grid gap-2 text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <label className="grid gap-1 font-medium">Slug unik
              <input name="slug" required placeholder="mis. permenkes-6-2026" className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
            <label className="grid gap-1 font-medium">Judul regulasi
              <input name="judul" required className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
            <label className="grid gap-1 font-medium">Nomor
              <input name="nomor" required placeholder="mis. 24" className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
            <label className="grid gap-1 font-medium">Tahun
              <input name="tahun" required inputMode="numeric" className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
            <label className="grid gap-1 font-medium">Jenis regulasi
              <input name="jenis" required placeholder="Permenkes, UU, PP" className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
            <label className="grid gap-1 font-medium">Instansi penerbit
              <input name="instansi" required className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
            <label className="grid gap-1 font-medium">Topik
              <input name="topik" placeholder="pisahkan dengan koma" className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
            <label className="grid gap-1 font-medium">URL sumber resmi
              <input name="sumberResmi" type="url" className="min-h-11 rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            </label>
          </div>
          <label className="grid gap-1 font-medium">Ringkasan (minimal 20 karakter)
            <textarea name="ringkasan" required minLength={20} rows={2} className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
          </label>
          <label className="grid gap-1 font-medium">Teks lengkap (opsional)
            <textarea name="fullText" rows={4} className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
          </label>
          <label className="grid gap-1 font-medium">Berkas PDF (opsional)
            <input name="pdf" type="file" accept="application/pdf" aria-describedby="ingest-hint ingest-privacy" className="min-h-11 text-sm" />
          </label>
          <button className="min-h-11 justify-self-start rounded-lg bg-pagar-700 px-4 py-2.5 font-semibold text-white">Proses dan indeks</button>
        </form>
        <p className="mt-2 text-xs text-ink-900/50">Hasil ingest tersimpan di <code>data/custom.json</code> (demo) dan menunggu verifikasi status sebelum berlabel BERLAKU.</p>
      </section> : null}

      {canVerify ? <section className="mt-4 rounded-2xl border border-ink-100 bg-white p-5">
        <h2 className="font-extrabold">Verifikasi Status Regulasi</h2>
        <p className="text-xs text-ink-900/60">Status hanya dari metadata terverifikasi admin/sumber resmi — tidak ditentukan AI.</p>
        <ul className="mt-2 space-y-1 text-sm">
          {regs.map((r) => (
            <li key={r.slug} className="rounded-xl bg-ink-50/50 px-3 py-3">
              <p className="font-semibold">{r.judul} <span className="text-xs text-ink-900/50">({r.status})</span></p>
              {latestVerifications.has(r.slug) ? (
                <p className="mt-1 text-xs text-ink-900/60">
                  Verifikasi terakhir: {latestVerifications.get(r.slug)?.verifiedBy} · {latestVerifications.get(r.slug)?.createdAt}
                  {latestVerifications.get(r.slug)?.catatan ? ` · ${latestVerifications.get(r.slug)?.catatan}` : ""}
                </p>
              ) : null}
              <details className="mt-2">
                <summary className="cursor-pointer text-xs font-bold text-pagar-700 underline">Ubah status dan catat verifikasi</summary>
                <form action="/api/admin/verify" method="post" className="mt-2 grid gap-2">
                  <input type="hidden" name="slug" value={r.slug} />
                  <label className="grid gap-1 text-xs font-semibold">
                    Status
                    <select name="status" defaultValue={r.status} className="rounded-lg border bg-white px-2 py-2 text-sm">
                      {["BERLAKU", "BELUM_BERLAKU", "BERLAKU_DENGAN_CATATAN", "PERUBAHAN", "DICABUT", "BELUM_DIVERIFIKASI"].map((status) => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </label>
                  <label className="grid gap-1 text-xs font-semibold">
                    Catatan verifikasi
                    <textarea name="catatan" required minLength={5} maxLength={1000} rows={2} className="rounded-lg border bg-white px-2 py-2 text-sm" />
                  </label>
                  <label className="grid gap-1 text-xs font-semibold">
                    URL sumber resmi (opsional)
                    <input name="sumberUrl" type="url" className="rounded-lg border bg-white px-2 py-2 text-sm" />
                  </label>
                  <button className="justify-self-start rounded-lg bg-pagar-700 px-3 py-2 text-xs font-bold text-white">Simpan verifikasi</button>
                </form>
              </details>
            </li>
          ))}
        </ul>
      </section> : null}

      <section className="mt-4 rounded-2xl border border-ink-100 bg-white p-5 text-sm">
        <h2 className="font-extrabold">Pemantauan regulasi</h2>
        <p className="mt-1 text-ink-900/60">Pantau regulasi baru dari Database Peraturan + JDIH: jalankan <code>npm run watch</code> di server.</p>
        <h2 className="mt-4 font-extrabold">Analitik (ringkas)</h2>
        <p className="mt-1 text-ink-900/60">Lihat <a className="font-bold text-pagar-700 underline" href="/api/analytics">/api/analytics</a> (JSON) untuk: total regulasi, pasal, chunk, topik populer, dan pertanyaan tanpa sumber.</p>
      </section>
    </div>
  );
}
