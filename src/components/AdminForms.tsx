"use client";

import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { STATUS_LABEL, type RegulationStatus } from "@/lib/data/types";
import { useFeedback } from "@/components/FeedbackProvider";
import { SubmitButton } from "@/components/SubmitButton";

const MAX_PDF_BYTES = 25 * 1024 * 1024;

export function AdminIngestForm() {
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { toast } = useFeedback();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setFileInfo(null);
      setErrors((prev) => ({ ...prev, pdf: "" }));
      return;
    }
    const sizeMb = (file.size / (1024 * 1024)).toFixed(2);
    if (!file.name.toLowerCase().endsWith(".pdf") && file.type !== "application/pdf") {
      setErrors((prev) => ({
        ...prev,
        pdf: "Berkas wajib berformat PDF (.pdf).",
      }));
      setFileInfo(null);
      return;
    }
    if (file.size > MAX_PDF_BYTES) {
      setErrors((prev) => ({
        ...prev,
        pdf: `Ukuran berkas (${sizeMb} MB) melebihi batas maksimal 25 MB.`,
      }));
      setFileInfo(null);
      return;
    }
    setErrors((prev) => ({ ...prev, pdf: "" }));
    setFileInfo(`${file.name} (${sizeMb} MB) siap diproses.`);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    const form = e.currentTarget;
    const data = new FormData(form);
    const slug = String(data.get("slug") ?? "").trim();
    const ringkasan = String(data.get("ringkasan") ?? "").trim();
    const nextErrors: Record<string, string> = {};

    if (!/^[a-z0-9-]+$/.test(slug)) {
      nextErrors.slug = "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung (mis. permenkes-6-2026).";
    }
    if (ringkasan.length < 20) {
      nextErrors.ringkasan = `Ringkasan minimal 20 karakter (saat ini ${ringkasan.length} karakter).`;
    }
    if (errors.pdf) {
      nextErrors.pdf = errors.pdf;
    }

    if (Object.keys(nextErrors).length > 0) {
      e.preventDefault();
      setErrors(nextErrors);
      toast({
        type: "warning",
        title: "Periksa kembali isian formulir",
        message: "Terdapat isian metadata atau berkas yang belum memenuhi syarat validasi.",
      });
      return;
    }
    setErrors({});
  };

  return (
    <form
      action="/api/admin/ingest"
      method="post"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
      className="mt-4 grid gap-3 text-sm"
    >
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-1">
          <label htmlFor="ingest-slug" className="font-semibold text-pagar-800">
            Slug unik <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            id="ingest-slug"
            name="slug"
            required
            placeholder="mis. permenkes-6-2026"
            aria-invalid={Boolean(errors.slug)}
            className="form-input"
          />
          {errors.slug && (
            <p role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
              {errors.slug}
            </p>
          )}
        </div>

        <div className="grid gap-1">
          <label htmlFor="ingest-judul" className="font-semibold text-pagar-800">
            Judul regulasi <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input id="ingest-judul" name="judul" required className="form-input" />
        </div>

        <div className="grid gap-1">
          <label htmlFor="ingest-nomor" className="font-semibold text-pagar-800">
            Nomor <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            id="ingest-nomor"
            name="nomor"
            required
            placeholder="mis. 24"
            className="form-input"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="ingest-tahun" className="font-semibold text-pagar-800">
            Tahun <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            id="ingest-tahun"
            name="tahun"
            required
            inputMode="numeric"
            placeholder="mis. 2026"
            className="form-input"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="ingest-jenis" className="font-semibold text-pagar-800">
            Jenis regulasi <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input
            id="ingest-jenis"
            name="jenis"
            required
            placeholder="Permenkes, UU, PP"
            className="form-input"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="ingest-instansi" className="font-semibold text-pagar-800">
            Instansi penerbit <span style={{ color: "var(--danger)" }}>*</span>
          </label>
          <input id="ingest-instansi" name="instansi" required className="form-input" />
        </div>

        <div className="grid gap-1">
          <label htmlFor="ingest-topik" className="font-semibold text-pagar-800">
            Topik (pisahkan dengan koma)
          </label>
          <input
            id="ingest-topik"
            name="topik"
            placeholder="rekam-medis, privasi"
            className="form-input"
          />
        </div>

        <div className="grid gap-1">
          <label htmlFor="ingest-sumber" className="font-semibold text-pagar-800">
            URL sumber resmi (.go.id)
          </label>
          <input
            id="ingest-sumber"
            name="sumberResmi"
            type="url"
            placeholder="https://jdih.kemkes.go.id/..."
            className="form-input"
          />
        </div>
      </div>

      <div className="grid gap-1">
        <label htmlFor="ingest-ringkasan" className="font-semibold text-pagar-800">
          Ringkasan (minimal 20 karakter) <span style={{ color: "var(--danger)" }}>*</span>
        </label>
        <textarea
          id="ingest-ringkasan"
          name="ringkasan"
          required
          minLength={20}
          rows={2}
          aria-invalid={Boolean(errors.ringkasan)}
          className="form-input"
        />
        {errors.ringkasan && (
          <p role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
            {errors.ringkasan}
          </p>
        )}
      </div>

      <div className="grid gap-1">
        <label htmlFor="ingest-fulltext" className="font-semibold text-pagar-800">
          Teks lengkap (opsional bila mengunggah PDF)
        </label>
        <textarea id="ingest-fulltext" name="fullText" rows={4} className="form-input" />
      </div>

      <div className="grid gap-1">
        <label htmlFor="ingest-pdf" className="font-semibold text-pagar-800">
          Berkas PDF (opsional, maks. 25 MB)
        </label>
        <input
          id="ingest-pdf"
          name="pdf"
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          aria-describedby="ingest-hint ingest-privacy"
          className="min-h-11 text-sm"
        />
        {fileInfo && (
          <p className="text-xs font-semibold" style={{ color: "var(--success)" }} role="status">
            {fileInfo}
          </p>
        )}
        {errors.pdf && (
          <p role="alert" className="text-xs font-semibold" style={{ color: "var(--danger)" }}>
            {errors.pdf}
          </p>
        )}
      </div>

      <div>
        <SubmitButton
          loadingLabel="Memproses dokumen..."
          progressSteps={[
            "Memvalidasi metadata dan berkas PDF...",
            "Mengekstrak teks dan memisahkan pasal...",
            "Mengindeks ke repositori lokal...",
          ]}
        >
          Proses dan indeks
        </SubmitButton>
      </div>
    </form>
  );
}

const VERIFY_STATUS_OPTIONS: RegulationStatus[] = [
  "BERLAKU",
  "BELUM_BERLAKU",
  "BERLAKU_DENGAN_CATATAN",
  "PERUBAHAN",
  "DICABUT",
  "BELUM_DIVERIFIKASI",
];

export function AdminVerifyForm({
  slug,
  judul,
  currentStatus,
}: {
  slug: string;
  judul: string;
  currentStatus: RegulationStatus;
}) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const confirmedRef = useRef(false);
  const { confirm } = useFeedback();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    if (confirmedRef.current) {
      confirmedRef.current = false;
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    const nextStatus = String(data.get("status") ?? "") as RegulationStatus;

    if (nextStatus === "DICABUT" && currentStatus !== "DICABUT") {
      e.preventDefault();
      const ok = await confirm({
        title: "Tetapkan status DICABUT?",
        description: `Anda akan mengubah status "${judul}" menjadi DICABUT. Regulasi yang dicabut akan diberi peringatan merah pada halaman detail agar tidak dijadikan dasar hukum aktif.`,
        confirmLabel: "Ya, tetapkan DICABUT",
        cancelLabel: "Batal",
        tone: "danger",
      });
      if (ok && formRef.current) {
        confirmedRef.current = true;
        formRef.current.requestSubmit();
      }
    }
  };

  return (
    <form
      ref={formRef}
      action="/api/admin/verify"
      method="post"
      onSubmit={handleSubmit}
      className="mt-3 grid gap-2.5 border-t border-ink-100 pt-3"
    >
      <input type="hidden" name="slug" value={slug} />
      <div className="grid gap-2.5 sm:grid-cols-2">
        <label className="grid gap-1 text-xs font-semibold text-pagar-800">
          Status keberlakuan
          <select name="status" defaultValue={currentStatus} className="form-input">
            {VERIFY_STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status} ({STATUS_LABEL[status]})
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-1 text-xs font-semibold text-pagar-800">
          URL sumber resmi (opsional)
          <input
            name="sumberUrl"
            type="url"
            placeholder="https://jdih.kemkes.go.id/..."
            className="form-input"
          />
        </label>
      </div>
      <label className="grid gap-1 text-xs font-semibold text-pagar-800">
        Catatan audit verifikasi (min. 5 karakter) <span style={{ color: "var(--danger)" }}>*</span>
        <textarea
          name="catatan"
          required
          minLength={5}
          maxLength={1000}
          rows={2}
          placeholder="Sebutkan dasar pasal pencabutan/perubahan atau tanggal pengecekan JDIH..."
          className="form-input"
        />
      </label>
      <div>
        <SubmitButton loadingLabel="Menyimpan verifikasi..." className="min-h-10 px-3.5 py-2 text-xs">
          Simpan verifikasi
        </SubmitButton>
      </div>
    </form>
  );
}

