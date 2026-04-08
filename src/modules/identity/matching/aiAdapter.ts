import type { AiRecommendation } from '../types';
import type { ScoredCandidate } from './deterministicScorer';

export type AiMatchingAdapter = {
  recommend(
    sourceRawName: string,
    candidates: ScoredCandidate[],
    masterNames: Map<string, string>,
  ): AiRecommendation[];
};

/**
 * Mock AI adapter: derives explanations from deterministic scores
 * with slight score adjustments to simulate AI reasoning.
 */
export const mockAiAdapter: AiMatchingAdapter = {
  recommend(sourceRawName, candidates, masterNames) {
    return candidates.map((c) => {
      const masterName = masterNames.get(c.masterId) || 'Unknown';
      const adjustment = c.compositeScore >= 90 ? 2 : c.compositeScore >= 70 ? -1 : -3;
      const aiScore = Math.max(0, Math.min(100, c.compositeScore + adjustment));

      let explanation: string;
      if (aiScore >= 95) {
        explanation = `Very high confidence: "${sourceRawName}" is almost certainly "${masterName}". Names are effectively identical after normalization.`;
      } else if (aiScore >= 85) {
        explanation = `High confidence: "${sourceRawName}" likely matches "${masterName}". Minor differences appear to be formatting or abbreviation variations.`;
      } else if (aiScore >= 70) {
        explanation = `Moderate confidence: "${sourceRawName}" may match "${masterName}". Names share significant overlap but have notable differences that warrant review.`;
      } else {
        explanation = `Low confidence: "${sourceRawName}" has some similarity to "${masterName}" but differences suggest these may be distinct entities.`;
      }

      return {
        candidateMasterId: c.masterId,
        score: Math.round(aiScore * 10) / 10,
        explanation,
      };
    });
  },
};
