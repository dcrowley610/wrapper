import type { ScopeSelection } from '../../../platform/context';
import { matchesScope } from '../../../platform/context';
import type { DealRecord } from '../types';

let DEAL_RECORDS: DealRecord[] = [
  {
    id: 'atlas-infra-acquisition',
    name: 'Atlas Infrastructure Acquisition',
    owner: 'James Park',
    investmentType: 'Infrastructure',
    taxableIncome: '$4,200,000',
    taxYear: '2026',
    status: 'Active',
    linkedEntityIds: ['atlas-master-fund', 'smith-real-estate-llc'],
    scopeIds: ['atlas-master-fund', 'tax-year-2026'],
    requestCount: 3,
    documentCount: 8,
    openQuestions: 1,
    lastReviewDate: '2026-03-20',
    notes: 'Infrastructure portfolio acquisition through Atlas Master Fund. Ongoing tax structuring review.',
    closingDate: '2026-01-15',
    currency: 'USD',
    geographicFocus: 'North America',
    sector: 'Infrastructure',
    activityLog: [
      { date: '2026-03-20', action: 'Tax structuring memo uploaded', actor: 'James Park' },
      { date: '2026-03-15', action: 'Entity allocation finalized', actor: 'Sarah Chen' },
      { date: '2026-03-01', action: 'Deal created in platform', actor: 'Maria Lopez' },
    ],
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Master Fund',
      parentContextLabel: 'Infrastructure sleeve',
    },
    comments: [],
  },
  {
    id: 'atlas-lux-debt-facility',
    name: 'Atlas Lux Debt Facility',
    owner: 'David Kim',
    investmentType: 'Debt',
    taxableIncome: '$1,850,000',
    taxYear: '2026',
    status: 'Pending Review',
    linkedEntityIds: ['atlas-blocker-lux'],
    scopeIds: ['atlas-blocker-lux', 'tax-year-2026'],
    requestCount: 2,
    documentCount: 5,
    openQuestions: 3,
    lastReviewDate: '2026-03-18',
    notes: 'Lux blocker debt facility with withholding and treaty implications. Under review for 2026 compliance.',
    closingDate: '',
    currency: 'EUR',
    geographicFocus: 'Europe',
    sector: 'Financial Services',
    activityLog: [
      { date: '2026-03-18', action: 'Withholding analysis flagged', actor: 'David Kim' },
      { date: '2026-03-10', action: 'Debt instrument terms uploaded', actor: 'Sarah Chen' },
      { date: '2026-02-20', action: 'Deal created in platform', actor: 'James Park' },
    ],
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Lux Blocker Sleeve',
      parentContextLabel: 'Debt facility',
    },
    comments: [],
  },
  {
    id: 'brep-ix-realty-equity',
    name: 'BREP IX Realty Equity',
    owner: 'Sarah Chen',
    investmentType: 'Real Estate',
    taxableIncome: '$12,500,000',
    taxYear: '2026',
    status: 'Active',
    linkedEntityIds: [],
    scopeIds: ['brep-ix', 'tax-year-2026'],
    requestCount: 5,
    documentCount: 14,
    openQuestions: 2,
    lastReviewDate: '2026-03-22',
    notes: 'Core real estate equity investment through BREP IX. Multi-state filing exposure.',
    closingDate: '2025-11-30',
    currency: 'USD',
    geographicFocus: 'North America',
    sector: 'Real Estate',
    activityLog: [
      { date: '2026-03-22', action: 'State apportionment review started', actor: 'Sarah Chen' },
      { date: '2026-03-14', action: 'Acquisition closing documents uploaded', actor: 'Maria Lopez' },
      { date: '2026-03-05', action: 'K-1 allocation model drafted', actor: 'James Park' },
      { date: '2026-02-15', action: 'Deal created in platform', actor: 'David Kim' },
    ],
    context: {
      fundFamilyLabel: 'Blackstone Real Estate Partners',
      fundLabel: 'BREP IX',
      parentContextLabel: 'Real estate equity',
    },
    comments: [],
  },
  {
    id: 'smith-re-equity-roll',
    name: 'Smith RE Equity Rollup',
    owner: 'Maria Lopez',
    investmentType: 'Equity',
    taxableIncome: '$780,000',
    taxYear: '2026',
    status: 'Closed',
    linkedEntityIds: ['smith-real-estate-llc', 'drip-ventures-inc'],
    scopeIds: ['atlas-master-fund', 'fed-state-compliance', 'tax-year-2026'],
    requestCount: 1,
    documentCount: 4,
    openQuestions: 0,
    lastReviewDate: '2026-02-28',
    notes: 'Downstream equity rollup through Smith Real Estate holding structure. Closed for 2026.',
    closingDate: '2026-02-28',
    currency: 'USD',
    geographicFocus: 'North America',
    sector: 'Real Estate',
    activityLog: [
      { date: '2026-02-28', action: 'Deal closed — final allocations posted', actor: 'Maria Lopez' },
      { date: '2026-02-15', action: 'Tax memo finalized', actor: 'James Park' },
      { date: '2026-01-20', action: 'Deal created in platform', actor: 'Sarah Chen' },
    ],
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Domestic Holdings',
      parentContextLabel: 'Equity rollup',
    },
    comments: [],
  },
];

import type { RecordComment } from '../../../types/comment';

let _version = 0;
type Listener = () => void;
const _listeners = new Set<Listener>();
function _notify() { _listeners.forEach((cb) => cb()); }

export const dealsService = {
  getAccessibleDeals(): DealRecord[] {
    return DEAL_RECORDS;
  },

  getScopedDeals(selection: ScopeSelection): DealRecord[] {
    return DEAL_RECORDS.filter((deal) => matchesScope(deal.scopeIds, selection));
  },

  getAccessibleDealById(id: string): DealRecord | undefined {
    return DEAL_RECORDS.find((deal) => deal.id === id);
  },

  getVersion(): number {
    return _version;
  },

  subscribe(cb: Listener): () => void {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },

  addDeal(deal: DealRecord): void {
    DEAL_RECORDS = [deal, ...DEAL_RECORDS];
    _version++;
    _notify();
  },

  updateDeal(id: string, updates: Partial<Omit<DealRecord, 'id'>>): void {
    DEAL_RECORDS = DEAL_RECORDS.map((d) => (d.id === id ? { ...d, ...updates } : d));
    _version++;
    _notify();
  },

  deleteDeal(id: string): void {
    DEAL_RECORDS = DEAL_RECORDS.filter((d) => d.id !== id);
    _version++;
    _notify();
  },

  addDealComment(id: string, comment: RecordComment): void {
    DEAL_RECORDS = DEAL_RECORDS.map((d) =>
      d.id === id ? { ...d, comments: [...d.comments, comment] } : d
    );
    _version++;
    _notify();
  },
};
