import { Fragment } from "react";
import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";
import {
  getMatterStore,
  MATTER_PRIORITY_LABEL,
  MATTER_STATUS_LABEL,
  MATTER_TIPE_LABEL,
  type MatterStatus,
} from "@/lib/matters/store";
import { readSession } from "@/lib/auth/session";
import { answerQuestion } from "@/lib/rag/pipeline";
import { getStore } from "@/lib/data/store";
import { TRUST_LABEL } from "@/lib/data/types";
import {
  Alert,
  Breadcrumb,
  ConfidenceBadge,
  Disclaimer,
  LegalBlock,
  MatterPriorityBadge,
  MatterStatusBadge,
} from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

const STATUS_OPTS: MatterStatus[] = ["BARU", "TINDAK_LANJUT", "SELESAI"];

function renderInline(text: string, keyPrefix: string): React.ReactNode[] {
  return text.split(/(\*\*.+?\*\*)/g).map((seg, j) =>
    seg.startsWith("**") && seg.endsWith("**") && seg.length > 4 ? (
      <strong key={`${keyPrefix}-b${j}`}>{seg.slice(2, -2)}</strong>
    ) : (
      <span key={`${keyPrefix}-t${j}`}>{seg}</span>
    ),
  );
}

function renderWithCitations(text: string): React.ReactNode[] {
  const parts = text.split(/(\[[a-z0-9-]+:pasal-[\w-]+:\d+\])/gi);
  return parts.map((p, i) => {
    const m = p.match(/^\[([a-z0-9-]+):pasal-([\w-]+):(\d+)\]$/i);
    if (!m) return <Fragment key={`p${i}`}>{renderInline(p, `p${i}`)}</Fragment>;
    return (
      <a
        key={`c${i}`}
        href={`/regulasi/${m[1]}?tab=pasal`}
        className="mx-0.5 rounded-md bg-pagar-50 px-1.5 py-0.5 text-xs font-bold text-pagar-700 underline"
        title={`Buka sumber: ${m[1]}`}
      >
        [{m[1]}]
      </a>
    );
  });
}

export default async function MatterDetailPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: Record<string, string | undefined>;
}) {
  const user = await readSession(cookies().get("pagarmik_session")?.value);
  if (!user) redirect("/masuk?next=/kepatuhan");

  const matter = getMatterStore().get(params.id);
  if (!matter) notFound();
  if (matter.ownedBy !== user.email && user.role !== "ADMIN") notFound();
  const regStore = getStore();

  const q = (searchParams.q ?? "").trim();
  const ans = q ? await answerQuestion(q) : null;
  const statusError = searchParams.error === "status";
  const noteError = searchParams.error === "note";
  const catatan = matter.catatan ?? [];

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Pusat Kepatuhan", href: "/kepatuhan" }, { label: matter.judul }]} />
        <div className="flex flex-wrap items-center gap-2">
          <MatterStatusBadge status={matter.status} />
          <MatterPriorityBadge priority={matter.prioritas} />
        </div>
        <h1 className="mt-3">{matter.judul}</h1>
      </header>

      {statusError && (
        <Alert variant="error" title="Status tidak valid">
          Pilih salah satu status: Baru, Tindak lanjut, atau Selesai.
        </Alert>
      )}

      {noteError && (
        <Alert variant="error" title="Catatan tidak valid">
          Catatan harus 1–1000 karakter.
        </Alert>
      )}

      <section className="section-card space-y-4" aria-labelledby="info-title">
        <h2 id="info-title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Ringkasan Materi
        </h2>

        <dl className="grid gap-3 text-sm sm:grid-cols-3">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Domain</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{MATTER_TIPE_LABEL[matter.tipe]}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Tenggat</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{matter.tenggat ?? "—"}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wider text-slate-400">Dibuat</dt>
            <dd className="mt-0.5 font-medium text-slate-800">{new Date(matter.createdAt).toLocaleDateString("id-ID")}</dd>
          </div>
        </dl>

        {(matter.regulasiTerkait ?? []).length > 0 && (
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Regulasi Terkait</h3>
            <ul className="mt-2 flex flex-wrap gap-2">
              {(matter.regulasiTerkait ?? []).map((slug) => {
                const r = regStore.regulation(slug);
                return (
                  <li key={slug}>
                    <a
                      href={`/regulasi/${slug}`}
                      title={r?.judul}
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal-300 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800 hover:bg-teal-100"
                    >
                      {r ? regStore.shortRef(slug) : slug}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
          <p className="whitespace-pre-line">{matter.deskripsi}</p>
        </div>

        <form action={`/api/matters/${matter.id}`} method="post" className="flex flex-wrap items-end gap-3 border-t border-slate-200 pt-4">
          <div className="grid gap-1.5">
            <label htmlFor="status" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Ubah Status
            </label>
            <select id="status" name="status" defaultValue={matter.status} className="form-input">
              {STATUS_OPTS.map((s) => (
                <option key={s} value={s}>
                  {MATTER_STATUS_LABEL[s]}
                </option>
              ))}
            </select>
          </div>
          <SubmitButton loadingLabel="Menyimpan...">Simpan Status</SubmitButton>
        </form>
      </section>

      <section className="section-card space-y-4" aria-labelledby="catatan-title">
        <div className="border-b border-slate-200 pb-3">
          <h2 id="catatan-title" className="text-base font-bold text-slate-900">Catatan &amp; Tindak Lanjut</h2>
          <p className="mt-1 text-sm text-slate-600">Cantumkan temuan, rekomendasi, atau langkah yang diambil. Setiap catatan tercatat di jejak audit.</p>
        </div>

        <form action={`/api/matters/${matter.id}`} method="post" className="space-y-2.5">
          <input type="hidden" name="_action" value="note" />
          <label htmlFor="note" className="sr-only">Tambah catatan</label>
          <textarea
            id="note"
            name="note"
            rows={2}
            required
            maxLength={1000}
            placeholder="Tulis temuan atau tindak lanjut..."
            className="form-input text-sm leading-relaxed"
          />
          <SubmitButton loadingLabel="Menyimpan...">Tambah Catatan</SubmitButton>
        </form>

        {catatan.length > 0 ? (
          <ol className="space-y-3 border-t border-slate-200 pt-3">
            {[...catatan].reverse().map((n) => (
              <li key={n.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="whitespace-pre-line text-sm leading-relaxed text-slate-800">{n.teks}</p>
                <p className="mt-1.5 text-xs text-slate-500">
                  {new Date(n.at).toLocaleString("id-ID")} · {n.actor}
                </p>
              </li>
            ))}
          </ol>
        ) : (
          <p className="border-t border-slate-200 pt-3 text-sm text-slate-500">Belum ada catatan.</p>
        )}
      </section>

      <section className="section-card space-y-4" aria-labelledby="riset-title">
        <div className="border-b border-slate-200 pb-3">
          <h2 id="riset-title" className="text-base font-bold text-slate-900">
            Riset Hukum Ber-sitasi
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Jawaban disintesis dari dokumen hukum primer terverifikasi dengan sitasi terperiksa. Pertanyaan awal sudah diisi dari deskripsi materi; boleh disunting.
          </p>
        </div>

        <form method="get" className="space-y-3">
          <textarea
            name="q"
            rows={3}
            required
            minLength={3}
            defaultValue={q || matter.deskripsi}
            className="form-input text-sm leading-relaxed"
            aria-label="Pertanyaan riset ber-sitasi"
          />
          <div className="flex flex-wrap gap-2.5">
            <SubmitButton
              loadingLabel="Menyusun jawaban..."
              progressSteps={[
                "Menelusuri sumber hukum primer di repositori...",
                "Memverifikasi kecocokan sitasi pasal...",
                "Menyusun jawaban berbasis bukti yuridis...",
              ]}
            >
              Jalankan Riset
            </SubmitButton>
          </div>
        </form>

        {ans && (
          <article className="space-y-4 border-t border-slate-200 pt-4" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <LegalBlock kind="ANALISIS HUKUM" title="Sintesis Yuridis">
                <div className="prose-pagar whitespace-pre-line text-sm leading-relaxed text-slate-800">
                  {renderWithCitations(ans.answer)}
                </div>
              </LegalBlock>
            </div>

            <ConfidenceBadge level={ans.confidence} />

            {ans.invalidCitationsDropped.length > 0 && (
              <Alert variant="warning" title="Sitasi tidak terverifikasi disaring">
                {ans.invalidCitationsDropped.length} rujukan yang tidak cocok dengan dokumen repositori dihapus otomatis demi integritas data yuridis.
              </Alert>
            )}

            {ans.citations.length > 0 && (
              <ul className="space-y-2.5">
                {ans.citations.map((c) => (
                  <li key={c.chunkId} className="rounded-xl border border-slate-200 bg-white p-4 text-sm">
                    <a href={`/regulasi/${c.regulationSlug}?tab=pasal`} className="font-bold text-teal-700 hover:underline">
                      {c.regulasiJudul}
                      {c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""}
                    </a>
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-700">“{c.kutipan}…”</p>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                      <span>ID Kutipan: <strong className="font-mono text-slate-700">{c.chunkId}</strong></span>
                      <span>·</span>
                      <span className="font-semibold text-slate-600">{TRUST_LABEL[c.trustLevel] ?? c.trustLevel}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            <Disclaimer />
          </article>
        )}
      </section>

      <section className="section-card" aria-labelledby="audit-title">
        <h2 id="audit-title" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Jejak Audit ({matter.audit.length})
        </h2>
        <ol className="mt-3 space-y-2.5">
          {[...matter.audit].reverse().map((e, i) => (
            <li key={`${e.at}:${i}`} className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
              <span className="font-mono text-xs text-slate-400">{new Date(e.at).toLocaleString("id-ID")}</span>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-600">{e.action}</span>
              <span>{e.detail}</span>
              <span className="text-xs text-slate-400">oleh {e.actor}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}