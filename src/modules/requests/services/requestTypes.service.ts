import type { RequestFrequency, RequestProcess, TaxonomyPath } from '../types';

const REQUEST_TYPE_RECORDS: RequestProcess[] = [
  {
    id: 'RT-001',
    name: 'Extension Decision Memo',
    description: 'Prepare and route an extension decision memo covering federal and state filing deadlines, prior-year assumptions, and open notices.',
    active: true,
    categoryId: 'CAT-002',
    playbookId: 'PB-001',
    taxonomy: { domain: 'Tax Compliance', category: 'Filing Preparation' },
    defaultFrequency: 'annual',
    recurrenceDriver: 'Tax year rollover',
    defaultDueOffsetDays: 21,
    defaultPriority: 'High',
    defaultOwner: 'Tax Manager',
    defaultPlaybook: 'Extension decision memo',
    defaultInstructions: 'Compile state filing exposure summary, prior-year assumption workpapers, and open notice inventory into a single decision packet for sign-off.',
    defaultExpectedOutput: 'Signed extension decision memo with state-by-state filing matrix.',
    riskNotes: 'Missing an extension deadline can trigger penalties. Ensure all jurisdictions are accounted for.',
    tags: ['extension', 'filing', 'deadline'],
    standardizationLevel: 'global',
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'RT-002',
    name: 'ECI and Withholding Support Package',
    description: 'Assemble entity structure, ownership percentages, and supporting workpapers to resolve withholding assumptions for foreign blocker entities.',
    active: true,
    categoryId: 'CAT-003',
    playbookId: 'PB-005',
    taxonomy: { domain: 'Tax Compliance', category: 'Withholding & ECI' },
    defaultFrequency: 'annual',
    recurrenceDriver: 'Tax year rollover',
    defaultDueOffsetDays: 30,
    defaultPriority: 'High',
    defaultOwner: 'International Tax',
    defaultPlaybook: 'Withholding analysis',
    defaultInstructions: 'Gather ownership structure diagram, ECI analysis workpapers, and withholding rate determination memo. Reference prior-year position papers where applicable.',
    defaultExpectedOutput: 'Complete withholding rate determination memo with supporting documentation.',
    riskNotes: 'Incorrect withholding rates can lead to over/under-payment and regulatory issues.',
    tags: ['withholding', 'ECI', 'international', 'blocker'],
    standardizationLevel: 'fund-specific',
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'RT-003',
    name: 'Notice Response Triage',
    description: 'Triage incoming tax notices, link to impacted jurisdictions and prior notices, and route for response preparation.',
    active: true,
    categoryId: 'CAT-002',
    playbookId: 'PB-004',
    taxonomy: { domain: 'Tax Compliance', category: 'Filing Preparation' },
    defaultFrequency: 'event-driven',
    recurrenceDriver: 'Entity lifecycle event',
    defaultDueOffsetDays: 14,
    defaultPriority: 'High',
    defaultOwner: 'Tax Operations',
    defaultPlaybook: 'Notice response',
    defaultInstructions: 'Upload notice copy, identify impacted entities and jurisdictions, link to prior notices if any, and draft a response letter.',
    defaultExpectedOutput: 'Filed response letter with acknowledgement receipt.',
    riskNotes: 'Notices have strict response deadlines. Late responses can result in assessments becoming final.',
    tags: ['notice', 'response', 'triage', 'state'],
    standardizationLevel: 'global',
    createdDate: '2025-02-10',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'RT-004',
    name: 'Estimated Payments Review',
    description: 'Review and align estimated tax payment assumptions across investment entities before quarter-end.',
    active: true,
    categoryId: 'CAT-005',
    playbookId: 'PB-007',
    taxonomy: { domain: 'Tax Compliance', category: 'Supporting Schedules' },
    defaultFrequency: 'quarterly',
    recurrenceDriver: 'Quarterly close',
    defaultDueOffsetDays: 15,
    defaultPriority: 'Medium',
    defaultOwner: 'Fund Controller',
    defaultPlaybook: 'Custom workflow',
    defaultInstructions: 'Compile estimated payment schedule across all entities, compare against prior-year actuals, and flag any material variances.',
    defaultExpectedOutput: 'Estimated payment schedule with variance analysis and recommendations.',
    riskNotes: 'Underpayment penalties apply if estimates are significantly below actual liability.',
    tags: ['estimated-payments', 'quarterly', 'payments'],
    standardizationLevel: 'hybrid',
    createdDate: '2025-03-01',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'RT-005',
    name: 'Capital Activity Support Package',
    description: 'Compile supporting schedules for capital activity and deliver to the reporting team with reviewed tax commentary.',
    active: true,
    categoryId: 'CAT-005',
    playbookId: 'PB-002',
    taxonomy: { domain: 'Tax Compliance', category: 'Supporting Schedules' },
    defaultFrequency: 'annual',
    recurrenceDriver: 'Tax year rollover',
    defaultDueOffsetDays: 20,
    defaultPriority: 'Medium',
    defaultOwner: 'Tax Manager',
    defaultPlaybook: 'Entity compliance package',
    defaultInstructions: 'Gather capital activity schedules, prepare tax commentary, and assemble final investor reporting package.',
    defaultExpectedOutput: 'Final investor reporting package with capital activity schedules and tax commentary.',
    riskNotes: '',
    tags: ['capital-activity', 'investor-reporting', 'schedules'],
    standardizationLevel: 'global',
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'RT-006',
    name: 'Obtain Schedule K-1s from Investments',
    description: 'Collect Schedule K-1 forms from all underlying investments for the applicable tax year. Investments, required items, timing, and collection method may vary by year and by fund.',
    active: true,
    categoryId: 'CAT-001',
    playbookId: 'PB-003',
    taxonomy: { domain: 'Tax Compliance', category: 'Annual Schedule K-1 Prep' },
    defaultFrequency: 'annual',
    recurrenceDriver: 'New investment list',
    defaultDueOffsetDays: 45,
    defaultPriority: 'High',
    defaultOwner: 'Tax Operations',
    defaultPlaybook: 'K-1 issue triage',
    defaultInstructions: 'For each investment on the current-year list: (1) determine the expected K-1 delivery method, (2) track receipt status, (3) escalate overdue K-1s. Reference prior-year collection notes for context.',
    defaultExpectedOutput: 'Complete set of K-1s received and validated for all investments.',
    riskNotes: 'Late K-1s are common. Early outreach to fund administrators reduces delays.',
    tags: ['k-1', 'investments', 'collection', 'schedule-k1'],
    standardizationLevel: 'hybrid',
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'RT-LEGACY',
    name: 'Legacy / Unmapped',
    description: 'Fallback process for requests that were created before the process system was introduced.',
    active: true,
    categoryId: 'CAT-LEGACY',
    playbookId: 'PB-007',
    taxonomy: { domain: '', category: '' },
    defaultFrequency: 'ad-hoc',
    recurrenceDriver: 'Manual trigger',
    defaultDueOffsetDays: 30,
    defaultPriority: 'Medium',
    defaultOwner: '',
    defaultPlaybook: 'Custom workflow',
    defaultInstructions: '',
    defaultExpectedOutput: '',
    riskNotes: '',
    tags: ['legacy'],
    standardizationLevel: 'global',
    createdDate: '2025-01-01',
    lastModifiedDate: '2025-01-01',
  },
];

export const requestTypesService = {
  getAllRequestTypes(): RequestProcess[] {
    return REQUEST_TYPE_RECORDS;
  },

  getActiveRequestTypes(): RequestProcess[] {
    return REQUEST_TYPE_RECORDS.filter((t) => t.active);
  },

  getRequestTypeById(id: string): RequestProcess | undefined {
    return REQUEST_TYPE_RECORDS.find((t) => t.id === id);
  },

  getRequestTypesByCategory(categoryId: string): RequestProcess[] {
    return REQUEST_TYPE_RECORDS.filter((t) => t.categoryId === categoryId);
  },

  getRequestTypesByTaxonomy(partial: Partial<TaxonomyPath>): RequestProcess[] {
    return REQUEST_TYPE_RECORDS.filter((t) => {
      if (partial.domain && t.taxonomy.domain !== partial.domain) return false;
      if (partial.category && t.taxonomy.category !== partial.category) return false;
      return true;
    });
  },

  getRequestTypesByFrequency(freq: RequestFrequency): RequestProcess[] {
    return REQUEST_TYPE_RECORDS.filter((t) => t.defaultFrequency === freq);
  },

  getRequestTypesByPlaybook(playbookId: string): RequestProcess[] {
    return REQUEST_TYPE_RECORDS.filter((t) => t.playbookId === playbookId);
  },

  searchRequestTypes(query: string): RequestProcess[] {
    const q = query.toLowerCase();
    return REQUEST_TYPE_RECORDS.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  },
};

/** Alias for requestTypesService */
export const requestProcessService = requestTypesService;
