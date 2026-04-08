import type { EntityClassification, EntityData, EntityType } from '../types';
import { getClassification } from '../data/entityClassifications';
import { getJurisdictionFill, getBorderOverlay } from '../data/annotationStyles';

const ENTITY_TYPE_TO_CLASSIFICATION: Record<EntityType, string> = {
  corporation: 'corporation',
  llc: 'reverse_hybrid',
  partnership: 'partnership',
  trust: 'corporation',
  individual: 'corporation',
};

const DEFAULT_CLASSIFICATION: EntityClassification = {
  label: 'Unknown',
  description: 'Unknown',
};

const DEFAULT_COLORS = {
  borderColor: '#1e293b',
  fillColor: 'white',
};

export function resolveClassification(data: EntityData): EntityClassification {
  if (data.classificationKey) {
    const cls = getClassification(data.classificationKey);
    if (cls) return cls;
  }
  return getClassification(ENTITY_TYPE_TO_CLASSIFICATION[data.entityType]) ?? DEFAULT_CLASSIFICATION;
}

export function resolveClassificationKey(data: EntityData): string {
  if (data.classificationKey) return data.classificationKey;
  return ENTITY_TYPE_TO_CLASSIFICATION[data.entityType] ?? 'corp-us-local';
}

export function resolveNodeColors(data: EntityData): { borderColor: string; fillColor: string } {
  let borderColor = DEFAULT_COLORS.borderColor;
  let fillColor = DEFAULT_COLORS.fillColor;

  const jurisdictionFillKey = data.jurisdictionFillKey ?? data.jurisdiction;
  if (jurisdictionFillKey) {
    const jf = getJurisdictionFill(jurisdictionFillKey);
    if (jf) fillColor = jf.fillColor;
  }

  if (data.borderOverlayKey) {
    const bo = getBorderOverlay(data.borderOverlayKey);
    if (bo) borderColor = bo.borderColor;
  }

  return { borderColor, fillColor };
}
