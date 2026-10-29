// SPDX-License-Identifier: MIT

export type WorkUnitState =
  | "DRAFT"
  | "READY"
  | "RUNNING"
  | "RESULT_PROPOSED"
  | "VERIFIED"
  | "COMPLETED"
  | "BLOCKED"
  | "STOPPED"
  | "ESCALATED";

export type FinalState = "COMPLETED" | "BLOCKED" | "STOPPED" | "ESCALATED";

export interface WorkUnit {
  readonly id: string;
  readonly state: WorkUnitState;
  readonly requiredCapabilities: readonly string[];
  readonly acceptanceCriteria: readonly string[];
  readonly repositoryRequired: boolean;
}

export interface ExecutionContext {
  readonly actorCapabilities: readonly string[];
  readonly approved: boolean;
  readonly repositoryAvailable: boolean;
}

export type Decision<T, C extends string> =
  | { readonly outcome: "ACCEPTED"; readonly value: T }
  | { readonly outcome: "BLOCKED"; readonly code: C; readonly reasons: readonly string[] };

export interface EvidenceItem {
  readonly kind: string;
  readonly reference: string;
}

export interface ExecutionResult {
  readonly summary: string;
  readonly evidence: readonly EvidenceItem[];
}

export interface RunProgress {
  readonly attempts: number;
  readonly unchangedIterations: number;
}
