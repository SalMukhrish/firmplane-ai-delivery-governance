# Authority and Control

## Authority boundaries

[`authorizeExecution`](../src/authority.ts) evaluates only declared inputs. It never infers approval or capability. Work that is not `READY`, not approved, missing a capability, or dependent on an unavailable repository is blocked. It does not evaluate the contents of `acceptanceCriteria`.

## Human approval

Approval is an explicit Boolean in the public context contract. An absent approval fails closed with `APPROVAL_REQUIRED`.

## Controlled execution

The module returns decisions; it does not perform execution. The [demo](../examples/governed-run.ts) shows accepted and repository-readiness-blocked paths.

## Separation of responsibilities

[`verifyResult`](../src/verification.ts) rejects a false review precondition, even when evidence is complete. The public API does not establish reviewer identity or independence.

© 2026 Saleh Mukhrish. All rights reserved.
