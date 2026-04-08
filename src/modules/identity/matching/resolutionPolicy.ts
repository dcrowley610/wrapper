import type { MatchTier, TaskPriority } from '../types';
import type { ScoredCandidate } from './deterministicScorer';

export type ResolutionDecision = {
  action: 'auto_match' | 'create_task' | 'create_new';
  tier: MatchTier;
  priority: TaskPriority;
  selectedMasterId: string | null;
};

export function resolvePolicy(candidates: ScoredCandidate[]): ResolutionDecision {
  if (candidates.length === 0) {
    return {
      action: 'create_new',
      tier: 'likely_new',
      priority: 'low',
      selectedMasterId: null,
    };
  }

  const top = candidates[0];
  const second = candidates.length > 1 ? candidates[1] : null;

  // Ambiguity check: top two within 5 points → always create task
  const isAmbiguous = second !== null && (top.compositeScore - second.compositeScore) <= 5;

  // Check for hard conflicts (e.g., conflicting EIN)
  const hasHardConflict = top.scoreComponents.some(
    (c) => c.factor === 'conflicting_ein' && c.weightedScore <= -100,
  );

  // ≥95, single top candidate, no hard conflicts → auto-match
  if (top.compositeScore >= 95 && !isAmbiguous && !hasHardConflict) {
    return {
      action: 'auto_match',
      tier: 'auto_match',
      priority: 'low',
      selectedMasterId: top.masterId,
    };
  }

  // Ambiguous or 85-94 → suggested
  if (top.compositeScore >= 85 || (isAmbiguous && top.compositeScore >= 70)) {
    return {
      action: 'create_task',
      tier: 'suggested',
      priority: 'medium',
      selectedMasterId: null,
    };
  }

  // 70-84 → review_required
  if (top.compositeScore >= 70) {
    return {
      action: 'create_task',
      tier: 'review_required',
      priority: 'high',
      selectedMasterId: null,
    };
  }

  // <70 → likely new
  return {
    action: 'create_task',
    tier: 'likely_new',
    priority: 'low',
    selectedMasterId: null,
  };
}
