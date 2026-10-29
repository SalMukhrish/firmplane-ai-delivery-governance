// SPDX-License-Identifier: MIT

import type { RunProgress } from "./types.js";

export type ExitDecision =
  | { readonly outcome: "CONTINUE" }
  | { readonly outcome: "STOPPED"; readonly code: "EXECUTION_LIMIT_REACHED" }
  | { readonly outcome: "ESCALATED"; readonly code: "NO_PROGRESS" };

export interface ExitLimits {
  readonly maxAttempts: number;
  readonly maxUnchangedIterations: number;
}

export function evaluateExitPolicy(progress: RunProgress, limits: ExitLimits): ExitDecision {
  if (progress.attempts >= limits.maxAttempts) {
    return { outcome: "STOPPED", code: "EXECUTION_LIMIT_REACHED" };
  }
  if (progress.unchangedIterations >= limits.maxUnchangedIterations) {
    return { outcome: "ESCALATED", code: "NO_PROGRESS" };
  }
  return { outcome: "CONTINUE" };
}
