import type { NormalizationResult, MasterRecord, ScoreComponent, ObjectAlias } from '../types';
import type { BlockingCandidate } from './candidateGenerator';
import {
  scoreAliasMatch,
  scoreExactNormalized,
  scoreExactStripped,
  scoreJaroWinkler,
  scoreTokenSort,
  scoreAcronym,
  scoreJurisdiction,
  scoreCategoryMatch,
  scoreScopeOverlap,
  scoreConflictingEin,
} from './scoringFunctions';

export type ScoredCandidate = {
  masterId: string;
  compositeScore: number;
  scoreComponents: ScoreComponent[];
  blockingReason: string;
};

export function scoreCandidates(
  sourceNorm: NormalizationResult,
  sourceAttrs: Record<string, string>,
  sourceScopeIds: string[],
  candidates: BlockingCandidate[],
  masters: MasterRecord[],
  aliases: ObjectAlias[],
): ScoredCandidate[] {
  const masterMap = new Map(masters.map((m) => [m.id, m]));

  return candidates
    .map((candidate) => {
      const master = masterMap.get(candidate.masterId);
      if (!master) return null;

      const components: ScoreComponent[] = [];

      // Name scores — take the best one
      const aliasScore = scoreAliasMatch(sourceNorm, aliases, master.id);
      const exactNorm = scoreExactNormalized(sourceNorm, master.normalizedName);
      const exactStrip = scoreExactStripped(sourceNorm, master.normalizedName);

      // Use best exact/alias score
      const bestExact = [aliasScore, exactNorm, exactStrip]
        .filter((s): s is ScoreComponent => s !== null)
        .sort((a, b) => b.weightedScore - a.weightedScore)[0];

      if (bestExact) {
        components.push(bestExact);
      }

      // Always add fuzzy scores
      components.push(scoreJaroWinkler(sourceNorm, master.normalizedName));
      components.push(scoreTokenSort(sourceNorm, master.normalizedName));

      const acronym = scoreAcronym(sourceNorm, master.normalizedName);
      if (acronym) components.push(acronym);

      // Attribute scores
      const juris = scoreJurisdiction(sourceAttrs, master);
      if (juris) components.push(juris);

      const cat = scoreCategoryMatch(sourceAttrs, master);
      if (cat) components.push(cat);

      const scope = scoreScopeOverlap(sourceScopeIds, master.scopeIds);
      if (scope) components.push(scope);

      // Penalties
      const einConflict = scoreConflictingEin(sourceAttrs, master);
      if (einConflict) components.push(einConflict);

      // Composite: best name score + attribute bonuses − penalties, clamped 0–100
      const nameScore = bestExact ? bestExact.weightedScore : 0;
      const fuzzyScore = Math.max(
        components.find((c) => c.factor === 'jaro_winkler')?.weightedScore || 0,
        components.find((c) => c.factor === 'token_sort')?.weightedScore || 0,
      );
      const bestNameScore = Math.max(nameScore, fuzzyScore);

      const bonuses = components
        .filter((c) => c.weightedScore > 0 && !['alias_exact_match', 'exact_normalized', 'exact_stripped', 'jaro_winkler', 'token_sort', 'acronym_match'].includes(c.factor))
        .reduce((sum, c) => sum + c.weightedScore, 0);

      const acronymBonus = acronym ? acronym.weightedScore : 0;

      const penalties = components
        .filter((c) => c.weightedScore < 0)
        .reduce((sum, c) => sum + c.weightedScore, 0);

      const compositeScore = Math.max(0, Math.min(100, bestNameScore + acronymBonus + bonuses + penalties));

      return {
        masterId: candidate.masterId,
        compositeScore: Math.round(compositeScore * 10) / 10,
        scoreComponents: components,
        blockingReason: candidate.matchedVia,
      };
    })
    .filter((c): c is ScoredCandidate => c !== null)
    .sort((a, b) => b.compositeScore - a.compositeScore);
}
