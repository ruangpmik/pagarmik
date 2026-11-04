# Threat Model: Admin Regulation Verification

**Scope:** Current demo verification path: browser/admin page → Next.js route → session cookie and role check → JSON audit file → `JsonStore` status overlay. This is a source-based model, not a penetration test.

## Assets and trust boundaries

| Asset | Sensitivity / integrity need |
|---|---|
| Regulation status and source metadata | High integrity; users rely on legal status |
| Verification event (email, timestamp, note, source URL) | Integrity and restricted access; email is personal data |
| `pagarmik_session` JWT | Authentication secret; must not be exposed |
| `data/verification.json` | Integrity and availability of local audit history |

Trust boundaries: untrusted browser input → authenticated Next.js route; role claim → privileged verification action; app process → local filesystem; single process → any future multi-process/container topology.

## Threat analysis (STRIDE)

| Threat | Actor / abuse case | Current controls | Residual risk |
|---|---|---|---|
| Spoofing / elevation | USER or EDITOR submits status change | Signed session validation; exact VERIFIER/ADMIN check in route; role helper test added | Test not yet executed; JWT role is not revalidated against a user database; no DB adapter |
| Tampering | Cross-site or crafted POST changes status/note | POST-only mutation, same-origin helper, Zod validation, known-regulation check | Test not yet executed; same-origin proxy behavior must be verified; no transaction/DB constraints |
| Stored XSS | A compromised/malicious EDITOR stores a regulation title that terminates the JSON-LD `<script>` rendered by the detail page | Admin role is required for ingest; ordinary React text output is escaped | `dangerouslySetInnerHTML` receives `JSON.stringify` metadata without escaping `<`; script-terminator payload may break out. Not tested. |
| Repudiation | Verifier denies making a change | Append-only event records email/time/note/source | Local JSON can be edited/deleted by host actor; no tamper-evident signature or centralized log |
| Information disclosure | EDITOR/USER reads audit events | GET checks exact VERIFIER/ADMIN | Route integration test not run; emails/notes require retention/access policy |
| Denial of service | Repeated/large verification requests or corrupted file | Small fields bounded by Zod; atomic replacement | No endpoint-specific rate limit; file growth unbounded; corrupted JSON can disrupt store loading |
| Cross-process race | Two app instances verify concurrently | Temp file + rename avoids partial-file truncation | Read/append/write is not transactionally locked across processes; later write may lose an event |

## Data-flow and abuse cases

1. A verifier submits a status, note, and optional URL. The route checks session, exact role, Origin, payload schema, and regulation existence.
2. The process appends an event to the local JSON file and resets the in-memory store.
3. A later read applies the latest event to the regulation status.

Abuse cases to retain in regression testing: missing/cross-origin Origin; USER/EDITOR role; unknown slug/status; empty/oversized note; repeat submissions; unreadable/corrupt file; multi-process concurrent writes.

## Treatment and scope limits

Keep current demo single-process and on persistent local storage only. Before production, replace with transactional database persistence, independent authorization tests, rate/size controls, durable backups, least-privilege filesystem access, retention rules, and restore/concurrency tests. No external service or production environment was tested.

This focused model does not cover the full upload/AI flow. Admin ingest accepts arbitrary PDF/text, and a configured external AI provider receives the user prompt and retrieved context. Until a data-flow review and user disclosure exist, use synthetic/non-sensitive inputs and keep external providers disabled for personal or health data.
