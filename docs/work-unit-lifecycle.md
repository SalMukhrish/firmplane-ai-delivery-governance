# Work-Unit Lifecycle

## Work-unit definition

A [`WorkUnit`](../src/types.ts) declares identifier, state, required capabilities, acceptance criteria, and repository dependency. Accepted transitions return a new value.

## Review state

The supported transition path is:

```text
DRAFT → READY → RUNNING → RESULT_PROPOSED → VERIFIED → COMPLETED
```

`BLOCKED`, `STOPPED`, and `ESCALATED` are terminal outcomes. Invalid jumps return `INVALID_TRANSITION`; final states return `FINAL_STATE_LOCKED`. `acceptanceCriteria` is retained as declared work metadata; lifecycle transitions do not evaluate its contents.

Evidence validation and review are separate from lifecycle transitions. [`validateEvidence`](../src/evidence.ts) checks required evidence kinds, while [`verifyResult`](../src/verification.ts) requires a Boolean review precondition. The public Boolean does not establish reviewer identity or evidence authenticity.
© 2026 Saleh Mukhrish. All rights reserved.
