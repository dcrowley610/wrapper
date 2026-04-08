import type { RequestStatus } from '../types';
import { SCOPE_DIMENSIONS } from '../../../platform/context/platformContext.types';
import { DOMAIN_OPTIONS } from './taxonomy.config';

export const STATUS_CONFIG: Record<RequestStatus, { label: string; stage: string }> = {
  new: { label: 'New Intake', stage: 'Waiting for assignment' },
  assigned: { label: 'Assigned', stage: 'Owner and playbook selected' },
  inProgress: { label: 'In Progress', stage: 'Documents and facts in flight' },
  inReview: { label: 'In Review', stage: 'Reviewer sign-off pending' },
  completed: { label: 'Completed', stage: 'Package delivered' },
};

export const WORKFLOW_COLUMNS: RequestStatus[] = [
  'new', 'assigned', 'inProgress', 'inReview', 'completed',
];

export const OWNER_OPTIONS = [
  'Tax Manager', 'Tax Operations', 'International Tax',
  'Fund Controller', 'Legal', 'AI Agent',
];

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export const REQUEST_FILTERS: FilterConfig[] = [
  { key: 'status', label: 'Status', options: ['All statuses', 'New Intake', 'Assigned', 'In Progress', 'In Review', 'Completed'] },
  { key: 'owner', label: 'Owner', options: ['All owners', ...OWNER_OPTIONS] },
  { key: 'frequency', label: 'Frequency', options: ['All frequencies', 'Annual', 'Quarterly', 'Monthly', 'Event-driven', 'Ad hoc'] },
  { key: 'domain', label: 'Domain', options: ['All domains', ...DOMAIN_OPTIONS] },
  { key: 'fund', label: 'Fund', options: ['All funds', ...SCOPE_DIMENSIONS.fund.map((f) => f.label)] },
  { key: 'taxYear', label: 'Tax Year', options: ['All years', ...SCOPE_DIMENSIONS.taxYear.map((y) => y.label)] },
];
