import assert from "node:assert/strict";
import test from "node:test";
import {
  authorizeExecution,
  evaluateExitPolicy,
  transitionWorkUnit,
  validateEvidence,
  verifyResult,
  type WorkUnit,
} from "../src/index.js";

const ready: WorkUnit = {
  id: "WU-REFERENCE",
  state: "READY",
  requiredCapabilities: ["repository:read", "tests:run"],
  acceptanceCriteria: ["Tests pass", "Evidence is returned"],
  repositoryRequired: true,
};

test("authorized ready work is accepted", () => {
  const result = authorizeExecution(ready, {
    actorCapabilities: ["repository:read", "tests:run"],
    approved: true,
    repositoryAvailable: true,
  });
  assert.equal(result.outcome, "ACCEPTED");
});

test("missing approval blocks execution", () => {
  const result = authorizeExecution(ready, {
    actorCapabilities: ["repository:read", "tests:run"],
    approved: false,
    repositoryAvailable: true,
  });
  assert.deepEqual(result, {
    outcome: "BLOCKED",
    code: "APPROVAL_REQUIRED",
    reasons: ["Required approval is absent."],
  });
});

test("missing capability blocks execution", () => {
  const result = authorizeExecution(ready, {
    actorCapabilities: ["repository:read"],
    approved: true,
    repositoryAvailable: true,
  });
  assert.equal(result.outcome, "BLOCKED");
  if (result.outcome === "BLOCKED") assert.equal(result.code, "CAPABILITY_MISSING");
});

test("repository-dependent work fails closed when repository is unavailable", () => {
  const result = authorizeExecution(ready, {
    actorCapabilities: ["repository:read", "tests:run"],
    approved: true,
    repositoryAvailable: false,
  });
  assert.equal(result.outcome, "BLOCKED");
  if (result.outcome === "BLOCKED") assert.equal(result.code, "REPOSITORY_UNAVAILABLE");
});

test("valid lifecycle transitions are accepted", () => {
  const result = transitionWorkUnit(ready, "RUNNING");
  assert.equal(result.outcome, "ACCEPTED");
});

test("invalid lifecycle transitions are blocked", () => {
  const result = transitionWorkUnit(ready, "COMPLETED");
  assert.equal(result.outcome, "BLOCKED");
  if (result.outcome === "BLOCKED") assert.equal(result.code, "INVALID_TRANSITION");
});

test("final states cannot be changed", () => {
  const result = transitionWorkUnit({ ...ready, state: "COMPLETED" }, "RUNNING");
  assert.equal(result.outcome, "BLOCKED");
  if (result.outcome === "BLOCKED") assert.equal(result.code, "FINAL_STATE_LOCKED");
});

test("required evidence is accepted", () => {
  const result = validateEvidence(
    { summary: "Validation completed", evidence: [{ kind: "test", reference: "test-report" }] },
    ["test"],
  );
  assert.equal(result.outcome, "ACCEPTED");
});

test("missing evidence is blocked", () => {
  const result = validateEvidence({ summary: "No evidence", evidence: [] }, ["test"]);
  assert.equal(result.outcome, "BLOCKED");
  if (result.outcome === "BLOCKED") assert.equal(result.code, "EVIDENCE_REQUIRED");
});

test("results cannot verify themselves", () => {
  const result = verifyResult(
    { ...ready, state: "RESULT_PROPOSED" },
    { summary: "Done", evidence: [{ kind: "test", reference: "test-report" }] },
    ["test"],
    false,
  );
  assert.equal(result.outcome, "BLOCKED");
  if (result.outcome === "BLOCKED") assert.equal(result.code, "REVIEW_REQUIRED");
});

test("independently reviewed evidence advances a proposed result", () => {
  const result = verifyResult(
    { ...ready, state: "RESULT_PROPOSED" },
    { summary: "Done", evidence: [{ kind: "test", reference: "test-report" }] },
    ["test"],
    true,
  );
  assert.equal(result.outcome, "ACCEPTED");
  if (result.outcome === "ACCEPTED") assert.equal(result.value.state, "VERIFIED");
});

test("execution limit stops a run", () => {
  assert.deepEqual(
    evaluateExitPolicy({ attempts: 3, unchangedIterations: 0 }, { maxAttempts: 3, maxUnchangedIterations: 2 }),
    { outcome: "STOPPED", code: "EXECUTION_LIMIT_REACHED" },
  );
});

test("no-progress condition escalates a run", () => {
  assert.deepEqual(
    evaluateExitPolicy({ attempts: 1, unchangedIterations: 2 }, { maxAttempts: 3, maxUnchangedIterations: 2 }),
    { outcome: "ESCALATED", code: "NO_PROGRESS" },
  );
});
