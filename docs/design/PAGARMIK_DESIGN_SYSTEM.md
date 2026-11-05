# PAGARMIK Design System

Status: implemented across all 18 application routes and shared components. The RUANGPMIK-based navy/teal/orange identity, accessible action shade, framed research shell, grouped desktop navigation, mobile bottom navigation, unified toast/confirmation feedback provider, submit loading/progress indicators, plain-text regulation statuses, labelled search/filter controls, and route-level `Breadcrumb`/`Alert`/`EmptyState`/`LegalBlock` patterns are active. Full assistive-technology screen-reader review remains open.

## Product principles

1. Legal information must read as calm, precise and trustworthy.
2. Put primary legal content and source metadata before decoration.
3. Use clear hierarchy and short labels. Avoid emoji as interface meaning.
4. Show legal fact, legal analysis and compliance recommendation as distinct content types.
5. Use accessible text and semantics in addition to color.
6. Prefer responsive tables for structured legal comparisons; use cards for summaries and choices.
7. Privacy is visible where users enter questions or upload documents: explain local storage and any external processing before the action.

## PAGARMIK by RUANGPMIK identity

- RUANGPMIK is the parent identity and color reference. PAGARMIK has its own shield/document/scales/health-information mark; do not reuse the RUANGPMIK person/book emblem as the product icon.
- The mark is saved as `app/icon.png` (256px transparent PNG), used in the shared header and discovered by Next.js as the App Router favicon.
- The shared wordmark reads “PAGARMIK by RUANGPMIK.” The mark uses the parent palette; interface actions use the darker accessible teal shade.

## Design tokens

These values are the current palette. Contrast has been checked for the primary action and desktop/mobile screens have been inspected; other text/status combinations still need a complete contrast audit.

| Token | Value | Use |
|---|---|---|
| Brand navy | #0B2E45 | Wordmark, main navigation, major headings and primary identity; sampled from the RUANGPMIK reference mark |
| Brand navy dark | #071F30 | Header/footer or high-emphasis text |
| Brand teal | #15966D | Mark and non-text data accents; sampled from the RUANGPMIK reference mark |
| Accessible action teal | #0F7254 | Primary actions, selected navigation and small text on light surfaces; white text contrast is 5.91:1 |
| Action teal hover | #0C5C43 | Hover/pressed action state |
| Brand orange | #F2782B | Small product mark detail; reserve for rare emphasis |
| Canvas | #F5F7FA | Application background |
| Workspace frame | #EDF2F4 | Low-chroma desktop shell around the white work surface |
| Surface | #FFFFFF | Cards, menus and form fields |
| Raised surface | #F4F7F8 | Search panel and light grouping surface |
| Active navigation | #E4ECEF | Neutral selected link background |
| Sheet edge | #E1E8EB | Subtle border around the desktop work surface |
| Control border | #C8D3DA | Search input boundary |
| Text primary | #1A2738 | Body and headings |
| Text muted | #526173 | Secondary labels and metadata |
| Border | #D7DEE7 | Dividers and control borders |
| Focus | #145CC7 | Keyboard focus ring, independent of brand color |
| Danger | #B42318 | Errors and revoked status text |
| Warning | #8A5A00 | Caution/partial-status text |
| Success | #176B45 | Active/verified status text |

Use CSS custom properties as the source of truth and map Tailwind semantic names to those properties. Avoid raw hex values scattered through pages. Keep status labels explicit: “Berlaku”, “Berlaku dengan catatan”, “Diubah”, “Dicabut”, and “Belum diverifikasi”. Use a text label and icon/shape where needed; never communicate a legal status only through color.

## Applied app direction

- The app-screen style selected framed-sheet (seed 161137320). Its L-shaped shell is a muted blue-grey frame, a 228px grouped sidebar, a 48px utility bar and a white workspace sheet with a 16px radius and no shadow. The primary navigation folds to the existing five-destination bottom bar below 1024px.
- The product face is the RUANGPMIK navy/teal/orange mark. The PAGARMIK shield/document/scales mark remains the product symbol. The screen signature is a legal-source row that pairs the stored lifecycle status and verification date with a conditional link to the recorded official source.
- The home screen answers “Where can I find a legal source for RMIK?” Its main action is the catalog search; counts are computed from the local data store and regulation rows use real catalog records.
- Page titles use a shared 28–32px scale, body text starts at 16px, status is a plain label with a small tone marker, and resting surfaces use no shadow. The home uses a search surface, data-backed regulation rows, and grouped text links instead of an icon-card grid.
- Brand teal `#15966D` is reserved for the mark/data accent. Action teal `#0F7254` with white text is 5.91:1; hover teal `#0C5C43` with white is 7.99:1. Orange `#F2782B` is a mark detail, not body text.

## Typography

- UI: a system sans-serif stack; do not fetch fonts from third-party hosts by default.
- Legal text and long explanations: optional local serif stack for readable excerpts, while preserving sans-serif metadata and controls.
- Body: 16px base with 1.55–1.7 line height.
- Small metadata: 13–14px, never below 12px on desktop or mobile.
- Headings: one consistent scale from page title to section title; use weight and spacing instead of decorative effects.
- Legal quotations: preserve original punctuation and source wording; do not use display styling that could be mistaken for the source text.

## Layout and responsive behavior

- Content container: 72rem maximum width; side padding 16px mobile, 24px tablet, 32px wide desktop.
- Mobile: 320px minimum tested viewport; single-column forms; no page-level horizontal overflow in the 320, 360, 390, 768, 1024, and 1280px route checks.
- Tables: keep semantic table markup. On narrow screens, use an explicitly labelled horizontal-scroll region or a deliberate stacked alternative; never shrink legal text until unreadable.
- Graphs: provide an accessible text/list alternative and a scroll/zoom affordance if the graph cannot fit.
- Header: one shared responsive shell. Desktop uses grouped navigation, an accessible compact search and the white work surface. Tablet/mobile use a brand row and bottom navigation with safe-area padding and 56px targets.
- Sticky elements: do not cover anchored headings, dialog content or keyboard-focused controls.
- Spacing: use a small scale (4, 8, 12, 16, 24, 32, 48, 64px) and apply it consistently.

## Components

| Component | Required behavior |
|---|---|
| AppShell | Shared header/footer/mobile navigation, skip link, focus-safe sticky behavior and active route semantics |
| PageHeader | One title, concise purpose sentence, optional breadcrumb and one primary action |
| SearchField | Visible label, described helper/error text, unique id, clear focus ring, submit/clear states |
| FilterGroup | Real labelled controls; selected state exposed semantically |
| RegulationStatus | Plain-text status, optional icon, date and verification-source link |
| SourceCitation | Instrument title, article, official publisher, effective/version date, and a direct official link |
| LegalBlock | Distinct label for LEGAL FACT, LEGAL ANALYSIS or COMPLIANCE RECOMMENDATION |
| RegulationTable | Caption, header scope, keyboard-friendly horizontal scrolling on small screens |
| EmptyState | Explains why there is no result and offers one useful next action |
| Alert | Programmatic role/live announcement when appropriate; clear recovery action |
| UploadForm | Label/format/size, official-material-only notice, no patient records notice, processing state and rejection reason |
| StatusBadge | Text always visible; no color-only status |

## Interaction and accessibility

- Use visible focus rings on every keyboard-operable control; never remove outline without a replacement.
- Use aria-current=page on navigation links. Use aria-pressed only for actual toggle buttons.
- Give every input a persistent label; placeholders are examples, not labels.
- Maintain at least WCAG AA text contrast for normal and large text; verify with tooling before release.
- Support reduced motion, visible error text and programmatic error/result announcements.
- Preserve a logical heading order, descriptive link text, semantic table headers, and keyboard access to menus/dialogs.
- Target at least 44 by 44 CSS pixels for primary touch controls where layout permits.
- Test at 320, 360, 768, 1024 and 1280 CSS pixels, plus keyboard-only navigation.

## Legal and privacy content presentation

- A source status must state who verified it and when, with a primary/official source link.
- Clearly distinguish enactment date, promulgation/effective date, transition deadline and repository verification date.
- Show legal facts separately from interpretation and product recommendations.
- Show uncertainty explicitly, e.g. “Status tercatat berlaku pada JDIH; harmonisasi pasal dengan peraturan baru belum selesai.”
- On AI and case input, disclose local/browser persistence and external-provider data flow before sending. Do not imply that the model is a lawyer or that answers are legal advice.
- The public UI must not expose internal risk labels or implementation details unless they help the user decide what data to submit.

## Adoption and verification sequence

1. CSS-variable tokens, Tailwind aliases, shared title scale, shell and navigation semantics are applied.
2. Home, legal search, case analysis, comparison, AI, and admin ingest forms received targeted alignment and label/privacy updates.
3. Continue the shared PageHeader, form-field and panel rollout across remaining routes; keep the regulation detail source hierarchy and graph evidence gate intact.
4. Complete contrast checks for every status/control pair, full keyboard workflows, screen-reader review, and authenticated admin visual review before claiming accessibility readiness.

