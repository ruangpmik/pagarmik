"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";

export function SubmitButton({
  children,
  loadingLabel = "Memproses...",
  variant = "primary",
  className = "",
  disabled = false,
  progressSteps,
}: {
  children: ReactNode;
  loadingLabel?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  disabled?: boolean;
  progressSteps?: string[];
}) {
  const [submitting, setSubmitting] = useState(false);
  const [stepIdx, setStepIdx] = useState(0);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    setSubmitting(false);
    setStepIdx(0);
  }, [pathname]);

  useEffect(() => {
    const btn = btnRef.current;
    const form = btn?.closest("form");
    if (!form) return;

    const handleSubmit = (event: SubmitEvent) => {
      if (submitting) {
        event.preventDefault();
        return;
      }
      if (!form.checkValidity()) {
        return;
      }
      setSubmitting(true);
      setStepIdx(0);
    };

    form.addEventListener("submit", handleSubmit);
    return () => form.removeEventListener("submit", handleSubmit);
  }, [submitting]);

  useEffect(() => {
    if (!submitting) return;
    // Safety reset if navigation returns to same route with updated query params
    const resetTimer = setTimeout(() => setSubmitting(false), 8000);
    let stepTimer: ReturnType<typeof setInterval> | undefined;
    if (progressSteps && progressSteps.length > 1) {
      stepTimer = setInterval(() => {
        setStepIdx((prev) => (prev < progressSteps.length - 1 ? prev + 1 : prev));
      }, 900);
    }
    return () => {
      clearTimeout(resetTimer);
      if (stepTimer) clearInterval(stepTimer);
    };
  }, [submitting, progressSteps]);

  const baseClass =
    variant === "danger"
      ? "btn-danger"
      : variant === "secondary"
        ? "btn-secondary"
        : "btn-primary";

  const activeStepLabel =
    submitting && progressSteps && progressSteps.length > 0
      ? progressSteps[stepIdx]
      : loadingLabel;

  return (
    <>
      <button
        ref={btnRef}
        type="submit"
        disabled={disabled || submitting}
        aria-busy={submitting}
        className={`${baseClass} ${className}`.trim()}
      >
        {submitting && (
          <svg
            viewBox="0 0 24 24"
            className="pagar-spinner h-4 w-4 shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="9" strokeOpacity="0.3" />
            <path d="M12 3a9 9 0 0 1 9 9" />
          </svg>
        )}
        <span>{submitting ? activeStepLabel : children}</span>
      </button>
      {submitting && progressSteps && progressSteps.length > 0 && (
        <div className="col-span-full mt-2" role="status" aria-live="polite">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink-100" aria-hidden="true">
            <div className="pagar-progress-bar h-full w-2/5 rounded-full bg-pagar-700" />
          </div>
          <p className="mt-1 text-xs font-medium text-ink-900/75">
            Tahap berjalan: {activeStepLabel}
          </p>
        </div>
      )}
    </>
  );
}

