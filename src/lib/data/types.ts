// Tipe domain PAGARMIK — dipakai JsonFileDb (mode demo tanpa DB)
// dan PrismaDb (production). Satu kontrak, dua implementasi.

export type RegulationStatus =
  | "BERLAKU"
  | "BERLAKU_DENGAN_CATATAN"
  | "PERUBAHAN"
  | "DICABUT"
  | "BELUM_DIVERIFIKASI";

export type TrustLevel =
  | "L1_PRIMER"
  | "L2_REPOSITORI_RESMI"
  | "L3_PUTUSAN_INSTITUSI"
  | "L4_AKADEMIK"
  | "L5_KOMENTAR_SEKUNDER";

export interface Regulation {
  slug: string;
  judul: string;
  nomor: string;
  tahun: number;
  jenis: string;
  instansi: string;
  status: RegulationStatus;
  tglPenetapan?: string;
  tglBerlaku?: string;
  sumberResmi?: string;
  ringkasan: string;
  topik: string[];
  verifiedAt?: string;
  /** Override trust level chunk (default L1 untuk pasal, L2 untuk ikhtisar). Putusan → L3. */
  trustLevel?: TrustLevel;
}

export interface Pasal {
  regulationSlug: string;
  nomor: string;
  teksAsli: string;
  isVerbatim: boolean;
  artiSederhana: string;
  relevansiPmIK: string;
  risikoKepatuhan?: string;
}

export interface LegalChunk {
  id: string; // "{slug}:pasal-{nomor}:{idx}"
  regulationSlug: string;
  regulasiJudul: string;
  pasalNomor?: string;
  teks: string;
  topik: string[];
  trustLevel: TrustLevel;
  authority: number; // bobot otoritas jenis regulasi (UU=1.0 ... SE=0.5)
  tahun: number;
}

export interface Citation {
  chunkId: string;
  regulationSlug: string;
  regulasiJudul: string;
  pasalNomor?: string;
  kutipan: string;
  trustLevel: TrustLevel;
}

export interface Topic {
  slug: string;
  nama: string;
  ikon: string;
  deskripsi: string;
}

export interface KnowledgeArticle {
  slug: string;
  judul: string;
  ringkasan: string;
  konten: string;
  dasarHukum: string[];
  topik: string[];
  verifiedAt?: string;
}

export interface Relation {
  from: string;
  to: string;
  type: "MENCABUT" | "MENGUBAH" | "MELAKSANAKAN" | "MERUJUK" | "TURUNAN" | "MEMPERKUAT" | "BERIRISAN";
}

export const STATUS_LABEL: Record<RegulationStatus, string> = {
  BERLAKU: "🟢 BERLAKU",
  BERLAKU_DENGAN_CATATAN: "🟡 BERLAKU DENGAN CATATAN",
  PERUBAHAN: "🟠 PERUBAHAN",
  DICABUT: "🔴 DICABUT",
  BELUM_DIVERIFIKASI: "⚪ BELUM DIVERIFIKASI",
};

export const TRUST_LABEL: Record<TrustLevel, string> = {
  L1_PRIMER: "Level 1 — Sumber hukum primer resmi",
  L2_REPOSITORI_RESMI: "Level 2 — Repositori pemerintah (JDIH)",
  L3_PUTUSAN_INSTITUSI: "Level 3 — Putusan/dokumen institusi resmi",
  L4_AKADEMIK: "Level 4 — Sumber akademik",
  L5_KOMENTAR_SEKUNDER: "Level 5 — Komentar sekunder",
};

export const LEGAL_DISCLAIMER =
  "PAGARMIK adalah platform informasi dan edukasi hukum. Informasi yang diberikan oleh sistem AI bukan merupakan pendapat hukum profesional dan tidak menggantikan konsultasi dengan advokat atau ahli hukum yang kompeten.";

export const NO_SOURCE_MESSAGE =
  "Saya belum menemukan dasar hukum primer yang cukup untuk menjawab pertanyaan ini.";
