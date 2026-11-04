# Standar Keamanan Production PAGARMIK

## Yang sudah diimplementasikan di kode

| Lapisan | Implementasi |
|---|---|
| Transport | HSTS is added by API middleware only; TLS must terminate at a trusted proxy. Other baseline headers come from `next.config.mjs`. |
| Clickjacking | `X-Frame-Options: DENY` is configured for all pages; CSP `frame-ancestors` is applied to API routes only. |
| XSS | React escapes ordinary rendered text. Regulation detail JSON-LD uses `dangerouslySetInnerHTML` with `JSON.stringify` on admin/seed-derived metadata; script-closing input is not escaped. |
| CSRF | Middleware checks host equality only when Origin is supplied (not full origin); missing Origin passes on other routes. Verification separately requires full same-origin. |
| Auth | JWT HS256 (`jose`), password `scrypt`, `AUTH_SECRET` min 32 char (fail-closed di production) |
| RBAC | Endpoint ingest memerlukan EDITOR/ADMIN; perubahan status regulasi memerlukan VERIFIER/ADMIN dengan pemeriksaan role tepat di server. Audit GET dibatasi untuk VERIFIER/ADMIN. |
| Input validation | Zod is used on selected AI/admin routes; auth forms and other endpoints do not share one uniform schema. Validate each route separately. |
| Rate limiting | In-memory per-IP limits exist on selected search/AI routes; login/register are not rate-limited and limits are not shared across instances. |
| Upload | PDF MIME, size, and magic bytes are checked in ingest; body parsing occurs before file-size validation. ClamAV scanning is a deployment TODO, not an active control. |
| SQL injection | Active demo reads JSON; no active Prisma query path was found. Prisma parameterization applies only if/when that adapter is implemented. |
| Secrets | `.env` di-gitignore; `docker-compose` mewajibkan `AUTH_SECRET`; akun demo **tidak** ditanam di production (`seed.ts` guard) |
| AI security | Prompt filter and citation validator exist; provider may send prompts/context to an external OpenAI-compatible endpoint when configured. No external data-flow authorization/disclosure was verified. |
| Privacy | No dedicated patient-record model was found, but ingest accepts arbitrary PDF/text and cannot guarantee patient data is excluded. Treat uploaded content and case queries as potentially sensitive. |

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
