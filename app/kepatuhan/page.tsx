import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { getMatterStore, MATTER_TIPE_LABEL } from "@/lib/matters/store";
import { readSession } from "@/lib/auth/session";
import {
  Breadcrumb,
  EmptyState,
  MatterPriorityBadge,
  MatterStatusBadge,
  StatisticCard,
} from "@/components/ui";

export const metadata = { title: "Pusat Kepatuhan — PAGARMIK" };

export default async function KepatuhanPage() {
  const user = await readSession(cookies().get("pagarmik_session")?.value);
  if (!user) redirect("/masuk?next=/kepatuhan");

  const store = getMatterStore();
  const all = store.matters();
  const matters = (user.role === "ADMIN" ? all : all.filter((m) => m.ownedBy === user.email)).sort(
    (a, b) => b.createdAt.localeCompare(a.createdAt),
  );

  const stats = {
    total: matters.length,
    tindakLanjut: matters.filter((m) => m.status === "TINDAK_LANJUT").length,
    selesai: matters.filter((m) => m.status === "SELESAI").length,
    tinggi: matters.filter((m) => m.prioritas === "TINGGI").length,
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="page-header flex flex-wrap items-end justify-between gap-4 border-b border-slate-200 pb-5">
        <div>
          <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Pusat Kepatuhan" }]} />
          <h1>Pusat Kepatuhan</h1>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
            Catat pertanyaan kepatuhan RMIK/PDP, kelola status penanganannya, dan jalankan riset hukum ber-sitasi dari satu tempat.
          </p>
        </div>
        <a href="/kepatuhan/intake" className="btn-primary">
          + Intake Baru
        </a>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatisticCard title="Materi Kepatuhan" value={stats.total} description="Semua materi milik Anda" />
        <StatisticCard title="Tindak Lanjut" value={stats.tindakLanjut} description="Sedang ditangani" />
        <StatisticCard title="Selesai" value={stats.selesai} description="Sudah dituntaskan" />
        <StatisticCard title="Prioritas Tinggi" value={stats.tinggi} description="Perlu perhatian segera" />
      </div>

      {matters.length === 0 ? (
        <EmptyState
          title="Belum ada materi kepatuhan"
          description="Mulai dengan mencatat pertanyaan atau skenario kepatuhan di fasilitas pelayanan kesehatan. Sistem melacak statusnya dan mendukung riset ber-sitasi."
          actionLabel="Buat Intake Pertama"
          actionHref="/kepatuhan/intake"
        />
      ) : (
        <ul className="space-y-3">
          {matters.map((m) => (
            <li key={m.id}>
              <a
                href={`/kepatuhan/${m.id}`}
                className="section-card block transition-colors hover:border-teal-500"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <MatterStatusBadge status={m.status} />
                  <MatterPriorityBadge priority={m.prioritas} />
                  {m.tenggat && <span className="text-xs text-slate-500">Tenggat {m.tenggat}</span>}
                </div>
                <h2 className="mt-3 text-base font-bold text-slate-900">{m.judul}</h2>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{m.deskripsi}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
                  <span>{MATTER_TIPE_LABEL[m.tipe]}</span>
                  <span>Diperbarui {new Date(m.updatedAt).toLocaleDateString("id-ID")}</span>
                </div>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}