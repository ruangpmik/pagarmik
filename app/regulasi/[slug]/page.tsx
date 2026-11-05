import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getStore } from "@/lib/data/store";
import { buildFocusedRelationshipGraph, relationLabelForFocus } from "@/lib/data/relationship-graph";
import {
  Alert,
  Breadcrumb,
  ConfidenceBadge,
  Disclaimer,
  EmptyState,
  LegalBlock,
  RegulationCard,
  StatusBadge,
} from "@/components/ui";
import { InlineMarkdown } from "@/components/Markdown";
import BookmarkButton from "@/components/BookmarkButton";
import ExplainPasalButton from "@/components/ExplainPasalButton";
import CopyCitationButton from "@/components/CopyCitationButton";
import PrintButton from "@/components/PrintButton";
import RememberVisit from "@/components/RememberVisit";
import { answerQuestion } from "@/lib/rag/pipeline";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const r = getStore().regulation(params.slug);
  if (!r) return { title: "Tidak ditemukan" };
  return {
    title: r.judul,
    description: r.ringkasan,
    alternates: { canonical: `/regulasi/${r.slug}` },
  };
}

export default async function RegulationDetail({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Record<string, string | undefined>;
}) {
  const store = getStore();
  const reg = store.regulation(params.slug);
  if (!reg) notFound();
  const pasals = store.pasalsOf(reg.slug);
  const relationGraph = buildFocusedRelationshipGraph(
    reg.slug,
    store.regulations(),
    store.relations(),
  );
  const rels = relationGraph.edges.map(({ relation }) => relation);
  const tab = searchParams.tab ?? "ringkasan";
  const pengganti = rels
    .filter((r) => r.to === reg.slug && (r.type === "MENCABUT" || r.type === "MENGUBAH"))
    .map((r) => store.regulation(r.from))
    .filter((r): r is NonNullable<typeof r> => !!r);

  const relatedByTopic = store
    .regulations()
    .filter((other) => other.slug !== reg.slug && other.topik.some((t) => reg.topik.includes(t)))
    .slice(0, 6);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Legislation",
    name: reg.judul,
    legislationType: reg.jenis,
    datePublished: reg.tglPenetapan,
  };

  let ai: Awaited<ReturnType<typeof answerQuestion>> | null = null;
  if (tab === "ai") {
    ai = await answerQuestion(
      `Jelaskan isi, kewajiban utama, dan implikasi ${reg.judul} bagi PMIK`,
      { topK: 6 },
    );
  }

  const tabs = [
    ["ringkasan", "Ringkasan"],
    ["pasal", `Pasal (${pasals.length})`],
    ["hubungan", `Hubungan Regulasi (${rels.length})`],
    ["terkait", `Topik Terkait (${reg.topik.length})`],
    ["ai", "Analisis AI"],
  ] as const;

  const metadataItems: [string, string, boolean][] = [
    ["Nomor", reg.nomor, true],
    ["Tahun", String(reg.tahun), true],
    ["Jenis", reg.jenis, false],
    ["Instansi", reg.instansi, false],
    ["Penetapan", reg.tglPenetapan ?? "Belum tercatat", true],
    ["Mulai berlaku", reg.tglBerlaku ?? "Belum tercatat", true],
    ["Sumber resmi", reg.sumberResmi ?? "Belum tercatat", false],
    ["Terverifikasi", reg.verifiedAt ?? "Belum tercatat", true],
  ];

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <RememberVisit kind="regulation" label={reg.judul} href={`/regulasi/${reg.slug}`} />

      <header className="page-header">
        <Breadcrumb
          items={[
            { label: "Beranda", href: "/" },
            { label: "Regulasi", href: "/regulasi" },
            { label: store.shortRef(reg.slug) },
          ]}
        />
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h1>{reg.judul}</h1>
            <div className="mt-2.5 flex flex-wrap items-center gap-2">
              <StatusBadge status={reg.status} />
              <span className="text-xs font-medium text-ink-900/70">
                {reg.jenis} · {reg.instansi} · {reg.tahun}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <PrintButton label="Cetak / PDF" />
            <BookmarkButton type="regulasi" slug={reg.slug} title={reg.judul} />
            <a
              href={`/bandingkan?a=${encodeURIComponent(reg.slug)}`}
              className="btn-secondary min-h-10 px-3 py-2 text-sm"
            >
              Bandingkan
            </a>
          </div>
        </div>
      </header>

      {(reg.status === "DICABUT" || reg.status === "PERUBAHAN") && (
        <Alert
          variant={reg.status === "DICABUT" ? "error" : "warning"}
          title="Peringatan status keberlakuan peraturan"
          className="mb-5"
        >
          <p>
            {reg.status === "DICABUT"
              ? "Peraturan ini tercatat telah dicabut. Jangan menjadikannya dasar hukum aktif tanpa memeriksa ketentuan penggantinya."
              : "Peraturan ini tercatat mengalami perubahan. Periksa naskah perubahan dan ketentuan terbaru yang berlaku."}
          </p>
          {pengganti.length > 0 && (
            <p className="mt-1.5">
              <strong>Digantikan / diubah oleh:</strong>{" "}
              {pengganti.map((g, i) => (
                <span key={g.slug}>
                  {i > 0 ? "; " : ""}
                  <a className="font-semibold underline" href={`/regulasi/${g.slug}`}>
                    {g.judul}
                  </a>
                </span>
              ))}
            </p>
          )}
        </Alert>
      )}

      {reg.status === "BELUM_BERLAKU" && (
        <Alert
          variant="info"
          title="Peraturan masa transisi (belum mulai berlaku)"
          className="mb-5"
        >
          Peraturan ini telah ditetapkan ({reg.tglPenetapan ?? "tercatat"}), namun baru mulai berlaku efektif pada{" "}
          <strong>{reg.tglBerlaku ?? "tanggal yang ditentukan"}</strong>.
        </Alert>
      )}

      {(pasals.length === 0 || !reg.tglPenetapan || !reg.sumberResmi) && (
        <Alert
          variant="info"
          title="Cakupan data sebagian (Partial-data)"
          className="mb-5"
        >
          Metadata inti regulasi ini telah tercatat di katalog, namun{" "}
          {[
            pasals.length === 0 ? "rincian teks per pasal belum diindeks" : null,
            !reg.tglPenetapan ? "tanggal penetapan menunggu verifikasi dokumen fisik" : null,
            !reg.sumberResmi ? "tautan sumber resmi belum dicatat" : null,
          ]
            .filter(Boolean)
            .join(", ")}
          . Gunakan tautan sumber resmi atau peta hubungan untuk meninjau konteks hukumnya.
        </Alert>
      )}

      <dl className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 bg-white p-5 text-sm md:grid-cols-4">
        {metadataItems.map(([k, v, isMono]) => (
          <div key={k} className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">{k}</dt>
            <dd
              className={`mt-1 break-all ${
                isMono ? "font-mono text-xs font-semibold text-slate-800" : "font-medium text-slate-900"
              }`}
            >
              {k === "Sumber resmi" && v.startsWith("http") ? (
                <a
                  href={v}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-xs font-semibold text-teal-700 underline underline-offset-2 hover:text-teal-800"
                >
                  Buka dokumen resmi ↗
                </a>
              ) : (
                v
              )}
            </dd>
          </div>
        ))}
      </dl>

      <nav className="mt-6 flex gap-2 overflow-x-auto pb-1" aria-label="Tab informasi regulasi">
        {tabs.map(([id, label]) => {
          const active = tab === id;
          return (
            <a
              key={id}
              href={`/regulasi/${reg.slug}?tab=${id}`}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-lg px-4 py-2 text-xs font-bold transition-colors ${
                active
                  ? "bg-slate-900 text-white"
                  : "border border-slate-200 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-700"
              }`}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <div className="mt-4">
        {tab === "ringkasan" && (
          <div className="prose-pagar section-card">
            <h2>Ringkasan</h2>
            <p>{reg.ringkasan}</p>
            <h2>Topik</h2>
            {reg.topik.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {reg.topik.map((t) => (
                  <a
                    key={t}
                    href={`/topik/${t}`}
                    className="rounded-full border border-pagar-200 bg-pagar-50 px-3 py-1 text-xs font-bold text-pagar-800 hover:bg-pagar-100"
                  >
                    #{t}
                  </a>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-900/70">Belum ada topik yang dikaitkan.</p>
            )}
          </div>
        )}

        {tab === "pasal" && (
          <div className="grid gap-4">
            {pasals.length > 2 && (
              <nav
                aria-label="Lompat cepat ke pasal"
                className="print:hidden sticky top-14 z-20 flex flex-wrap items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-3"
              >
                <span className="mr-1 text-xs font-semibold text-pagar-800">Lompat ke:</span>
                {pasals.map((p) => (
                  <a
                    key={p.nomor}
                    href={`#pasal-${p.nomor}`}
                    className="inline-flex items-center rounded border border-ink-100 bg-ink-50 px-2 py-0.5 text-xs font-medium text-ink-900/80 transition-colors hover:border-pagar-400 hover:bg-pagar-50 hover:text-pagar-800 focus-visible:outline"
                  >
                    Pasal {p.nomor}
                  </a>
                ))}
              </nav>
            )}

            {pasals.map((p) => (
              <article key={p.nomor} id={`pasal-${p.nomor}`} className="section-card scroll-mt-28 space-y-3.5">
                <div className="flex flex-wrap items-start justify-between gap-2 border-b border-ink-100 pb-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-semibold text-pagar-800">Pasal {p.nomor}</h2>
                    {!p.isVerbatim && (
                      <span
                        className="rounded border px-2 py-0.5 text-[11px] font-bold"
                        style={{
                          color: "var(--warning)",
                          backgroundColor: "var(--warning-bg)",
                          borderColor: "var(--warning-border)",
                        }}
                      >
                        ringkasan terverifikasi
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <CopyCitationButton
                      citation={`${reg.judul}, Pasal ${p.nomor}:\n"${p.teksAsli}"`}
                      label="Salin kutipan"
                    />
                    <BookmarkButton type="pasal" slug={reg.slug} pasal={p.nomor} title={reg.judul} />
                  </div>
                </div>

                <LegalBlock kind="FAKTA HUKUM" title="Bunyi / Ringkasan Ketentuan">
                  <p className="legal-text">{p.teksAsli}</p>
                </LegalBlock>

                <div className="grid gap-3 md:grid-cols-2">
                  <LegalBlock kind="ANALISIS HUKUM" title="Apa artinya?">
                    <p>{p.artiSederhana}</p>
                  </LegalBlock>
                  <LegalBlock kind="REKOMENDASI KEPATUHAN" title="Relevansi untuk PMIK">
                    <p>{p.relevansiPmIK}</p>
                  </LegalBlock>
                </div>

                {p.risikoKepatuhan && (
                  <LegalBlock kind="RISIKO KEPATUHAN" title="Risiko Kepatuhan">
                    <p>{p.risikoKepatuhan}</p>
                  </LegalBlock>
                )}

                <div className="print:hidden">
                  <ExplainPasalButton
                    slug={reg.slug}
                    pasal={p.nomor}
                    regulasiJudul={reg.judul}
                  />
                </div>
              </article>
            ))}
            {pasals.length === 0 && (
              <EmptyState
                title="Belum ada pasal terindeks"
                description="Regulasi ini telah tercatat di katalog, namun rincian per pasal belum diindeks."
                actionLabel="Buka peta hubungan regulasi"
                actionHref={`/grafik?regulasi=${encodeURIComponent(reg.slug)}`}
              />
            )}
          </div>
        )}

        {tab === "hubungan" && (
          <div className="section-card space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-pagar-800">Hubungan Regulasi</h2>
              <a
                href={`/grafik?regulasi=${encodeURIComponent(reg.slug)}`}
                className="btn-secondary min-h-10 px-3 py-1.5 text-xs"
              >
                Lihat grafik hubungan untuk regulasi ini →
              </a>
            </div>
            {relationGraph.needsReviewCount > 0 && (
              <Alert variant="warning">
                {relationGraph.needsReviewCount} usulan hubungan (keluaran AI) butuh telaah hukum sebelum ditampilkan sebagai hubungan hukum, sehingga untuk sementara ditahan.
              </Alert>
            )}
            {relationGraph.pendingCount > 0 && (
              <Alert variant="warning">
                {relationGraph.pendingCount} catatan hubungan di katalog belum memiliki sumber resmi, rujukan pasal, dan tanggal verifikasi per relasi, sehingga tidak ditampilkan sebagai hubungan hukum.
              </Alert>
            )}
            {rels.length === 0 ? (
              <p className="text-sm text-ink-900/75">
                Belum ada hubungan terverifikasi yang dapat ditampilkan.
              </p>
            ) : (
              <ul className="space-y-2.5 text-sm">
                {rels.map((r, i) => {
                  const other = r.from === reg.slug ? r.to : r.from;
                  const target = store.regulation(other);
                  return (
                    <li key={i} className="rounded-xl border border-ink-100 bg-ink-50/60 p-3.5">
                      <span className="font-bold text-pagar-800">
                        {relationLabelForFocus(r, reg.slug)}
                      </span>{" "}
                      <a className="font-bold text-pagar-700 underline" href={`/regulasi/${other}`}>
                        {target?.judul ?? other}
                      </a>
                      {r.evidence?.sources.map((source) => (
                        <p
                          key={`${source.url}:${source.citation}`}
                          className="mt-1 text-xs text-ink-900/75"
                        >
                          Dasar relasi: {source.citation} ·{" "}
                          <a
                            className="font-semibold text-pagar-700 underline"
                            href={source.url}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Sumber resmi
                          </a>
                        </p>
                      ))}
                      {r.evidence?.verifiedAt && (
                        <p className="mt-1 text-xs text-ink-900/60">
                          Terverifikasi: {r.evidence.verifiedAt}
                        </p>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}

        {tab === "terkait" && (
          <div className="space-y-5">
            <div className="section-card">
              <h2 className="text-lg font-semibold text-pagar-800">Topik Terkait</h2>
              {reg.topik.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {reg.topik.map((t) => (
                    <a
                      key={t}
                      href={`/topik/${t}`}
                      className="rounded-full border border-pagar-200 bg-pagar-50 px-3 py-1.5 text-xs font-bold text-pagar-800 hover:bg-pagar-100"
                    >
                      #{t}
                    </a>
                  ))}
                </div>
              ) : (
                <p className="mt-2 text-sm text-ink-900/70">
                  Regulasi ini belum diklasifikasikan ke dalam topik tertentu.
                </p>
              )}
            </div>
            {relatedByTopic.length > 0 && (
              <section aria-labelledby="regulasi-sejenis">
                <h3 id="regulasi-sejenis" className="mb-3 text-base font-semibold text-pagar-800">
                  Regulasi lain pada topik yang sama
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {relatedByTopic.map((item) => (
                    <RegulationCard key={item.slug} r={item} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}

        {tab === "ai" && ai && (
          <div className="section-card space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-ink-100 pb-3">
              <h2 className="text-lg font-semibold text-pagar-800">Analisis AI Terverifikasi</h2>
              <ConfidenceBadge level={ai.confidence} />
            </div>
            <LegalBlock kind="ANALISIS HUKUM" title="Sintesis otomatis berbasis kutipan katalog">
              <p className="whitespace-pre-line text-[15px] leading-relaxed">
                <InlineMarkdown text={ai.answer} />
              </p>
            </LegalBlock>
            <div>
              <h3 className="text-sm font-bold text-pagar-800">Sumber kutipan yang digunakan</h3>
              <ul className="mt-2 space-y-1.5 text-sm">
                {ai.citations.map((c) => (
                  <li key={c.chunkId} className="rounded-lg bg-ink-50/70 px-3 py-2">
                    <span className="font-mono text-xs font-semibold text-pagar-700">
                      [{c.chunkId}]
                    </span>{" "}
                    {c.regulasiJudul}
                    {c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""}{" "}
                    <span className="text-xs text-ink-900/60">({c.trustLevel})</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
