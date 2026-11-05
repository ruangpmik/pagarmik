"use client";

import { Alert, Breadcrumb } from "@/components/ui";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Kendala sistem" }]} />
        <h1>Terjadi kendala saat memuat halaman</h1>
        <p className="mt-2 text-base leading-relaxed text-ink-900/75">
          Permintaan Anda belum dapat diselesaikan saat ini. Detail internal disembunyikan demi keamanan.
        </p>
      </header>

      <Alert
        variant="error"
        title="Operasi gagal dimuat"
        action={
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => reset()} className="btn-primary">
              Coba lagi
            </button>
            <a href="/" className="btn-secondary">
              Kembali ke beranda
            </a>
          </div>
        }
      >
        Silakan coba muat ulang bagian ini. Jika kendala berlanjut, periksa koneksi jaringan Anda atau kembali ke halaman utama.
      </Alert>
    </div>
  );
}

