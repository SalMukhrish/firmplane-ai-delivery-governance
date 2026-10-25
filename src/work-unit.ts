import type { Decision, WorkUnit, WorkUnitState } from "./types.js";

export type TransitionBlock = "INVALID_TRANSITION" | "FINAL_STATE_LOCKED";

const transitions: Readonly<Record<WorkUnitState, readonly WorkUnitState[]>> = {
  DRAFT: ["READY", "BLOCKED"],
  READY: ["RUNNING", "BLOCKED", "STOPPED"],
  RUNNING: ["RESULT_PROPOSED", "BLOCKED", "STOPPED", "ESCALATED"],
  RESULT_PROPOSED: ["VERIFIED", "BLOCKED", "ESCALATED"],
  VERIFIED: ["COMPLETED"],
  COMPLETED: [],
  BLOCKED: [],
  STOPPED: [],
  ESCALATED: [],
};

export function transitionWorkUnit(
  workUnit: WorkUnit,
  next: WorkUnitState,
): Decision<WorkUnit, TransitionBlock> {
  const allowed = transitions[workUnit.state];
  if (allowed.length === 0) {
    return {
      outcome: "BLOCKED",
      code: "FINAL_STATE_LOCKED",
      reasons: [`${workUnit.state} is final.`],
    };
  }
  if (!allowed.includes(next)) {
    return {
      outcome: "BLOCKED",
      code: "INVALID_TRANSITION",
      reasons: [`${workUnit.state} cannot transition to ${next}.`],
    };
  }
  return { outcome: "ACCEPTED", value: { ...workUnit, state: next } };
}
