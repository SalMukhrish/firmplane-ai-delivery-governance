# Evidence and Review

## Evidence return

Evidence items contain a `kind` and `reference`. [`validateEvidence`](../src/evidence.ts) blocks empty evidence and reports missing required kinds.

## Review workflow

[`verifyResult`](../src/verification.ts) checks the supplied review precondition, validates required evidence kinds, and checks whether the work unit may transition to `VERIFIED`.

## Status transitions

A successful verification returns a new work unit in `VERIFIED`; callers can then transition it to `COMPLETED`. Missing review, invalid evidence, or invalid state returns a typed blocked decision.

## Verification boundaries

Evidence validation checks declared kinds and references; it does not prove authenticity or provenance. The Boolean review input does not determine reviewer identity. Artifact inspection, test execution, and reviewer selection remain with the integrating application.

© 2026 Saleh Mukhrish. All rights reserved.
