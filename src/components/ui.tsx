import { STATUS_LABEL, type Regulation } from "@/lib/data/types";

export function StatusBadge({ status }: { status: Regulation["status"] }) {
  const colors: Record<string, string> = {
    BERLAKU: "var(--success)",
    BELUM_BERLAKU: "var(--text-muted)",
    BERLAKU_DENGAN_CATATAN: "var(--warning)",
    PERUBAHAN: "var(--brand-navy)",
    DICABUT: "var(--danger)",
    BELUM_DIVERIFIKASI: "var(--text-muted)",
  };
  return (
    <span className="inline-flex items-center gap-2 text-sm font-semibold" style={{ color: colors[status] }}>
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: colors[status] }} aria-hidden="true" />
      <span>{STATUS_LABEL[status]}</span>
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
    <a href={`/regulasi/${r.slug}`} className="block rounded-xl border border-ink-100 bg-white p-4 transition-colors hover:border-pagar-300 hover:bg-pagar-50">
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

export function SearchBar({
  action = "/legal-search",
  big = false,
  showAiLink = true,
  label = "Cari regulasi atau pertanyaan hukum",
  placeholder = 'Contoh: "Apa dasar hukum kerahasiaan rekam medis?"',
  submitLabel = "Cari Regulasi",
}: {
  action?: string;
  big?: boolean;
  showAiLink?: boolean;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
}) {
  return (
    <form action={action} method="get" role="search" className="grid gap-2">
      <label htmlFor="q" className="text-sm font-semibold text-pagar-800">{label}</label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id="q"
          name="q"
          required
          minLength={3}
          placeholder={placeholder}
          className={`min-h-11 min-w-0 flex-1 rounded-lg border border-ink-100 bg-white text-ink-900 placeholder:text-ink-900/60 ${big ? "px-5 py-3 text-base" : "px-4 py-2.5 text-sm"}`}
        />
        <button type="submit" className="min-h-11 whitespace-nowrap rounded-lg bg-pagar-700 px-5 py-2.5 text-sm font-bold text-white hover:bg-pagar-600">
          {submitLabel}
        </button>
        {showAiLink && (
          <a href="/ai" className="inline-flex min-h-11 items-center justify-center whitespace-nowrap rounded-lg border border-pagar-700 px-5 py-2.5 text-sm font-bold text-pagar-700 hover:bg-pagar-50">
            Tanya AI
          </a>
        )}
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
  ["BERLAKU", "Berlaku"],
  ["BELUM_BERLAKU", "Belum berlaku"],
  ["BERLAKU_DENGAN_CATATAN", "Berlaku dengan catatan"],
  ["PERUBAHAN", "Perubahan"],
  ["DICABUT", "Dicabut"],
  ["BELUM_DIVERIFIKASI", "Belum diverifikasi"],
];

/** Switcher status berlaku dan tidak berlaku dengan hitungan. */
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
    <div className="flex gap-1 overflow-x-auto rounded-xl border border-ink-100 bg-white p-1.5" role="group" aria-label="Filter status keberlakuan">
      {STATUS_OPTS.map(([v, label]) => {
        const active = (current ?? "") === v;
        const n = counts?.[v || "ALL"];
        return (
          <a
            key={v || "all"}
            href={href(v)}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${active ? "bg-pagar-700 text-white" : "text-ink-900/75 hover:bg-pagar-50 hover:text-pagar-700"}`}
          >
            {label}{typeof n === "number" ? ` · ${n}` : ""}
          </a>
        );
      })}
    </div>
  );
}
