# Engineering Scorecard

Updated: 2026-11-03. This is an evidence inventory, not a numeric grade or compliance claim.

| Dimension | Status | Evidence | Outstanding evidence |
|---|---|---|---|
| Product quality / traceability | PARTIALLY VERIFIED | Verification requirement and acceptance conditions in `CHARTER.md` | Product owner and broader requirements traceability |
| Architecture | PARTIALLY VERIFIED | App Router, JSON store, Prisma schema inspected; ADR-0001 recorded | Git history unavailable; Prisma production topology unknown |
| Functional integrity | PARTIALLY VERIFIED | Verification flow implementation and local file rename probe | Test suite/browser/API flow not executed |
| Security | PARTIALLY VERIFIED | Server role and same-origin guards implemented; threat model recorded | Automated tests blocked; known global CSRF/auth gaps remain |
| Privacy | NOT TESTED | Data fields and basic boundaries documented | Data inventory, retention, deletion, external AI data flow review |
| Database integrity | NOT TESTED | Prisma schema inspected; no active DB adapter or migration | Constraints, transaction, migration, backup/restore tests |
| Availability/recovery | PARTIALLY VERIFIED | Recovery docs and local atomic rename behavior | Restore test, monitoring, failure handling, owner-approved RTO/RPO |
| Performance | NOT TESTED | No baseline/profile available | Corpus/load baseline and bottleneck evidence |
| Maintainability | PARTIALLY VERIFIED | Project instructions, ADR, worklog, debt register | Typecheck/lint/test/build; Git review unavailable |
| Supply chain | NOT TESTED | Lockfile exists | Vulnerability, provenance, license, SBOM review |
| Quality assurance | PARTIALLY VERIFIED | Vitest suite and GitHub Actions workflow exist; CI path corrected | CI has not run; local dependencies absent |
| Operational readiness | NOT TESTED | Demo verification runbook exists | Production storage, monitoring, backup/restore, incident rehearsal |
| Release safety | NOT TESTED | CI workflow only; no staging/release evidence | Release gates, backup readiness, rollback, deployment authorization |

Do not convert PARTIALLY VERIFIED or NOT TESTED to VERIFIED without recorded test evidence.
