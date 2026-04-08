export type ControversyStatus = 'Open' | 'In Progress' | 'Pending Response' | 'Resolved' | 'Closed';
export type ControversyCategory = 'Notice' | 'Audit' | 'Exam' | 'Appeal';
export type ControversyPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export type ActivityEntry = {
  date: string;
  action: string;
  actor: string;
};

export type LinkedRecord = {
  id: string;
  label: string;
  module: 'entities' | 'investors';
};

export type RecordContext = {
  fundFamilyLabel: string;
  fundLabel: string;
  parentContextLabel?: string;
};

export type ControversyRecord = {
  id: string;
  name: string;
  category: ControversyCategory;
  status: ControversyStatus;
  priority: ControversyPriority;
  issuingAuthority: string;
  noticeDate: string;
  responseDeadline: string;
  assignedTeam: string;
  assignedTo: string;
  scopeIds: string[];
  summary: string;
  amountAtIssue: string;
  taxYearsAffected: string[];
  issueType: string;
  statuteOfLimitations: string;
  linkedEntities: LinkedRecord[];
  linkedInvestors: LinkedRecord[];
  documentCount: number;
  openQuestions: number;
  lastActivityDate: string;
  notes: string;
  activityLog: ActivityEntry[];
  context: RecordContext;
};
