type StepResult = { output: string; transformations: string[] };

type SuffixRule = { patterns: string[]; canonical: string };

const SUFFIX_RULES: SuffixRule[] = [
  { patterns: ['LIMITED LIABILITY COMPANY', 'LIMITED LIABILITY CO'], canonical: 'LLC' },
  { patterns: ['LIMITED LIABILITY PARTNERSHIP'], canonical: 'LLP' },
  { patterns: ['LIMITED PARTNERSHIP'], canonical: 'LP' },
  { patterns: ['LIMITED'], canonical: 'LTD' },
  { patterns: ['INCORPORATED'], canonical: 'INC' },
  { patterns: ['CORPORATION'], canonical: 'CORP' },
  { patterns: ['COMPANY'], canonical: 'CO' },
  { patterns: ['SOCIETE A RESPONSABILITE LIMITEE', 'S A R L', 'SARL'], canonical: 'SARL' },
  { patterns: ['SEGREGATED PORTFOLIO COMPANY'], canonical: 'SPC' },
];

// Build flat lookup sorted by pattern length (longest first)
const ORDERED_RULES: { pattern: string; canonical: string }[] = [];
for (const rule of SUFFIX_RULES) {
  for (const pattern of rule.patterns) {
    ORDERED_RULES.push({ pattern, canonical: rule.canonical });
  }
  // Also add the canonical itself so "LLC" stays "LLC"
  if (!rule.patterns.includes(rule.canonical)) {
    ORDERED_RULES.push({ pattern: rule.canonical, canonical: rule.canonical });
  }
}
ORDERED_RULES.sort((a, b) => b.pattern.length - a.pattern.length);

export function legalSuffix(input: string): { full: StepResult; stripped: StepResult } {
  const fullTransformations: string[] = [];
  const strippedTransformations: string[] = [];
  let fullResult = input;
  let strippedResult = input;

  for (const rule of ORDERED_RULES) {
    const regex = new RegExp(`\\b${rule.pattern}\\b`, 'i');
    if (regex.test(fullResult)) {
      if (rule.pattern !== rule.canonical) {
        fullResult = fullResult.replace(regex, rule.canonical);
        fullTransformations.push(`Normalized "${rule.pattern}" → "${rule.canonical}"`);
      }
      strippedResult = strippedResult.replace(regex, '').replace(/\s{2,}/g, ' ').trim();
      strippedTransformations.push(`Stripped suffix "${rule.pattern}"`);
      break; // Only process the first (longest) match
    }
  }

  return {
    full: { output: fullResult, transformations: fullTransformations },
    stripped: { output: strippedResult, transformations: strippedTransformations },
  };
}
