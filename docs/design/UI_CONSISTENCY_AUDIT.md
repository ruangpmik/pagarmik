# PAGARMIK UI Consistency Audit

Audit date: 3 November 2026  
Scope: all 18 page routes under app/, shared shell/components, global styles and Tailwind tokens. Static source inspection and the design-taste static lint were performed. The live app was later verified in the in-app browser at `http://localhost:3007/` (the execution shell itself cannot reach that listener). All 18 routes were loaded at 320, 360, 768 and 1280 CSS pixels. After two targeted fixes, there was no document-level horizontal overflow and each route had an `<h1>`; `/admin` redirected to `/masuk` for the unauthenticated session. A keyboard tab-order spot-check covered the homepage's first nine stops. Assistive-technology, full keyboard workflows on all routes, and automated contrast measurement remain unverified.

## Live browser findings and fixes

- Before the fix, `/regulasi/permenkes-6-2026` overflowed horizontally at 320 CSS pixels because the long official source URL was an unbreakable string inside the metadata grid. `app/regulasi/[slug]/page.tsx` now allows the value to wrap; the route and all 18 routes pass at 320/360/768/1280 without document-level overflow.
- The signed-out `/profil` state had no page heading. `app/profil/page.tsx` now includes an `h1`; the route is included in the 18-route verification.
- Homepage keyboard sampling showed visible focus on the brand/navigation links, a 2px input focus ring, and focus on the search button within the first nine Tab stops. This is a spot-check, not a complete keyboard-accessibility audit.
- `/admin` rendered the sign-in page because the browser session was unauthenticated. Admin ingest controls were not visually inspected or exercised.

## Relationship graph defect and remediation

- The former `/grafik` page defined a fixed `NODES`/`EDGES` array and ignored both the relationship catalog and the regulation from the detail page. The detail-page link also discarded the selected regulation.
- `/regulasi/[slug]?tab=hubungan` now passes `regulasi=<slug>` to the graph. `/grafik` asks for a regulation first; it does not invent or display a generic example network. The server builds the focused graph from `JsonStore.regulations()` and `JsonStore.relations()`.
- The graph only draws a direct relationship when its record has a verified status, verification date and reviewer, plus an HTTPS `.go.id` source with a specific legal reference. `BERIRISAN` is undirected; directional labels reverse when the selected regulation is the target. The SVG has a matching text list.
- None of the 41 seeded relationship records currently carries this per-edge evidence. They are withheld from the graph and relation detail instead of being presented as legal facts. The UI shows how many are pending evidence. This is a known content gap, tracked as TD-015.
- Regression coverage confirms that unsupported relations are withheld, a sourced/verified fixture appears only for its selected endpoint, relation direction labels are contextual, and empty/unknown selections do not produce inferred nodes.

## Initial design-system adoption

- CSS custom properties now hold the repository design-system navy, teal, neutral, focus and status colors; Tailwind aliases reference those variables. Shared shell no longer uses the decorative stripe or backdrop blur, the canvas and spacing follow the design contract, and system sans is explicit.
- Desktop/mobile navigation now indicates the active page with `aria-current`; mobile links have a visible selected state and a 48px minimum height. Shared search and status filters have persistent labels and focus treatment; regulation status text no longer depends on emoji.
- This is a staged rollout. Some page-specific cards, shadows, labels and color choices remain to be audited and normalized.

## Route inventory

| Area | Routes | Main user task |
|---|---|---|
| Entry | / | Understand product, search and reach key modules |
| Legal search | /legal-search, /regulasi, /regulasi/[slug], /pasal, /bandingkan, /timeline, /grafik | Find, inspect, compare and explore regulation text/relationships |
| AI and case tools | /ai, /analisis-kasus | Ask a legal question or explore a case scenario |
| Knowledge | /topik, /topik/[slug], /artikel, /artikel/[slug] | Browse topic and editorial material |
| Account | /masuk, /daftar, /profil | Authenticate and view local account/library state |
| Administration | /admin | Ingest and verify legal sources |

API routes are not counted as UI pages. Main API categories include auth, regulation/search, AI, analytics, admin ingest and admin verification.

## Findings

### Consistency and visual hierarchy

- The common shell lives in app/layout.tsx; shared controls include StatusBadge, ConfidenceBadge, Disclaimer, RegulationCard, SearchBar, ScoreBar and StatusSwitcher in src/components/ui.tsx.
- Shared CSS variables and Tailwind color aliases now implement the documented navy/teal identity. Page-specific cards, spacing and some colors remain inconsistent across routes.
- Tailwind declares Inter and Source Serif families, but the inspected root layout does not load either font. Rendering may fall back to system fonts.
- Status labels combine emoji and color. Words do identify the status, which is good; emoji should not be the only status indicator and decorative emoji should be removed from navigation/actions.
- Several page-specific cards/shadows and backdrop blur create inconsistent emphasis and may add visual noise. The static lint flags patterns including emoji, gradient, repeated shadows, backdrop blur, monospaced body text and punctuation/style consistency.

### Navigation and page context

- Desktop uses the top navigation; mobile uses BottomNav. Both now expose the active page using `aria-current` and visible styling.
- Some routes are not top-level navigation destinations. Breadcrumbs and consistent parent context are not present across detail/topic/article pages.
- Mobile bottom navigation helps reach core areas, but needs a clear active state, accessible labels and safe-area spacing verified on a real viewport.
- The app root declares Indonesian language and includes a skip link. Retain both.

### Forms, tables and accessibility

- Login and registration forms have visible labels. The admin ingest form and legal-search filters rely on placeholders for several fields; add persistent labels and instructions.
- SearchBar hard-codes id=q. Reusing it more than once on a route could duplicate an HTML id; make the identifier unique or use an explicit generated id.
- StatusSwitcher now uses `aria-current=page` for its filter links; actual toggle buttons may use `aria-pressed`.
- The homepage search input shows a 2px keyboard focus ring. Other route-specific fields and error states were not keyboard-tested; keep a shared focus treatment and verify it route by route.
- The regulation comparison table has min-w-[560px] and graph SVG min-w-[640px]. Document-level overflow was absent at all four tested widths, but the intentional table/graph scroll behavior and accessible alternatives still need direct interaction checks.
- Tables are suitable for dense legal comparison and should remain tables with proper caption/headers; avoid turning every data area into decorative cards.
- Color contrast, screen-reader announcement of changing results, error focus management and reduced-motion behavior have not been measured.

### Responsive and interaction quality

- The page shell uses a centered max-width layout, desktop navigation breakpoint, mobile bottom navigation and bottom content padding.
- Fixed minimum widths in comparison and graph views require intentional scroll affordances; no document-level overflow occurred at the tested viewports.
- Sticky-header overlap, bottom navigation obstruction, touch target size, assistive-technology output and form error feedback remain unverified. Homepage focus was spot-checked only.

## Priority

1. Continue applying the adopted token layer and shared components across remaining page routes.
2. Rebuild high-traffic search, regulation detail, comparison, AI and case-analysis screens from the shared components.
3. Test comparison-table scrolling and graph scrolling at all documented viewport widths.
4. Measure contrast and complete keyboard/assistive-technology checks.
5. Review admin separately for visible form labels, upload privacy notice, file feedback and verification-history semantics.

## Evidence boundary

The route inventory and earlier audit include static source review and a browser pass before the latest design-token changes. The focused graph's verified-empty states and selected-regulation flow were reviewed in the local browser after the evidence gate; automated tests and typecheck are recorded in the engineering worklog. Mobile screenshots, contrast measurement and full keyboard/screen-reader pass remain outstanding. `/admin` remains unavailable without an authenticated session.

## Follow-up — master-prompt visual correction (3 November 2026)

### Verified mismatch

- The initial browser screenshot showed a deep green hero, a 48px title, an emoji icon-card grid, and a green wordmark. Runtime measurements were `body #F6F7F8` and `text-pagar-800 rgb(23,70,59)`, despite source tokens specifying navy/neutral values. The running local server was serving a generated Tailwind utility sheet from before the token mapping was loaded.
- The inspected UI therefore did not match the agreed institutional/editorial PAGARMIK direction. This follow-up supersedes earlier statements that the palette was already visibly correct.

### Changes

- Added token-backed utility fallbacks in `app/globals.css` so the current running server uses the RUANGPMIK-derived palette without restarting the user's development server. The 28px mobile / 32px desktop page-title scale, 12px shared panel radius, and no-shadow resting surfaces are normalized.
- Rebuilt the home page as a light, information-led screen: one search action, live catalog counts, plain route indexes, and regulation rows with status/source context. Removed decorative emoji tiles and redundant card panels while preserving the routes, counts, search, sample question, and regulation links.
- Removed emoji from interface headings/actions, standardized key page titles, gave search filters and case analysis visible labels, and changed comparison rows to a semantic table with rules instead of a saturated header band/zebra fill. Admin ingest fields now have labels and a notice against uploading patient records; the authenticated admin screen itself was not available in the browser.
- Generated a PAGARMIK-specific shield/document/scales/health-information mark from the supplied RUANGPMIK logo as a color reference. Added the 256px transparent PNG at `app/icon.png`, used it in the shared header, and verified the Next favicon link. Header/footer and document title now say “PAGARMIK by RUANGPMIK.”
- The logo-reference teal `#15966D` is retained for the mark. White text uses action teal `#0F7254` (5.91:1); the darker hover shade `#0C5C43` is 7.99:1. This is a targeted primary-action contrast check, not a full WCAG contrast audit.
- The design-taste sheet selected `framed-sheet` (seed 1120411848). Its thin-rule/no-shadow principles were applied; its sidebar move was declined because it conflicts with the existing top/mobile navigation and would exceed the scoped correction.

### Validation and limits

- Browser verification covered 18 routes at 320, 360, 390, 768, 1024, and 1280px: 108 route/viewport combinations. Each had a page heading, no document-level horizontal overflow, no unlabeled visible input/select/textarea, no duplicate IDs, and a loaded header mark. `/admin` redirected to sign-in for the unauthenticated browser session.
- Desktop (1280×900) and mobile (390×844) screenshots were visually reviewed. The selected regulation graph still follows the regulation context; unsupported relations remain withheld.
- `npm.cmd test`: PASS, 33 tests/7 files. `npm.cmd run typecheck`: PASS. Design-taste lint: 0 FAIL, 1 WARN for 18 em dashes across existing copy; the warning was not changed in this visual pass.
- The standalone design-taste screenshot inspector could not start its Chrome process (Crashpad pipe failure). Screenshots and route measurements were instead checked through the live in-app browser at `http://localhost:3007/`.
- Not verified: full keyboard-only workflows, screen-reader output, all foreground/background contrast pairs, an authenticated admin screen, or a production build. `.git` remains absent, so no branch or diff baseline can be claimed.

## Follow-up - research workspace redesign (3 November 2026)

### Implemented

- Selected the framed-sheet app direction (seed 161137320) for PAGARMIK's multi-destination legal research work: a muted blue-grey frame, grouped desktop sidebar, 48px utility search, and white work surface. Tablet/mobile keep a compact brand row and the five-destination bottom navigation.
- Reworked the home around the primary job: find a legal source. The heading describes the RMIK scope; counts are computed from the local catalog; the regulation list uses stored records with status, verification date, and a source link only when a URL exists.
- Status is now a readable text label with a small color marker. Bookmark actions use a document-shaped SVG, and the saved-items screen uses aligned rows instead of emoji and oversized cards.
- Preserved route destinations, search targets, catalog data, and local bookmark/history behavior. No legal status or source record was changed.

### Evidence

- TypeScript typecheck: PASS. Vitest: 33/33 tests across 7 files. Design-taste lint: 0 FAIL, 1 WARN for 33 em dashes across the repository.
- The in-app browser showed the updated home in a narrow preview; its accessibility tree exposed the labeled search, catalog counts, recorded-source links, and mobile navigation. This is a narrow-screen spot check only.
- The design-taste screenshot inspector again exited while starting Chrome with a Crashpad pipe error. A final desktop screenshot, 18-route measurement after the new shell, complete keyboard flow, contrast-pair check, screen-reader review, authenticated admin review, and production build remain unverified.
- The prior 108 route/viewport pass predates this redesign and must not be presented as verification of the new shell.

## Follow-up — full-stack UI/UX consistency, feedback system, and 18-route standardization (4 November 2026)

### Implemented

- **Nested layout defect fixed:** `app/topik/layout.tsx` previously rendered a duplicate `<html lang="en"><body>` wrapper and default `'Next.js'` title metadata inside the root layout. Replaced with a clean fragment pass-through and added a regression test in `tests/ui-governance.test.ts`.
- **Shared design primitives (`app/globals.css`, `src/components/ui.tsx`):** Added semantic status/feedback tokens (`--danger-bg`, `--danger-border`, `--warning-bg`, `--warning-border`, `--success-bg`, `--success-border`, `--info`, `--info-bg`, `--info-border`) and shared classes (`.page-header`, `.section-card`, `.form-input`, `.btn-primary`, `.btn-secondary`, `.btn-danger`). Added `Alert`, `EmptyState`, `Breadcrumb`, and `LegalBlock`; localized `ConfidenceBadge` to Indonesian; updated `SearchBar` to accept unique `id`, `defaultValue`, and `helperText`.
- **Feedback, confirmation, and async progress system (`src/components/FeedbackProvider.tsx`, `src/components/SubmitButton.tsx`):** Mounted a single toast notification region (with deduplication, non-color icons, manual dismiss, and extended duration for errors/warnings) and an accessible modal confirmation dialog (`role="dialog"`, `aria-modal="true"`, Escape/focus handling). Connected `BookmarkButton`, `LibraryView`, and `AdminVerifyForm` to toast/confirmation feedback. Added `SubmitButton` with double-submit prevention (`disabled`, `aria-busy`) and honest multi-step progress indicators (`progressSteps`) on `/ai`, `/analisis-kasus`, and `/admin` ingest.
- **18-route consistency rollout:** Applied `Breadcrumb`, `.page-header`, initial states, `EmptyState`, `Alert`, `LegalBlock`, and inline form validation (`AuthForms`, `AdminForms`) across all routes under `app/`. Added `/bandingkan` to `TopNav` and home navigation links.

### Evidence

- TypeScript typecheck (`npm.cmd run typecheck`): PASS.
- Vitest (`npm.cmd test`): PASS — 45/45 tests across 7 test files (including 3 new UI governance regression checks).
- Full assistive-technology screen-reader testing, authenticated `/admin` browser inspection, and production build remain NOT RUN.

