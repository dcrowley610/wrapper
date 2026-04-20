import type { ScopeSelection } from '../../../platform/context';
import { matchesScope } from '../../../platform/context';
import type { InvestorRecord } from '../types';
import type { RecordComment } from '../../../types/comment';

let INVESTOR_RECORDS: InvestorRecord[] = [
  {
    id: 'northlight-pension',
    name: 'Northlight Pension Trust',
    investorClass: 'Institutional',
    domicile: 'United States',
    status: 'Active',
    withholdingProfile: 'US tax-exempt',
    serviceTeam: 'Investor Tax',
    scopeIds: ['bip-i', 'tax-year-2026', 'northlight-pension'],
    commitment: '$85M',
    openQuestions: 1,
    requestCount: 3,
    lastActivityDate: '2026-03-19',
    notes: 'Frequent K-1 timing questions and year-end reporting coordination.',
    legalName: 'Northlight Pension Trust',
    contactName: 'Rebecca Torres',
    contactEmail: 'rtorres@northlightpension.org',
    taxIdType: 'EIN',
    taxIdLast4: '4321',
    entityType: 'Tax-Exempt Trust',
    withholdingRate: '0%',
    w8FormType: 'N/A — US investor',
    w8ExpirationDate: '',
    treatyClaimCountry: 'N/A',
    chapter3Status: 'N/A',
    chapter4Status: 'N/A',
    openQuestionsList: [
      { id: 'q1', question: 'When will 2025 K-1s be available for distribution?', askedDate: '2026-03-19', status: 'Open' },
    ],
    activityLog: [
      { date: '2026-03-19', action: 'K-1 timing inquiry submitted', actor: 'Rebecca Torres' },
      { date: '2026-03-14', action: 'Capital account statement reviewed', actor: 'Investor Tax' },
      { date: '2026-03-01', action: 'Annual compliance package sent', actor: 'System' },
      { date: '2026-02-15', action: 'Commitment confirmation received', actor: 'Rebecca Torres' },
    ],
    documentCount: 12,
    lastReviewDate: '2026-03-14',
    capitalAccount: '$84.2M',
    ownershipPercentage: '18.4%',
    investorType: 'Pension Fund',
    allocationPercentage: '4.2%',
    taxExempt: 'Yes',
    kycStatus: 'Verified',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Master Fund',
      parentContextLabel: 'Institutional investor cohort',
    },
    comments: [],
  },
  {
    id: 'meridian-family-office',
    name: 'Meridian Family Office',
    investorClass: 'Family Office',
    domicile: 'United Kingdom',
    status: 'Watchlist',
    withholdingProfile: 'Non-US with treaty review',
    serviceTeam: 'Withholding Desk',
    scopeIds: ['bip-i', 'fed-state-compliance', 'tax-year-2026', 'meridian-family-office'],
    commitment: '$42M',
    openQuestions: 4,
    requestCount: 5,
    lastActivityDate: '2026-03-17',
    notes: 'Open documentation and withholding-certification follow-up remains unresolved.',
    legalName: 'Meridian Family Office Ltd',
    contactName: 'Charles Whitfield',
    contactEmail: 'c.whitfield@meridianfo.co.uk',
    taxIdType: 'GIIN',
    taxIdLast4: '7890',
    entityType: 'Foreign Corporation',
    withholdingRate: '15%',
    w8FormType: 'W-8BEN-E',
    w8ExpirationDate: '2026-06-30',
    treatyClaimCountry: 'United Kingdom',
    chapter3Status: 'Treaty benefit claimed — Art. 11',
    chapter4Status: 'Participating FFI',
    openQuestionsList: [
      { id: 'q1', question: 'Can we confirm treaty eligibility for 2026 distributions?', askedDate: '2026-03-17', status: 'Open' },
      { id: 'q2', question: 'Is the current W-8BEN-E still valid or does it need renewal?', askedDate: '2026-03-15', status: 'Escalated' },
      { id: 'q3', question: 'What is the expected withholding on Q1 distribution?', askedDate: '2026-03-10', status: 'Open' },
      { id: 'q4', question: 'Please confirm beneficial ownership for LOB purposes.', askedDate: '2026-03-05', status: 'Answered' },
    ],
    activityLog: [
      { date: '2026-03-17', action: 'Treaty eligibility question raised', actor: 'Charles Whitfield' },
      { date: '2026-03-15', action: 'W-8BEN-E expiration warning triggered', actor: 'System' },
      { date: '2026-03-10', action: 'Withholding rate review initiated', actor: 'Withholding Desk' },
      { date: '2026-03-05', action: 'LOB certification received', actor: 'Charles Whitfield' },
    ],
    documentCount: 8,
    lastReviewDate: '2026-03-10',
    capitalAccount: '$41.1M',
    ownershipPercentage: '9.2%',
    investorType: 'Family Office',
    allocationPercentage: '2.1%',
    taxExempt: 'No',
    kycStatus: 'Pending',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Co-Invest Sleeve',
      parentContextLabel: 'Family office investor group',
    },
    comments: [],
  },
  {
    id: 'blue-harbor-feeder',
    name: 'Blue Harbor Feeder SPC',
    investorClass: 'Feeder',
    domicile: 'Cayman Islands',
    status: 'Active',
    withholdingProfile: 'Feeder level reporting',
    serviceTeam: 'Fund Operations',
    scopeIds: ['bx-infra-i', 'bip-i', 'tax-year-2026', 'blue-harbor-feeder'],
    commitment: '$63M',
    openQuestions: 2,
    requestCount: 2,
    lastActivityDate: '2026-03-14',
    notes: 'Ideal candidate for future investor-to-structure and investor-to-entity relationships.',
    legalName: 'Blue Harbor Feeder SPC Ltd',
    contactName: 'Patricia Ng',
    contactEmail: 'png@blueharboradvisors.ky',
    taxIdType: 'GIIN',
    taxIdLast4: '5566',
    entityType: 'Segregated Portfolio Company',
    withholdingRate: '0%',
    w8FormType: 'W-8IMY',
    w8ExpirationDate: '2027-12-31',
    treatyClaimCountry: 'N/A',
    chapter3Status: 'Intermediary — flow-through',
    chapter4Status: 'Registered deemed-compliant FFI',
    openQuestionsList: [
      { id: 'q1', question: 'Do we need a separate withholding statement for each segregated portfolio?', askedDate: '2026-03-14', status: 'Open' },
      { id: 'q2', question: 'Can the feeder-level K-1 be consolidated?', askedDate: '2026-03-08', status: 'Open' },
    ],
    activityLog: [
      { date: '2026-03-14', action: 'Withholding statement question submitted', actor: 'Patricia Ng' },
      { date: '2026-03-08', action: 'K-1 consolidation request opened', actor: 'Fund Operations' },
      { date: '2026-02-28', action: 'Feeder allocation schedule uploaded', actor: 'System' },
      { date: '2026-02-12', action: 'W-8IMY validated and filed', actor: 'Patricia Ng' },
    ],
    documentCount: 6,
    lastReviewDate: '2026-03-08',
    capitalAccount: '$62.5M',
    ownershipPercentage: '13.8%',
    investorType: 'Endowment',
    allocationPercentage: '3.5%',
    taxExempt: 'Partial',
    kycStatus: 'Verified',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Blocker Lux',
      parentContextLabel: 'Feeder structure tied to blocker sleeve',
    },
    comments: [],
  },
  {
    id: 'alex-rivera',
    name: 'Alex Rivera',
    investorClass: 'Individual',
    domicile: 'Canada',
    status: 'Active',
    withholdingProfile: 'Non-US individual',
    serviceTeam: 'Investor Services',
    scopeIds: ['tax-year-2026', 'bip-i', 'alex-rivera'],
    commitment: '$8M',
    openQuestions: 3,
    requestCount: 2,
    lastActivityDate: '2026-03-12',
    notes: 'Needs a tighter question-and-answer workspace for residency and withholding follow-up.',
    legalName: 'Alex Rivera',
    contactName: 'Alex Rivera',
    contactEmail: 'alex.rivera@email.ca',
    taxIdType: 'ITIN',
    taxIdLast4: '9012',
    entityType: 'Individual',
    withholdingRate: '15%',
    w8FormType: 'W-8BEN',
    w8ExpirationDate: '2026-04-15',
    treatyClaimCountry: 'Canada',
    chapter3Status: 'Treaty benefit claimed — Art. 10',
    chapter4Status: 'Exempt beneficial owner',
    openQuestionsList: [
      { id: 'q1', question: 'Has Canadian tax residency been confirmed for 2026?', askedDate: '2026-03-12', status: 'Open' },
      { id: 'q2', question: 'Should we apply treaty rate or statutory 30% pending confirmation?', askedDate: '2026-03-10', status: 'Escalated' },
      { id: 'q3', question: 'Is the W-8BEN expiring April 15 being renewed?', askedDate: '2026-03-05', status: 'Open' },
    ],
    activityLog: [
      { date: '2026-03-12', action: 'Residency confirmation request sent', actor: 'Investor Services' },
      { date: '2026-03-10', action: 'Withholding rate escalation created', actor: 'Withholding Desk' },
      { date: '2026-03-05', action: 'W-8BEN expiration notice sent', actor: 'System' },
      { date: '2026-02-20', action: 'Annual investor letter delivered', actor: 'System' },
    ],
    documentCount: 5,
    lastReviewDate: '2026-03-05',
    capitalAccount: '$7.8M',
    ownershipPercentage: '1.7%',
    investorType: 'Individual',
    allocationPercentage: '0.4%',
    taxExempt: 'No',
    kycStatus: 'Expired',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Tax Year 2026 Program',
      parentContextLabel: 'Direct investor onboarding set',
    },
    comments: [],
  },
];

let _version = 0;
type Listener = () => void;
const _listeners = new Set<Listener>();
function _notify() { _listeners.forEach((cb) => cb()); }

export const investorsService = {
  getScopedInvestors(selection: ScopeSelection): InvestorRecord[] {
    return INVESTOR_RECORDS.filter((investor) => matchesScope(investor.scopeIds, selection));
  },

  getAccessibleInvestorById(id: string): InvestorRecord | undefined {
    return INVESTOR_RECORDS.find((investor) => investor.id === id);
  },

  getVersion(): number {
    return _version;
  },

  subscribe(cb: Listener): () => void {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },

  addInvestor(investor: InvestorRecord): void {
    INVESTOR_RECORDS = [investor, ...INVESTOR_RECORDS];
    _version++;
    _notify();
  },

  updateInvestor(id: string, updates: Partial<Omit<InvestorRecord, 'id'>>): void {
    INVESTOR_RECORDS = INVESTOR_RECORDS.map((i) => (i.id === id ? { ...i, ...updates } : i));
    _version++;
    _notify();
  },

  deleteInvestor(id: string): void {
    INVESTOR_RECORDS = INVESTOR_RECORDS.filter((i) => i.id !== id);
    _version++;
    _notify();
  },

  addInvestorComment(id: string, comment: RecordComment): void {
    INVESTOR_RECORDS = INVESTOR_RECORDS.map((i) =>
      i.id === id ? { ...i, comments: [...i.comments, comment] } : i
    );
    _version++;
    _notify();
  },
};
