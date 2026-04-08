type StepResult = { output: string; transformations: string[] };

export function basicCleanup(input: string): StepResult {
  const transformations: string[] = [];
  let result = input;

  const trimmed = result.trim();
  if (trimmed !== result) {
    transformations.push('Trimmed whitespace');
    result = trimmed;
  }

  if (/[\t\n\r]/.test(result)) {
    result = result.replace(/[\t\n\r]+/g, ' ');
    transformations.push('Replaced tabs/newlines with spaces');
  }

  const upper = result.toUpperCase();
  if (upper !== result) {
    transformations.push('Converted to uppercase');
    result = upper;
  }

  if (result.includes('&')) {
    result = result.replace(/&/g, 'AND');
    transformations.push('Replaced & with AND');
  }

  if (/-/.test(result)) {
    result = result.replace(/-/g, ' ');
    transformations.push('Replaced hyphens with spaces');
  }

  if (/[^A-Z0-9\s]/.test(result)) {
    result = result.replace(/[^A-Z0-9\s]/g, '');
    transformations.push('Removed punctuation');
  }

  if (/\s{2,}/.test(result)) {
    result = result.replace(/\s{2,}/g, ' ');
    transformations.push('Collapsed multiple spaces');
  }

  result = result.trim();

  return { output: result, transformations };
}
