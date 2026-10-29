// SPDX-License-Identifier: MIT

import type { Decision, ExecutionContext, WorkUnit } from "./types.js";

export type AuthorityBlock =
  | "WORK_UNIT_NOT_READY"
  | "APPROVAL_REQUIRED"
  | "CAPABILITY_MISSING"
  | "REPOSITORY_UNAVAILABLE";

export function authorizeExecution(
  workUnit: WorkUnit,
  context: ExecutionContext,
): Decision<WorkUnit, AuthorityBlock> {
  const failures: Array<{ code: AuthorityBlock; reason: string }> = [];

  if (workUnit.state !== "READY") {
    failures.push({ code: "WORK_UNIT_NOT_READY", reason: `Work unit is ${workUnit.state}.` });
  }
  if (!context.approved) {
    failures.push({ code: "APPROVAL_REQUIRED", reason: "Required approval is absent." });
  }

  const available = new Set(context.actorCapabilities);
  const missing = workUnit.requiredCapabilities.filter((capability) => !available.has(capability));
  if (missing.length > 0) {
    failures.push({ code: "CAPABILITY_MISSING", reason: `Missing capabilities: ${missing.join(", ")}.` });
  }
  if (workUnit.repositoryRequired && !context.repositoryAvailable) {
    failures.push({
      code: "REPOSITORY_UNAVAILABLE",
      reason: "Repository-dependent execution is unavailable in this workspace.",
    });
  }

  const first = failures[0];
  return first
    ? { outcome: "BLOCKED", code: first.code, reasons: failures.map(({ reason }) => reason) }
    : { outcome: "ACCEPTED", value: workUnit };
}
