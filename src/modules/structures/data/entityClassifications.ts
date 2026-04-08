import type { EntityClassification } from '../types';

const CLASSIFICATIONS: Record<string, EntityClassification> = {
  partnership: {
    label: 'Partnership',
    description: 'Partnership',
  },
  reverse_hybrid: {
    label: 'Corp (US tax) / Partnership or LLC (legal)',
    description: 'Corp (US tax) / Flow-Thru (nonUS)',
  },
  hybrid: {
    label: 'Partnership (US tax) / Opaque (nonUS))',
    description: 'Partnership (US tax) / Opaque (nonUS)',
  },
  disregarded: {
    label: 'Disregarded entity (US tax)',
    description: 'Disregarded entity (US tax)',
  },
  corporation: {
    label: 'Corp (US tax & local legal)',
    description: 'Corporation (US tax) and (nonUS)',
  },
  nonbx: {
    label: 'Non-BX entity',
    description: 'Non-BX entity',
  },
  asset: {
    label: 'Asset',
    description: 'Asset',
  },
};

export const CLASSIFICATION_DIMENSIONS: Record<string, { width: number; height: number }> = {
  partnership: { width: 180, height: 140 },
  reverse_hybrid: { width: 200, height: 80 },
  hybrid: { width: 200, height: 80 },
  disregarded: { width: 200, height: 80 },
  corporation: { width: 200, height: 80 },
  nonbx: { width: 200, height: 80 },
  asset: { width: 200, height: 100 },
};

const DEFAULT_DIMENSIONS = { width: 200, height: 80 };

export function getClassificationDimensions(key: string): { width: number; height: number } {
  return CLASSIFICATION_DIMENSIONS[key] ?? DEFAULT_DIMENSIONS;
}

export function getClassification(key: string): EntityClassification | undefined {
  return CLASSIFICATIONS[key];
}

export function getAllClassifications(): Record<string, EntityClassification> {
  return CLASSIFICATIONS;
}
