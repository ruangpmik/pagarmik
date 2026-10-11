# Spesifikasi API PAGARMIK

Base: `/api`. Semua response JSON. Rate limit default 60/menit (AI: 30, case: 20).

## Search

`GET /api/search?q=...&jenis=&tahun=&status=&topik=`
→ `{ query, hits: [{ chunkId, regulationSlug, regulasiJudul, pasalNomor, kutipan, trustLevel, score, breakdown }] }`

## AI (RAG, selalu bersitasi)

- `POST /api/ai/chat` `{ question, filters? }` → `{ answer, citations[], confidence, evidence[], disclaimer, noSource, invalidCitationsDropped[] }`
- `POST /api/ai/case-analysis` `{ kasus }` → jawaban + `sections` (8 bagian: identifikasi → sumber)
- `GET /api/ai/explain-pasal?slug=&pasal=` → penjelasan pasal (Explain This Pasal)
- `GET /api/ai/compare?a=&b=` → perbandingan dua regulasi (What Changed / Compare)

Semua endpoint AI mengembalikan `confidence: HIGH|MEDIUM|LOW` dan `disclaimer` edukatif.
Tanpa sumber valid → `noSource: true` + pesan jujur (tidak mengarang).

## Regulasi & Analytics

- `GET /api/regulations` → daftar + `pasalCount` + `relations`
- `GET /api/analytics` → total regulasi/pasal/chunk, byStatus, topTopics
  (production: + searches/day, AI questions/day, no-source rate, citation accuracy)

## Admin (butuh peran, cookie `pagarmik_session`)

- `POST /api/admin/ingest` (multipart: metadata + `pdf?`/`fullText`) — peran EDITOR+
  → `{ ok, slug, pasalCount, status: "BELUM_DIVERIFIKASI" }`
- `GET /api/admin/verify?slug=&status=` — peran VERIFIER+ → verification record

## Auth

- `POST /api/auth/login` (form: email, password, next) — demo via `data/users.json`, production via Prisma
- `POST /api/auth/register` (form: name, email, profesi, institusi, password min 8)
- `POST /api/auth/logout`
- Google OAuth: hubungkan Auth.js di production, petakan profil ke `SessionUser` (lihat `src/lib/auth/session.ts`).

## Kode status

`200` ok · `400` validasi · `401/403` auth/RBAC · `422` ekstraksi PDF gagal · `429` rate limit (+`Retry-After`).
