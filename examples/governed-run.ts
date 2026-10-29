// SPDX-License-Identifier: MIT

import {
  authorizeExecution,
  transitionWorkUnit,
  verifyResult,
  type ExecutionContext,
  type WorkUnit,
} from "../src/index.js";

const workUnit: WorkUnit = {
  id: "WU-REFERENCE",
  state: "READY",
  requiredCapabilities: ["repository:read", "tests:run"],
  acceptanceCriteria: ["Tests pass", "Evidence is reviewed"],
  repositoryRequired: true,
};

const context: ExecutionContext = {
  actorCapabilities: ["repository:read", "tests:run"],
  approved: true,
  repositoryAvailable: true,
};

const authorized = authorizeExecution(workUnit, context);
if (authorized.outcome === "BLOCKED") throw new Error(authorized.reasons.join(" "));

const running = transitionWorkUnit(authorized.value, "RUNNING");
if (running.outcome === "BLOCKED") throw new Error(running.reasons.join(" "));
const proposed = transitionWorkUnit(running.value, "RESULT_PROPOSED");
if (proposed.outcome === "BLOCKED") throw new Error(proposed.reasons.join(" "));

const verified = verifyResult(
  proposed.value,
  { summary: "Reference validation completed", evidence: [{ kind: "test", reference: "test-report" }] },
  ["test"],
  true,
);

const blocked = authorizeExecution(workUnit, { ...context, repositoryAvailable: false });

console.log("Governed path:", verified.outcome === "ACCEPTED" ? verified.value.state : verified.code);
console.log("Blocked path:", blocked.outcome === "BLOCKED" ? blocked.code : blocked.outcome);
