import type { NormalizationResult, MasterRecord, ScoreComponent, ObjectAlias } from '../types';
import { jaroWinkler, tokenSortRatio } from '../normalization';

export function scoreAliasMatch(
  sourceNorm: NormalizationResult,
  aliases: ObjectAlias[],
  masterId: string,
): ScoreComponent | null {
  const masterAliases = aliases.filter((a) => a.masterId === masterId && a.isActive);
  for (const alias of masterAliases) {
    const aliasKey = alias.normalizedAliasName.replace(/\s+/g, ' ').trim();
    if (sourceNorm.comparisonKeyFull === aliasKey) {
      return {
        factor: 'alias_exact_match',
        weight: 1,
        rawScore: 95,
        weightedScore: 95,
        explanation: `Exact match to existing alias "${alias.aliasName}"`,
      };
    }
  }
  return null;
}

export function scoreExactNormalized(
  sourceNorm: NormalizationResult,
  masterNormalized: string,
): ScoreComponent | null {
  if (sourceNorm.normalizedNameFull === masterNormalized) {
    return {
      factor: 'exact_normalized',
      weight: 1,
      rawScore: 90,
      weightedScore: 90,
      explanation: 'Exact normalized name match',
    };
  }
  return null;
}

export function scoreExactStripped(
  sourceNorm: NormalizationResult,
  masterNormalized: string,
): ScoreComponent | null {
  const masterStripped = masterNormalized.replace(/\b(LLC|LP|LLP|LTD|INC|CORP|CO|SARL|SPC)\b/g, '').replace(/\s{2,}/g, ' ').trim();
  if (sourceNorm.normalizedNameStrippedSuffix === masterStripped) {
    return {
      factor: 'exact_stripped',
      weight: 1,
      rawScore: 85,
      weightedScore: 85,
      explanation: 'Exact match after stripping legal suffixes',
    };
  }
  return null;
}

export function scoreJaroWinkler(
  sourceNorm: NormalizationResult,
  masterNormalized: string,
): ScoreComponent {
  const similarity = jaroWinkler(sourceNorm.comparisonKeyFull, masterNormalized);
  const rawScore = similarity * 35;
  return {
    factor: 'jaro_winkler',
    weight: 1,
    rawScore: Math.round(rawScore * 10) / 10,
    weightedScore: Math.round(rawScore * 10) / 10,
    explanation: `Jaro-Winkler similarity: ${(similarity * 100).toFixed(1)}%`,
  };
}

export function scoreTokenSort(
  sourceNorm: NormalizationResult,
  masterNormalized: string,
): ScoreComponent {
  const ratio = tokenSortRatio(sourceNorm.comparisonKeyFull, masterNormalized);
  const rawScore = ratio * 20;
  return {
    factor: 'token_sort',
    weight: 1,
    rawScore: Math.round(rawScore * 10) / 10,
    weightedScore: Math.round(rawScore * 10) / 10,
    explanation: `Token sort ratio: ${(ratio * 100).toFixed(1)}%`,
  };
}

export function scoreAcronym(
  sourceNorm: NormalizationResult,
  masterNormalized: string,
): ScoreComponent | null {
  if (!sourceNorm.acronymKey || sourceNorm.acronymKey.length < 2) return null;
  const masterTokens = masterNormalized.split(/\s+/).filter(Boolean);
  const masterAcronym = masterTokens.length > 1 ? masterTokens.map((t) => t[0]).join('') : '';
  if (sourceNorm.acronymKey === masterAcronym) {
    return {
      factor: 'acronym_match',
      weight: 1,
      rawScore: 10,
      weightedScore: 10,
      explanation: `Acronym match: "${sourceNorm.acronymKey}"`,
    };
  }
  return null;
}

export function scoreJurisdiction(
  sourceAttrs: Record<string, string>,
  master: MasterRecord,
): ScoreComponent | null {
  const sourceJuris = sourceAttrs['jurisdiction'] || sourceAttrs['domicile'] || '';
  if (!sourceJuris) return null;

  let masterJuris = '';
  if (master.domain === 'entity') masterJuris = master.jurisdiction;
  if (master.domain === 'investor') masterJuris = master.domicile;

  if (!masterJuris) return null;

  if (sourceJuris.toUpperCase() === masterJuris.toUpperCase()) {
    return {
      factor: 'jurisdiction_match',
      weight: 1,
      rawScore: 8,
      weightedScore: 8,
      explanation: `Same jurisdiction: ${masterJuris}`,
    };
  }

  return {
    factor: 'jurisdiction_conflict',
    weight: 1,
    rawScore: -25,
    weightedScore: -25,
    explanation: `Conflicting jurisdiction: source="${sourceJuris}" vs master="${masterJuris}"`,
  };
}

export function scoreCategoryMatch(
  sourceAttrs: Record<string, string>,
  master: MasterRecord,
): ScoreComponent | null {
  const sourceCat = sourceAttrs['category'] || sourceAttrs['investorClass'] || sourceAttrs['investmentType'] || '';
  if (!sourceCat) return null;

  let masterCat = '';
  if (master.domain === 'entity') masterCat = master.category;
  if (master.domain === 'investor') masterCat = master.investorClass;
  if (master.domain === 'deal') masterCat = master.investmentType;

  if (!masterCat) return null;

  if (sourceCat.toUpperCase() === masterCat.toUpperCase()) {
    return {
      factor: 'category_match',
      weight: 1,
      rawScore: 8,
      weightedScore: 8,
      explanation: `Same category/class: ${masterCat}`,
    };
  }
  return null;
}

export function scoreScopeOverlap(
  sourceScopeIds: string[],
  masterScopeIds: string[],
): ScoreComponent | null {
  if (!sourceScopeIds.length || !masterScopeIds.length) return null;

  const overlap = sourceScopeIds.filter((id) => masterScopeIds.includes(id));
  if (overlap.length > 0) {
    return {
      factor: 'scope_overlap',
      weight: 1,
      rawScore: Math.min(12, overlap.length * 4),
      weightedScore: Math.min(12, overlap.length * 4),
      explanation: `Scope overlap: ${overlap.join(', ')}`,
    };
  }
  return null;
}

export function scoreConflictingEin(
  sourceAttrs: Record<string, string>,
  master: MasterRecord,
): ScoreComponent | null {
  const sourceEin = sourceAttrs['ein'] || '';
  if (!sourceEin || master.domain !== 'entity') return null;

  if (master.ein && master.ein !== sourceEin) {
    return {
      factor: 'conflicting_ein',
      weight: 1,
      rawScore: -100,
      weightedScore: -100,
      explanation: `Conflicting EIN: source="${sourceEin}" vs master="${master.ein}"`,
    };
  }
  return null;
}
