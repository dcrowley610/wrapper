export type NormalizationTraceEntry = {
  step: string;
  input: string;
  output: string;
  transformations: string[];
};

export type NormalizationResult = {
  originalName: string;
  normalizedNameFull: string;
  normalizedNameStrippedSuffix: string;
  comparisonKeyFull: string;
  comparisonKeyStripped: string;
  tokenSortKey: string;
  acronymKey: string;
  trace: NormalizationTraceEntry[];
};
