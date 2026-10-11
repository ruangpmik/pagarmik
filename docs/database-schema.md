# Skema Database PAGARMIK (PostgreSQL + pgvector)

Lihat `prisma/schema.prisma` untuk definisi penuh. Entitas: `User`, `Regulation`,
`RegulationVersion`, `RegulationRelationship`, `Pasal`, `LegalChunk`, `LegalTopic`,
`Article`, `AiConversation`, `AiMessage`, `SearchQuery`, `Bookmark`,
`VerificationRecord`, `AuditLog`.

## Kolom vector (pgvector)

Prisma belum mendukung tipe `vector` native → buat via migration SQL:

```sql
CREATE EXTENSION IF NOT EXISTS vector;

ALTER TABLE "LegalChunk" ADD COLUMN IF NOT EXISTS embedding vector(768);

CREATE INDEX IF NOT EXISTS chunk_embedding_idx
  ON "LegalChunk" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

CREATE INDEX IF NOT EXISTS chunk_regulation_idx ON "LegalChunk"("regulationId");
CREATE INDEX IF NOT EXISTS chunk_topik_idx ON "LegalChunk" USING GIN (topik);
ALTER TABLE "Regulation" ADD COLUMN IF NOT EXISTS search_tsv tsvector
  GENERATED ALWAYS AS (to_tsvector('indonesian', judul || ' ' || ringkasan)) STORED;
CREATE INDEX IF NOT EXISTS regulation_fts_idx ON "Regulation" USING GIN (search_tsv);
```

Isi `embedding` dari pipeline ingest memakai `EmbeddingProvider`
(`local-hash` untuk demo, `openai-compatible`/`nomic-embed-text` untuk produksi).
Pencarian produksi: gabungkan skor pgvector cosine + FTS + filter metadata,
dengan rerank otoritas/trust seperti di `src/lib/search/hybrid.ts`.

## Relasi kunci

- Regulation 1—N Pasal, LegalChunk, RegulationVersion
- Regulation N—N via RegulationRelationship (MENCABUT/MENGUBAH/MELAKSANAKAN/MERUJUK/TURUNAN/MEMPERKUAT/BERIRISAN)
- User 1—N AiConversation 1—N AiMessage (citations JSON tervalidasi + confidence)
- VerificationRecord mencatat setiap perubahan status (sumberUrl + verifiedBy) → audit trail status.
