// Label, tipe, dan tone presentasional modul kepatuhan.
// Dipisah dari store.ts (yang menyentuh fs) agar aman diimpor komponen client.

export type MatterStatus = "BARU" | "TINDAK_LANJUT" | "SELESAI";
export type MatterPriority = "TINGGI" | "SEDANG" | "RENDAH";
export type MatterTipe = "RMIK" | "PDP" | "RME" | "KEBIJAKAN_INTERNAL" | "LAIN";

export interface MatterAuditEvent {
  at: string;
  actor: string;
  action: "CREATE" | "UPDATE_STATUS";
  detail: string;
}

export interface Matter {
  id: string;
  judul: string;
  deskripsi: string;
  tipe: MatterTipe;
  status: MatterStatus;
  prioritas: MatterPriority;
  tenggat?: string; // YYYY-MM-DD
  ownedBy: string; // email
  ownerName: string;
  createdAt: string;
  updatedAt: string;
  audit: MatterAuditEvent[];
}

export const MATTER_STATUS_LABEL: Record<MatterStatus, string> = {
  BARU: "Baru",
  TINDAK_LANJUT: "Tindak lanjut",
  SELESAI: "Selesai",
};

export const MATTER_PRIORITY_LABEL: Record<MatterPriority, string> = {
  TINGGI: "Tinggi",
  SEDANG: "Sedang",
  RENDAH: "Rendah",
};

export const MATTER_TIPE_LABEL: Record<MatterTipe, string> = {
  RMIK: "Rekam Medis & MIK",
  PDP: "Pelindungan Data Pribadi",
  RME: "Rekam Medis Elektronik",
  KEBIJAKAN_INTERNAL: "Kebijakan Internal Fasyankes",
  LAIN: "Lainnya",
};

/** Ramp status/prioritas materi (dipakai badge UI). */
export const MATTER_STATUS_TONE: Record<MatterStatus, { fg: string; bg: string; border: string }> = {
  BARU: { fg: "text-sky-800", bg: "bg-sky-50", border: "border-sky-300" },
  TINDAK_LANJUT: { fg: "text-amber-800", bg: "bg-amber-50", border: "border-amber-300" },
  SELESAI: { fg: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-300" },
};

export const MATTER_PRIORITY_TONE: Record<MatterPriority, { fg: string; bg: string; border: string }> = {
  TINGGI: { fg: "text-rose-700", bg: "bg-rose-50", border: "border-rose-300" },
  SEDANG: { fg: "text-amber-800", bg: "bg-amber-50", border: "border-amber-300" },
  RENDAH: { fg: "text-slate-600", bg: "bg-slate-100", border: "border-slate-300" },
};