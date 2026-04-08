import type { NormalizationResult, NormalizationTraceEntry } from '../types';
import { basicCleanup } from './basicCleanup';
import { legalSuffix } from './legalSuffix';
import { businessPhrasesConservative } from './businessPhrases';
import { buildComparisonKeys } from './comparisonKeys';

export function normalize(rawName: string): NormalizationResult {
  const trace: NormalizationTraceEntry[] = [];

  // Step 1: basic cleanup
  const cleanup = basicCleanup(rawName);
  trace.push({
    step: 'basicCleanup',
    input: rawName,
    output: cleanup.output,
    transformations: cleanup.transformations,
  });

  // Step 2: legal suffix normalization
  const suffix = legalSuffix(cleanup.output);
  trace.push({
    step: 'legalSuffix(full)',
    input: cleanup.output,
    output: suffix.full.output,
    transformations: suffix.full.transformations,
  });
  trace.push({
    step: 'legalSuffix(stripped)',
    input: cleanup.output,
    output: suffix.stripped.output,
    transformations: suffix.stripped.transformations,
  });

  // Step 3: conservative business phrases
  const phrasesFull = businessPhrasesConservative(suffix.full.output);
  trace.push({
    step: 'businessPhrases(full)',
    input: suffix.full.output,
    output: phrasesFull.output,
    transformations: phrasesFull.transformations,
  });

  const phrasesStripped = businessPhrasesConservative(suffix.stripped.output);
  trace.push({
    step: 'businessPhrases(stripped)',
    input: suffix.stripped.output,
    output: phrasesStripped.output,
    transformations: phrasesStripped.transformations,
  });

  const normalizedNameFull = phrasesFull.output;
  const normalizedNameStrippedSuffix = phrasesStripped.output;

  // Step 4+5: comparison keys (includes aggressive phrases + roman numerals)
  const keys = buildComparisonKeys(normalizedNameFull, normalizedNameStrippedSuffix);
  trace.push(...keys.trace);

  return {
    originalName: rawName,
    normalizedNameFull,
    normalizedNameStrippedSuffix,
    comparisonKeyFull: keys.comparisonKeyFull,
    comparisonKeyStripped: keys.comparisonKeyStripped,
    tokenSortKey: keys.tokenSortKey,
    acronymKey: keys.acronymKey,
    trace,
  };
}
