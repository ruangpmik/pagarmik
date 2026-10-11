import { STATUS_LABEL, type Regulation } from "@/lib/data/types";

export function StatusBadge({ status }: { status: Regulation["status"] }) {
  const map: Record<string, string> = {
    BERLAKU: "bg-emerald-50 text-emerald-800 border-emerald-200",
    BERLAKU_DENGAN_CATATAN: "bg-yellow-50 text-yellow-800 border-yellow-200",
    PERUBAHAN: "bg-orange-50 text-orange-800 border-orange-200",
    DICABUT: "bg-red-50 text-red-800 border-red-200",
    BELUM_DIVERIFIKASI: "bg-gray-50 text-gray-700 border-gray-200",
  };
  return (
    <span className={`inline-block rounded-full border px-2.5 py-0.5 text-xs font-semibold ${map[status]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function ConfidenceBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const map = {
    HIGH: "bg-emerald-600",
    MEDIUM: "bg-amber-500",
    LOW: "bg-gray-400",
  } as const;
  return (
    <span className="inline-flex items-center gap-1.5 text-xs font-semibold">
      <span className={`h-2 w-2 rounded-full ${map[level]}`} aria-hidden />
      Confidence: {level === "HIGH" ? "High" : level === "MEDIUM" ? "Medium" : "Low"}
    </span>
  );
}

export function Disclaimer() {
  return (
    <p className="rounded-xl border border-gold-400/40 bg-amber-50 p-3 text-xs leading-relaxed text-amber-900">
      Informasi pada PAGARMIK merupakan informasi edukatif dan bukan pengganti pendapat hukum profesional.
    </p>
  );
}

export function RegulationCard({ r }: { r: Regulation }) {
  return (
    <a href={`/regulasi/${r.slug}`} className="block rounded-2xl border border-ink-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div className="flex flex-wrap items-center gap-2">
        <StatusBadge status={r.status} />
        <span className="text-xs text-ink-900/60">{r.jenis} · {r.tahun}</span>
      </div>
      <h3 className="mt-2 font-bold leading-snug text-pagar-800">{r.judul}</h3>
      <p className="mt-1 line-clamp-2 text-sm text-ink-900/70">{r.ringkasan}</p>
      <p className="mt-2 text-xs text-ink-900/50">
        {r.instansi} · Terverifikasi: {r.verifiedAt ?? "—"}
      </p>
    </a>
  );
}

export function SearchBar({ action = "/legal-search", big = false }: { action?: string; big?: boolean }) {  return (
    <form action={action} method="get" role="search" className={`flex gap-2 ${big ? "flex-col sm:flex-row" : ""}`}>
      <label htmlFor="q" className="sr-only">Cari regulasi atau tanya hukum</label>
      <input
        id="q"
        name="q"
        required
        minLength={3}
        placeholder='🔍 "Apa dasar hukum kerahasiaan rekam medis?"'
        className={`w-full rounded-2xl border border-ink-100 bg-white text-ink-900 shadow-sm outline-none placeholder:text-ink-900/40 focus:border-pagar-500 focus:ring-2 focus:ring-pagar-100 ${big ? "px-5 py-4 text-base" : "px-4 py-2.5 text-sm"}`}
      />
      <div className={`flex gap-2 ${big ? "" : ""}`}>
        <button type="submit" className="whitespace-nowrap rounded-2xl bg-pagar-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-pagar-600">
          Cari Regulasi
        </button>
        <a href="/ai" className="whitespace-nowrap rounded-2xl border border-pagar-700 px-5 py-2.5 text-sm font-bold text-pagar-700 hover:bg-pagar-50">
          Tanya AI
        </a>
      </div>
    </form>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, score)) * 100);
  return (
    <span className="inline-flex items-center gap-1.5" title={`Skor relevansi ${pct}%`}>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100" aria-hidden>
        <span className="block h-full rounded-full bg-pagar-600" style={{ width: `${pct}%` }} />
      </span>
      <span className="text-[11px] font-bold text-pagar-700">{pct}% relevan</span>
    </span>
  );
}

const STATUS_OPTS: [string, string][] = [
  ["", "Semua"],
  ["BERLAKU", "🟢 Berlaku"],
  ["BERLAKU_DENGAN_CATATAN", "🟡 Catatan"],
  ["PERUBAHAN", "🟠 Perubahan"],
  ["DICABUT", "🔴 Dicabut"],
  ["BELUM_DIVERIFIKASI", "⚪ Belum verif"],
];

/** Switcher Berlaku ↔ Tidak Berlaku (+ status lain) dengan hitungan. */
export function StatusSwitcher({ base, current, extra, counts }: {
  base: string;
  current?: string;
  extra?: Record<string, string>;
  counts?: Record<string, number>;
}) {
  const href = (s: string) => {
    const p = new URLSearchParams();
    for (const [k, v] of Object.entries(extra ?? {})) if (v) p.set(k, v);
    if (s) p.set("status", s);
    const qs = p.toString();
    return qs ? `${base}?${qs}` : base;
  };
  return (
    <div className="flex gap-1 overflow-x-auto rounded-2xl border border-ink-100 bg-white p-1.5 shadow-sm" role="group" aria-label="Filter status keberlakuan">
      {STATUS_OPTS.map(([v, label]) => {
        const active = (current ?? "") === v;
        const n = counts?.[v || "ALL"];
        return (
          <a
            key={v || "all"}
            href={href(v)}
            aria-pressed={active}
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold transition ${active ? "bg-pagar-700 text-white shadow" : "text-ink-900/70 hover:bg-pagar-50 hover:text-pagar-700"}`}
          >
            {label}{typeof n === "number" ? ` · ${n}` : ""}
          </a>
        );
      })}
    </div>
  );
}
