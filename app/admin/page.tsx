import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, can, type SessionUser } from "@/lib/auth/session";
import { getStore } from "@/lib/data/store";

export const metadata = { title: "Admin Dashboard" };

export default async function Admin({ searchParams }: { searchParams?: Record<string, string | undefined> }) {
  const token = cookies().get("pagarmik_session")?.value;
  const user = await readSession(token);
  if (!user) redirect("/masuk?next=/admin");
  if (!can(user, "EDITOR")) {
    return <p className="text-sm">Akses ditolak. Butuh peran EDITOR/ADMIN/VERIFIER. Masuk sebagai {user.email} ({user.role}).</p>;
  }

  return <AdminBody user={user} searchParams={searchParams} />;
}

function AdminBody({ user, searchParams }: { user: SessionUser; searchParams?: Record<string, string | undefined> }) {
  const store = getStore();
  const regs = store.regulations();
  const okSlug = searchParams?.ok;
  const okPasal = searchParams?.pasal;
  const merged = searchParams?.merged === "1";

  return (
    <div>
      <h1 className="text-2xl font-extrabold">Admin Dashboard</h1>
      <p className="mt-1 text-sm text-ink-900/60">Masuk sebagai {user.name} ({user.role}) · {regs.length} regulasi · {store.allChunks().length} chunk terindeks</p>

      {okSlug ? (
        <div className="mt-4 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm" role="status">
          <p className="font-extrabold text-emerald-800">✅ Ingest berhasil: {okPasal} pasal terindeks{merged ? " (digabungkan ke regulasi yang sudah ada)" : ""}.</p>
          <p className="mt-1 text-emerald-900/70">
            Lihat: <a className="font-bold underline" href={`/regulasi/${okSlug}`}>{okSlug}</a> · Hasil langsung live tanpa restart.
          </p>
        </div>
      ) : null}

      <div className="mt-4 grid gap-2 text-sm md:grid-cols-4">
        {[["Regulasi", String(regs.length)], ["Chunk terindeks", String(store.allChunks().length)],
          ["Pasal", String(regs.reduce((a, r) => a + store.pasalsOf(r.slug).length, 0))],
          ["Artikel", String(store.articles().length)]].map(([k, v]) => (
          <div key={k} className="rounded-2xl border border-ink-100 bg-white p-4"><p className="text-2xl font-extrabold text-pagar-800">{v}</p><p className="text-xs text-ink-900/60">{k}</p></div>
        ))}
      </div>

      <section className="mt-6 rounded-2xl border border-ink-100 bg-white p-5">
        <h2 className="font-extrabold">Upload Regulasi (PDF → ekstraksi → pasal → chunking → indexing)</h2>
        <p className="mt-1 text-xs text-ink-900/60">Slug yang sudah ada akan <strong>digabungkan</strong> (merge), bukan diduplikasi. Hanya PDF asli (%PDF, maks 25 MB).</p>
        <form action="/api/admin/ingest" method="post" encType="multipart/form-data" className="mt-3 grid gap-2 text-sm">
          <div className="grid gap-2 md:grid-cols-2">
            <input name="slug" required placeholder="Slug unik (mis. permenkes-6-2026)" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            <input name="judul" required placeholder="Judul regulasi" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            <input name="nomor" required placeholder="Nomor (mis. 24)" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            <input name="tahun" required inputMode="numeric" placeholder="Tahun" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            <input name="jenis" required placeholder="Jenis (Permenkes/UU/PP…)" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            <input name="instansi" required placeholder="Instansi penerbit" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            <input name="topik" placeholder="Topik, pisah koma (privasi,rme)" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
            <input name="sumberResmi" placeholder="URL sumber resmi (opsional)" className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
          </div>
          <textarea name="ringkasan" required placeholder="Ringkasan (min. 20 karakter)" rows={2} className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
          <textarea name="fullText" placeholder="ATAU tempel full text bila tanpa PDF…" rows={4} className="rounded-xl border border-ink-100 bg-white px-3 py-2 text-ink-900" />
          <input name="pdf" type="file" accept="application/pdf" className="text-sm" />
          <button className="rounded-xl bg-pagar-700 px-4 py-2.5 font-bold text-white">Proses & Index</button>
        </form>
        <p className="mt-2 text-xs text-ink-900/50">Hasil ingest tersimpan di <code>data/custom.json</code> (demo) dan menunggu verifikasi status sebelum berlabel BERLAKU.</p>
      </section>

      <section className="mt-4 rounded-2xl border border-ink-100 bg-white p-5">
        <h2 className="font-extrabold">Verifikasi Status Regulasi</h2>
        <p className="text-xs text-ink-900/60">Status hanya dari metadata terverifikasi admin/sumber resmi — tidak ditentukan AI.</p>
        <ul className="mt-2 space-y-1 text-sm">
          {regs.map((r) => (
            <li key={r.slug} className="flex items-center justify-between gap-2 rounded-xl bg-ink-50/50 px-3 py-2">
              <span className="font-semibold">{r.judul} <span className="text-xs text-ink-900/50">({r.status})</span></span>
              <a className="text-xs font-bold text-pagar-700 underline" href={`/api/admin/verify?slug=${r.slug}&status=BERLAKU`}>Tandai BERLAKU</a>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-4 rounded-2xl border border-ink-100 bg-white p-5 text-sm">
        <h2 className="font-extrabold">Regulation Watch</h2>
        <p className="mt-1 text-ink-900/60">Pantau regulasi baru dari Database Peraturan + JDIH: jalankan <code>npm run watch</code> di server.</p>
        <h2 className="mt-4 font-extrabold">Analytics (ringkas)</h2>
        <p className="mt-1 text-ink-900/60">Lihat <a className="font-bold text-pagar-700 underline" href="/api/analytics">/api/analytics</a> (JSON) untuk: total regulasi, pasal, chunk, topik populer, dan pertanyaan tanpa sumber.</p>
      </section>
    </div>
  );
}
