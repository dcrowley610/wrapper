import type { NormalizationResult } from '../types';
import type { MasterRecord, ObjectAlias } from '../types';

export type BlockingCandidate = {
  masterId: string;
  matchedVia: string;
};

/**
 * Generate candidate masters using blocking keys to avoid O(n²) comparison.
 * Returns deduplicated set of master IDs with match reason.
 */
export function generateCandidates(
  sourceNorm: NormalizationResult,
  sourceAttributes: Record<string, string>,
  masters: MasterRecord[],
  aliases: ObjectAlias[],
): BlockingCandidate[] {
  const seen = new Map<string, string>();

  function add(masterId: string, reason: string) {
    if (!seen.has(masterId)) {
      seen.set(masterId, reason);
    }
  }

  for (const master of masters) {
    // Exact comparisonKeyStripped match
    if (
      sourceNorm.comparisonKeyStripped &&
      master.normalizedName &&
      sourceNorm.comparisonKeyStripped === buildStrippedKey(master.normalizedName)
    ) {
      add(master.id, 'exact_stripped_key');
    }

    // First-4-character prefix of comparisonKeyFull
    if (
      sourceNorm.comparisonKeyFull.length >= 4 &&
      master.normalizedName.length >= 4 &&
      sourceNorm.comparisonKeyFull.slice(0, 4) === buildFullKey(master.normalizedName).slice(0, 4)
    ) {
      add(master.id, 'prefix_4_match');
    }

    // Acronym key match
    if (
      sourceNorm.acronymKey &&
      sourceNorm.acronymKey.length >= 2 &&
      sourceNorm.acronymKey === buildAcronymKey(master.normalizedName)
    ) {
      add(master.id, 'acronym_match');
    }

    // Exact EIN/taxId match
    const sourceEin = sourceAttributes['ein'] || sourceAttributes['taxIdLast4'] || '';
    if (sourceEin) {
      const masterEin = getMasterIdentifier(master);
      if (masterEin && masterEin === sourceEin) {
        add(master.id, 'exact_ein_match');
      }
    }
  }

  // Existing alias comparisonKeyFull match
  for (const alias of aliases) {
    if (alias.isActive && alias.normalizedAliasName) {
      const aliasKey = buildFullKey(alias.normalizedAliasName);
      if (sourceNorm.comparisonKeyFull === aliasKey) {
        add(alias.masterId, 'alias_key_match');
      }
    }
  }

  return Array.from(seen.entries()).map(([masterId, matchedVia]) => ({
    masterId,
    matchedVia,
  }));
}

function buildStrippedKey(normalizedName: string): string {
  return normalizedName.replace(/\s+/g, ' ').trim();
}

function buildFullKey(normalizedName: string): string {
  return normalizedName.replace(/\s+/g, ' ').trim();
}

function buildAcronymKey(normalizedName: string): string {
  const tokens = normalizedName.split(/\s+/).filter(Boolean);
  return tokens.length > 1 ? tokens.map((t) => t[0]).join('') : '';
}

function getMasterIdentifier(master: MasterRecord): string {
  if (master.domain === 'entity') return master.ein || '';
  if (master.domain === 'investor') return master.taxIdLast4 || '';
  return '';
}
