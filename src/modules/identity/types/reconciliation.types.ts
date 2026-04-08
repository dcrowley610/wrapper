import type { MasterDomain } from './master.types';

export type TaskStatus = 'open' | 'in_progress' | 'resolved' | 'deferred';
export type TaskPriority = 'high' | 'medium' | 'low';

export type ReconciliationTask = {
  id: string;
  sourceRecordId: string;
  domain: MasterDomain;
  status: TaskStatus;
  priority: TaskPriority;
  candidateCount: number;
  topCandidateScore: number;
  topCandidateTier: string;
  resolvedDate: string;
  resolvedBy: string;
  resolutionAction: string;
  resolutionMasterId: string;
  createdDate: string;
};

export type ReconciliationActionType =
  | 'task_created'
  | 'candidate_accepted'
  | 'candidate_rejected'
  | 'new_master_created'
  | 'task_deferred'
  | 'task_reopened'
  | 'auto_matched';

export type ReconciliationActionHistory = {
  id: string;
  taskId: string;
  actionType: ReconciliationActionType;
  actor: string;
  timestamp: string;
  metadata: Record<string, string>;
  description: string;
};
