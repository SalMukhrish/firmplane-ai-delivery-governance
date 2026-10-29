// SPDX-License-Identifier: MIT

import type { Decision, ExecutionResult, WorkUnit } from "./types.js";
import { validateEvidence } from "./evidence.js";
import { transitionWorkUnit } from "./work-unit.js";

export type VerificationBlock = "REVIEW_REQUIRED" | "EVIDENCE_INVALID" | "STATE_INVALID";

export function verifyResult(
  workUnit: WorkUnit,
  result: ExecutionResult,
  requiredEvidence: readonly string[],
  independentlyReviewed: boolean,
): Decision<WorkUnit, VerificationBlock> {
  if (!independentlyReviewed) {
    return { outcome: "BLOCKED", code: "REVIEW_REQUIRED", reasons: ["Independent review is required."] };
  }
  const evidence = validateEvidence(result, requiredEvidence);
  if (evidence.outcome === "BLOCKED") {
    return { outcome: "BLOCKED", code: "EVIDENCE_INVALID", reasons: evidence.reasons };
  }
  const transition = transitionWorkUnit(workUnit, "VERIFIED");
  return transition.outcome === "BLOCKED"
    ? { outcome: "BLOCKED", code: "STATE_INVALID", reasons: transition.reasons }
    : transition;
}
