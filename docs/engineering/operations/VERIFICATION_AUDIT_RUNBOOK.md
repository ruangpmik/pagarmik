# Verification Audit Runbook — Demo Mode

This runbook applies only to the current single-process JSON demo. It does not establish production SLO/RTO/RPO or a verified backup process.

## Normal verification

1. Sign in with an account assigned VERIFIER or ADMIN by an authorized setup process.
2. Open `/admin`; confirm the intended regulation slug and current status.
3. Review the official source independently. Submit the new status, a concise rationale, and source URL when available.
4. Confirm the success response, latest status, verifier, timestamp, and note appear after the page reloads.
5. For read-only audit access, use the authorized GET endpoint `/api/admin/verify?slug=<slug>`; never use GET to change status.

## Failure handling

- On validation/authorization failure, do not retry with a broader role or weaken Origin checks. Correct the request or access assignment through authorized administration.
- If the status or audit history cannot be read, stop further status changes. Preserve `data/verification.json`; capture non-sensitive error details and inspect filesystem availability/permissions.
- If the JSON is malformed, do not delete or hand-edit it in place. Make a separate protected copy through the approved backup process, diagnose the copy, and reconcile events before restoration.
- If a write reports failure, read back the current file before retrying to avoid duplicate events or inconsistent operator expectations.

## Backup and recovery limitations

- The file is ignored runtime data. Keep it on a persistent, access-restricted filesystem and include it in an owner-approved backup plan before relying on it.
- No backup schedule, restore target, retention period, or RTO/RPO is currently evidenced. Do not invent or promise them.
- A filesystem copy/rename probe is not a backup/restore test. A real restore test requires a separate safe environment and explicit approval if any real audit data is involved.
- Do not use this storage for multi-instance production. Production recovery requires database transactions, backups, restore rehearsal, access controls, monitoring, and an approved incident plan.
