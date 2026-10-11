// RAG pipeline PAGARMIK:
// Question → Query Understanding → Hybrid Retrieval → Rerank → Context → LLM → Citation Validator → Response.
// Anti-halusinasi: jawaban tanpa sitasi valid → pesan NO_SOURCE + confidence LOW.

import { hybridSearch, type SearchFilters } from "@/lib/search/hybrid";
import { detectTopics } from "@/lib/nlp/tokenize";
import { getLlmProvider, type ChatMessage } from "@/lib/ai/providers";
import { verifyCitations, sanitizeAnswer } from "@/lib/citation/validator";
import { getStore } from "@/lib/data/store";
import { NO_SOURCE_MESSAGE, type Citation } from "@/lib/data/types";

export type Confidence = "HIGH" | "MEDIUM" | "LOW";

export interface RagAnswer {
  answer: string;
  citations: Citation[];
  confidence: Confidence;
  evidence: { chunkId: string; score: number }[];
  disclaimer: string;
  noSource: boolean;
  invalidCitationsDropped: string[];
}

const SYSTEM_RULES = `Anda adalah PAGARMIK AI, asisten riset hukum untuk Rekam Medis & Informasi Kesehatan Indonesia.
ATURAN KERAS:
1. Jawab HANYA berdasarkan KONTEKS dokumen yang diberikan. Setiap klaim hukum WAJIB disertai sitasi [chunk-id].
2. DILARANG mengarang nomor peraturan, pasal, kutipan, atau status berlaku.
3. Jika konteks tidak cukup, jawab persis: "${NO_SOURCE_MESSAGE}"
4. Bedakan tiga label: NORMA HUKUM (dari sumber) vs INTERPRETASI (penalaran AI) vs REKOMENDASI PRAKTIS.
5. Akhiri dengan tingkat keyakinan (High/Medium/Low) berdasarkan jumlah dan level sumber.`;

export function sanitizeUserQuery(q: string): string {
  // Prompt-injection protection lapis 1: netralisasi instruksi dalam input user.
  return q
    .replace(/(ignore|abaikan).{0,40}(instruction|instruksi|system|prompt)/gi, "[dihapus: instruksi]")
    .replace(/(system|developer)\s*:/gi, "pengguna:")
    .slice(0, 2000);
}

export async function answerQuestion(
  rawQuery: string,
  opts: { filters?: SearchFilters; topK?: number } = {}
): Promise<RagAnswer> {
  const query = sanitizeUserQuery(rawQuery);
  const store = getStore();
  const chunks = store.allChunks();
  const meta = store.regulationMeta();

  const retrieved = hybridSearch(query, chunks, {
    filters: opts.filters,
    topK: opts.topK ?? 8,
    regulationMeta: meta,
  });

  const disclaimer =
    "Informasi pada PAGARMIK merupakan informasi edukatif dan bukan pengganti pendapat hukum profesional.";

  if (!retrieved.length) {
    return {
      answer: NO_SOURCE_MESSAGE,
      citations: [],
      confidence: "LOW",
      evidence: [],
      disclaimer,
      noSource: true,
      invalidCitationsDropped: [],
    };
  }

  // Gate relevansi: skor tertinggi di bawah ambang → nyatakan tidak cukup bukti
  // (jangan memaksakan jawaban dari kecocokan satu token generik). Dekat tapi lemah
  // tetap ditampilkan sebagai kandidat agar transparan.
  const MIN_TOP_SCORE = 0.38;
  if (retrieved[0].score < MIN_TOP_SCORE) {
    return {
      answer: NO_SOURCE_MESSAGE,
      citations: retrieved.slice(0, 3).map((r) => ({
        chunkId: r.chunk.id,
        regulationSlug: r.chunk.regulationSlug,
        regulasiJudul: r.chunk.regulasiJudul,
        pasalNomor: r.chunk.pasalNomor,
        kutipan: r.chunk.teks.slice(0, 280),
        trustLevel: r.chunk.trustLevel,
      })),
      confidence: "LOW",
      evidence: retrieved.map((r) => ({ chunkId: r.chunk.id, score: r.score })),
      disclaimer,
      noSource: true,
      invalidCitationsDropped: [],
    };
  }

  const context = retrieved
    .map((r) => {
      const pn = r.chunk.pasalNomor;
      const pasalLabel = !pn ? "Ikhtisar" : /^\d/.test(pn) ? `Pasal ${pn}` : `bagian "${pn}"`;
      return `[CTX:${r.chunk.id} | ${store.shortRef(r.chunk.regulationSlug)} | ${pasalLabel} | ${r.chunk.trustLevel} | ${r.score.toFixed(2)} | topik:${r.chunk.topik.join(",")}]\n${r.chunk.teks}`;
    })
    .join("\n\n");

  const topics = detectTopics(query);
  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM_RULES },
    {
      role: "user",
      content: `KONTEKS DOKUMEN:\n${context}\n\nPERTANYAAN: ${query}\n${topics.length ? `TOPIK TERDETEKSI: ${topics.join(", ")}` : ""}\n\nSusun jawaban terstruktur: 1) Simpulan 2) Key Points dengan format "Merujuk pada Pasal X [Nama Regulasi]" + sitasi [id] 3) Keterkaitan Antar Aturan (pasangan ketentuan dari regulasi berbeda yang mengatur topik sama) 4) Analisis & Implikasi untuk PMIK dengan label NORMA HUKUM / INTERPRETASI / REKOMENDASI PRAKTIS 5) Confidence.`,
    },
  ];

  let draft: string;
  try {
    draft = await getLlmProvider().generate(messages);
  } catch {
    draft = "NO_SOURCE";
  }

  if (draft.trim() === "NO_SOURCE") {
    return {
      answer: NO_SOURCE_MESSAGE,
      citations: retrieved.slice(0, 3).map((r) => ({
        chunkId: r.chunk.id,
        regulationSlug: r.chunk.regulationSlug,
        regulasiJudul: r.chunk.regulasiJudul,
        pasalNomor: r.chunk.pasalNomor,
        kutipan: r.chunk.teks.slice(0, 280),
        trustLevel: r.chunk.trustLevel,
      })),
      confidence: "LOW",
      evidence: retrieved.map((r) => ({ chunkId: r.chunk.id, score: r.score })),
      disclaimer,
      noSource: true,
      invalidCitationsDropped: [],
    };
  }

  const { valid, invalidIds } = verifyCitations(draft, retrieved.map((r) => r.chunk));
  const answer = sanitizeAnswer(draft, invalidIds);

  // Confidence: HIGH jika ≥2 sumber L1/L2 berbeda regulasi; MEDIUM jika 1 sumber primer; LOW jika hanya sekunder/tak valid.
  const primaries = valid.filter((c) => c.trustLevel === "L1_PRIMER" || c.trustLevel === "L2_REPOSITORI_RESMI");
  const distinctRegs = new Set(valid.map((c) => c.regulationSlug)).size;
  const confidence: Confidence =
    primaries.length >= 2 && distinctRegs >= 2 ? "HIGH" : primaries.length >= 1 ? "MEDIUM" : "LOW";

  return {
    answer: valid.length ? answer : `${NO_SOURCE_MESSAGE}\n\nDokumen terdekat yang ditemukan belum cukup kuat untuk dijadikan dasar jawaban. Lihat daftar sumber di bawah.`,
    citations: valid.length ? valid : retrieved.slice(0, 3).map((r) => ({
      chunkId: r.chunk.id, regulationSlug: r.chunk.regulationSlug, regulasiJudul: r.chunk.regulasiJudul,
      pasalNomor: r.chunk.pasalNomor, kutipan: r.chunk.teks.slice(0, 280), trustLevel: r.chunk.trustLevel,
    })),
    confidence,
    evidence: retrieved.map((r) => ({ chunkId: r.chunk.id, score: r.score })),
    disclaimer,
    noSource: !valid.length,
    invalidCitationsDropped: invalidIds,
  };
}

/** Analisis kasus terstruktur: 8 bagian sesuai spesifikasi. */
export async function analyzeCase(skenario: string): Promise<RagAnswer & { sections: Record<string, string> }> {
  const base = await answerQuestion(skenario, { topK: 10 });
  const sections: Record<string, string> = {
    "1. Identifikasi Masalah": "Lihat jawaban: masalah pokok beserta para pihak yang terlibat.",
    "2. Fakta yang Perlu Diklarifikasi": "INTERPRETASI — status kecakapan pasien, ada/tidaknya surat kuasa atau persetujuan tertulis, dan dasar permintaan (tertulis/lisan/resmi).",
    "3. Dasar Hukum": base.citations.map((c) => `${c.regulasiJudul}`).join("; ") || "Belum ditemukan.",
    "4. Pasal Relevan": base.citations.map((c) => `[${c.chunkId}] ${c.regulasiJudul}${c.pasalNomor ? ` — Pasal ${c.pasalNomor}` : ""}`).join("\n"),
    "5. Analisis": base.answer,
    "6. Risiko": "Pelanggaran kerahasiaan + UU PDP (data kesehatan = data spesifik): sanksi administratif hingga pidana bila pembukaan tanpa dasar sah.",
    "7. Rekomendasi Tindakan": "REKOMENDASI PRAKTIS — verifikasi identitas & kuasa tertulis, terapkan minimisasi data, buat berita acara + log pelepasan informasi, tolak permintaan tanpa dasar secara sopan dan terdokumentasi.",
    "8. Sumber": base.citations.map((c) => `${c.regulasiJudul} [${c.chunkId}] (${c.trustLevel})`).join("\n"),
  };
  return { ...base, sections };
}
