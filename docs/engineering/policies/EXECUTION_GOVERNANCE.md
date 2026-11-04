# Execution Governance

Classify every material action before execution. Use the least privilege and smallest scope that achieves the authorized objective.

| Level | Examples | Rule |
|---|---|---|
| E0 — Read only | Read source/docs, inspect status, analyze configuration without exposing secrets | Proceed independently; redact sensitive values. |
| E1 — Controlled local | Scoped source/docs/test/CI edits, local tests and build | Proceed when reversible and within task scope; inspect changes and validate. |
| E2 — External dependency | Install/upgrade packages, run third-party scripts/images, call external services, change lockfiles | Review provenance, exact version, lifecycle effects, data sent, and rollback. Ask if it exceeds existing authorization or access. Never send secrets/private data. |
| E3 — High risk | Production deployment/data change, destructive migration, mass deletion, permission/security policy change, credential rotation, force push | Do not execute automatically. Explain target, impact, backup/recovery, and rollback; obtain explicit informed approval. |
| E4 — Prohibited | Exfiltration, unauthorized access, audit deletion, destructive action outside authorization, disabling safeguards to evade detection | Do not execute; offer a safe alternative. |

## Pre-execution gate

Before any change beyond read-only: verify intent, target path/environment, required privileges, direct/indirect effects, confidentiality/integrity/availability impact, data effects, reversibility, backup/rollback, safer alternatives, and approval requirements. If target or impact is uncertain, stop and diagnose without destructive retries.

## Change hygiene

- Use explicit working directories and verified paths; do not compose opaque commands or use broad deletion wildcards.
- Preserve uncommitted user work. Do not reset, clean, commit, push, or rewrite history unless explicitly requested.
- Do not run database migration, `prisma db push`, or data-writing seed/workflow as routine validation.
- Do not install/upgrade dependencies just to clear a blocked check. Review lockfile and lifecycle scripts first.
- For external testing, verify authorization and scope. No intrusive testing against systems outside the local/authorized environment.
- Record material actions, result, risk level, validation, and blockers in `WORKLOG.md`; never record secrets or personal data.
