# Project State

Updated: 2026-11-03 - Full repeal lists, PDP implementing regulation, subjective demarcation

## Latest checkpoint — full repeal lists, PDP implementing regulation, subjective demarcation

- **PP 28/2024 repeal:** 31 instruments modeled as `MENCABUT` edges (`Pasal 1170 huruf a..z, aa..ee`), verified against the official PP 28/2024 PDF. 26 PP + 5 Perpres nodes added; all `DICABUT`.
- **PMK 6/2026 repeal:** 21 instruments modeled as `MENCABUT` edges (`Pasal 84 huruf a..u`), verified against the official PMK 6/2026 PDF. 19 Permenkes + 2 Kepmenkes; the prior `Pasal 84 huruf h` (82/2013) and `huruf o` (4/2018) citations were confirmed correct.
- **PDP implementing regulation:** added `pp-33-2026` (`status: BELUM_BERLAKU`, ditetapkan 2026-07-16, mulai berlaku 2027-01-16), `MELAKSANAKAN`/`TURUNAN` to `uu-27-2022`, sourced from the user-supplied Kabupaten Banyumas PDF mirror.
- **Subjective demarcation:** 17 relations (15 `BERIRISAN` + 2 `MEMPERKUAT`) now carry `LEGAL_REVIEW_REQUIRED` evidence (empty sources) instead of being silently withheld. `buildFocusedRelationshipGraph` exposes `needsReviewCount`; the detail and grafik pages label them "usulan hubungan (keluaran AI) butuh telaah hukum".
- **State:** 94 regulations, 99 relations → 82 `VERIFIED`, 17 `LEGAL_REVIEW_REQUIRED`, 0 without evidence.
- **Validation:** PASS — Vitest 42/42 across 7 files; `npm run typecheck` clean; seed JSON parses. Browser runtime and production build NOT RUN this step.
- **Open:** `LEGAL_REVIEW_REQUIRED` still needs an actual human legal review before publication; the reviewer remains internal ("RUANGPMIK Editorial"). `pp-33-2026` source is a regional `.go.id` mirror, to be re-pointed to the canonical national source once indexed. The seed was re-serialized to uniform 2-space JSON, so its formatting no longer matches the original hand-authored layout.

## Previous checkpoint — reviewer identity, MK retype, full UU 17/2023 repeal

- **Reviewer:** `verifiedBy` is now `"RUANGPMIK Editorial"` on every relation (user decision); `verifiedAt` remains the work date, not an independent legal-review date.
- **Schema fix:** added `MENGUJI` to `Relation.type` (reverse label `"DIUJI OLEH"`); re-typed `mk-111-182-puu-2024 → uu-17-2023` from `MEMPERKUAT` to `MENGUJI` with `VERIFIED` evidence. Deleted the chronologically impossible `perka-anri-12-2007 → uu-43-2009`.
- **UU 17/2023 full repeal:** all 11 repealed laws now modeled as `MENCABUT` edges (Pasal 454 angka 1–11). Seven new `DICABUT` nodes added (`uu-419-1949`, `uu-4-1984`, `uu-20-2013`, `uu-18-2014`, `uu-38-2014`, `uu-6-2018`, `uu-4-2019`); four existing citations corrected from `Pasal 454 huruf c/d/e/h` to `angka 3/4/5/8`.
- **Evidence boundary:** 30/47 relations carry `VERIFIED` evidence; 17 withheld = 15 `BERIRISAN` + 2 `MEMPERKUAT` (subjective, by design).
- **Validation:** PASS — seed JSON parses; Vitest 39/39 across 7 files; `npm run typecheck` clean. Browser runtime and production build NOT RUN this step.
- **Open:** PP 28/2024 (31 instruments: 26 PP + 5 Perpres) and PMK 6/2026 (21: 19 Permenkes + 2 Kepmenkes) broader repeal lists are not yet edges — BPK "Mencabut" metadata is gathered but the two existing `Pasal 84 huruf h/o` citations need re-verification first. Demarcation of the 18 subjective relations remains a model + UI task.

## Previous checkpoint - research-workspace UI

- **Baseline:** .git is absent, so the existing working-tree diff is unknown. Before editing, copies of six shell/home files were saved under .taste-skill/checkpoints/2026-11-03-home-ui/.
- **Design:** The framed-sheet app style was selected for a multi-destination legal research tool (seed 161137320). The RUANGPMIK-derived blue-grey frame, white workspace sheet, product mark, and compact navigation preserve the brand and the user task.
- **Changes:** Desktop now has grouped left navigation and a compact search utility bar. Tablet/mobile keep the brand row and use the bottom navigation. The home prioritizes a descriptive RMIK title, the real catalog search, live catalog counts, and regulation rows with stored status/date and conditional official-source links. Status is text with a dot, not a color-only pill. Bookmark and library controls no longer use emoji; library items are plain aligned rows.
- **Evidence boundary:** Counts and regulation data are read from JsonStore. Missing verification dates or source URLs are shown as missing; none are inferred.
- **Validation:** PASS - npm.cmd run typecheck. PASS - Vitest 33/33 across 7 files. PASS - design-taste lint 0 FAIL / 1 WARN (33 em dashes across the repository). The in-app browser displayed the updated home at its narrow preview size; its accessibility tree exposed the labeled search, live catalog counts, source links, and mobile navigation links.
- **Not verified:** The standalone design-taste screenshot inspector exited at Chrome startup with a Crashpad pipe error, so the final desktop screenshot and full responsive measurements are not available. Full keyboard/screen-reader review and production build were not run. The earlier 108 route/viewport check predates this shell change and is not evidence for the new UI.
- **Safety:** No database, migration, dependency, production setting, external service, or runtime user data changed. Git status remains unavailable because .git is absent.
- **Recovery:** Restore only the targeted files from .taste-skill/checkpoints/2026-11-03-home-ui/ if this UI iteration needs reversal; preserve other project files and local data.

## Previous checkpoint - UI master-prompt correction and PAGARMIK identity

- **Finding:** The live `localhost:3007` UI was visibly inconsistent with the design contract: old generated Tailwind utilities rendered a green palette, while the home page used a large dark panel, 48px title, and emoji card grid.
- **Changes:** Added token-backed palette fallbacks and a shared title scale; aligned brand colors to the supplied RUANGPMIK mark; introduced an accessible darker action teal; redesigned the home around source search and legal-source rows; removed interface emoji; improved labels, comparison-table styling, and admin upload privacy messaging. Generated `app/icon.png` and applied it to the header and favicon with “PAGARMIK by RUANGPMIK” branding.
- **Validation:** 108 browser route/viewport checks passed at 320, 360, 390, 768, 1024, and 1280px. No document overflow, missing page heading, unlabeled visible controls, duplicate IDs, or failed header image. Vitest PASS (33 tests/7 files); TypeScript typecheck PASS; design-taste lint 0 FAIL/1 WARN (18 em-dash finding).
- **Evidence limits:** `/admin` redirects to sign-in in the unauthenticated browser. Full keyboard/AT checks, all-pair contrast testing, production build, and Git baseline remain unavailable/incomplete. The standalone screenshot inspector could not spawn Chrome; the live in-app browser was used for screenshots and route measurement.
- **Safety:** No database, migration, dependency, production configuration, or runtime user data changed. `.git` is absent; do not claim the repository is clean or that all pre-existing diffs are known.

## Current checkpoint — contextual regulatory graph

- **Problem fixed:** `/grafik` previously used hard-coded nodes and edges and ignored the regulation selected on the detail page.
- **Behavior now:** the detail-page graph link passes the regulation slug; the graph focuses on that selection. It draws only direct catalog relationships with per-edge verification status, reviewer/date, official HTTPS `.go.id` source and a specific legal reference. `/grafik` without a selection asks the user to choose one; unknown, unconnected or unsupported selections do not produce edges.
- **Evidence boundary:** none of the 41 seeded relationships currently has per-edge evidence. They are withheld from both the graph and relation-detail list, with a pending-evidence count shown. See TD-015.
- **Design-system rollout:** initial CSS tokens, neutral canvas, responsive shell, active top/mobile navigation, plain-text status labels, visible shared search label and relationship-graph text alternative are implemented. The full route-by-route redesign and accessibility audit remain open.
- **Validation:** Vitest PASS (28 tests/6 files); TypeScript typecheck PASS. On `http://localhost:3007`, `/regulasi/permenkominfo-20-2016?tab=hubungan` shows one pending catalog record and no legal relation; its graph link retains the selected slug. The graph shows one withheld relation for Permenkominfo 20/2016 and five for UU 27/2022 when selection changes. `/grafik` without a selection shows the picker state. Desktop screenshot reviewed. Mobile, full keyboard and assistive-technology checks remain NOT RUN.
- **Existing limits:** `.git` is absent, so branch/diff/local-change baseline remains unavailable. No database, migration, dependency, production config, or runtime data was changed.

## Earlier audit snapshot (superseded by current checkpoint)

### Status at the earlier legal and UI audit checkpoint

- **Status:** Regulatory and UI audit reports are complete. The post-audit, official-source-backed registry corrections are implemented.
- **Validation:** Final Vitest suite PASS (23 tests/5 files) with `TEMP`/`TMP` set to the repository after the sandbox OS temp path caused an `EPERM` atomic-rename failure; TypeScript typecheck PASS; seed JSON parses with 36 unique regulation slugs, 41 valid relations, and no dangling endpoints.
- **Open blockers:** PMK 13/2025 set-date mismatch remains unresolved and intentionally omitted from seed. Live responsive checks now pass on the browser-visible server at localhost:3007; assistive-technology and complete keyboard workflows remain unverified. Shell loopback does not share the browser's server context.
- **Git:** .git is absent; no claim of clean working tree or complete local diff can be made.
- **Legal source limit:** PMK 55/2013's repeal is verified in PMK 13/2025, but its original detailed text was not independently retrieved; the seed article explanation is explicitly historical pending that source.
- **Next:** Resolve the PMK 13 date from the visual official PDF; roll out the documented shared design tokens/components in a separate reviewed UI change; complete keyboard/assistive-technology checks and continue legal review of unverified/lower-priority corpus rows.

## Checkpoint — legal/regulatory and UI audit (2026-11-03)

- **Audit status:** Complete for the repository inventory and official-source checks documented in docs/legal/ and docs/design/. The audit covers all 35 regulation/decision records in prisma/seed.json and all 18 page routes found under app/.
- **Implementation status at this checkpoint:** This was the pre-implementation baseline. The subsequent authorized seed corrections and validation are recorded in the latest WORKLOG entry below.
- **Verified legal issues to correct:** PMK 55/2013 is expressly repealed by PMK 13/2025; PMK 82/2013 effective date is 2014-01-20; PMK 36/2012 set/promulgation dates are 2012-08-10 and 2012-09-12; the PMK 6/2026 Article 84 list contains 21 items, not the 22 stated in the seed summary. PMK 13/2025 set-date conflict (JDIH says 18 October 2025; extracted PDF text reads 8 October 2025) remains open; the new seed entry will omit that date.
- **UI status:** Static audit and proposed design-system contract are saved in docs/design/. Screenshot/responsive/keyboard UI QA is blocked because the local development server failed to bind 127.0.0.1:3000 with EACCES. No visual success is claimed.
- **Git/data boundary:** .git is absent, so pre-existing changes cannot be compared and “clean” cannot be claimed. At the latest listing, no data/ runtime folder or .env was present; preserve any runtime files if they appear later.
- **Validation available at this checkpoint:** node_modules exists. Typecheck and tests were scheduled after the focused change. Do not build/rewrite .next, run db seed, or run any migration.
- **Recovery:** Read the latest WORKLOG entry, audit reports, and exact JSON fields before proceeding. Preserve all existing historical regulations, article summaries, and user data; update only cited fields and add a focused test.

## Objective and status

**Task ID:** PAGARMIK-GOVERNANCE-2026-11-03  
**Objective:** Consolidate PAGARMIK engineering governance, preserve recovery checkpoints, and enable only stack-compatible quality gates.  
**Status:** Governance documents and a corrected CI workflow are saved. CI itself has not run; local checks are blocked because project dependencies are not installed.

## Prior checkpoint — legal/regulatory and UI audit (2026-11-03; superseded)

- Master Prompt 09 received; research in progress. Source code remains unchanged in this audit phase.
- Actual repository root confirmed at C:\laragon\www\pagarmik. .git is absent; Git branch/diff/local changes remain unknowable.
- Contrary to the prior checkpoint, node_modules and .next currently exist. Their provenance and completeness are unknown; validate commands before relying on them.
- Scope is evidence-based legal status audit of existing registry, official-source research for proven PAGARMIK domain, UI inventory and static/runtime review if safe. No migrations, seed runs, dependency updates, status mutation, or production changes.
- Recheck this state and preserve files before any later implementation. See latest WORKLOG entry for checkpoint and current blockers.

## Repository baseline

- Root: `C:\laragon\www\pagarmik`
- Stack: Next.js 14, React 18, TypeScript, Tailwind, Prisma, PostgreSQL/pgvector, Vitest.
- Node v24.22.1 and npm 11.17.0 were available; `package.json` requires Node >=20.
- No `.git` directory was present. Branch, commit, staged changes, and pre-existing local diff are unknown; do not initialize Git or infer a clean baseline.
- No `node_modules` or `.env` was present during validation. `.env.example` exists.

## Current implementation

- Verification submissions use `POST /api/admin/verify`; `GET` is read-only and returns authorized audit history.
- Only VERIFIER/ADMIN can verify. Only EDITOR/ADMIN see ingest controls. The POST requires same-origin `Origin`, validates status, note, and optional source URL, and rejects unknown regulation slugs.
- Demo events are append-only in `data/verification.json`; the file is written via a temporary sibling and rename. Latest events overlay regulation status and `verifiedAt` when `JsonStore` loads.
- Admin UI displays latest verifier/time/note and has success/error states.
- This is file-backed single-process demo persistence, not Prisma production storage. It requires persistent local filesystem and is not safe for concurrent multi-instance writes.

## Files changed in the verification implementation

- `app/api/admin/verify/route.ts`
- `app/admin/page.tsx`
- `src/lib/data/types.ts`
- `src/lib/data/store.ts`
- `src/lib/data/verification-store.ts` (new)
- `tests/verification-store.test.ts` (new)
- `docs/api-spec.md`
- `docs/architecture.md`
- `docs/security.md` (implementation inventory reconciled)
- `AGENTS.md` (new)
- `docs/engineering/PROJECT_STATE.md` (new)
- `docs/engineering/WORKLOG.md` (new)
- `docs/engineering/DECISIONS.md` (new)
- `docs/engineering/RECOVERY.md` (new)
- `docs/engineering/CHARTER.md` (new)
- `docs/engineering/architecture/ADR-0001-demo-verification-storage.md` (new)
- `docs/engineering/security/THREAT_MODEL.md` (new)
- `docs/engineering/governance/CONTROL_MATRIX.md` and `ENGINEERING_SCORECARD.md` (new)
- `docs/engineering/TECHNICAL_DEBT_REGISTER.md` (new)
- `docs/engineering/quality/QUALITY_GATES.md` (new)
- `docs/engineering/operations/VERIFICATION_AUDIT_RUNBOOK.md` (new)
- `docs/engineering/policies/` (new)
- `.github/workflows/ci.yml` (root paths corrected; no lint step because ESLint is not configured)
- `src/lib/auth/session.ts`, `src/lib/security/guards.ts`, `app/api/admin/verify/route.ts`, `tests/governance-guards.test.ts` (role/origin predicates and tests)

## Data and database

- No database connection or migration was run.
- Prisma schema exists, but no active Prisma store adapter was found.
- `data/verification.json` is created only when the demo verifier submits a valid change; it did not exist at the last checkpoint.
- Do not use the JSON store for production or ephemeral/multi-replica deployment.

## Latest validation

- **PASS:** Node/npm versions and seed JSON were checked during reconnaissance; all required governance documents exist.
- **PASS:** Local workspace rename probe verified same-filesystem temp-file replacement behavior. This does not validate the application store or backup/restore.
- **PASS:** Inspected source/config/docs and confirmed workflow paths target the repository root; no database connection or migration was used.
- **BLOCKED:** `npm test` — Vitest unavailable; `npm run typecheck` — `tsc` unavailable; `npm run build` — Next CLI unavailable (`node_modules` absent).
- **NOT RUN:** Lint (no ESLint dependency/config); vulnerability/secret scanners (no approved scanner configured); browser, route integration, database, and restore tests.
- **NOT AVAILABLE:** Git status/diff/branch/commit because `.git` is absent.

## Governance consolidation evidence

- **PASS:** Consolidated root rules and created charter, execution/security policies, ADR, threat model, control matrix, scorecard, debt register, quality gates, and operations runbook.
- **PASS:** Added Vitest unit cases for exact verifier roles and same-origin policy; the existing verification store tests remain in place. Tests are authored but not executed.
- **PASS:** Corrected GitHub Actions root/cache paths; configured read-only `contents` permission, Prisma client generation using a dummy CI URL, typecheck, tests, and build. CI workflow execution remains unverified.
- **PASS:** Updated the security implementation inventory to reflect API-only HSTS/CSP, incomplete global CSRF, JSON-LD script sink, arbitrary document ingest, and configurable external AI data flow.
- **BOUNDARY:** No production configuration, database, migration, dependency, application data, or external service was changed.

## Next actions

1. Run Vitest, typecheck, and build in CI or a reviewed lockfile-installed environment; record actual results.
2. Confirm the corrected workflow on the canonical GitHub repository when Git metadata/remote is available.
3. Address open global CSRF/auth, JSON-LD XSS, arbitrary upload, and external AI data-flow risks before production.
4. Replace file-backed verification with a transactional Prisma audit store only after an approved schema, backup, and non-destructive migration plan.
