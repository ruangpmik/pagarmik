# Standar Keamanan Production PAGARMIK

## Yang sudah diimplementasikan di kode

| Lapisan | Implementasi |
|---|---|
| Transport | HSTS (`middleware.ts`); wajib TLS di reverse proxy |
| Clickjacking | `X-Frame-Options: DENY` + CSP `frame-ancestors 'none'` |
| XSS | CSP, `escapeHtml` untuk render teks AI/regulasi, React auto-escape |
| CSRF | Cek `Origin` vs host untuk semua POST/PUT/PATCH/DELETE `/api/*` + cookie `SameSite=Lax`, `HttpOnly` |
| Auth | JWT HS256 (`jose`), password `scrypt`, `AUTH_SECRET` min 32 char (fail-closed di production) |
| RBAC | ADMIN > EDITOR > VERIFIER > USER di setiap endpoint admin |
| Input validation | `zod` di semua endpoint AI/admin/auth |
| Rate limiting | Per-IP: umum 60/mnt, AI 30, analisis kasus 20 (+`Retry-After`) |
| Upload | Hanya PDF, maks 25 MB, **magic-byte `%PDF`**, ekstraksi terisolasi; status hasil ingest selalu `BELUM_DIVERIFIKASI` |
| SQL injection | Prisma parameterized queries (production); tidak ada query mentah dari input user |
| Secrets | `.env` di-gitignore; `docker-compose` mewajibkan `AUTH_SECRET`; akun demo **tidak** ditanam di production (`seed.ts` guard) |
| AI security | Prompt-injection filter, retrieval isolation (upload user tak masuk system prompt), citation validator, trust levels |
| Privacy | Tidak menyimpan data pasien; log AI hanya pertanyaan + sitasi |

## Tugas operator saat hosting

- [ ] TLS valid (Let's Encrypt) + redirect HTTP→HTTPS di reverse proxy
- [ ] `AUTH_SECRET` ≥ 32 char acak dari secret manager (bukan `.env` di repo)
- [ ] `DATABASE_URL` + kredensial S3 hanya via environment rahasia
- [ ] Backup PostgreSQL harian + uji restore
- [ ] ClamAV scan pada direktori upload PDF (hook di `ingest/route.ts`)
- [ ] Sentry DSN + alert no-source rate / citation accuracy dari `/api/analytics`
- [ ] `npm audit` berkala + auto-update dependensi minor via Dependabot
- [ ] WAF + pembatasan ukuran body di reverse proxy (defense in depth)
- [ ] Hapus akun demo bila `ALLOW_DEMO_USERS` tak sengaja aktif: cek `data/users.json`
