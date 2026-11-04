# Decision Index

Detailed architecture decisions use ADRs in `architecture/` so rationale is recorded once.

## D-001 — Verification workflow

Use a file-backed audit store only for the single-process demo; require exact VERIFIER/ADMIN authorization and same-origin POST for status changes. See [ADR-0001](architecture/ADR-0001-demo-verification-storage.md) for context, options, trade-offs, and migration impact.

## D-002 — Git baseline

Do not infer branch, commit, or cleanliness when `.git` is absent. Preserve files and report the baseline as unavailable; do not initialize Git as a recovery shortcut. See `RECOVERY.md`.

## D-003 — Production data platform

Prisma/PostgreSQL/pgvector is a planned architecture, not the active store. Do not claim production persistence or run a schema change until a Prisma adapter, migration plan, backup, and environment authorization exist. See `TECHNICAL_DEBT_REGISTER.md`.