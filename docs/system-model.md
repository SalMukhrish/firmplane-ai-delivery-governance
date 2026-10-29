# System Model

## Public types and modules

`WorkUnit` contains state, required capabilities, acceptance criteria, and repository dependency. `ExecutionContext` supplies actor capabilities, approval, and repository availability. `Decision` returns either an accepted value or a typed blocked result. The modules in [`src/`](../src/) keep these contracts immutable and dependency-free.

`acceptanceCriteria` is part of the public work-unit shape and reference model; `authorizeExecution()` checks readiness, approval, capabilities, and repository availability, while evidence validation and review are separate controls.

## Roles and agents

## Execution context

## Reference boundary

The public package does not implement persistence, identity resolution, policy composition, or runtime routing. [`transitionWorkUnit`](../src/work-unit.ts) demonstrates state integrity locally: only listed transitions are accepted and final states cannot be reopened.

## Planning, authority, execution, and verification

The executable flow is:

1. Define a work unit and its acceptance criteria.
2. Authorize it against the execution context.
3. Transition it through `RUNNING` to `RESULT_PROPOSED`.
4. Validate required evidence.
5. Require a review precondition before `VERIFIED`.
6. Transition verified work to `COMPLETED`.

The package does not dispatch tools or execute code. It validates declared decisions around an external executor.

© 2026 Saleh Mukhrish. All rights reserved.
