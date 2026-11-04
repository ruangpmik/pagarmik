# Security, CIA, and Privacy Policy

This file defines required controls. `docs/security.md` is the implementation inventory and may record controls as partial or missing; it does not override this policy.

## CIA and privacy requirements

- **Confidentiality:** server-side least-privilege authorization; secure session handling; secrets only through approved environment/secret management; minimize personal data in logs and artifacts.
- **Integrity:** validate on the server; protect status changes with authorization and CSRF controls; retain auditable change history; do not claim legal status without evidence.
- **Availability:** handle dependency/storage failure safely; rate-limit expensive public endpoints; protect runtime data; document recovery and backup limits.
- **Privacy by design:** collect only what a feature needs, state purpose, restrict access, define retention/deletion, and use synthetic test data. Health-related domain does not automatically make HIPAA/GDPR applicable; identify jurisdiction and controller obligations before production.

## PAGARMIK data facts and controls

- Account data includes email/name and optional profession/institution in demo flows. Verification audit stores verifier email, status, note, source URL, and timestamp.
- Current legal corpus is seed data and no dedicated patient-record feature was observed. However, admin ingest accepts arbitrary PDF/text and cannot guarantee patient data is excluded; treat all uploaded content and legal case queries as potentially sensitive. Do not upload real patient records into this demo or tests.
- `data/` contains ignored runtime data. Treat it as user data and never delete/overwrite it during development or recovery.
- Demo verification uses a local JSON file. It is single-process, has no transactional concurrency protection, and may be lost on ephemeral container storage. It is not production-grade durability or tamper-proof audit storage.
- Configurable AI providers may transmit the question and retrieved context externally. Do not enable an external provider for personal/health data without explicit product authorization, data-flow review, and user disclosure. Do not send secrets or credentials.

## Authorization and request protection

- Ingest: EDITOR/ADMIN. Regulation verification and its audit read API: VERIFIER/ADMIN. Enforce on the server even when UI controls are hidden.
- Verification mutation is POST-only and requires an explicit same-origin `Origin`; GET is read-only.
- The global middleware currently checks cross-host Origin only when the header is present. Other mutating routes therefore need a separate CSRF review; do not describe global CSRF as complete.
- Do not claim compliance or certification to ISO, NIST, or OWASP from this policy. Use relevant control catalogs as review aids and record evidence/limitations.
