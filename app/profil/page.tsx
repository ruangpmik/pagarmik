import { cookies } from "next/headers";
import { readSession } from "@/lib/auth/session";
import { Breadcrumb } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import LibraryView from "@/components/LibraryView";

export const metadata = { title: "Profil & Simpanan" };

export default async function Profil() {
  const token = cookies().get("pagarmik_session")?.value;
  const user = await readSession(token);
  const isStaff = Boolean(user && ["ADMIN", "EDITOR", "VERIFIER"].includes(user.role));

  return (
    <div className="mx-auto max-w-3xl">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Profil" }]} />
        <h1>Profil</h1>
        <p className="mt-2 text-base leading-relaxed text-ink-900/80">
          Kelola sesi akun Anda serta daftar simpanan dan riwayat penelusuran pada peramban ini.
        </p>
      </header>

      {!user ? (
        <section className="section-card mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-pagar-800">Status sesi: Belum masuk</h2>
            <p className="mt-1 text-sm text-ink-900/75">
              Anda dapat menyimpan regulasi dan pasal secara lokal tanpa masuk, atau masuk untuk mengakses panel verifikasi/administrasi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href="/masuk?next=/profil" className="btn-primary">
              Masuk
            </a>
            <a href="/daftar" className="btn-secondary">
              Daftar
            </a>
          </div>
        </section>
      ) : (
        <section className="section-card mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-pagar-800">{user.name}</h2>
              <span className="rounded-full border border-pagar-200 bg-pagar-50 px-2.5 py-0.5 text-xs font-bold text-pagar-800">
                {user.role}
              </span>
            </div>
            <p className="mt-1 text-sm text-ink-900/70">{user.email}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {isStaff && (
              <a href="/admin" className="btn-secondary">
                Panel Administrasi
              </a>
            )}
            <form action="/api/auth/logout" method="post">
              <SubmitButton variant="secondary" loadingLabel="Keluar...">
                Keluar
              </SubmitButton>
            </form>
          </div>
        </section>
      )}

      <LibraryView />
    </div>
  );
}
