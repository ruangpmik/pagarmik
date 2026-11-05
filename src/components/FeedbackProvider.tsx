"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
  type ReactNode,
} from "react";

export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastInput {
  type: ToastVariant;
  title?: string;
  message: string;
  duration?: number;
}

interface ToastItem extends ToastInput {
  id: string;
}

export interface ConfirmOptions {
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
}

interface FeedbackContextValue {
  toast: (input: ToastInput) => void;
  dismissToast: (id: string) => void;
  confirm: (options: ConfirmOptions) => Promise<boolean>;
  isOffline: boolean;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const TOAST_STYLE: Record<ToastVariant, { fg: string; bg: string; border: string; label: string }> = {
  success: {
    fg: "var(--success)",
    bg: "var(--success-bg)",
    border: "var(--success-border)",
    label: "Berhasil",
  },
  error: {
    fg: "var(--danger)",
    bg: "var(--danger-bg)",
    border: "var(--danger-border)",
    label: "Kesalahan",
  },
  warning: {
    fg: "var(--warning)",
    bg: "var(--warning-bg)",
    border: "var(--warning-border)",
    label: "Perhatian",
  },
  info: {
    fg: "var(--info)",
    bg: "var(--info-bg)",
    border: "var(--info-border)",
    label: "Informasi",
  },
};

function FeedbackIcon({ type }: { type: ToastVariant }) {
  const common = {
    viewBox: "0 0 24 24",
    className: "h-5 w-5 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };
  switch (type) {
    case "success":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="m8.5 12.5 2.3 2.3 4.7-4.8" />
        </svg>
      );
    case "error":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v4.5M12 16h.01" />
        </svg>
      );
    case "warning":
      return (
        <svg {...common}>
          <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
          <path d="M12 9v4M12 17h.01" />
        </svg>
      );
    case "info":
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 11v5M12 8h.01" />
        </svg>
      );
  }
}

export function useFeedback(): FeedbackContextValue {
  const ctx = useContext(FeedbackContext);
  if (!ctx) {
    return {
      toast: () => {},
      dismissToast: () => {},
      confirm: async () => true,
      isOffline: false,
    };
  }
  return ctx;
}

export default function FeedbackProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const [dialog, setDialog] = useState<(ConfirmOptions & { resolve: (val: boolean) => void }) | null>(null);
  const cancelBtnRef = useRef<HTMLButtonElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const dialogTitleId = useId();
  const dialogDescId = useId();

  const dismissToast = useCallback((id: string) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const dedupeKey = `${input.type}:${input.title ?? ""}:${input.message}`;
      const defaultDuration =
        input.type === "error" ? 9000 : input.type === "warning" ? 6500 : 4200;
      const duration = input.duration ?? defaultDuration;

      setToasts((prev) => {
        const existing = prev.find((item) => item.id === dedupeKey);
        if (existing) {
          return prev.map((item) => (item.id === dedupeKey ? { ...input, id: dedupeKey } : item));
        }
        return [...prev.slice(-3), { ...input, id: dedupeKey }];
      });

      const prevTimer = timersRef.current.get(dedupeKey);
      if (prevTimer) clearTimeout(prevTimer);

      if (duration > 0) {
        const timer = setTimeout(() => {
          timersRef.current.delete(dedupeKey);
          setToasts((prev) => prev.filter((item) => item.id !== dedupeKey));
        }, duration);
        timersRef.current.set(dedupeKey, timer);
      }
    },
    [],
  );

  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOffline(!window.navigator.onLine);

    const handleOffline = () => {
      setIsOffline(true);
      toast({
        type: "warning",
        title: "Koneksi terputus",
        message: "Anda sedang luring (offline). Simpanan lokal tetap tersedia, namun fitur server membutuhkan koneksi.",
      });
    };
    const handleOnline = () => {
      setIsOffline(false);
      toast({
        type: "success",
        title: "Koneksi pulih",
        message: "Peramban kembali terhubung ke jaringan.",
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [toast]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const confirm = useCallback((options: ConfirmOptions) => {
    if (typeof document !== "undefined" && document.activeElement instanceof HTMLElement) {
      previousFocusRef.current = document.activeElement;
    }
    return new Promise<boolean>((resolve) => {
      setDialog({ ...options, resolve });
    });
  }, []);

  const closeDialog = useCallback(
    (result: boolean) => {
      if (!dialog) return;
      const { resolve } = dialog;
      setDialog(null);
      resolve(result);
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
        previousFocusRef.current = null;
      }
    },
    [dialog],
  );

  useEffect(() => {
    if (!dialog) return;
    cancelBtnRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog(false);
        return;
      }
      if (event.key === "Tab") {
        const cancelEl = cancelBtnRef.current;
        const confirmEl = confirmBtnRef.current;
        if (!cancelEl || !confirmEl) return;
        if (event.shiftKey && document.activeElement === cancelEl) {
          event.preventDefault();
          confirmEl.focus();
        } else if (!event.shiftKey && document.activeElement === confirmEl) {
          event.preventDefault();
          cancelEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [dialog, closeDialog]);

  return (
    <FeedbackContext.Provider value={{ toast, dismissToast, confirm, isOffline }}>
      {isOffline && (
        <div
          role="alert"
          className="border-b px-4 py-2 text-center text-xs font-semibold"
          style={{
            backgroundColor: "var(--warning-bg)",
            borderColor: "var(--warning-border)",
            color: "var(--warning)",
          }}
        >
          Status jaringan luring (offline): Pencarian server dan AI tidak dapat diakses hingga koneksi kembali aktif.
        </div>
      )}
      {children}

      {/* Toast Notification Region */}
      <div
        className="pointer-events-none fixed inset-x-4 bottom-20 z-50 flex flex-col items-end gap-2 sm:inset-x-auto sm:right-6 sm:w-96 lg:bottom-6"
        aria-live="polite"
        aria-relevant="additions text"
      >
        {toasts.map((item) => {
          const style = TOAST_STYLE[item.type];
          return (
            <div
              key={item.id}
              role={item.type === "error" || item.type === "warning" ? "alert" : "status"}
              className="pointer-events-auto flex w-full items-start gap-3 rounded-lg border p-3.5 text-sm"
              style={{
                backgroundColor: style.bg,
                borderColor: style.border,
                color: "var(--text-primary)",
              }}
            >
              <span style={{ color: style.fg }} className="mt-0.5">
                <FeedbackIcon type={item.type} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold" style={{ color: style.fg }}>
                  {item.title ?? style.label}
                </p>
                <p className="mt-0.5 leading-relaxed text-ink-900/90">{item.message}</p>
              </div>
              <button
                type="button"
                onClick={() => dismissToast(item.id)}
                className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-ink-900/70 hover:bg-white/60 focus-visible:outline"
                aria-label="Tutup notifikasi"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="m6 6 12 12M18 6 6 18" />
                </svg>
              </button>
            </div>
          );
        })}
      </div>

      {/* Confirmation Dialog Modal */}
      {dialog && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/50 p-4"
          role="presentation"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDialog(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={dialogTitleId}
            aria-describedby={dialogDescId}
            className="w-full max-w-md rounded-lg border border-ink-100 bg-white p-5"
          >
            <h2 id={dialogTitleId} className="text-lg font-semibold text-pagar-800">
              {dialog.title}
            </h2>
            <p id={dialogDescId} className="mt-2 text-sm leading-relaxed text-ink-900/80">
              {dialog.description}
            </p>
            <div className="mt-5 flex flex-wrap justify-end gap-2">
              <button
                ref={cancelBtnRef}
                type="button"
                onClick={() => closeDialog(false)}
                className="btn-secondary"
              >
                {dialog.cancelLabel ?? "Batal"}
              </button>
              <button
                ref={confirmBtnRef}
                type="button"
                onClick={() => closeDialog(true)}
                className={dialog.tone === "danger" ? "btn-danger" : "btn-primary"}
              >
                {dialog.confirmLabel ?? "Konfirmasi"}
              </button>
            </div>
          </div>
        </div>
      )}
    </FeedbackContext.Provider>
  );
}
