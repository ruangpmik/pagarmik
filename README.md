# PAGARMIK — Menjaga Batas. Melindungi Profesi.

Legal Intelligence Platform untuk Rekam Medis & Informasi Kesehatan (RMIK/MIK):
repository regulasi terstruktur + pencarian hukum hybrid + **PAGARMIK AI** (RAG bersitasi, anti-halusinasi).

> PAGARMIK adalah platform informasi dan edukasi hukum. Informasi AI bukan pendapat hukum
> profesional dan tidak menggantikan konsultasi advokat/ahli hukum kompeten.

## Fitur (MVP Tahap 1 — selesai)

- Landing premium + hero search + Jelajahi PAGARMIK (8 hub)
- Repository regulasi + halaman detail (tab: Ringkasan / Pasal / Hubungan / Topik / AI Analysis)
- Legal Search hybrid (BM25 + semantik + filter jenis/tahun/status/topik) — `/legal-search`
- Pasal Explorer — `/pasal`
- PAGARMIK AI: chat RAG + sitasi klikabel + confidence + evidence — `/ai`, `POST /api/ai/chat`
- Analisis Kasus 8-bagian (norma vs interpretasi vs rekomendasi) — `/analisis-kasus`
- Regulatory Timeline, Relationship Graph interaktif, Topic Hub (12 topik), Knowledge Base terverifikasi
- Compare Regulasi (tabel aspek + highlight) — `/bandingkan`
- Auth email/password + JWT + RBAC (Google OAuth siap via Auth.js), profil, admin dashboard
- Admin ingest: PDF → ekstraksi → pasal split → chunking → indexing; verifikasi status
- SEO: metadata, OpenGraph, canonical, sitemap, robots, JSON-LD (WebSite + Legislation)
- Mobile-first: bottom nav (Home/Search/AI/Regulasi/Profile), security headers, rate limiting
- Test: retrieval, citation, hallucination, prompt-injection, ingest (`npm test`)

## Mulai cepat

```bash
cd pagarmik
npm install
npm run db:seed
npm run dev
```

Docker: `cp .env.example .env` → `docker compose up --build`. Detail: `docs/deployment.md`.

## Struktur

```
app/            routes + API (App Router, SSR)
src/lib/        nlp/ search/ ai/ rag/ citation/ ingest/ data/ auth/ security/
src/components/ BottomNav, ui (SearchBar, cards, badges)
prisma/         schema.prisma (PostgreSQL+pgvector), seed.json, seed.ts
tests/          search.test.ts, rag.test.ts (vitest)
docs/           architecture, database-schema, api-spec, deployment
```

## Skenario demo

`/ai?q=Apa dasar hukum kerahasiaan rekam medis dan siapa yang bertanggung jawab menjaganya?`
→ Ringkasan + Dasar Hukum (UU 17/2023, Permenkes 24/2022, UU PDP, Permenkes 36/2012)
+ Pasal Relevan + Analisis PMIK + Sumber + Confidence.

## Roadmap

- Tahap 2: bookmark/riwayat penuh, kolaborasi, expert verification, API publik
- Tahap 3: Legal Risk Scanner (analisis SOP), Ask About This Document, PWA, API mobile
