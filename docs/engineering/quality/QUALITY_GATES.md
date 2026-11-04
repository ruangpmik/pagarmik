# Quality Gates

## Automated CI

The GitHub Actions workflow is configured at the repository root to gate push/pull request changes on:

1. `npm ci` from `package-lock.json`.
2. `npx prisma generate` with a dummy CI-only `DATABASE_URL`; it does not connect to or mutate a database.
3. `npm run typecheck`.
4. `npm test` (Vitest).
5. `npm run build`.

Workflow execution has not been verified because this folder has no `.git` metadata/remote evidence and dependencies are not installed. Confirm the workflow on the canonical GitHub repository before treating it as an active gate.

## Deliberately not enabled

- `npm run lint` is not in CI: package metadata/lockfile show no ESLint package/config. Do not add a failing/prompting gate or silently install a linter; plan that as a reviewed tooling task.
- No vulnerability scanner, secret scanner, license gate, SBOM, database integration test, or E2E browser runner was found. These remain NOT TESTED until a supported tool/runner is selected.
- Do not add production secrets to CI. No database service or migration is needed by the current type/test/build gate.

## Change acceptance evidence

For each task, record objective, synthetic test inputs, expected and actual result, command/environment, status, and unresolved defects. Add tests for deterministic authorization, validation, data integrity, and error behavior. Tests must use synthetic accounts and temporary storage, and clean only their own temporary fixture directories.
