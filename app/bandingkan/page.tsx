import { getStore } from "@/lib/data/store";
import { Alert, Breadcrumb, Disclaimer, StatusBadge } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";
import CompareAiPanel from "@/components/CompareAiPanel";
import PrintButton from "@/components/PrintButton";

export const metadata = { title: "Bandingkan regulasi" };

const COMPARE_PRESETS = [
  {
    label: "Permenkes 24/2022 vs Permenkes 269/2008 (Rekam Medis)",
    a: "permenkes-24-2022",
    b: "permenkes-269-2008",
  },
  {
    label: "UU 17/2023 vs UU 29/2004 (Kesehatan & Praktik Kedokteran)",
    a: "uu-17-2023",
    b: "uu-29-2004",
  },
  {
    label: "UU 27/2022 vs PP 33/2026 (Pelindungan Data Pribadi)",
    a: "uu-27-2022",
    b: "pp-33-2026",
  },
];

export default function Compare({
  searchParams,
}: {
  searchParams: Record<string, string | undefined>;
}) {
  const store = getStore();
  const regs = store.regulations();
  const a = regs.find((r) => r.slug === searchParams.a);
  const b = regs.find((r) => r.slug === searchParams.b);
  const isSame = Boolean(a && b && a.slug === b.slug);

  const sel = (name: "a" | "b", val: string | undefined) => (
    <label htmlFor={`regulasi-${name}`} className="grid gap-1 text-sm font-semibold text-ink-900">
      Regulasi {name.toUpperCase()}
      <select
        id={`regulasi-${name}`}
        name={name}
        required
        defaultValue={val ?? ""}
        className="form-input font-normal"
      >
        <option value="">Pilih regulasi</option>
        {regs.map((r) => (
          <option key={r.slug} value={r.slug}>
            {store.shortRef(r.slug)} — {r.judul}
          </option>
        ))}
      </select>
    </label>
  );

  const rows: [string, string, string][] =
    a && b
      ? [
          ["Judul", a.judul, b.judul],
          ["Jenis / Nomor / Tahun", `${a.jenis} No. ${a.nomor}/${a.tahun}`, `${b.jenis} No. ${b.nomor}/${b.tahun}`],
          ["Instansi penerbit", a.instansi, b.instansi],
          ["Status keberlakuan", a.status, b.status],
          ["Tanggal berlaku", a.tglBerlaku ?? "Belum tercatat", b.tglBerlaku ?? "Belum tercatat"],
          ["Ringkasan", a.ringkasan, b.ringkasan],
          ["Topik", a.topik.join(", ") || "—", b.topik.join(", ") || "—"],
          [
            "Jumlah pasal terindeks",
            String(store.pasalsOf(a.slug).length),
            String(store.pasalsOf(b.slug).length),
          ],
        ]
      : [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Bandingkan regulasi" }]} />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1>Bandingkan Regulasi</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
              Sandingkan dua instrumen hukum secara berdampingan untuk memeriksa perbedaan status keberlakuan, ruang lingkup, dan cakupan pasal.
            </p>
          </div>
          {a && b && (
            <div className="print:hidden">
              <PrintButton label="Cetak Perbandingan" />
            </div>
          )}
        </div>
      </header>

      <form
        method="get"
        className="section-card grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end"
      >
        {sel("a", searchParams.a)}
        {sel("b", searchParams.b)}
        <div className="flex gap-2">
          <SubmitButton loadingLabel="Membandingkan...">Bandingkan</SubmitButton>
          {(a || b) && (
            <a href="/bandingkan" className="btn-secondary">
              Reset
            </a>
          )}
        </div>
      </form>

      {isSame && (
        <Alert
          variant="warning"
          title="Regulasi yang dipilih sama"
          className="mt-4"
        >
          Anda memilih regulasi yang sama pada Regulasi A dan Regulasi B. Pilih dua regulasi yang berbeda untuk melihat perbandingan.
        </Alert>
      )}

      {(!a || !b) && (
        <section className="section-card space-y-3" aria-labelledby="contoh-perbandingan">
          <h2 id="contoh-perbandingan" className="text-base font-bold text-slate-900">
            Pasangan Perbandingan Rekomendasi
          </h2>
          <p className="text-sm text-slate-600">
            Pilih dua regulasi pada formulir di atas, atau telaah salah satu pasangan transisi hukum berikut:
          </p>
          <div className="grid gap-3 sm:grid-cols-3">
            {COMPARE_PRESETS.map((preset) => (
              <a
                key={`${preset.a}:${preset.b}`}
                href={`/bandingkan?a=${encodeURIComponent(preset.a)}&b=${encodeURIComponent(preset.b)}`}
                className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:border-teal-500 hover:bg-teal-50/20"
              >
                <span className="text-xs font-semibold text-slate-800">{preset.label}</span>
                <span className="mt-2 text-xs font-bold text-teal-700">Telaah perbandingan →</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {a && b && (
        <div
          className="overflow-x-auto rounded-xl border border-slate-200 bg-white"
          role="region"
          aria-label="Tabel perbandingan regulasi"
          tabIndex={0}
        >
          <table className="w-full min-w-[600px] text-sm">
            <caption className="sr-only">
              Perbandingan antara {a.judul} dan {b.judul}
            </caption>
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-slate-700">
                <th scope="col" className="w-48 p-4 text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Aspek Hukum
                </th>
                <th scope="col" className="p-4 text-sm font-bold text-slate-900">
                  <a href={`/regulasi/${a.slug}`} className="hover:text-teal-700 underline-offset-2 hover:underline">
                    {store.shortRef(a.slug)}
                  </a>
                </th>
                <th scope="col" className="p-4 text-sm font-bold text-slate-900">
                  <a href={`/regulasi/${b.slug}`} className="hover:text-teal-700 underline-offset-2 hover:underline">
                    {store.shortRef(b.slug)}
                  </a>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map(([k, va, vb]) => {
                const isDifferent = va !== vb;
                return (
                  <tr
                    key={k}
                    className={`align-top transition-colors ${
                      isDifferent ? "bg-amber-50/30" : "hover:bg-slate-50/50"
                    }`}
                  >
                    <th scope="row" className="p-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-600">
                      {k}
                    </th>
                    <td className="p-4 leading-relaxed text-slate-800">
                      {k === "Status keberlakuan" ? (
                        <StatusBadge status={va as typeof a.status} />
                      ) : (
                        va
                      )}
                    </td>
                    <td className="p-4 leading-relaxed text-slate-800">
                      <div className="flex flex-wrap items-center gap-2">
                        <span>
                          {k === "Status keberlakuan" ? (
                            <StatusBadge status={vb as typeof b.status} />
                          ) : (
                            vb
                          )}
                        </span>
                        {isDifferent && (
                          <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                            Berbeda
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {a && b && !isSame && (
        <CompareAiPanel
          slugA={a.slug}
          slugB={b.slug}
          labelA={store.shortRef(a.slug)}
          labelB={store.shortRef(b.slug)}
        />
      )}

      <div>
        <Disclaimer />
      </div>
    </div>
  );
}
