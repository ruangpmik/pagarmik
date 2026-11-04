# Recovery Procedure

## Resume after interruption

1. Confirm the project root is `C:\laragon\www\pagarmik` and read `AGENTS.md`.
2. Read `PROJECT_STATE.md`, then the latest `WORKLOG.md` entry and relevant decisions.
3. Inspect actual files, `.git`, `node_modules`, and `data/` before acting. If `.git` is absent, report Git baseline as unavailable; never initialize/reset it as a recovery shortcut.
4. Compare the current verification implementation with the checkpoint: POST-only mutation, exact verifier role check, same-origin requirement, persisted audit event, status overlay, UI capability separation, and test coverage.
5. Preserve existing files and runtime data. Do not run `db push`, migrations, seed scripts, or delete/replace data as a recovery step.
6. If dependencies are available, run the targeted test, typecheck, and build; add lint only after a compatible linter/config is approved. Otherwise record each check as BLOCKED/NOT RUN. Do not upgrade packages to make a check pass.
7. Update project state/worklog with the observed result and next concrete action.

For the full governance map, read `CHARTER.md` and the linked policy, ADR, threat model, control matrix, scorecard, quality gates, operations runbook, and debt register. These records index evidence; an unrun control remains unverified.

## Restore a partially written documentation checkpoint

- Recovery documents are ordinary tracked project files when Git is available. Inspect their contents before replacing anything.
- For an update, write a temporary sibling file, verify its contents, then atomically rename it over the destination. Keep the prior file intact if staging or verification fails.
- Do not include secrets, credentials, tokens, or personal data in checkpoint documents.

## Data and deployment limitations

- Demo verification events live in ignored runtime data at `data/verification.json`; preserve and back it up if it contains needed audit history.
- Do not copy real user data into tests.
- JSON verification storage is unsuitable for multiple app instances or ephemeral filesystems. Production recovery requires a durable database, backups, migration review, and an explicit environment-specific plan.

## Latest checkpoint

- **Task:** PAGARMIK-GOVERNANCE-2026-11-03.
- **Status:** Governance and CI configuration saved; automated checks remain unexecuted/blocked by absent dependencies.
- **Unfinished:** Run tests/typecheck/build on canonical CI; review outstanding security/privacy debt; obtain a Git checkout for diff review.