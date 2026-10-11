# Deployment & Production Guide PAGARMIK

## 1. Jalankan lokal (tanpa Docker, tanpa DB)

```bash
cd pagarmik
npm install
npm run db:seed   # validasi seed + akun demo (data/users.json)
npm run dev       # http://localhost:3000
```

Akun demo: `admin@pagarmik.id / pagarmik123` (ADMIN), `pmik@contoh.id / pagarmik123` (USER).
Mode AI default `extractive`: RAG asli (retrieval → context → generate → cite) tanpa API key.

## 2. Docker (full stack: app + PostgreSQL pgvector)

```bash
cp .env.example .env   # isi AUTH_SECRET (min 32 char)
docker compose up --build
# → app :3000, db :5432. Container app menjalankan prisma db push + seed + start.
```

## 3. Production checklist

- [ ] `AUTH_SECRET` ≥ 32 char via secret manager; `DATABASE_URL` terkunci.
- [ ] Jalankan migration SQL pgvector di `docs/database-schema.md`.
- [ ] Ganti `JsonStore` → Prisma di `getStore()` (koneksi `LegalChunk.embedding`).
- [ ] Set `AI_PROVIDER=openai-compatible|ollama` + `AI_MODEL`, atau pertahankan extractive.
- [ ] Set `EMBEDDING_PROVIDER=openai-compatible` + jalankan backfill embedding.
- [ ] Hubungkan Auth.js Google OAuth (client id/secret) → petakan ke `SessionUser`.
- [ ] S3 untuk PDF (`S3_*`), ClamAV scan pada upload, HTTPS via reverse proxy.
- [ ] Sentry DSN + structured logging; backup DB harian; `GET /api/analytics` untuk monitoring no-source rate & citation accuracy.

## 4. CI/CD

`.github/workflows/ci.yml`: typecheck → vitest → build di setiap push/PR.
Target performa: Lighthouse > 90 (SSR App Router, lazy graph SVG, image AVIF/WebP).

## 5. Verifikasi Definition of Done

```bash
npm test        # retrieval, citation, hallucination, prompt-injection, ingest
npm run typecheck
npm run build
```

Demo wajib: buka `/ai?q=Apa dasar hukum kerahasiaan rekam medis dan siapa yang bertanggung jawab menjaganya?`
→ jawaban + dasar hukum + pasal + analisis PMIK + sumber + confidence.
