import { Breadcrumb, Disclaimer } from "@/components/ui";
import { CONTACT_EMAIL, DONATE_URL } from "@/lib/site";

export const metadata = { title: "Tentang — PAGARMIK" };

const PRINSIP = [
  {
    judul: "Akurasi hukum",
    teks: "Jawaban berbasis sumber hukum primer terverifikasi (peraturan, putusan) dari repositori resmi .go.id, lengkap dengan sitasi, tanggal berlaku, dan status hukum.",
  },
  {
    judul: "Keamanan data klien",
    teks: "Patuh UU PDP: segregasi data per pengguna, jejak audit untuk setiap mutasi, dan akses terautentikasi. Data materi kepatuhan tidak dibagikan ke pihak ketiga.",
  },
  {
    judul: "Kemudahan pemakaian",
    teks: "Bahasa Indonesia sederhana, jalur cepat pencarian pasal, dan riset AI satu klik untuk Perekam Medis non-hukum sekalipun.",
  },
  {
    judul: "Manusia tetap memutuskan",
    teks: "AI adalah asisten ber-sitasi, bukan pengganti pertimbangan profesional. Setiap keluaran dibubuhi penafian bahwa itu bukan nasihat hukum final.",
  },
];

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Tentang" }]} />
        <h1>Tentang PAGARMIK</h1>
        <p className="mt-2 text-lg font-semibold text-slate-700">Menjaga Batas. Melindungi Profesi.</p>
      </header>

      <section className="section-card space-y-4">
        <h2 className="text-base font-bold text-slate-900">Apa itu PAGARMIK?</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          PAGARMIK adalah platform vertikal hukum dan regulasi kesehatan untuk Perekam Medis dan Informasi Kesehatan
          (RMIK/MIK) di Indonesia. Fokus pada rekam medis, rekam medis elektronik (RME), pelindungan data pribadi
          (PDP), dan kebijakan internal fasilitas pelayanan kesehatan.
        </p>
        <p className="text-sm leading-relaxed text-slate-700">
          Platform ini membantu tenaga perekam medis, pejabat DPO/DPC rumah sakit, petugas kepatuhan, dosen, mahasiswa,
          dan peneliti memahami kewajiban hukumnya secara cepat dan akurat — dari pencarian pasal hingga riset AI
          yang menjawab dengan sitasi terverifikasi.
        </p>
      </section>

      <section className="section-card space-y-4">
        <h2 className="text-base font-bold text-slate-900">Prinsip kami</h2>
        <ul className="space-y-4">
          {PRINSIP.map((p) => (
            <li key={p.judul}>
              <h3 className="text-sm font-bold text-slate-900">{p.judul}</h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600">{p.teks}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="section-card space-y-4">
        <h2 className="text-base font-bold text-slate-900">Dukung PAGARMIK</h2>
        <p className="text-sm leading-relaxed text-slate-700">
          PAGARMIK dikembangkan dan dipelihara oleh RUANGPMIK. Kalau platform ini membantu pekerjaan Anda, traktir kami
          kopi untuk menjaga data regulasi tetap terverifikasi dan terbaru.
        </p>
        <div className="flex flex-wrap gap-3">
          <a href={DONATE_URL} target="_blank" rel="noopener noreferrer" className="btn-primary">
            Traktir Kopi
          </a>
          <a href="/masukan" className="btn-secondary">
            Kirim Masukan
          </a>
        </div>
      </section>

      <section className="section-card">
        <h2 className="text-base font-bold text-slate-900">Hubungi kami</h2>
        <p className="mt-2 text-sm text-slate-700">
          Email:{" "}
          <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-pagar-700 underline underline-offset-2">
            {CONTACT_EMAIL}
          </a>
        </p>
      </section>

      <Disclaimer />
    </div>
  );
}