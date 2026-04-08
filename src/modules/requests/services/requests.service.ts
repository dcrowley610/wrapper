import type { ScopeSelection } from '../../../platform/context';
import { matchesScope } from '../../../platform/context';
import type { RequestInstance, RequestType, TemplateSnapshot, ExecutionMethod } from '../types';
import { requestTypesService } from './requestTypes.service';
import { requestPlaybooksService } from './requestPlaybooks.service';
import { deliverableTemplatesService } from './deliverableTemplates.service';

function snapshotFromType(type: RequestType): TemplateSnapshot {
  const playbook = requestPlaybooksService.getById(type.playbookId);
  return {
    typeName: type.name,
    typeDescription: type.description,
    playbookName: playbook?.name ?? type.defaultPlaybook,
    taxonomy: { ...type.taxonomy },
    defaultFrequency: type.defaultFrequency,
    defaultInstructions: type.defaultInstructions,
    defaultExpectedOutput: type.defaultExpectedOutput,
    snapshotDate: new Date().toISOString().slice(0, 10),
  };
}

const REQUEST_RECORDS: RequestInstance[] = [
  {
    id: 'REQ-1042',
    scopeIds: ['atlas-master-fund', 'tax-year-2026', 'fed-state-compliance'],
    status: 'inReview',
    stage: 'Reviewer sign-off pending',
    title: 'Atlas Master Fund extension decision memo',
    summary: 'State filing exposure, prior-year assumptions, and open notices have been grouped into one decision packet for sign-off.',
    owner: 'Tax Manager',
    latestExpectedDate: '2026-03-26',
    playbookId: 'PB-001',
    createdDate: '2026-03-05',
    lastUpdatedDate: '2026-03-20',
    linkedEntities: [
      { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity', linkedDate: '2026-03-05' },
    ],
    requiredDocuments: [
      { id: 'doc-1', title: 'Extension decision memo draft', status: 'reviewed', documentId: null, dueDate: '2026-03-20' },
      { id: 'doc-2', title: 'State filing exposure summary', status: 'received', documentId: null, dueDate: '2026-03-18' },
      { id: 'doc-3', title: 'Prior-year assumption workpapers', status: 'received', documentId: null, dueDate: '2026-03-15' },
    ],
    deliverables: [],
    activityLog: [
      { date: '2026-03-20', action: 'Moved to In Review — decision memo draft attached', actor: 'Tax Manager' },
      { date: '2026-03-18', action: 'State filing exposure summary received from Tax Operations', actor: 'Tax Operations' },
      { date: '2026-03-12', action: 'Assigned to Tax Manager with Extension decision memo playbook', actor: 'System' },
      { date: '2026-03-05', action: 'Request created — extension deadline approaching for multi-state filings', actor: 'Fund Controller' },
    ],
    comments: [
      { id: 'c1', author: 'Sarah Chen', text: 'The NY and CA extensions need to be filed separately — different deadlines apply. Let me know if the memo should cover both or just federal.', timestamp: '2026-03-18 14:22' },
      { id: 'c2', author: 'David Kim', text: 'Federal only for now. We can add state-specific memos once the composite filing analysis is complete.', timestamp: '2026-03-19 09:05' },
    ],
    // --- Process-memory fields ---
    requestTypeId: 'RT-001',
    fundId: 'atlas-master-fund',
    entityId: null,
    dealId: null,
    taxYear: '2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-12-31',
    requestor: 'Fund Controller',
    dueDate: '2026-03-26',
    frequency: 'annual',
    createdFromRecurringRun: false,
    priorRequestInstanceId: null,
    priorPeriodRef: null,
    templateSnapshot: {
      typeName: 'Extension Decision Memo',
      typeDescription: 'Prepare and route an extension decision memo covering federal and state filing deadlines, prior-year assumptions, and open notices.',
      playbookName: 'Extension decision memo',
      taxonomy: { domain: 'Tax Compliance', category: 'Filing Preparation' },
      defaultFrequency: 'annual',
      defaultInstructions: 'Compile state filing exposure summary, prior-year assumption workpapers, and open notice inventory into a single decision packet for sign-off.',
      defaultExpectedOutput: 'Signed extension decision memo with state-by-state filing matrix.',
      snapshotDate: '2026-03-05',
    },
    executionMethod: null,
    completionSummary: '',
  },
  {
    id: 'REQ-1038',
    scopeIds: ['atlas-blocker-lux', 'tax-year-2026'],
    status: 'inProgress',
    stage: 'Documents and facts in flight',
    title: 'Lux blocker ECI and withholding support package',
    summary: 'Entity structure, ownership percentages, and supporting workpapers are being assembled so withholding assumptions can be resolved.',
    owner: 'International Tax',
    latestExpectedDate: '2026-03-24',
    playbookId: 'PB-005',
    createdDate: '2026-03-02',
    lastUpdatedDate: '2026-03-19',
    linkedEntities: [
      { entityId: 'atlas-blocker-lux', entityName: 'Atlas Blocker Lux', entityType: 'Entity', linkedDate: '2026-03-02' },
      { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity', linkedDate: '2026-03-10' },
    ],
    requiredDocuments: [
      { id: 'doc-4', title: 'Ownership structure diagram', status: 'received', documentId: null, dueDate: '2026-03-15' },
      { id: 'doc-5', title: 'ECI analysis workpapers', status: 'pending', documentId: null, dueDate: '2026-03-22' },
      { id: 'doc-6', title: 'Withholding rate determination memo', status: 'pending', documentId: null, dueDate: '2026-03-24' },
    ],
    deliverables: [
      { id: 'dlv-1', templateId: null, parentId: null, kind: 'line-item', title: 'Lux blocker ECI package', order: 1, dealName: 'Atlas Fund IV', entityName: 'Atlas Blocker Lux', status: 'received', dueDate: '2026-03-20', notes: 'Lux blocker ECI package', fileLink: '', comments: [] },
      { id: 'dlv-2', templateId: null, parentId: null, kind: 'line-item', title: 'Master fund withholding summary', order: 2, dealName: 'Atlas Fund IV', entityName: 'Atlas Master Fund', status: 'pending', dueDate: '2026-03-22', notes: 'Master fund withholding summary', fileLink: '', comments: [] },
      { id: 'dlv-3', templateId: null, parentId: null, kind: 'line-item', title: 'Prior year comparison', order: 3, dealName: 'Atlas Fund III', entityName: 'Atlas Blocker Lux', status: 'not-started', dueDate: '2026-03-24', notes: 'Prior year comparison needed', fileLink: '', comments: [] },
    ],
    activityLog: [
      { date: '2026-03-19', action: 'Ownership structure diagram received and validated', actor: 'International Tax' },
      { date: '2026-03-10', action: 'Linked Atlas Master Fund as parent entity', actor: 'International Tax' },
      { date: '2026-03-08', action: 'Moved to In Progress — started gathering supporting documents', actor: 'International Tax' },
      { date: '2026-03-03', action: 'Assigned to International Tax with Withholding analysis playbook', actor: 'Tax Manager' },
      { date: '2026-03-02', action: 'Request created — Lux blocker withholding analysis needed before Q1 close', actor: 'Tax Manager' },
    ],
    comments: [
      { id: 'c3', author: 'Maria Lopez', text: 'The ECI analysis should reference the 2024 position paper — same intercompany loan structure applies.', timestamp: '2026-03-15 11:30' },
    ],
    requestTypeId: 'RT-002',
    fundId: 'atlas-blocker-lux',
    entityId: null,
    dealId: null,
    taxYear: '2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-12-31',
    requestor: 'Tax Manager',
    dueDate: '2026-03-24',
    frequency: 'annual',
    createdFromRecurringRun: false,
    priorRequestInstanceId: null,
    priorPeriodRef: null,
    templateSnapshot: {
      typeName: 'ECI and Withholding Support Package',
      typeDescription: 'Assemble entity structure, ownership percentages, and supporting workpapers to resolve withholding assumptions for foreign blocker entities.',
      playbookName: 'Withholding analysis',
      taxonomy: { domain: 'Tax Compliance', category: 'Withholding & ECI' },
      defaultFrequency: 'annual',
      defaultInstructions: 'Gather ownership structure diagram, ECI analysis workpapers, and withholding rate determination memo. Reference prior-year position papers where applicable.',
      defaultExpectedOutput: 'Complete withholding rate determination memo with supporting documentation.',
      snapshotDate: '2026-03-02',
    },
    executionMethod: null,
    completionSummary: '',
  },
  {
    id: 'REQ-1031',
    scopeIds: ['fed-state-compliance', 'tax-year-2026', 'atlas-master-fund'],
    status: 'assigned',
    stage: 'Owner and playbook selected',
    title: 'Q1 notice response triage for state composite filings',
    summary: 'The request has been scoped into a notice-response starter workflow with impacted jurisdictions and prior notices linked in.',
    owner: 'Tax Operations',
    latestExpectedDate: '2026-03-22',
    playbookId: 'PB-004',
    createdDate: '2026-03-08',
    lastUpdatedDate: '2026-03-14',
    linkedEntities: [
      { entityId: 'smith-real-estate-llc', entityName: 'Smith Real Estate LLC', entityType: 'Entity', linkedDate: '2026-03-08' },
    ],
    requiredDocuments: [
      { id: 'doc-7', title: 'NY DTF notice copy', status: 'received', documentId: 'notice-ny-smith-re', dueDate: '2026-03-15' },
      { id: 'doc-8', title: 'Response letter draft', status: 'pending', documentId: null, dueDate: '2026-03-20' },
    ],
    deliverables: [],
    activityLog: [
      { date: '2026-03-14', action: 'NY DTF notice uploaded and linked to request', actor: 'Tax Operations' },
      { date: '2026-03-09', action: 'Assigned to Tax Operations with Notice response playbook', actor: 'Tax Manager' },
      { date: '2026-03-08', action: 'Request created — Q1 state composite notices require triage', actor: 'Tax Operations' },
    ],
    comments: [],
    requestTypeId: 'RT-003',
    fundId: 'atlas-master-fund',
    entityId: null,
    dealId: null,
    taxYear: '2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    requestor: 'Tax Operations',
    dueDate: '2026-03-22',
    frequency: 'event-driven',
    createdFromRecurringRun: false,
    priorRequestInstanceId: null,
    priorPeriodRef: null,
    templateSnapshot: {
      typeName: 'Notice Response Triage',
      typeDescription: 'Triage incoming tax notices, link to impacted jurisdictions and prior notices, and route for response preparation.',
      playbookName: 'Notice response',
      taxonomy: { domain: 'Tax Compliance', category: 'Filing Preparation' },
      defaultFrequency: 'event-driven',
      defaultInstructions: 'Upload notice copy, identify impacted entities and jurisdictions, link to prior notices if any, and draft a response letter.',
      defaultExpectedOutput: 'Filed response letter with acknowledgement receipt.',
      snapshotDate: '2026-03-08',
    },
    executionMethod: null,
    completionSummary: '',
  },
  {
    id: 'REQ-1027',
    scopeIds: ['tax-year-2026', 'atlas-master-fund'],
    status: 'new',
    stage: 'Waiting for assignment',
    title: '2026 estimated payments review across investment entities',
    summary: 'A new multi-entity review request has been opened to align payment assumptions before quarter-end.',
    owner: 'Fund Controller',
    latestExpectedDate: '2026-03-29',
    playbookId: 'PB-007',
    createdDate: '2026-03-12',
    lastUpdatedDate: '2026-03-12',
    linkedEntities: [
      { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity', linkedDate: '2026-03-12' },
      { entityId: 'drip-ventures-inc', entityName: 'Drip Ventures Inc', entityType: 'Entity', linkedDate: '2026-03-12' },
    ],
    requiredDocuments: [
      { id: 'doc-9', title: 'Estimated payment schedule', status: 'pending', documentId: null, dueDate: '2026-03-25' },
      { id: 'doc-10', title: 'Prior-year payment comparison', status: 'pending', documentId: null, dueDate: '2026-03-25' },
    ],
    deliverables: [],
    activityLog: [
      { date: '2026-03-12', action: 'Request created — need to align estimated payments before Q1 close', actor: 'Fund Controller' },
    ],
    comments: [],
    requestTypeId: 'RT-004',
    fundId: 'atlas-master-fund',
    entityId: null,
    dealId: null,
    taxYear: '2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-03-31',
    requestor: 'Fund Controller',
    dueDate: '2026-03-29',
    frequency: 'quarterly',
    createdFromRecurringRun: false,
    priorRequestInstanceId: null,
    priorPeriodRef: null,
    templateSnapshot: {
      typeName: 'Estimated Payments Review',
      typeDescription: 'Review and align estimated tax payment assumptions across investment entities before quarter-end.',
      playbookName: 'Custom workflow',
      taxonomy: { domain: 'Tax Compliance', category: 'Supporting Schedules' },
      defaultFrequency: 'quarterly',
      defaultInstructions: 'Compile estimated payment schedule across all entities, compare against prior-year actuals, and flag any material variances.',
      defaultExpectedOutput: 'Estimated payment schedule with variance analysis and recommendations.',
      snapshotDate: '2026-03-12',
    },
    executionMethod: null,
    completionSummary: '',
  },
  // --- Prior-year record for demonstrating prior-period linkage ---
  {
    id: 'REQ-0819',
    scopeIds: ['atlas-master-fund', 'tax-year-2025'],
    status: 'completed',
    stage: 'Package delivered',
    title: 'Capital activity support package for investor reporting (2025)',
    summary: 'Supporting schedules for 2025 capital activity were compiled and delivered to the reporting team.',
    owner: 'Tax Manager',
    latestExpectedDate: '2025-03-15',
    playbookId: 'PB-002',
    createdDate: '2025-02-20',
    lastUpdatedDate: '2025-03-14',
    linkedEntities: [
      { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity', linkedDate: '2025-02-20' },
    ],
    requiredDocuments: [
      { id: 'doc-p1', title: 'Capital activity schedules (2025)', status: 'reviewed', documentId: null, dueDate: '2025-03-08' },
      { id: 'doc-p2', title: 'Tax commentary memo (2025)', status: 'reviewed', documentId: null, dueDate: '2025-03-12' },
      { id: 'doc-p3', title: 'Investor reporting package (2025)', status: 'reviewed', documentId: null, dueDate: '2025-03-14' },
    ],
    deliverables: [],
    activityLog: [
      { date: '2025-03-14', action: 'Completed — final package delivered to reporting team', actor: 'Tax Manager' },
      { date: '2025-03-12', action: 'Tax commentary reviewed and approved', actor: 'Tax Manager' },
      { date: '2025-03-08', action: 'Capital activity schedules compiled', actor: 'Tax Operations' },
      { date: '2025-02-20', action: 'Request created — investor reporting support needed for 2025 capital activity', actor: 'Fund Controller' },
    ],
    comments: [
      { id: 'cp1', author: 'Sarah Chen', text: 'The 2025 schedules required a manual reconciliation step due to a mid-year accounting system migration. This should not recur in 2026.', timestamp: '2025-03-13 10:45' },
    ],
    requestTypeId: 'RT-005',
    fundId: 'atlas-master-fund',
    entityId: null,
    dealId: null,
    taxYear: '2025',
    periodStart: '2025-01-01',
    periodEnd: '2025-12-31',
    requestor: 'Fund Controller',
    dueDate: '2025-03-15',
    frequency: 'annual',
    createdFromRecurringRun: false,
    priorRequestInstanceId: null,
    priorPeriodRef: null,
    templateSnapshot: {
      typeName: 'Capital Activity Support Package',
      typeDescription: 'Compile supporting schedules for capital activity and deliver to the reporting team with reviewed tax commentary.',
      playbookName: 'Entity compliance package',
      taxonomy: { domain: 'Tax Compliance', category: 'Supporting Schedules' },
      defaultFrequency: 'annual',
      defaultInstructions: 'Gather capital activity schedules, prepare tax commentary, and assemble final investor reporting package.',
      defaultExpectedOutput: 'Final investor reporting package with capital activity schedules and tax commentary.',
      snapshotDate: '2025-02-20',
    },
    executionMethod: {
      fulfillmentMethod: 'email',
      sourceSystem: 'Fund administrator portal + email',
      executionNotes: 'Capital activity schedules received via email from fund administrator. Manual reconciliation required due to mid-year accounting migration.',
      stepSummary: '1. Requested schedules from fund admin. 2. Received raw data via email. 3. Reconciled against accounting system. 4. Prepared tax commentary. 5. Assembled final package.',
      methodEffectiveness: 'Adequate — email was slow; recommend switching to portal retrieval for 2026.',
      issuesEncountered: 'Mid-year accounting system migration required manual reconciliation step.',
    },
    completionSummary: 'All supporting schedules delivered on time. Manual reconciliation was needed due to mid-year accounting migration; this should not recur.',
  },
  {
    id: 'REQ-1019',
    scopeIds: ['atlas-master-fund', 'tax-year-2026'],
    status: 'completed',
    stage: 'Package delivered',
    title: 'Capital activity support package for investor reporting',
    summary: 'Supporting schedules were finalized and delivered to the reporting team with reviewed tax commentary attached.',
    owner: 'AI Agent',
    latestExpectedDate: '2026-03-18',
    playbookId: 'PB-002',
    createdDate: '2026-02-28',
    lastUpdatedDate: '2026-03-17',
    linkedEntities: [
      { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity', linkedDate: '2026-02-28' },
    ],
    requiredDocuments: [
      { id: 'doc-11', title: 'Capital activity schedules', status: 'reviewed', documentId: null, dueDate: '2026-03-10' },
      { id: 'doc-12', title: 'Tax commentary memo', status: 'reviewed', documentId: null, dueDate: '2026-03-14' },
      { id: 'doc-13', title: 'Final investor reporting package', status: 'reviewed', documentId: null, dueDate: '2026-03-17' },
    ],
    deliverables: [],
    activityLog: [
      { date: '2026-03-17', action: 'Completed — final package delivered to reporting team', actor: 'AI Agent' },
      { date: '2026-03-14', action: 'Tax commentary memo reviewed and approved', actor: 'Tax Manager' },
      { date: '2026-03-10', action: 'Capital activity schedules compiled and validated', actor: 'AI Agent' },
      { date: '2026-03-01', action: 'Assigned to AI Agent with Entity compliance package playbook', actor: 'Tax Manager' },
      { date: '2026-02-28', action: 'Request created — investor reporting support needed for Q4 capital activity', actor: 'Fund Controller' },
    ],
    comments: [],
    requestTypeId: 'RT-005',
    fundId: 'atlas-master-fund',
    entityId: null,
    dealId: null,
    taxYear: '2026',
    periodStart: '2026-01-01',
    periodEnd: '2026-12-31',
    requestor: 'Fund Controller',
    dueDate: '2026-03-18',
    frequency: 'annual',
    createdFromRecurringRun: false,
    priorRequestInstanceId: 'REQ-0819',
    priorPeriodRef: {
      priorRequestInstanceId: 'REQ-0819',
      priorStatus: 'completed',
      priorDueDate: '2025-03-15',
      priorAssignee: 'Tax Manager',
      priorNotes: 'Manual reconciliation was needed due to mid-year accounting migration; this should not recur.',
      priorCompletionSummary: 'All supporting schedules delivered on time. Manual reconciliation was needed due to mid-year accounting system migration.',
    },
    templateSnapshot: {
      typeName: 'Capital Activity Support Package',
      typeDescription: 'Compile supporting schedules for capital activity and deliver to the reporting team with reviewed tax commentary.',
      playbookName: 'Entity compliance package',
      taxonomy: { domain: 'Tax Compliance', category: 'Supporting Schedules' },
      defaultFrequency: 'annual',
      defaultInstructions: 'Gather capital activity schedules, prepare tax commentary, and assemble final investor reporting package.',
      defaultExpectedOutput: 'Final investor reporting package with capital activity schedules and tax commentary.',
      snapshotDate: '2026-02-28',
    },
    executionMethod: {
      fulfillmentMethod: 'portal',
      sourceSystem: 'Fund administrator portal',
      executionNotes: 'Switched to portal retrieval this year per prior-year recommendation. Automated data pull was successful.',
      stepSummary: '1. Retrieved schedules from fund admin portal. 2. AI Agent compiled and validated data. 3. Tax commentary prepared by Tax Manager. 4. Final package assembled and delivered.',
      methodEffectiveness: 'Excellent — portal retrieval eliminated the manual reconciliation step from prior year.',
      issuesEncountered: 'None.',
    },
    completionSummary: 'Package delivered ahead of schedule. Portal-based retrieval improved efficiency over prior year email-based approach.',
  },
];

let requestCounter = 0;

function createRequestId() {
  requestCounter += 1;
  return `REQ-${String(2000 + requestCounter).padStart(4, '0')}`;
}

export const requestsService = {
  getAllRequests(): RequestInstance[] {
    return REQUEST_RECORDS;
  },

  getScopedRequests(selection: ScopeSelection): RequestInstance[] {
    return REQUEST_RECORDS.filter((r) => matchesScope(r.scopeIds, selection));
  },

  getRequestById(id: string): RequestInstance | undefined {
    return REQUEST_RECORDS.find((r) => r.id === id);
  },

  getRequestsByTypeId(typeId: string): RequestInstance[] {
    return REQUEST_RECORDS.filter((r) => r.requestTypeId === typeId);
  },

  getRequestsByTaxYear(taxYear: string): RequestInstance[] {
    return REQUEST_RECORDS.filter((r) => r.taxYear === taxYear);
  },

  getRequestsByFundId(fundId: string): RequestInstance[] {
    return REQUEST_RECORDS.filter((r) => r.fundId === fundId);
  },

  getPriorPeriodRequest(instanceId: string): RequestInstance | undefined {
    const instance = REQUEST_RECORDS.find((r) => r.id === instanceId);
    if (!instance?.priorRequestInstanceId) return undefined;
    return REQUEST_RECORDS.find((r) => r.id === instance.priorRequestInstanceId);
  },

  getSimilarRequests(instance: RequestInstance): RequestInstance[] {
    return REQUEST_RECORDS.filter(
      (r) =>
        r.id !== instance.id &&
        r.requestTypeId === instance.requestTypeId &&
        r.requestTypeId !== null,
    );
  },

  createInstanceFromType(
    typeId: string,
    overrides: Partial<RequestInstance>,
  ): RequestInstance | null {
    const type = requestTypesService.getRequestTypeById(typeId);
    if (!type) return null;

    const today = new Date().toISOString().slice(0, 10);
    const snapshot = snapshotFromType(type);

    const instance: RequestInstance = {
      id: createRequestId(),
      scopeIds: [],
      status: 'new',
      stage: 'Waiting for assignment',
      title: type.name,
      summary: type.description,
      owner: type.defaultOwner,
      latestExpectedDate: '',
      playbookId: type.playbookId,
      linkedEntities: [],
      requiredDocuments: [],
      deliverables: deliverableTemplatesService.instantiateFromTemplates(typeId),
    activityLog: [
        { date: today, action: `Request created from type: ${type.name}`, actor: overrides.requestor ?? 'Current User' },
      ],
      comments: [],
      createdDate: today,
      lastUpdatedDate: today,
      requestTypeId: typeId,
      fundId: null,
      entityId: null,
      dealId: null,
      taxYear: '',
      periodStart: '',
      periodEnd: '',
      requestor: '',
      dueDate: '',
      frequency: type.defaultFrequency,
      createdFromRecurringRun: false,
      priorRequestInstanceId: null,
      priorPeriodRef: null,
      templateSnapshot: snapshot,
      executionMethod: null,
      completionSummary: '',
      ...overrides,
    };

    REQUEST_RECORDS.unshift(instance);
    return instance;
  },

  createInstanceFromPrior(
    priorId: string,
    newTaxYear: string,
    overrides: Partial<RequestInstance> = {},
  ): RequestInstance | null {
    const prior = REQUEST_RECORDS.find((r) => r.id === priorId);
    if (!prior) return null;

    const today = new Date().toISOString().slice(0, 10);
    let snapshot = prior.templateSnapshot;
    if (prior.requestTypeId) {
      const type = requestTypesService.getRequestTypeById(prior.requestTypeId);
      if (type) snapshot = snapshotFromType(type);
    }

    const yearNum = parseInt(newTaxYear, 10) || new Date().getFullYear();

    const instance: RequestInstance = {
      id: createRequestId(),
      scopeIds: prior.scopeIds.map((s) =>
        s.startsWith('tax-year-') ? `tax-year-${newTaxYear}` : s,
      ),
      status: 'new',
      stage: 'Waiting for assignment',
      title: prior.title.replace(/\(\d{4}\)/, `(${newTaxYear})`).replace(/\d{4}/, newTaxYear),
      summary: prior.summary,
      owner: prior.owner,
      latestExpectedDate: '',
      playbookId: prior.playbookId,
      linkedEntities: [],
      requiredDocuments: [],
      deliverables: [],
    activityLog: [
        { date: today, action: `Request created from prior period: ${prior.id} (${prior.taxYear})`, actor: overrides.requestor ?? 'Current User' },
      ],
      comments: [],
      createdDate: today,
      lastUpdatedDate: today,
      requestTypeId: prior.requestTypeId,
      fundId: prior.fundId,
      entityId: prior.entityId,
      dealId: prior.dealId,
      taxYear: newTaxYear,
      periodStart: `${yearNum}-01-01`,
      periodEnd: `${yearNum}-12-31`,
      requestor: overrides.requestor ?? prior.requestor,
      dueDate: '',
      frequency: prior.frequency,
      createdFromRecurringRun: false,
      priorRequestInstanceId: prior.id,
      priorPeriodRef: {
        priorRequestInstanceId: prior.id,
        priorStatus: prior.status,
        priorDueDate: prior.dueDate,
        priorAssignee: prior.owner,
        priorNotes: prior.executionMethod?.executionNotes ?? '',
        priorCompletionSummary: prior.completionSummary,
      },
      templateSnapshot: snapshot,
      executionMethod: null,
      completionSummary: '',
      ...overrides,
    };

    REQUEST_RECORDS.unshift(instance);
    return instance;
  },

  suggestDueDate(typeId: string, periodStart: string): string {
    const type = requestTypesService.getRequestTypeById(typeId);
    if (!type || !periodStart) return '';
    const start = new Date(periodStart);
    if (isNaN(start.getTime())) return '';
    start.setDate(start.getDate() + type.defaultDueOffsetDays);
    return start.toISOString().slice(0, 10);
  },

  generateNextPeriodInstances(instanceIds: string[], newTaxYear: string): RequestInstance[] {
    const created: RequestInstance[] = [];
    for (const id of instanceIds) {
      const instance = this.createInstanceFromPrior(id, newTaxYear);
      if (instance) created.push(instance);
    }
    return created;
  },

  addRequest(request: RequestInstance): void {
    REQUEST_RECORDS.unshift(request);
  },
};
