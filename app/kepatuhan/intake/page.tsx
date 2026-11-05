import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { readSession } from "@/lib/auth/session";
import { getStore } from "@/lib/data/store";
import {
  MATTER_PRIORITY_LABEL,
  MATTER_TIPE_LABEL,
  type MatterPriority,
  type MatterTipe,
} from "@/lib/matters/store";
import { Alert, Breadcrumb } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

export const metadata = { title: "Intake Kepatuhan — PAGARMIK" };

const TIPE: MatterTipe[] = ["RMIK", "PDP", "RME", "KEBIJAKAN_INTERNAL", "LAIN"];
const PRIORITAS: MatterPriority[] = ["TINGGI", "SEDANG", "RENDAH"];

export default async function IntakePage({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const user = await readSession(cookies().get("pagarmik_session")?.value);
  if (!user) redirect("/masuk?next=/kepatuhan/intake");

  const showError = searchParams.error === "validation";
  const regStore = getStore();
  const regulations = regStore.regulations();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Pusat Kepatuhan", href: "/kepatuhan" }, { label: "Intake Baru" }]} />
        <h1>Intake Kepatuhan</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
          Deskripsikan pertanyaan atau skenario kepatuhan di fasilitas pelayanan kesehatan. Sistem menyimpannya sebagai materi yang bisa ditindaklanjuti dan diriset ber-sitasi.
        </p>
      </header>

      {showError && (
        <Alert variant="error" title="Input tidak valid">
          Periksa kembali: judul 3–200 karakter, deskripsi 10–4000 karakter, dan tenggat berformat YYYY-MM-DD.
        </Alert>
      )}

      <form action="/api/matters" method="post" className="section-card space-y-5">
        <div className="grid gap-1.5">
          <label htmlFor="judul" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Judul / Pertanyaan <span className="text-rose-500">*</span>
          </label>
          <input
            id="judul"
            name="judul"
            type="text"
            required
            minLength={3}
            maxLength={200}
            placeholder="Contoh: Kepatuhan alur pelepasan rekam medis ke pihak ketiga"
            className="form-input"
          />
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="deskripsi" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Deskripsi Skenario <span className="text-rose-500">*</span>
          </label>
          <textarea
            id="deskripsi"
            name="deskripsi"
            required
            minLength={10}
            maxLength={4000}
            rows={5}
            placeholder="Jelaskan situasi, para pihak, dokumen terkait, dan pertanyaan hukum yang ingin dipastikan ketaatannya..."
            className="form-input text-sm leading-relaxed"
          />
          <p className="text-xs text-slate-500">
            Jangan mencantumkan nama pasien riil, identitas personel, atau data klinis sensitif.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="grid gap-1.5">
            <label htmlFor="tipe" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Domain <span className="text-rose-500">*</span>
            </label>
            <select id="tipe" name="tipe" required className="form-input">
              {TIPE.map((t) => (
                <option key={t} value={t}>
                  {MATTER_TIPE_LABEL[t]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="prioritas" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Prioritas <span className="text-rose-500">*</span>
            </label>
            <select id="prioritas" name="prioritas" required defaultValue="SEDANG" className="form-input">
              {PRIORITAS.map((p) => (
                <option key={p} value={p}>
                  {MATTER_PRIORITY_LABEL[p]}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="tenggat" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tenggat (opsional)
            </label>
            <input id="tenggat" name="tenggat" type="date" className="form-input" />
          </div>
        </div>

        <div className="grid gap-1.5">
          <label htmlFor="regulasiTerkait" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Regulasi Terkait (opsional)
          </label>
          <select
            id="regulasiTerkait"
            name="regulasiTerkait"
            multiple
            size={5}
            className="form-input h-auto"
            aria-describedby="regulasi-terkait-hint"
          >
            {regulations.map((r) => (
              <option key={r.slug} value={r.slug} title={r.judul}>
                {regStore.shortRef(r.slug)} — {r.judul}
              </option>
            ))}
          </select>
          <p id="regulasi-terkait-hint" className="text-xs text-slate-500">
            Tahan Ctrl (Windows) / ⌘ (Mac) untuk memilih beberapa. Bersifat penanda; riset tetap menelusuri seluruh repositori.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 border-t border-slate-200 pt-4">
          <SubmitButton loadingLabel="Menyimpan...">Simpan Intake</SubmitButton>
          <a href="/kepatuhan" className="btn-secondary">
            Batal
          </a>
        </div>
      </form>
    </div>
  );
}