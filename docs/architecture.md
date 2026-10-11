# Arsitektur Sistem PAGARMIK

```
Browser (mobile-first, SSR)
  │  Next.js App Router + Tailwind
  ▼
Route handlers (/api/*)
  ├── /api/search          SearchService  (hybridSearch)
  ├── /api/ai/chat         AIService      (RAG pipeline)
  ├── /api/ai/case-analysis, /explain-pasal, /compare
  ├── /api/regulations     RegulationService
  ├── /api/admin/*         DocumentService + AdminService (RBAC)
  └── /api/auth/*          AuthService (JWT + Google OAuth via Auth.js di prod)
  ▼
Core libs (src/lib) — tanpa dependensi provider
  ├── nlp/tokenize         tokenisasi ID + sinonim MIK + deteksi topik
  ├── search/hybrid        BM25 + TF-IDF cosine + metadata filter + rerank
  │                          (bobot: semantic .45, keyword .30, authority .10, trust .10, recency .05)
  ├── ai/providers         LlmProvider / EmbeddingProvider abstraction
  │                          extractive (default) | openai-compatible | ollama
  ├── rag/pipeline         Question → Understand → Retrieve → Rerank → Context
  │                        → LLM → Citation Validator → Confidence → Response
  ├── citation/validator   setiap [id] harus cocok dengan chunk ter-retrieve
  ├── ingest/pipeline      PDF → cleaning → pasal split → chunking → index
  ├── data/store           JsonStore (demo) ↔ PrismaStore+pgvector (prod)
  ├── auth/session         JWT jose + scrypt, RBAC ADMIN>EDITOR>VERIFIER>USER
  └── security/guards      rate-limit, zod validation, escapeHtml, upload guard
  ▼
Data
  ├── PostgreSQL + pgvector (prod) — prisma/schema.prisma
  └── prisma/seed.json + data/custom.json + data/users.json (demo tanpa DB)
```

## Aliran RAG (detail)

1. **Query Understanding** — `sanitizeUserQuery` (prompt-injection filter) → `expandQuery` (sinonim MIK)
   → `detectTopics` (metadata search).
2. **Hybrid Retrieval** — BM25 (keyword) + TF-IDF cosine (semantik) + filter metadata
   (jenis/tahun/status/topik/trust) di atas `LegalChunk[]`.
3. **Reranking** — skor terbobot + boost topik; ambil topK 8–10.
4. **Context** — chunk diberi ID stabil `{slug}:pasal-{nomor}:{idx}` + label trust.
5. **LLM** — via `LlmProvider`. Mode `extractive` (tanpa key) menyusun jawaban
   **hanya** dari chunk ter-retrieve; mode LLM memakai system prompt aturan keras anti-halusinasi.
6. **Citation Validator** — sitasi tak cocok → dibuang + dicatat transparan.
7. **Confidence** — HIGH (≥2 sumber L1/L2 lintas regulasi), MEDIUM (1 primer), LOW (sekunder/tanpa sumber).
8. **Response** — jawaban + citations + evidence + disclaimer. Tanpa sitasi valid → pesan NO_SOURCE jujur.

## Keputusan penting

- **Tanpa DB tetap jalan**: `JsonStore` membaca `prisma/seed.json`, sehingga `npm run dev` langsung demo.
- **Status regulasi** selalu dari metadata terverifikasi (`VerificationRecord`), tidak pernah dari AI.
- **Teks pasal seed** diberi flag `isVerbatim:false` (ringkasan terverifikasi) agar tidak diklaim kutipan harfiah.
- **Dokumen upload user** terisolasi: tidak masuk system prompt, hanya konteks terpisah (retrieval isolation).
- **Observability**: Sentry + structured logging di production (lihat deployment.md).
