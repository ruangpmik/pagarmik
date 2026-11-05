import { Alert, Breadcrumb } from "@/components/ui";
import { RegisterForm } from "@/components/AuthForms";

export const metadata = { title: "Daftar" };

export default function Daftar({
  searchParams,
}: {
  searchParams?: Record<string, string | undefined>;
}) {
  const err = searchParams?.error;
  return (
    <div className="mx-auto max-w-md">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Daftar" }]} />
        <h1>Daftar</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-900/75">
          Buat akun pengguna untuk melengkapi profil profesi RMIK Anda.
        </p>
      </header>

      {err === "exists" && (
        <Alert
          variant="error"
          title="Email sudah terdaftar"
          className="mb-4"
          action={
            <a href="/masuk" className="btn-secondary text-xs">
              Masuk ke akun Anda
            </a>
          }
        >
          Alamat email tersebut sudah tercatat di sistem. Silakan masuk atau gunakan alamat email lain.
        </Alert>
      )}

      {err === "validation" && (
        <Alert variant="error" title="Data pendaftaran belum valid" className="mb-4">
          Pastikan nama minimal 2 karakter, format email valid, dan kata sandi minimal 8 karakter.
        </Alert>
      )}

      <RegisterForm />

      <p className="mt-4 text-xs text-ink-900/70">
        Sudah memiliki akun?{" "}
        <a className="font-bold text-pagar-700 underline underline-offset-2" href="/masuk">
          Masuk ke akun Anda →
        </a>
      </p>
    </div>
  );
}
