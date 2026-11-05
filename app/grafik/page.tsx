import { getStore } from "@/lib/data/store";
import { buildFocusedRelationshipGraph, relationLabelForFocus } from "@/lib/data/relationship-graph";
import { Breadcrumb } from "@/components/ui";
import { SubmitButton } from "@/components/SubmitButton";

type GraphPageProps = {
  searchParams: { regulasi?: string | string[] };
};

const NODE_WIDTH = 232;
const NODE_HEIGHT = 58;
const GRAPH_WIDTH = 760;
const FOCUS_X = 164;
const RELATED_X = 596;
const FIRST_NODE_Y = 56;
const NODE_GAP_Y = 112;

function relationColor(type: string) {
  return type === "MENCABUT" ? "var(--danger)" : "var(--accent-teal)";
}

export default function GraphPage({ searchParams }: GraphPageProps) {
  const store = getStore();
  const rawSlug = searchParams.regulasi;
  const selectedSlug = Array.isArray(rawSlug) ? rawSlug[0] : rawSlug;
  const graph = selectedSlug
    ? buildFocusedRelationshipGraph(selectedSlug, store.regulations(), store.relations())
    : null;
  const relatedCount = graph?.related.length ?? 0;
  const height = relatedCount > 1
    ? FIRST_NODE_Y * 2 + (relatedCount - 1) * NODE_GAP_Y
    : 176;
  const focusY = relatedCount > 1
    ? (FIRST_NODE_Y + FIRST_NODE_Y + (relatedCount - 1) * NODE_GAP_Y) / 2
    : height / 2;

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="page-header border-b border-slate-200 pb-5">
        <Breadcrumb items={[{ label: "Beranda", href: "/" }, { label: "Peta hubungan" }]} />
        <h1>Peta Hubungan Regulasi</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Visualisasi graf keterkaitan antarperaturan (mencabut, mengubah, mendasari, atau beririsan) yang terverifikasi dalam repositori.
        </p>
      </header>

      <form action="/grafik" method="get" className="section-card grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <div>
          <label htmlFor="regulasi" className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-500">Pilih Regulasi Utama</label>
          <select
            id="regulasi"
            name="regulasi"
            defaultValue={graph?.focus?.slug ?? ""}
            className="form-input"
          >
            <option value="">Pilih regulasi</option>
            {store.regulations().map((regulation) => (
              <option key={regulation.slug} value={regulation.slug}>
                {store.shortRef(regulation.slug)} — {regulation.judul}
              </option>
            ))}
          </select>
        </div>
        <SubmitButton loadingLabel="Memuat grafik...">
          Tampilkan Grafik
        </SubmitButton>
        {graph?.focus && (
          <a href="/grafik" className="btn-secondary">
            Reset Pilihan
          </a>
        )}
      </form>

      {!selectedSlug && (
        <section className="section-card" aria-labelledby="pilih-regulasi">
          <h2 id="pilih-regulasi" className="text-base font-bold text-slate-900">Mulai dari Satu Regulasi</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            Diagram tidak menampilkan jaringan acak atau kesimpulan otomatis. Pilih regulasi pada menu di atas untuk memuat jaringan relasi yang tersimpan dan terverifikasi pada regulasi tersebut.
          </p>
        </section>
      )}

      {selectedSlug && !graph?.focus && (
        <p className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900" role="alert">
          Regulasi tersebut tidak ditemukan di repositori. Tidak ada grafik yang dapat ditampilkan.
        </p>
      )}

      {graph?.focus && graph.edges.length === 0 && (
        <section className="section-card space-y-2" aria-labelledby="relasi-kosong">
          <h2 id="relasi-kosong" className="text-base font-bold text-slate-900">Belum Ada Relasi Terverifikasi</h2>
          {graph.needsReviewCount > 0 || graph.pendingCount > 0 ? (
            <>
              {graph.needsReviewCount > 0 && (
                <p className="text-sm leading-relaxed text-slate-600">
                  Terdapat {graph.needsReviewCount} usulan hubungan untuk <strong>{graph.focus.judul}</strong> yang memerlukan telaah hukum sebelum dipublikasikan pada grafik.
                </p>
              )}
              {graph.pendingCount > 0 && (
                <p className="text-sm leading-relaxed text-slate-600">
                  Terdapat {graph.pendingCount} catatan hubungan katalog untuk <strong>{graph.focus.judul}</strong> yang belum dilengkapi bukti yuridis lengkap.
                </p>
              )}
            </>
          ) : (
            <p className="text-sm leading-relaxed text-slate-600">
              Belum ada hubungan yang tercatat untuk <strong>{graph.focus.judul}</strong>. Sistem tidak menyimpulkan relasi semata-mata dari kemiripan topik.
            </p>
          )}
        </section>
      )}

      {graph?.focus && graph.edges.length > 0 && (
        <section className="space-y-4" aria-labelledby="grafik-terpilih">
          <div className="flex flex-wrap items-end justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Fokus Analisis Relasi</p>
              <h2 id="grafik-terpilih" className="text-lg font-bold text-slate-900">{graph.focus.judul}</h2>
            </div>
            <p className="text-xs font-semibold text-slate-500">{graph.edges.length} relasi · {graph.related.length} regulasi terkait</p>
          </div>

          <aside className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
            <strong className="block text-sm font-bold text-amber-950 mb-0.5">Batas Bukti Relasi Yuridis</strong>
            Grafik ini mengikuti catatan hubungan di katalog PAGARMIK. Hubungan ditampilkan hanya jika memiliki rujukan hukum terverifikasi.
          </aside>

          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white p-4" role="region" aria-label="Graf hubungan; geser mendatar untuk melihat seluruh diagram" tabIndex={0}>
            <svg
              viewBox={`0 0 ${GRAPH_WIDTH} ${height}`}
              className="mx-auto block min-w-[700px]"
              role="img"
              aria-label={`Hubungan regulasi yang tercatat untuk ${graph.focus.judul}`}
            >
              <defs>
                <marker id="relationship-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L8,4 L0,8 z" fill="var(--accent-teal)" />
                </marker>
                <marker id="repeal-arrow" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto" markerUnits="strokeWidth">
                  <path d="M0,0 L8,4 L0,8 z" fill="var(--danger)" />
                </marker>
              </defs>

              {graph.edges.map(({ relation, from, to, related }, index) => {
                const relatedIndex = graph.related.findIndex((regulation) => regulation.slug === related.slug);
                const relatedY = relatedCount > 1 ? FIRST_NODE_Y + relatedIndex * NODE_GAP_Y : height / 2;
                const sameNeighborEdges = graph.edges.filter((edge) => edge.related.slug === related.slug);
                const edgeIndexForNeighbor = sameNeighborEdges.findIndex((edge) => edge.relation === relation);
                const labelOffset = (edgeIndexForNeighbor - (sameNeighborEdges.length - 1) / 2) * 22;
                const pointsFromFocus = relation.from === graph.focus?.slug;
                const x1 = pointsFromFocus ? FOCUS_X + NODE_WIDTH / 2 : RELATED_X - NODE_WIDTH / 2;
                const x2 = pointsFromFocus ? RELATED_X - NODE_WIDTH / 2 : FOCUS_X + NODE_WIDTH / 2;
                const y1 = pointsFromFocus ? focusY : relatedY;
                const y2 = pointsFromFocus ? relatedY : focusY;
                const labelY = (y1 + y2) / 2 + labelOffset;
                const color = relationColor(relation.type);
                const displayLabel = relationLabelForFocus(relation, graph.focus!.slug);
                const labelWidth = Math.max(76, displayLabel.length * 7.2 + 16);
                return (
                  <g key={`${relation.from}:${relation.type}:${relation.to}`}>
                    <line
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={color}
                      strokeWidth="2"
                      strokeDasharray={relation.type === "BERIRISAN" ? "6 4" : undefined}
                      markerEnd={relation.type === "BERIRISAN" ? undefined : relation.type === "MENCABUT" ? "url(#repeal-arrow)" : "url(#relationship-arrow)"}
                    />
                    <rect x={GRAPH_WIDTH / 2 - labelWidth / 2} y={labelY - 11} width={labelWidth} height="21" rx="4" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
                    <text x={GRAPH_WIDTH / 2} y={labelY + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill={color}>
                      {displayLabel}
                    </text>
                    <title>{`${from.judul} — ${relation.type} — ${to.judul}; regulasi terkait: ${related.judul}`}</title>
                  </g>
                );
              })}

              {[graph.focus, ...graph.related].map((regulation, index) => {
                const isFocus = index === 0;
                const x = isFocus ? FOCUS_X : RELATED_X;
                const y = isFocus
                  ? focusY
                  : relatedCount > 1 ? FIRST_NODE_Y + (index - 1) * NODE_GAP_Y : height / 2;
                const shortLabel = store.shortRef(regulation.slug);
                return (
                  <a key={regulation.slug} href={`/grafik?regulasi=${encodeURIComponent(regulation.slug)}`} aria-label={`Tampilkan grafik hubungan untuk ${regulation.judul}`}>
                    <title>{regulation.judul}</title>
                    <rect
                      x={x - NODE_WIDTH / 2}
                      y={y - NODE_HEIGHT / 2}
                      width={NODE_WIDTH}
                      height={NODE_HEIGHT}
                      rx="8"
                      fill={isFocus ? "#f0fdf4" : "#ffffff"}
                      stroke={isFocus ? "#0d9488" : "#cbd5e1"}
                      strokeWidth={isFocus ? "2" : "1.5"}
                    />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill={isFocus ? "#0f766e" : "#1e293b"}>
                      {shortLabel}
                    </text>
                  </a>
                );
              })}
            </svg>
          </div>

          <p className="text-xs text-slate-500">
            Keterangan: Garis berpanah menunjukkan arah relasi hukum (mencabut / mengubah). Garis putus-putus menunjukkan relasi beririsan materi.
          </p>

          <section className="section-card space-y-3" aria-labelledby="daftar-relasi">
            <h3 id="daftar-relasi" className="text-base font-bold text-slate-900">Rincian Pasangan Relasi Hukum</h3>
            <ol className="divide-y divide-slate-100 rounded-xl border border-slate-200 bg-white">
              {graph.edges.map(({ relation, from, to }) => (
                <li key={`${relation.from}:${relation.type}:${relation.to}`} className="p-4 text-sm leading-relaxed">
                  <div className="flex flex-wrap items-center gap-2">
                    <a className="font-bold text-teal-700 hover:underline" href={`/regulasi/${from.slug}`}>{store.shortRef(from.slug)}</a>
                    <span className="rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-700">{relation.type}</span>
                    <a className="font-bold text-teal-700 hover:underline" href={`/regulasi/${to.slug}`}>{store.shortRef(to.slug)}</a>
                  </div>
                  <p className="mt-1 text-xs text-slate-600">
                    {from.judul} {relation.type === "BERIRISAN" ? "beririsan dengan" : `${relation.type.toLowerCase()}`} {to.judul}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </section>
      )}
    </div>
  );
}
