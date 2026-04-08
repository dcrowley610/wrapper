type StepResult = { output: string; transformations: string[] };

const CONSERVATIVE_MAP: [string, string][] = [
  ['HOLDING COMPANY', 'HOLDCO'],
  ['HOLDCO', 'HOLDCO'],
  ['HLDGS', 'HOLDINGS'],
  ['MGMT', 'MANAGEMENT'],
  ['INTL', 'INTERNATIONAL'],
  ['SVCS', 'SERVICES'],
  ['ASSOC', 'ASSOCIATES'],
];

const AGGRESSIVE_MAP: [string, string][] = [
  ['PROPERTY', 'PROP'],
  ['PROPERTIES', 'PROP'],
  ['REAL ESTATE', 'RE'],
  ['PRIVATE EQUITY', 'PE'],
  ['VENTURE CAPITAL', 'VC'],
  ['INVESTMENT', 'INV'],
  ['INVESTMENTS', 'INV'],
  ['CAPITAL', 'CAP'],
  ['PARTNERS', 'PRTNRS'],
  ['ADVISORS', 'ADV'],
  ['ADVISORY', 'ADV'],
  ['MANAGEMENT', 'MGMT'],
  ['HOLDINGS', 'HLDGS'],
  ['INTERNATIONAL', 'INTL'],
  ['FINANCIAL', 'FIN'],
  ['SERVICES', 'SVCS'],
  ['TECHNOLOGY', 'TECH'],
  ['DEVELOPMENT', 'DEV'],
  ['INFRASTRUCTURE', 'INFRA'],
  ['ACQUISITION', 'ACQ'],
  ['ACQUISITIONS', 'ACQ'],
];

function applyMap(input: string, map: [string, string][]): StepResult {
  const transformations: string[] = [];
  let result = input;

  for (const [from, to] of map) {
    const regex = new RegExp(`\\b${from}\\b`, 'g');
    if (regex.test(result)) {
      result = result.replace(regex, to);
      transformations.push(`"${from}" → "${to}"`);
    }
  }

  return { output: result, transformations };
}

export function businessPhrasesConservative(input: string): StepResult {
  return applyMap(input, CONSERVATIVE_MAP);
}

export function businessPhrasesAggressive(input: string): StepResult {
  return applyMap(input, AGGRESSIVE_MAP);
}
