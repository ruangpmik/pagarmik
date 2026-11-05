import { Breadcrumb, EmptyState } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl">
      <header className="page-header">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tidak ditemukan" }]} />
        <h1>Halaman atau dokumen tidak ditemukan</h1>
        <p className="mt-2 text-base leading-relaxed text-ink-900/75">
          Tautan yang Anda buka mungkin telah berubah, atau slug regulasi/topik/artikel tersebut belum terdaftar di katalog PAGARMIK.
        </p>
      </header>

      <EmptyState
        title="Dokumen tidak tersedia di katalog"
        description="Gunakan pencarian hukum untuk menelusuri regulasi berdasarkan kata kunci, nomor, atau tahun penetapan."
        actionLabel="Buka pencarian hukum"
        actionHref="/legal-search"
      >
        <div className="flex flex-wrap justify-center gap-2">
          <a href="/" className="btn-secondary">
            Kembali ke beranda
          </a>
          <a href="/regulasi" className="btn-secondary">
            Lihat katalog regulasi
          </a>
        </div>
      </EmptyState>
    </div>
  );
}

