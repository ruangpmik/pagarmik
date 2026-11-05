export default function Loading() {
  return (
    <div
      className="space-y-5"
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label="Memuat konten halaman"
    >
      <div className="page-header space-y-3">
        <div className="h-3.5 w-36 rounded bg-ink-100" />
        <div className="h-8 w-72 max-w-full rounded bg-ink-100" />
        <div className="h-4 w-full max-w-2xl rounded bg-ink-100/80" />
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
        <div className="pagar-progress-bar h-full w-1/3 rounded-full bg-pagar-700" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="section-card space-y-3">
          <div className="h-5 w-28 rounded bg-ink-100" />
          <div className="h-5 w-3/4 rounded bg-ink-100" />
          <div className="h-4 w-full rounded bg-ink-100/70" />
          <div className="h-4 w-2/3 rounded bg-ink-100/70" />
        </div>
        <div className="section-card space-y-3">
          <div className="h-5 w-28 rounded bg-ink-100" />
          <div className="h-5 w-3/4 rounded bg-ink-100" />
          <div className="h-4 w-full rounded bg-ink-100/70" />
          <div className="h-4 w-2/3 rounded bg-ink-100/70" />
        </div>
      </div>
      <span className="sr-only">Sedang memuat konten hukum...</span>
    </div>
  );
}

