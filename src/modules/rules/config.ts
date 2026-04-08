import type { SectionConfig } from '../../components/ModulePage/SectionNav';
import type { ProcessRunStatus, StepStatus, ProcessType, StepType, EvidenceType } from './types';

export type ProcessRunSectionKey = 'overview' | 'steps' | 'timeline' | 'summary';

export const PROCESS_RUN_SECTIONS: SectionConfig[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'steps', label: 'Steps' },
  { key: 'timeline', label: 'Timeline' },
  { key: 'summary', label: 'Manager Summary' },
];

export const RUN_STATUS_CONFIG: Record<ProcessRunStatus, { label: string; colorClass: string }> = {
  notStarted: { label: 'Not Started', colorClass: 'statusNotStarted' },
  inProgress: { label: 'In Progress', colorClass: 'statusInProgress' },
  blocked: { label: 'Blocked', colorClass: 'statusBlocked' },
  inReview: { label: 'In Review', colorClass: 'statusInReview' },
  completed: { label: 'Completed', colorClass: 'statusCompleted' },
  cancelled: { label: 'Cancelled', colorClass: 'statusCancelled' },
};

export const STEP_STATUS_CONFIG: Record<StepStatus, { label: string; colorClass: string }> = {
  pending: { label: 'Pending', colorClass: 'stepPending' },
  inProgress: { label: 'In Progress', colorClass: 'stepInProgress' },
  blocked: { label: 'Blocked', colorClass: 'stepBlocked' },
  completed: { label: 'Completed', colorClass: 'stepCompleted' },
  skipped: { label: 'Skipped', colorClass: 'stepSkipped' },
};

export const PROCESS_TYPE_LABELS: Record<ProcessType, string> = {
  compliance: 'Compliance',
  review: 'Review',
  analysis: 'Analysis',
  filing: 'Filing',
  reporting: 'Reporting',
  custom: 'Custom',
};

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  manual: 'Manual',
  review: 'Review',
  decision: 'Decision',
  dataGathering: 'Data Gathering',
  validation: 'Validation',
  approval: 'Approval',
  automated: 'Automated',
};

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  document: 'Document',
  screenshot: 'Screenshot',
  calculation: 'Calculation',
  externalSource: 'External Source',
  systemGenerated: 'System Generated',
  email: 'Email',
};

export const RUN_STATUS_ORDER: ProcessRunStatus[] = [
  'notStarted', 'inProgress', 'blocked', 'inReview', 'completed', 'cancelled',
];

export const OWNER_OPTIONS = [
  'Tax Manager', 'Tax Operations', 'International Tax',
  'Fund Controller', 'Legal', 'AI Agent',
];
