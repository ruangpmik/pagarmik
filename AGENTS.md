# PAGARMIK Core Engineering Instructions

This file is the concise, mandatory project entry point. Detailed policy lives in `docs/engineering/`; do not duplicate it here.

## Authority and conflict resolution

1. Follow platform/developer safety constraints and the user's current authorized scope.
2. Reconcile repository instructions with actual source, tests, Git metadata, schema, and runtime evidence.
3. When repository policies conflict, preserve data and choose the stricter security/recovery control. Record unresolved conflicts; do not silently weaken controls.
4. Do not infer product requirements from assumptions. Mark confirmed requirements, technical constraints, and proposed enhancements separately.

## Project facts

- PAGARMIK provides Indonesian legal information for medical records and health information management.
- Current stack: Next.js 14 App Router, React 18, TypeScript, Tailwind, Vitest, Prisma, PostgreSQL/pgvector.
- The active data implementation is JSON-backed. Prisma/PostgreSQL production persistence is not connected unless source evidence changes.
- Start each resumed task with `docs/engineering/PROJECT_STATE.md`, latest `WORKLOG.md`, relevant decisions, and a scoped source inspection. Check `.git` and dependencies; their absence means state is unknown, not clean.

## Non-negotiable safeguards

- Preserve user changes and runtime data. No reset/clean, destructive database operation, migration, production change, deployment, force push, or commit without explicit authorization.
- Do not expose or store secrets, credentials, tokens, personal data, or production health data in output, tests, logs, or documentation.
- Apply least privilege and server-side authorization. Regulation verification is VERIFIER/ADMIN; ingestion is EDITOR/ADMIN.
- Do not transmit private data to external services or add/upgrade dependencies without an authorized need and supply-chain review.
- Do not claim production readiness, standards compliance, or a passed check without direct evidence.

## Execution and evidence

- Classify actions under `docs/engineering/policies/EXECUTION_GOVERNANCE.md`. E0/E1 work may proceed within scope; E2 requires dependency/external-impact review; E3 requires explicit approval, backup, and recovery plan; E4 is prohibited.
- Define acceptance evidence for the task. Add focused tests for code changes. Use CI gates in `.github/workflows/ci.yml`; report unavailable checks as BLOCKED or NOT RUN.
- Do not run migrations, `prisma db push`, seeds, or data-writing workflows as routine validation.
- Update project state/worklog and relevant ADR, debt, threat, control, or scorecard records at meaningful milestones. No secrets or personal data in checkpoints.

## Canonical engineering documents

- `docs/engineering/CHARTER.md` — consolidated product and engineering governance.
- `docs/engineering/policies/` — execution, security, privacy, and data handling.
- `docs/engineering/architecture/` — ADRs and architecture boundaries.
- `docs/engineering/security/` — threat models and security evidence.
- `docs/engineering/governance/` — control matrix and engineering scorecard.
- `docs/engineering/quality/` — automated and manual quality gates.
- `docs/engineering/operations/` — recovery and operational runbooks.
- `docs/engineering/PROJECT_STATE.md`, `WORKLOG.md`, `DECISIONS.md`, `RECOVERY.md`, and `TECHNICAL_DEBT_REGISTER.md` — project continuity.
