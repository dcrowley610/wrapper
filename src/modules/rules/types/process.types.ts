// === Enums / String Unions ===

export type ProcessType = 'compliance' | 'review' | 'analysis' | 'filing' | 'reporting' | 'custom';

export type ProcessRunStatus = 'notStarted' | 'inProgress' | 'blocked' | 'inReview' | 'completed' | 'cancelled';

export type StepStatus = 'pending' | 'inProgress' | 'blocked' | 'completed' | 'skipped';

export type StepType = 'manual' | 'review' | 'decision' | 'dataGathering' | 'validation' | 'approval' | 'automated';

export type EvidenceType = 'document' | 'screenshot' | 'calculation' | 'externalSource' | 'systemGenerated' | 'email';

export type EventType =
  | 'statusChange'
  | 'stepStarted'
  | 'stepCompleted'
  | 'stepSkipped'
  | 'evidenceAdded'
  | 'noteAdded'
  | 'decisionRecorded'
  | 'exceptionFlagged'
  | 'ownerChanged'
  | 'ruleReferenced'
  | 'created'
  | 'cancelled';

// === Sub-types (embedded within steps) ===

export type StepDecision = {
  id: string;
  decisionText: string;
  rationale: string;
  decidedBy: string;
  timestamp: string;
  // AI-readiness: future hook for AI-suggested decisions
  // aiSuggested?: boolean;
  // aiConfidence?: number;
};

export type StepEvidence = {
  id: string;
  source: string;
  evidenceType: EvidenceType;
  description: string;
  documentRef: string | null;
  addedBy: string;
  addedDate: string;
  // AI-readiness: future hook for auto-extracted evidence
  // aiExtracted?: boolean;
};

export type StepNote = {
  id: string;
  text: string;
  author: string;
  timestamp: string;
};

export type RuleReference = {
  ruleId: string;
  ruleName: string;
  ruleType: 'deterministic' | 'conditional' | 'policy' | 'external';
  applicationNote: string;
};

// === LinkedRecord (polymorphic parent link) ===

export type LinkedRecord = {
  parentType: 'request' | 'entity' | 'investor' | 'controversy' | 'document';
  parentId: string;
  parentLabel: string;
};

// === ProcessTemplate ===

export type ProcessTemplateStep = {
  id: string;
  title: string;
  description: string;
  stepType: StepType;
  order: number;
  expectedInputs: string[];
  expectedOutputs: string[];
  estimatedMinutes: number | null;
};

export type ProcessTemplate = {
  id: string;
  name: string;
  description: string;
  processType: ProcessType;
  defaultSteps: ProcessTemplateStep[];
  expectedInputs: string[];
  expectedOutputs: string[];
  tags: string[];
  active: boolean;
  version: number;
  createdBy: string;
  createdDate: string;
  lastModifiedDate: string;
  scopeIds: string[];
};

// === ProcessRunStep (execution instance of a template step) ===

export type ProcessRunStep = {
  id: string;
  templateStepId: string | null;
  title: string;
  description: string;
  stepType: StepType;
  order: number;
  status: StepStatus;
  owner: string;
  startedDate: string | null;
  completedDate: string | null;
  evidence: StepEvidence[];
  notes: StepNote[];
  decisions: StepDecision[];
  ruleReferences: RuleReference[];
  isException: boolean;
  exceptionReason: string | null;
  aiAutomationCandidate: boolean;
  aiAutomationNotes: string;
};

// === ProcessRun (execution instance) ===

export type ProcessRun = {
  id: string;
  templateId: string | null;
  templateName: string | null;
  linkedRecord: LinkedRecord;
  name: string;
  description: string;
  processType: ProcessType;
  status: ProcessRunStatus;
  owner: string;
  steps: ProcessRunStep[];
  dueDate: string | null;
  startedDate: string | null;
  completedDate: string | null;
  createdDate: string;
  lastUpdatedDate: string;
  scopeIds: string[];
};

// === ProcessEvent (audit trail) ===

export type ProcessEvent = {
  id: string;
  runId: string;
  eventType: EventType;
  description: string;
  actor: string;
  timestamp: string;
  stepId: string | null;
  metadata: Record<string, string>;
};

// === ProcessSummary (computed for panels) ===

export type ProcessSummary = {
  runId: string;
  runName: string;
  templateName: string | null;
  status: ProcessRunStatus;
  totalSteps: number;
  completedSteps: number;
  percentComplete: number;
  currentStepTitle: string | null;
  exceptionCount: number;
  owner: string;
  dueDate: string | null;
  lastUpdatedDate: string;
};
