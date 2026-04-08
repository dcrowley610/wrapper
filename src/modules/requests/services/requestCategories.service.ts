import type { RequestCategory } from '../types';

const CATEGORY_RECORDS: RequestCategory[] = [
  {
    id: 'CAT-001',
    name: 'Annual Schedule K-1 Prep',
    description: 'Processes related to collecting and preparing Schedule K-1 forms from investments and blocker entities.',
    domain: 'Tax Compliance',
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'CAT-002',
    name: 'Filing Preparation',
    description: 'Processes for preparing tax filings, extensions, and responding to notices.',
    domain: 'Tax Compliance',
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'CAT-003',
    name: 'Withholding & ECI',
    description: 'Processes for withholding analysis and effectively connected income determinations.',
    domain: 'Tax Compliance',
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'CAT-004',
    name: 'Ownership Changes',
    description: 'Processes for gathering and analyzing ownership change documentation.',
    domain: 'Tax Compliance',
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'CAT-005',
    name: 'Supporting Schedules',
    description: 'Processes for compiling supporting schedules such as capital activity and estimated payments.',
    domain: 'Tax Compliance',
    active: true,
    createdDate: '2025-01-15',
    lastModifiedDate: '2025-12-01',
  },
  {
    id: 'CAT-LEGACY',
    name: 'Uncategorized',
    description: 'Fallback category for processes that have not been assigned to a specific category.',
    domain: '',
    active: true,
    createdDate: '2025-01-01',
    lastModifiedDate: '2025-01-01',
  },
];

export const requestCategoriesService = {
  getAll(): RequestCategory[] {
    return CATEGORY_RECORDS.filter((c) => c.active);
  },

  getById(id: string): RequestCategory | undefined {
    return CATEGORY_RECORDS.find((c) => c.id === id);
  },

  getByDomain(domain: string): RequestCategory[] {
    return CATEGORY_RECORDS.filter((c) => c.active && c.domain === domain);
  },

  search(query: string): RequestCategory[] {
    const q = query.toLowerCase();
    return CATEGORY_RECORDS.filter(
      (c) =>
        c.active &&
        (c.name.toLowerCase().includes(q) ||
          c.description.toLowerCase().includes(q) ||
          c.domain.toLowerCase().includes(q)),
    );
  },
};
