// SPDX-License-Identifier: MIT

import type { Decision, ExecutionResult } from "./types.js";

export type EvidenceBlock = "EVIDENCE_REQUIRED" | "EVIDENCE_INCOMPLETE";

export function validateEvidence(
  result: ExecutionResult,
  requiredKinds: readonly string[],
): Decision<ExecutionResult, EvidenceBlock> {
  if (result.evidence.length === 0) {
    return { outcome: "BLOCKED", code: "EVIDENCE_REQUIRED", reasons: ["No evidence was returned."] };
  }

  const received = new Set(result.evidence.map(({ kind }) => kind));
  const missing = requiredKinds.filter((kind) => !received.has(kind));
  if (missing.length > 0) {
    return {
      outcome: "BLOCKED",
      code: "EVIDENCE_INCOMPLETE",
      reasons: [`Missing evidence: ${missing.join(", ")}.`],
    };
  }
  return { outcome: "ACCEPTED", value: result };
}
