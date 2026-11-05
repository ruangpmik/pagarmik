import type { ReactNode } from "react";
import { STATUS_LABEL, type Regulation } from "@/lib/data/types";
import { SubmitButton } from "@/components/SubmitButton";

const STATUS_PALETTE: Record<string, { fg: string; bg: string; border: string }> = {
  BERLAKU: { fg: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300" },
  BELUM_BERLAKU: { fg: "text-slate-600", bg: "bg-slate-100", border: "border-slate-300" },
  BERLAKU_DENGAN_CATATAN: { fg: "text-amber-800", bg: "bg-amber-50", border: "border-amber-300" },
  PERUBAHAN: { fg: "text-sky-800", bg: "bg-sky-50", border: "border-sky-300" },
  DICABUT: { fg: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300" },
  BELUM_DIVERIFIKASI: { fg: "text-slate-600", bg: "bg-slate-100", border: "border-slate-300" },
};

export function StatusBadge({ status }: { status: Regulation["status"] }) {
  const p = STATUS_PALETTE[status] ?? STATUS_PALETTE.BELUM_DIVERIFIKASI;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[12px] font-semibold leading-none ${p.fg} ${p.bg} ${p.border}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      <span>{STATUS_LABEL[status]}</span>
    </span>
  );
}

const CONFIDENCE_PALETTE: Record<
  "HIGH" | "MEDIUM" | "LOW",
  { fg: string; bg: string; border: string; label: string }
> = {
  HIGH: {
    fg: "text-status-success",
    bg: "bg-status-success-bg",
    border: "border-status-success-border",
    label: "Tinggi (sumber primer cocok)",
  },
  MEDIUM: {
    fg: "text-status-warning",
    bg: "bg-status-warning-bg",
    border: "border-status-warning-border",
    label: "Sedang (rujukan terbatas)",
  },
  LOW: {
    fg: "text-ink-900/60",
    bg: "bg-ink-100/50",
    border: "border-ink-100",
    label: "Rendah (perlu verifikasi manual)",
  },
};

export function ConfidenceBadge({ level }: { level: "HIGH" | "MEDIUM" | "LOW" }) {
  const p = CONFIDENCE_PALETTE[level] ?? CONFIDENCE_PALETTE.LOW;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold leading-none ${p.fg} ${p.bg} ${p.border}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
      <span>Tingkat keyakinan: {p.label}</span>
    </span>
  );
}

export function Disclaimer() {
  return (
    <aside
      aria-label="Pernyataan batas informasi hukum"
      className="flex items-start gap-2.5 rounded-xl border border-status-warning-border bg-status-warning-bg p-3.5 text-xs leading-relaxed text-ink-900"
    >
      <svg
        viewBox="0 0 24 24"
        className="mt-0.5 h-4 w-4 shrink-0 text-status-warning"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4.5M12 16h.01" />
      </svg>
      <p>
        <strong className="font-semibold text-status-warning">
          Catatan edukasi hukum:
        </strong>{" "}
        Informasi pada PAGARMIK merupakan rujukan edukatif dan bukan pengganti pendapat hukum profesional. Selalu periksa naskah resmi pada JDIH instansi terkait.
      </p>
    </aside>
  );
}

const ALERT_PALETTE: Record<
  "info" | "success" | "warning" | "error",
  { fg: string; bg: string; border: string }
> = {
  info: { fg: "text-status-info", bg: "bg-status-info-bg", border: "border-status-info-border" },
  success: { fg: "text-status-success", bg: "bg-status-success-bg", border: "border-status-success-border" },
  warning: { fg: "text-status-warning", bg: "bg-status-warning-bg", border: "border-status-warning-border" },
  error: { fg: "text-status-danger", bg: "bg-status-danger-bg", border: "border-status-danger-border" },
};

export function Alert({
  variant = "info",
  title,
  children,
  action,
  className = "",
}: {
  variant?: "info" | "success" | "warning" | "error";
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const p = ALERT_PALETTE[variant];
  const role = variant === "error" || variant === "warning" ? "alert" : "status";
  return (
    <div
      role={role}
      className={`flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed text-ink-900 ${p.bg} ${p.border} ${className}`.trim()}
    >
      <span className={`mt-0.5 shrink-0 ${p.fg}`} aria-hidden="true">
        {variant === "success" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="m8.5 12.5 2.3 2.3 4.7-4.8" />
          </svg>
        ) : variant === "error" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4.5M12 16h.01" />
          </svg>
        ) : variant === "warning" ? (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <path d="M12 9v4M12 17h.01" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 11v5M12 8h.01" />
          </svg>
        )}
      </span>
      <div className="min-w-0 flex-1">
        {title && (
          <p className={`font-semibold ${p.fg}`}>
            {title}
          </p>
        )}
        <div className={title ? "mt-1" : ""}>{children}</div>
        {action && <div className="mt-2.5">{action}</div>}
      </div>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children?: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-dashed border-ink-100 bg-white p-6 text-center">
      <p className="text-base font-semibold text-pagar-800">{title}</p>
      <p className="mx-auto mt-1 max-w-lg text-sm leading-relaxed text-ink-900/75">{description}</p>
      {actionLabel && actionHref && (
        <div className="mt-4">
          <a href={actionHref} className="btn-secondary">
            {actionLabel}
          </a>
        </div>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-3">
      <ol className="flex flex-wrap items-center gap-1.5 text-xs font-medium text-ink-900/70">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={`${item.label}:${idx}`} className="inline-flex items-center gap-1.5">
              {idx > 0 && <span aria-hidden="true">/</span>}
              {item.href && !isLast ? (
                <a href={item.href} className="font-semibold text-pagar-700 underline-offset-2 hover:underline">
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-ink-900/80">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function LegalBlock({
  kind,
  title,
  children,
}: {
  kind: "FAKTA HUKUM" | "ANALISIS HUKUM" | "RISIKO KEPATUHAN" | "REKOMENDASI KEPATUHAN";
  title?: string;
  children: ReactNode;
}) {
  const tone =
    kind === "FAKTA HUKUM"
      ? { fg: "text-sky-800", bg: "bg-sky-50", border: "border-sky-200", accent: "border-l-sky-600" }
      : kind === "RISIKO KEPATUHAN"
        ? { fg: "text-rose-800", bg: "bg-rose-50", border: "border-rose-200", accent: "border-l-rose-500" }
        : kind === "REKOMENDASI KEPATUHAN"
          ? { fg: "text-teal-800", bg: "bg-teal-50", border: "border-teal-200", accent: "border-l-teal-600" }
          : { fg: "text-purple-800", bg: "bg-purple-50", border: "border-purple-200", accent: "border-l-purple-600" };

  return (
    <div className={`legal-block rounded-xl border border-slate-200 border-l-4 ${tone.accent} bg-white p-4 shadow-xs`}>
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[11px] font-bold tracking-wide ${tone.fg} ${tone.bg} ${tone.border}`}
        >
          {kind}
        </span>
        {title && <h3 className="text-sm font-bold text-slate-800">{title}</h3>}
      </div>
      <div className="mt-2 text-sm leading-relaxed text-slate-700">{children}</div>
    </div>
  );
}

export function RegulationCard({ r }: { r: Regulation }) {
  return (
    <a
      href={`/regulasi/${r.slug}`}
      className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 transition-all duration-150 hover:border-teal-500 hover:bg-teal-50/20"
    >
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={r.status} />
          <span className="font-mono text-xs font-semibold text-slate-500">
            {r.jenis} No. {r.nomor}/{r.tahun}
          </span>
        </div>
        <h3 className="mt-3 font-semibold leading-snug text-slate-900 hover:text-teal-700">{r.judul}</h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">{r.ringkasan}</p>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
        <span className="font-medium text-slate-700">{r.instansi}</span>
        <span>Terverifikasi: {r.verifiedAt ?? "Belum tercatat"}</span>
      </div>
    </a>
  );
}

export function SearchBar({
  id = "q",
  action = "/legal-search",
  big = false,
  showAiLink = true,
  defaultValue = "",
  label = "Cari regulasi atau pertanyaan hukum",
  placeholder = 'Contoh: "Apa dasar hukum kerahasiaan rekam medis?"',
  submitLabel = "Cari Regulasi",
  helperText,
}: {
  id?: string;
  action?: string;
  big?: boolean;
  showAiLink?: boolean;
  defaultValue?: string;
  label?: string;
  placeholder?: string;
  submitLabel?: string;
  helperText?: string;
}) {
  const hintId = helperText ? `${id}-hint` : undefined;
  return (
    <form action={action} method="get" role="search" className="grid gap-2">
      <label htmlFor={id} className="text-sm font-semibold text-pagar-800">
        {label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={id}
          name="q"
          type="search"
          defaultValue={defaultValue}
          required
          minLength={3}
          aria-describedby={hintId}
          placeholder={placeholder}
          className={`min-h-11 min-w-0 flex-1 rounded-lg border border-ink-100 bg-white text-ink-900 placeholder:text-ink-900/60 ${
            big ? "px-5 py-3 text-base" : "px-4 py-2.5 text-sm"
          }`}
        />
        <SubmitButton loadingLabel="Mencari..." className="whitespace-nowrap px-5 py-2.5">
          {submitLabel}
        </SubmitButton>
        {showAiLink && (
          <a
            href="/ai"
            className="btn-secondary whitespace-nowrap px-5 py-2.5"
          >
            Tanya AI
          </a>
        )}
      </div>
      {helperText && (
        <p id={hintId} className="text-xs text-ink-900/70">
          {helperText}
        </p>
      )}
    </form>
  );
}

export function ScoreBar({ score }: { score: number }) {
  const pct = Math.round(Math.min(1, Math.max(0, score)) * 100);
  return (
    <span className="inline-flex items-center gap-1.5" title={`Skor relevansi ${pct}%`}>
      <span className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
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
export function StatusSwitcher({
  base,
  current,
  extra,
  counts,
}: {
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
    <div
      className="flex gap-1 overflow-x-auto rounded-xl border border-ink-100 bg-white p-1.5"
      role="group"
      aria-label="Filter status keberlakuan"
    >
      {STATUS_OPTS.map(([v, label]) => {
        const active = (current ?? "") === v;
        const n = counts?.[v || "ALL"];
        return (
          <a
            key={v || "all"}
            href={href(v)}
            aria-current={active ? "page" : undefined}
            className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-bold transition-colors ${
              active
                ? "bg-pagar-700 text-white"
                : "text-ink-900/75 hover:bg-pagar-50 hover:text-pagar-700"
            }`}
          >
            {label}
            {typeof n === "number" ? ` · ${n}` : ""}
          </a>
        );
      })}
    </div>
  );
}
