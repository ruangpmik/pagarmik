import { Alert, Breadcrumb } from "@/components/ui";
import { LoginForm } from "@/components/AuthForms";

export const metadata = { title: "Masuk" };

export default function Masuk({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  return (
    <div className="mx-auto max-w-md">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Masuk" }]} />
        <h1>Masuk</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-900/75">
          Masuk untuk mengakses fitur administrasi, unggah regulasi (EDITOR/ADMIN), atau verifikasi status peraturan (VERIFIER/ADMIN).
        </p>
      </header>

      {searchParams.error && (
        <Alert
          variant="error"
          title="Autentikasi gagal"
          className="mb-4"
        >
          Email atau kata sandi yang dimasukkan tidak cocok dengan catatan akun. Periksa kembali kredensial Anda.
        </Alert>
      )}

      <LoginForm nextUrl={searchParams.next ?? "/"} />

      <div className="mt-4 rounded-xl border border-ink-100 bg-ink-50/60 p-3.5 text-xs leading-relaxed text-ink-900/70">
        <p>
          Akun demo dibuat saat seed. Lihat kredensial di log terminal server, atau daftar akun pengguna baru di bawah ini.
        </p>
        <p className="mt-2">
          Belum punya akun?{" "}
          <a className="font-bold text-pagar-700 underline underline-offset-2" href="/daftar">
            Daftar akun baru →
          </a>
        </p>
      </div>
    </div>
  );
}
