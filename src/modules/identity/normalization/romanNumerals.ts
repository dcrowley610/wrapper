type StepResult = { output: string; transformations: string[] };

const ROMAN_MAP: [string, string][] = [
  ['XX', '20'], ['XIX', '19'], ['XVIII', '18'], ['XVII', '17'], ['XVI', '16'],
  ['XV', '15'], ['XIV', '14'], ['XIII', '13'], ['XII', '12'], ['XI', '11'],
  ['X', '10'], ['IX', '9'], ['VIII', '8'], ['VII', '7'], ['VI', '6'],
  ['V', '5'], ['IV', '4'], ['III', '3'], ['II', '2'], ['I', '1'],
];

export function convertRomanNumerals(input: string): StepResult {
  const transformations: string[] = [];
  let result = input;

  for (const [roman, arabic] of ROMAN_MAP) {
    const regex = new RegExp(`\\b${roman}\\b`, 'g');
    if (regex.test(result)) {
      result = result.replace(regex, arabic);
      transformations.push(`Roman numeral "${roman}" → "${arabic}"`);
    }
  }

  return { output: result, transformations };
}
