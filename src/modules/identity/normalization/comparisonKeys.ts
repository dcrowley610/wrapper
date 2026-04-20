import { businessPhrasesAggressive } from './businessPhrases';
import { convertRomanNumerals } from './romanNumerals';

export type ComparisonKeys = {
  comparisonKeyFull: string;
  comparisonKeyStripped: string;
  tokenSortKey: string;
  acronymKey: string;
  trace: { step: string; input: string; output: string; transformations: string[] }[];
};

export function buildComparisonKeys(
  normalizedFull: string,
  normalizedStripped: string,
): ComparisonKeys {
  const trace: ComparisonKeys['trace'] = [];

  // Apply aggressive phrases to full key
  const aggressiveFull = businessPhrasesAggressive(normalizedFull);
  trace.push({
    step: 'comparisonKeys:aggressivePhrases(full)',
    input: normalizedFull,
    output: aggressiveFull.output,
    transformations: aggressiveFull.transformations,
  });

  // Apply roman numeral conversion
  const romanFull = convertRomanNumerals(aggressiveFull.output);
  trace.push({
    step: 'comparisonKeys:romanNumerals(full)',
    input: aggressiveFull.output,
    output: romanFull.output,
    transformations: romanFull.transformations,
  });
  const comparisonKeyFull = romanFull.output;

  // Apply aggressive phrases to stripped key
  const aggressiveStripped = businessPhrasesAggressive(normalizedStripped);
  const romanStripped = convertRomanNumerals(aggressiveStripped.output);
  const comparisonKeyStripped = romanStripped.output;

  trace.push({
    step: 'comparisonKeys:stripped',
    input: normalizedStripped,
    output: comparisonKeyStripped,
    transformations: [...aggressiveStripped.transformations, ...romanStripped.transformations],
  });

  // Token sort key (alphabetically sorted tokens)
  const tokens = comparisonKeyFull.split(/\s+/).filter(Boolean).sort();
  const tokenSortKey = tokens.join(' ');
  trace.push({
    step: 'comparisonKeys:tokenSort',
    input: comparisonKeyFull,
    output: tokenSortKey,
    transformations: ['Alphabetically sorted tokens'],
  });

  // Acronym key (first letter of each token if multi-word)
  const acronymKey = tokens.length > 1 ? tokens.map((t) => t[0]).join('') : '';
  trace.push({
    step: 'comparisonKeys:acronym',
    input: comparisonKeyFull,
    output: acronymKey,
    transformations: tokens.length > 1 ? ['Built first-letter acronym'] : ['Single word — no acronym'],
  });

  return { comparisonKeyFull, comparisonKeyStripped, tokenSortKey, acronymKey, trace };
}
