import type { RequestPlaybook } from '../types';

const PLAYBOOK_RECORDS: RequestPlaybook[] = [
  {
    id: 'PB-001',
    name: 'Extension decision memo',
    categoryId: 'CAT-002',
    description: 'Standard playbook for preparing and routing extension decision memos.',
    defaultOwner: 'Tax Manager',
    tags: ['extension', 'filing'],
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'PB-002',
    name: 'Entity compliance package',
    categoryId: 'CAT-005',
    description: 'Playbook for assembling entity-level compliance and reporting packages.',
    defaultOwner: 'Tax Manager',
    tags: ['compliance', 'reporting'],
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'PB-003',
    name: 'K-1 issue triage',
    categoryId: 'CAT-001',
    description: 'Playbook for collecting, tracking, and triaging Schedule K-1 forms.',
    defaultOwner: 'Tax Operations',
    tags: ['k-1', 'triage'],
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'PB-004',
    name: 'Notice response',
    categoryId: 'CAT-002',
    description: 'Playbook for triaging and responding to tax notices.',
    defaultOwner: 'Tax Operations',
    tags: ['notice', 'response'],
    active: true,
    createdDate: '2025-02-10',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'PB-005',
    name: 'Withholding analysis',
    categoryId: 'CAT-003',
    description: 'Playbook for withholding rate determinations and ECI analysis.',
    defaultOwner: 'International Tax',
    tags: ['withholding', 'ECI'],
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'PB-006',
    name: 'GPR and Year-End Reporting',
    categoryId: 'CAT-005',
    description: 'Playbook for year-end GPR assembly and investor reporting.',
    defaultOwner: 'Tax Manager',
    tags: ['GPR', 'year-end', 'reporting'],
    active: true,
    createdDate: '2025-03-01',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'PB-007',
    name: 'Custom workflow',
    categoryId: 'CAT-LEGACY',
    description: 'Generic playbook for ad-hoc or unmapped workflows.',
    defaultOwner: '',
    tags: ['custom', 'ad-hoc'],
    active: true,
    createdDate: '2025-01-01',
    lastModifiedDate: '2025-01-01',
  },
];

/** Map from legacy playbook name strings to playbook IDs */
const NAME_TO_ID: Record<string, string> = {};
for (const pb of PLAYBOOK_RECORDS) {
  NAME_TO_ID[pb.name.toLowerCase()] = pb.id;
}

export const requestPlaybooksService = {
  getAll(): RequestPlaybook[] {
    return PLAYBOOK_RECORDS;
  },

  getById(id: string): RequestPlaybook | undefined {
    return PLAYBOOK_RECORDS.find((pb) => pb.id === id);
  },

  getByCategory(categoryId: string): RequestPlaybook[] {
    return PLAYBOOK_RECORDS.filter((pb) => pb.categoryId === categoryId);
  },

  search(query: string): RequestPlaybook[] {
    const q = query.toLowerCase();
    return PLAYBOOK_RECORDS.filter(
      (pb) =>
        pb.name.toLowerCase().includes(q) ||
        pb.description.toLowerCase().includes(q) ||
        pb.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  },

  /** Resolve a legacy playbook name string to a playbook ID */
  resolveNameToId(name: string): string | undefined {
    return NAME_TO_ID[name.toLowerCase()];
  },
};
