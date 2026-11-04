# PAGARMIK Engineering Charter

## Mission and evidence

PAGARMIK is an Indonesian legal information product for medical records and health information management. Its legal status and source integrity are core trust properties. This mission is evidenced by the README, seeded regulation corpus, and current routes; broader product commitments require owner confirmation.

Engineering decisions use this evidence order: actual source/configuration and executed tests; Git history/local diff when available; database schema/migrations; engineering records; then conversation context. If a checkout lacks `.git`, Git state is unknown rather than clean.

## Product traceability

| Requirement | Classification | Implementation | Validation evidence | Success condition |
|---|---|---|---|---|
| Only authorized verifiers can change a regulation status | Confirmed for the verification task | POST route checks VERIFIER/ADMIN server-side | `governance-guards.test.ts` covers role policy; execution awaits dependencies | USER/EDITOR denied; VERIFIER/ADMIN allowed |
| Status updates preserve who/when/why/source and can be read back | Confirmed for the verification task | JSON demo audit history and latest-status overlay | `verification-store.test.ts`; not yet executed | Every accepted update persists and later reads show the event and latest status |
| Production persistence uses durable, transactional storage | Technical requirement before production; not yet implemented | No active Prisma adapter observed | Source inspection only | No lost writes under supported deployment topology; audited transaction and restore tested |

Do not promote assumptions or proposed enhancements into confirmed product requirements. Capture the user, business outcome, data, permissions, failure impact, and measurable acceptance criteria before starting larger features.

## Non-negotiable principles

- Protect confidentiality, integrity, and availability with controls that are implemented and testable.
- Apply data minimization and privacy by default. PAGARMIK concerns health information, but do not assume HIPAA/GDPR or any certification applies without jurisdiction-specific review.
- Preserve user data and local work. No destructive operation, production change, dependency upgrade, migration, or deployment without scope and required approval.
- Use the smallest maintainable architecture that fits actual scale; do not introduce distributed systems patterns without evidence.
- Distinguish verified, partially verified, failed, not tested, and not applicable. A build alone is not a production-readiness claim.
- Define service objectives, RTO, and RPO with the system owner; none are currently established.

## Operating system map

- Core rules: [`/AGENTS.md`](../../AGENTS.md)
- Execution risk: [`policies/EXECUTION_GOVERNANCE.md`](policies/EXECUTION_GOVERNANCE.md)
- Security/privacy/data: [`policies/SECURITY_AND_PRIVACY.md`](policies/SECURITY_AND_PRIVACY.md)
- Architecture records: [`architecture/`](architecture/)
- Threat analysis: [`security/`](security/)
- Controls and scorecard: [`governance/`](governance/)
- Quality gates: [`quality/QUALITY_GATES.md`](quality/QUALITY_GATES.md)
- Operations: [`operations/`](operations/)
- Continuity: `PROJECT_STATE.md`, `WORKLOG.md`, `DECISIONS.md`, `RECOVERY.md`
- Debt: `TECHNICAL_DEBT_REGISTER.md`

