import { getStore } from "@/lib/data/store";
import { buildFocusedRelationshipGraph, relationLabelForFocus } from "@/lib/data/relationship-graph";

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
    <div className="mx-auto max-w-6xl">
      <header className="max-w-3xl">
        <h1>Graf hubungan regulasi</h1>
        <p className="mt-2 text-base leading-relaxed text-ink-900/75">
          Pilih satu regulasi untuk melihat hubungan yang tercatat langsung dengannya.
        </p>
      </header>

      <form action="/grafik" method="get" className="mt-6 grid gap-3 rounded-xl border border-ink-100 bg-white p-4 sm:grid-cols-[minmax(0,1fr)_auto_auto] sm:items-end">
        <div>
          <label htmlFor="regulasi" className="mb-1 block text-sm font-bold text-pagar-800">Regulasi</label>
          <select
            id="regulasi"
            name="regulasi"
            defaultValue={graph?.focus?.slug ?? ""}
            className="min-h-11 w-full rounded-lg border border-ink-100 px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
          >
            <option value="">Pilih regulasi</option>
            {store.regulations().map((regulation) => (
              <option key={regulation.slug} value={regulation.slug}>
                {store.shortRef(regulation.slug)} — {regulation.judul}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="min-h-11 rounded-lg bg-pagar-700 px-5 py-2 text-sm font-bold text-white hover:bg-pagar-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]"
        >
          Tampilkan grafik
        </button>
        {graph?.focus && (
          <a href="/grafik" className="inline-flex min-h-11 items-center justify-center px-3 text-sm font-semibold text-pagar-700 underline underline-offset-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]">
            Hapus pilihan
          </a>
        )}
      </form>

      {!selectedSlug && (
        <section className="mt-6 rounded-xl border border-ink-100 bg-white p-5" aria-labelledby="pilih-regulasi">
          <h2 id="pilih-regulasi" className="text-lg font-bold text-pagar-800">Mulai dari satu regulasi</h2>
          <p className="mt-1 text-sm leading-relaxed text-ink-900/75">
            Grafik tidak menampilkan jaringan contoh atau hubungan otomatis. Pilih regulasi di atas untuk memuat relasi yang tersimpan pada regulasi tersebut.
          </p>
        </section>
      )}

      {selectedSlug && !graph?.focus && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert">
          Regulasi tersebut tidak ditemukan di katalog. Tidak ada grafik yang ditampilkan.
        </p>
      )}

      {graph?.focus && graph.edges.length === 0 && (
        <section className="mt-6 rounded-xl border border-ink-100 bg-white p-5" aria-labelledby="relasi-kosong">
          <h2 id="relasi-kosong" className="text-lg font-bold text-pagar-800">Belum ada relasi terverifikasi</h2>
          {graph.needsReviewCount > 0 || graph.pendingCount > 0 ? (
            <>
              {graph.needsReviewCount > 0 && (
                <p className="mt-1 text-sm leading-relaxed text-ink-900/75">
                  Ada {graph.needsReviewCount} usulan hubungan (keluaran AI) untuk <strong>{graph.focus.judul}</strong> yang butuh telaah hukum sebelum dipublikasikan pada grafik.
                </p>
              )}
              {graph.pendingCount > 0 && (
                <p className="mt-1 text-sm leading-relaxed text-ink-900/75">
                  Ada {graph.pendingCount} catatan hubungan katalog untuk <strong>{graph.focus.judul}</strong> yang belum dilengkapi sumber resmi, rujukan pasal, dan tanggal verifikasi per relasi. Catatan itu ditahan dari grafik sampai buktinya tersedia.
                </p>
              )}
            </>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-ink-900/75">
              Belum ada hubungan yang tercatat untuk <strong>{graph.focus.judul}</strong>. Sistem tidak menyimpulkan relasi dari kemiripan topik.
            </p>
          )}
        </section>
      )}

      {graph?.focus && graph.edges.length > 0 && (
        <section className="mt-6" aria-labelledby="grafik-terpilih">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-sm font-semibold text-ink-900/65">Hubungan langsung untuk</p>
              <h2 id="grafik-terpilih" className="text-xl font-semibold leading-snug text-pagar-800">{graph.focus.judul}</h2>
            </div>
            <p className="text-sm text-ink-900/65">{graph.edges.length} relasi · {graph.related.length} regulasi terkait</p>
          </div>

          <aside className="mt-4 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
            <strong className="block">Batas bukti relasi</strong>
            Grafik ini mengikuti catatan hubungan di katalog PAGARMIK. Katalog belum menyimpan rujukan pasal atau tautan sumber resmi untuk tiap relasi; tampilan ini bukan verifikasi hukum independen.
          </aside>

          <div className="mt-4 overflow-x-auto rounded-xl border border-ink-100 bg-white p-3" role="region" aria-label="Graf hubungan; geser mendatar untuk melihat seluruh diagram" tabIndex={0}>
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
                    <rect x={GRAPH_WIDTH / 2 - labelWidth / 2} y={labelY - 11} width={labelWidth} height="21" rx="4" fill="var(--surface)" />
                    <text x={GRAPH_WIDTH / 2} y={labelY + 4} textAnchor="middle" fontSize="12" fontWeight="700" fill={color}>
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
                      fill={isFocus ? "var(--canvas)" : "var(--surface)"}
                      stroke={isFocus ? "var(--brand-navy)" : "var(--border)"}
                      strokeWidth={isFocus ? "2" : "1.5"}
                    />
                    <text x={x} y={y + 5} textAnchor="middle" fontSize="14" fontWeight="700" fill="var(--brand-navy)">
                      {shortLabel}
                    </text>
                  </a>
                );
              })}
            </svg>
          </div>

          <p className="mt-2 text-sm text-ink-900/70">
            Panah menunjukkan arah relasi yang tercatat. Garis putus-putus tanpa panah menunjukkan relasi BERIRISAN.
          </p>

          <section className="mt-5" aria-labelledby="daftar-relasi">
            <h3 id="daftar-relasi" className="text-base font-bold text-pagar-800">Daftar relasi yang sama</h3>
            <ol className="mt-2 divide-y divide-ink-100 rounded-xl border border-ink-100 bg-white">
              {graph.edges.map(({ relation, from, to }) => (
                <li key={`${relation.from}:${relation.type}:${relation.to}`} className="p-4 text-sm leading-relaxed">
                  <a className="font-semibold text-pagar-700 underline underline-offset-2" href={`/regulasi/${from.slug}`}>{store.shortRef(from.slug)}</a>
                  <span className="mx-2 font-bold text-ink-900/70">{relation.type}</span>
                  <a className="font-semibold text-pagar-700 underline underline-offset-2" href={`/regulasi/${to.slug}`}>{store.shortRef(to.slug)}</a>
                  <p className="mt-1 text-ink-900/70">
                    {from.judul} {relation.type === "BERIRISAN" ? "— beririsan dengan —" : `— ${relation.type} →`} {to.judul}
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
