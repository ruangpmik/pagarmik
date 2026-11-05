import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession, type SessionUser } from "@/lib/auth/session";
import { getStore } from "@/lib/data/store";
import { Alert, Breadcrumb, StatusBadge } from "@/components/ui";
import { AdminIngestForm, AdminVerifyForm } from "@/components/AdminForms";

export const metadata = { title: "Administrasi" };

export default async function Admin({
  searchParams,
}: {
  searchParams?: Record<string, string | undefined>;
}) {
  const token = cookies().get("pagarmik_session")?.value;
  const user = await readSession(token);
  if (!user) redirect("/masuk?next=/admin");
  if (!["ADMIN", "EDITOR", "VERIFIER"].includes(user.role)) {
    return (
      <div className="mx-auto max-w-3xl">
        <header className="page-header">
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Administrasi" }]} />
          <h1>Administrasi</h1>
        </header>
        <Alert
          variant="error"
          title="Akses ditolak (Izin tidak mencukupi)"
          action={
            <a href="/profil" className="btn-secondary">
              Kembali ke profil
            </a>
          }
        >
          Halaman ini memerlukan peran <strong>EDITOR</strong>, <strong>VERIFIER</strong>, atau{" "}
          <strong>ADMIN</strong>. Anda saat ini masuk sebagai {user.email} ({user.role}).
        </Alert>
      </div>
    );
  }

  return <AdminBody user={user} searchParams={searchParams} />;
}

function AdminBody({
  user,
  searchParams,
}: {
  user: SessionUser;
  searchParams?: Record<string, string | undefined>;
}) {
  const store = getStore();
  const regs = store.regulations();
  const okSlug = searchParams?.ok;
  const ingestError = searchParams?.ingestError;
  const verifiedSlug = searchParams?.verified;
  const verifyError = searchParams?.verifyError;
  const okPasal = searchParams?.pasal;
  const merged = searchParams?.merged === "1";
  const canIngest = user.role === "ADMIN" || user.role === "EDITOR";
  const canVerify = user.role === "ADMIN" || user.role === "VERIFIER";
  const latestVerifications = new Map(
    store.verificationRecords().map((record) => [record.regulationSlug, record] as const),
  );

  const metrics = [
    ["Regulasi", String(regs.length)],
    ["Chunk terindeks", String(store.allChunks().length)],
    ["Pasal", String(regs.reduce((a, r) => a + store.pasalsOf(r.slug).length, 0))],
    ["Artikel", String(store.articles().length)],
  ] as const;

  return (
    <div className="space-y-6">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Administrasi" }]} />
        <h1>Administrasi</h1>
        <p className="mt-2 text-sm text-ink-900/75">
          Masuk sebagai <strong>{user.name}</strong> ({user.role}) · {regs.length} regulasi ·{" "}
          {store.allChunks().length} chunk terindeks
        </p>
      </header>

      {okSlug ? (
        <Alert variant="success" title="Ingest regulasi berhasil">
          <p>
            {okPasal} pasal terindeks
            {merged ? " (digabungkan ke regulasi yang sudah ada tanpa duplikasi)" : ""}.
          </p>
          <p className="mt-1">
            Lihat dokumen:{" "}
            <a className="font-bold underline" href={`/regulasi/${okSlug}`}>
              {okSlug}
            </a>{" "}
            · Perubahan langsung aktif tanpa perlu memulai ulang server.
          </p>
        </Alert>
      ) : null}

      {ingestError ? (
        <Alert variant="error" title="Ingest regulasi gagal">
          {ingestError}
        </Alert>
      ) : null}

      {verifiedSlug ? (
        <Alert variant="success" title="Verifikasi status tercatat">
          Status keberlakuan regulasi{" "}
          <a className="font-bold underline" href={`/regulasi/${verifiedSlug}`}>
            {verifiedSlug}
          </a>{" "}
          berhasil diperbarui dan disimpan ke log audit verifikasi.
        </Alert>
      ) : null}

      {verifyError ? (
        <Alert variant="error" title="Verifikasi gagal disimpan">
          {verifyError}
        </Alert>
      ) : null}

      <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
        {metrics.map(([k, v]) => (
          <div key={k} className="section-card">
            <dt className="text-xs font-medium text-ink-900/65">{k}</dt>
            <dd className="mt-1 text-2xl font-bold tabular-nums text-pagar-800">{v}</dd>
          </div>
        ))}
      </dl>

      {canIngest ? (
        <section className="section-card" aria-labelledby="ingest-title">
          <h2 id="ingest-title" className="text-lg font-semibold text-pagar-800">
            Unggah dan Indeks Regulasi
          </h2>
          <p id="ingest-hint" className="mt-1 text-sm text-ink-900/75">
            Slug yang sudah ada akan digabungkan, bukan diduplikasi. Format PDF asli, maksimal 25 MB.
          </p>
          <p
            id="ingest-privacy"
            className="mt-1.5 rounded-lg border border-status-warning-border bg-status-warning-bg px-3 py-2 text-xs font-semibold text-status-warning"
          >
            Peringatan privasi: Unggah hanya dokumen regulasi publik resmi. Dilarang mengunggah rekam medis atau data pasien.
          </p>
          <AdminIngestForm />
          <p className="mt-3 text-xs text-ink-900/60">
            Hasil ingest disimpan pada <code>data/custom.json</code> (mode demo) dan berstatus{" "}
            <code>BELUM_DIVERIFIKASI</code> hingga ditinjau oleh verifikator.
          </p>
        </section>
      ) : null}

      {canVerify ? (
        <section className="section-card" aria-labelledby="verify-title">
          <h2 id="verify-title" className="text-lg font-semibold text-pagar-800">
            Verifikasi Status Regulasi ({regs.length})
          </h2>
          <p className="mt-1 text-xs text-ink-900/70">
            Status keberlakuan hanya berasal dari metadata terverifikasi admin/sumber resmi dan tidak pernah ditentukan oleh AI.
          </p>
          <ul className="mt-4 space-y-2.5 text-sm">
            {regs.map((r) => {
              const latest = latestVerifications.get(r.slug);
              return (
                <li
                  key={r.slug}
                  className="rounded-xl border border-ink-100 bg-ink-50/50 p-3.5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <a
                      href={`/regulasi/${r.slug}`}
                      className="font-semibold text-pagar-800 hover:underline"
                    >
                      {r.judul}
                    </a>
                    <StatusBadge status={r.status} />
                  </div>
                  {latest ? (
                    <p className="mt-1.5 text-xs text-ink-900/70">
                      Verifikasi terakhir: <strong>{latest.verifiedBy}</strong> · {latest.createdAt}
                      {latest.catatan ? ` · "${latest.catatan}"` : ""}
                    </p>
                  ) : null}
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs font-bold text-pagar-700 underline">
                      Ubah status dan catat verifikasi
                    </summary>
                    <AdminVerifyForm
                      slug={r.slug}
                      judul={r.judul}
                      currentStatus={r.status}
                    />
                  </details>
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}

      <section className="section-card text-sm" aria-labelledby="monitoring-title">
        <h2 id="monitoring-title" className="text-base font-semibold text-pagar-800">
          Pemantauan Regulasi & Analitik
        </h2>
        <p className="mt-1 text-ink-900/75">
          Pantau regulasi baru dari Database Peraturan dan JDIH dengan menjalankan{" "}
          <code>npm run watch</code> pada server.
        </p>
        <p className="mt-2 text-ink-900/75">
          Lihat ringkasan metrik JSON pada{" "}
          <a className="font-bold text-pagar-700 underline" href="/api/analytics">
            /api/analytics
          </a>{" "}
          (mencakup total regulasi, pasal, chunk, topik populer, dan pertanyaan tanpa sumber).
        </p>
      </section>
    </div>
  );
}
