import { Breadcrumb } from "@/components/ui";
import MasukanForm from "@/components/MasukanForm";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata = { title: "Masukan — PAGARMIK" };

export default function MasukanPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Masukan" }]} />
        <h1>Masukan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Ada saran, usulan fitur, laporan galat data regulasi, atau pertanyaan? Kirim langsung ke tim kami.
        </p>
      </header>

      <section className="section-card">
        <MasukanForm />
      </section>

      <p className="text-sm text-slate-500">
        Atau kirim email langsung ke{" "}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-pagar-700 underline underline-offset-2">
          {CONTACT_EMAIL}
        </a>
        .
      </p>
    </div>
  );
}