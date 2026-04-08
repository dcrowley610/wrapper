import type { FulfillmentMethod, RequestFrequency } from '../types';

export const FREQUENCY_OPTIONS: { key: RequestFrequency; label: string }[] = [
  { key: 'annual', label: 'Annual' },
  { key: 'quarterly', label: 'Quarterly' },
  { key: 'monthly', label: 'Monthly' },
  { key: 'event-driven', label: 'Event-driven' },
  { key: 'ad-hoc', label: 'Ad hoc' },
];

export const FREQUENCY_LABEL: Record<RequestFrequency, string> = {
  'annual': 'Annual',
  'quarterly': 'Quarterly',
  'monthly': 'Monthly',
  'event-driven': 'Event-driven',
  'ad-hoc': 'Ad hoc',
};

export const RECURRENCE_DRIVERS = [
  'Tax year rollover',
  'New investment list',
  'Quarterly close',
  'Regulatory deadline',
  'Entity lifecycle event',
  'Acquisition / disposition event',
  'Manual trigger',
];

export const FULFILLMENT_METHOD_OPTIONS: { key: FulfillmentMethod; label: string }[] = [
  { key: 'portal', label: 'Portal' },
  { key: 'email', label: 'Email' },
  { key: 'shared-drive', label: 'Shared Drive' },
  { key: 'manual-upload', label: 'Manual Upload' },
  { key: 'api', label: 'API' },
  { key: 'other', label: 'Other' },
];

export const FULFILLMENT_METHOD_LABEL: Record<FulfillmentMethod, string> = {
  'portal': 'Portal',
  'email': 'Email',
  'shared-drive': 'Shared Drive',
  'manual-upload': 'Manual Upload',
  'api': 'API',
  'other': 'Other',
};

export const PRIORITY_OPTIONS = ['Low', 'Medium', 'High', 'Critical'];

export const STANDARDIZATION_OPTIONS: { key: string; label: string }[] = [
  { key: 'global', label: 'Global (standard across all funds)' },
  { key: 'fund-specific', label: 'Fund-specific' },
  { key: 'hybrid', label: 'Hybrid (standard with fund-level overrides)' },
];
