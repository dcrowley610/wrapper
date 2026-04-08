// === Enums / String Unions ===

export type RequestStatus = 'new' | 'assigned' | 'inProgress' | 'inReview' | 'completed';

export type RequestFrequency = 'annual' | 'quarterly' | 'monthly' | 'event-driven' | 'ad-hoc';

export type FulfillmentMethod = 'portal' | 'email' | 'shared-drive' | 'manual-upload' | 'api' | 'other';

export type StandardizationLevel = 'global' | 'fund-specific' | 'hybrid';

export type CreationMode = 'blank' | 'fromType' | 'fromPrior' | 'duplicate';

// === Sub-types ===

export type ActivityEntry = {
  date: string;
  action: string;
  actor: string;
};

export type LinkedEntity = {
  entityId: string;
  entityName: string;
  entityType: string;
  linkedDate: string;
};

export type RequiredDocument = {
  id: string;
  title: string;
  status: 'pending' | 'received' | 'reviewed';
  documentId: string | null;
  dueDate: string | null;
};

export type DeliverableStatus = 'not-started' | 'pending' | 'received' | 'reviewed';

export type DeliverableInstance = {
  id: string;
  templateId: string | null;
  parentId: string | null;
  kind: string;
  title: string;
  order: number;
  dealName: string;
  entityName: string;
  status: DeliverableStatus;
  dueDate: string | null;
  notes: string;
  fileLink: string;
  fileName?: string;
  comments: RequestComment[];
};

/** Backward-compat alias */
export type Deliverable = DeliverableInstance;

export type RequestComment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
};

// === Taxonomy ===

export type TaxonomyPath = {
  category: string;
  domain: string;
};

// === Request Playbook (first-class workflow container) ===

export type RequestPlaybook = {
  id: string;
  name: string;
  categoryId: string;
  description: string;
  defaultOwner: string;
  tags: string[];
  active: boolean;
  createdDate: string;
  lastModifiedDate: string;
};

// === Deliverable Template (hierarchical blueprint on a process) ===

export type DeliverableTemplate = {
  id: string;
  processId: string;
  parentId: string | null;
  kind: string;
  title: string;
  order: number;
};

// === Request Category (editable grouping level) ===

export type RequestCategory = {
  id: string;
  name: string;
  description: string;
  domain: string;
  active: boolean;
  createdDate: string;
  lastModifiedDate: string;
};

// === Request Process (reusable template / definition, formerly RequestType) ===

export type RequestProcess = {
  id: string;
  name: string;
  description: string;
  active: boolean;
  categoryId: string;
  playbookId: string;
  taxonomy: TaxonomyPath;
  defaultFrequency: RequestFrequency;
  recurrenceDriver: string;
  defaultDueOffsetDays: number;
  defaultPriority: string;
  defaultOwner: string;
  defaultPlaybook: string;
  defaultInstructions: string;
  defaultExpectedOutput: string;
  riskNotes: string;
  tags: string[];
  standardizationLevel: StandardizationLevel;
  createdDate: string;
  lastModifiedDate: string;
};

/** Backward-compat alias — existing components can continue using RequestType */
export type RequestType = RequestProcess;

// === Template Snapshot (historical truth — frozen at instance creation) ===

export type TemplateSnapshot = {
  typeName: string;
  typeDescription: string;
  playbookName: string;
  taxonomy: TaxonomyPath;
  defaultFrequency: RequestFrequency;
  defaultInstructions: string;
  defaultExpectedOutput: string;
  snapshotDate: string;
};

// === Execution Method (lightweight process memory) ===

export type ExecutionMethod = {
  fulfillmentMethod: FulfillmentMethod;
  sourceSystem: string;
  executionNotes: string;
  stepSummary: string;
  methodEffectiveness: string;
  issuesEncountered: string;
};

// === Prior Period Reference ===

export type PriorPeriodReference = {
  priorRequestInstanceId: string;
  priorStatus: RequestStatus;
  priorDueDate: string;
  priorAssignee: string;
  priorNotes: string;
  priorCompletionSummary: string;
};

// === Request Instance (execution record, formerly WorkflowRequest) ===

export type RequestInstance = {
  id: string;
  scopeIds: string[];
  status: RequestStatus;
  stage: string;
  title: string;
  summary: string;
  owner: string;
  latestExpectedDate: string;
  playbookId: string | null;
  linkedEntities: LinkedEntity[];
  requiredDocuments: RequiredDocument[];
  deliverables: DeliverableInstance[];
  activityLog: ActivityEntry[];
  comments: RequestComment[];
  createdDate: string;
  lastUpdatedDate: string;

  // --- New fields for process-memory system ---
  requestTypeId: string | null;
  fundId: string | null;
  entityId: string | null;
  dealId: string | null;
  taxYear: string;
  periodStart: string;
  periodEnd: string;
  requestor: string;
  dueDate: string;
  frequency: RequestFrequency;
  createdFromRecurringRun: boolean;
  priorRequestInstanceId: string | null;
  priorPeriodRef: PriorPeriodReference | null;
  templateSnapshot: TemplateSnapshot | null;
  executionMethod: ExecutionMethod | null;
  completionSummary: string;
};

/** Backward-compat alias — existing components can continue using WorkflowRequest */
export type WorkflowRequest = RequestInstance;

// === Form States ===

export type RequestFormState = {
  title: string;
  summary: string;
  owner: string;
  latestExpectedDate: string;
  playbookId: string;
  // New fields for enhanced intake
  requestTypeId: string;
  fundId: string;
  taxYear: string;
  dueDate: string;
  requestor: string;
  frequency: RequestFrequency;
  creationMode: CreationMode;
};

export type RequestProcessFormState = {
  name: string;
  description: string;
  domain: string;
  categoryId: string;
  defaultFrequency: RequestFrequency;
  recurrenceDriver: string;
  defaultDueOffsetDays: number;
  defaultPriority: string;
  defaultOwner: string;
  playbookId: string;
  defaultInstructions: string;
  defaultExpectedOutput: string;
  riskNotes: string;
  tags: string;
  standardizationLevel: StandardizationLevel;
};

/** Backward-compat alias */
export type RequestTypeFormState = RequestProcessFormState;

export type RequestCategoryFormState = {
  name: string;
  description: string;
  domain: string;
};
