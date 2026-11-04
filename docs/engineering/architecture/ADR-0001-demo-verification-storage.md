# ADR-0001: Demo Verification Storage

- **Status:** Accepted for local/demo mode only
- **Date:** 2026-11-03
- **Owners:** Project owner/engineering owner not identified in repository

## Context

The admin verification flow must record the status, verifier, time, note, and optional source. The active application data path is `JsonStore`; Prisma models exist, but no production Prisma store adapter was found. The checkout has no Git metadata, so this decision is based on current source inspection.

## Problem

A previous verification endpoint returned success without persisting status or audit history. A status change is a high-trust product action and must be read back consistently.

## Options

1. Keep returning a success-shaped response without persistence.
2. Add a file-backed audit store consistent with the existing demo runtime.
3. Build and migrate a Prisma-backed store as part of the same task.

## Decision and rationale

Use an append-only `data/verification.json` event list for the single-process demo. Write a complete temporary sibling file then rename it into place; overlay the latest event when `JsonStore` loads. Keep POST as the only mutation, require a same-origin request, validate input, and authorize exact VERIFIER/ADMIN roles.

This completes the demonstrated flow without implying that PostgreSQL is active or running an unreviewed migration. It is deliberately not a production persistence decision.

## Trade-offs and security impact

- Preserves prior events and provides verifier/time/note/source evidence for a local demo.
- JSON writes do not provide cross-process transaction or concurrency guarantees; a local actor can alter the file; container filesystems may be ephemeral; there is no database backup/restore integration.
- Exact role separation and explicit Origin checking reduce unauthorized status changes, but do not fix CSRF behavior on other routes.

## Migration impact and consequences

Production requires a durable database-backed audit transaction, migration review, unique/foreign-key constraints as appropriate, backup/restore evidence, and topology-specific concurrency tests. No migration is included or applied by this ADR. Until then, do not operate the JSON implementation in multi-instance production.

