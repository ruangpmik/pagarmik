# Engineering Control Matrix

Status vocabulary: VERIFIED, PARTIALLY VERIFIED, FAILED, NOT TESTED, NOT APPLICABLE. A source inspection is not an executed test.

| Control | Evidence / implementation | Verification method | Status | Gap / owner action |
|---|---|---|---|---|
| Server-side verification RBAC | `canVerifyRegulationStatus`; route uses it | Vitest role matrix added; not run | PARTIALLY VERIFIED | Run CI; add route integration test when test harness supports Next handlers |
| Same-origin verification mutation | `isSameOrigin`; POST requires Origin | Vitest same/cross/missing/malformed cases added; not run | PARTIALLY VERIFIED | Run CI and test reverse-proxy origin behavior |
| Verification audit persistence | JSON event list with temp-file rename; store overlays latest | Vitest store tests added; not run; local rename probe passed | PARTIALLY VERIFIED | Run tests; add corruption/concurrency tests; replace for production |
| Stored XSS through JSON-LD | Regulation detail embeds `JSON.stringify` output with `dangerouslySetInnerHTML` | Source inspection found the sink; no exploit test run | FAILED (known gap) | Escape `<` in JSON-LD serialization or use a safe serializer; add a script-terminator regression test |
| GET is read-only | Route GET returns audit list; mutation is POST | Source review only | PARTIALLY VERIFIED | Add route integration test proving GET does not mutate |
| Global CSRF | Middleware rejects different host only when Origin is present | Source review | FAILED (known gap) | Review all state-changing routes and missing-Origin policy |
| Authentication/session | jose JWT and cookie handling in source | No auth integration/security test run | PARTIALLY VERIFIED | Review `next` redirect, registration cookie flags, login/register rate limits |
| Input validation | Zod schema on verification route | Source review; route tests absent | PARTIALLY VERIFIED | Add integration tests for invalid status, note, URL, and slug |
| Type/test/build gates | GitHub Actions workflow at `.github/workflows/ci.yml` | Workflow path corrected; GitHub run unavailable | NOT TESTED | Confirm run on actual GitHub repository |
| Lint gate | No ESLint dependency/config in package manifest/lockfile | Inventory checked | NOT APPLICABLE currently | Add only with an intentional dependency/config task |
| Dependency vulnerability/SBOM/secret scanning | No scanner workflow/tool evidence found | Not executed | NOT TESTED | Select an approved scanner and repository permissions before enabling |
| Database constraints/migrations | Prisma schema only; no active adapter/migration run | Source inventory | NOT TESTED | Design and review production persistence/migration separately |
| Container startup database safety | Compose command invokes `prisma db push` at app startup | Source inspection | FAILED (known risk) | Remove automatic schema mutation from release startup; use reviewed migration governance |
| Privacy/data minimization | Ingest accepts arbitrary PDF/text; configurable AI provider can transmit prompt/context externally | Source inspection only | NOT TESTED | Define upload restrictions, external-provider approval/disclosure, data retention/deletion, and safe test data |
| Backup/restore | Runtime JSON data; no retention or restore evidence | Documentation review | NOT TESTED | Owner must define backup target, RTO/RPO, and approve restore test |

