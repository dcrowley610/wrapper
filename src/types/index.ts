export type EntityType = 'corporation' | 'llc' | 'partnership' | 'trust' | 'individual';

export type EntityClassification = {
  label: string;
  description: string;
};

export type EntityData = {
  label: string;
  entityType: EntityType;
  classificationKey: string;
  jurisdictionFillKey?: string;
  borderOverlayKey?: string;
  jurisdiction?: string;
  ein?: string;
  dateFormed?: string;
  status?: 'active' | 'inactive' | 'dissolved';
  address?: string;
  notes?: string;
  [key: string]: unknown;
};
