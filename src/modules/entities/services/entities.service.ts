import type { ScopeSelection } from '../../../platform/context';
import { matchesScope } from '../../../platform/context';
import type { EntityRecord } from '../types';
import type { RecordComment } from '../../../types/comment';

let _version = 0;
type Listener = () => void;
const _listeners = new Set<Listener>();
function _notify() { _listeners.forEach((cb) => cb()); }

let ENTITY_RECORDS: EntityRecord[] = [
  {
    id: 'atlas-master-fund',
    name: 'Atlas Master Fund',
    legalName: 'Atlas Master Fund, L.P.',
    category: 'Fund Vehicle',
    jurisdiction: 'Cayman Islands',
    status: 'Active',
    taxClassification: 'Partnership',
    ownerTeam: 'Fund Tax',
    scopeIds: ['atlas-master-fund', 'tax-year-2026', 'tax-year-2025'],
    structureSummary: 'Top-level fund vehicle coordinating blocker and portfolio entity reporting.',
    requestCount: 6,
    documentCount: 18,
    openQuestions: 2,
    lastReviewDate: '2026-03-18',
    notes: 'Primary point of entry for year-end filing coordination and investor allocations.',
    ein: '98-7654321',
    dateFormed: '2018-04-15',
    fiscalYearEnd: 'December 31',
    registeredAgent: 'Maples Corporate Services',
    address: 'PO Box 309, Ugland House, George Town, Grand Cayman',
    checkTheBoxElection: 'N/A — foreign partnership',
    treatyCountry: 'Cayman Islands',
    fatcaStatus: 'Sponsoring entity — IGA Model 1',
    stateFilingJurisdictions: [],
    structureRole: 'Master Fund',
    formationType: 'LP',
    functionalCurrency: 'USD',
    taxReportingStatus: 'None',
    annualRevenue: '$45,000,000',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Master Fund',
      parentContextLabel: 'Master fund vehicle',
    },
    activityLog: [
      { date: '2026-03-18', action: 'Year-end review initiated', actor: 'Sarah Chen' },
      { date: '2026-03-15', action: 'K-1 draft packages uploaded', actor: 'System' },
      { date: '2026-03-10', action: 'Investor allocation model finalized', actor: 'James Park' },
      { date: '2026-02-28', action: 'FATCA reporting status confirmed', actor: 'Maria Lopez' },
    ],
    comments: [],
  },
  {
    id: 'atlas-blocker-lux',
    name: 'Atlas Blocker Lux',
    legalName: 'Atlas Blocker Lux S.a r.l.',
    category: 'Blocker',
    jurisdiction: 'Luxembourg',
    status: 'Pending Review',
    taxClassification: 'Corporation',
    ownerTeam: 'International Tax',
    scopeIds: ['atlas-blocker-lux', 'tax-year-2026', 'tax-year-2025'],
    structureSummary: 'Lux blocker entity with ECI, withholding, and ownership tracing requirements.',
    requestCount: 4,
    documentCount: 11,
    openQuestions: 5,
    lastReviewDate: '2026-03-16',
    notes: 'Likely first candidate for deep-linking from Structures into entity detail.',
    ein: '98-1112233',
    dateFormed: '2019-09-01',
    fiscalYearEnd: 'December 31',
    registeredAgent: 'Luxembourg Corp Services S.A.',
    address: '2 Rue du Fort Bourbon, L-1249 Luxembourg',
    checkTheBoxElection: 'Elected corporation — Form 8832 filed 2019',
    treatyCountry: 'Luxembourg',
    fatcaStatus: 'Registered deemed-compliant FFI',
    stateFilingJurisdictions: [],
    structureRole: 'Blocker',
    formationType: 'Corp',
    functionalCurrency: 'EUR',
    taxReportingStatus: 'CFC',
    annualRevenue: '$12,500,000',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Lux Blocker Sleeve',
      parentContextLabel: 'Owned by Atlas Master Fund',
    },
    activityLog: [
      { date: '2026-03-16', action: 'Withholding rate review flagged for update', actor: 'David Kim' },
      { date: '2026-03-12', action: 'ECI analysis memo uploaded', actor: 'Sarah Chen' },
      { date: '2026-03-05', action: 'Treaty position documented', actor: 'Maria Lopez' },
      { date: '2026-02-20', action: 'Entity classification confirmed for 2026', actor: 'James Park' },
    ],
    comments: [],
  },
  {
    id: 'smith-real-estate-llc',
    name: 'Smith Real Estate LLC',
    legalName: 'Smith Real Estate LLC',
    category: 'Holding Company',
    jurisdiction: 'Delaware',
    status: 'Active',
    taxClassification: 'Reverse Hybrid',
    ownerTeam: 'Tax Operations',
    scopeIds: ['atlas-master-fund', 'fed-state-compliance', 'tax-year-2026'],
    structureSummary: 'Domestic holding company with downstream property and operating investments.',
    requestCount: 3,
    documentCount: 9,
    openQuestions: 1,
    lastReviewDate: '2026-03-11',
    notes: 'Frequently touched in notice response and composite filing workflows.',
    ein: '47-5559876',
    dateFormed: '2012-07-22',
    fiscalYearEnd: 'December 31',
    registeredAgent: 'Corporation Trust Company',
    address: '1209 Orange St, Wilmington, DE 19801',
    checkTheBoxElection: 'Elected reverse hybrid — Form 8832 filed 2012',
    treatyCountry: 'N/A',
    fatcaStatus: 'N/A — domestic entity',
    stateFilingJurisdictions: ['Delaware', 'New York', 'California'],
    structureRole: 'Holding Company',
    formationType: 'LLC',
    functionalCurrency: 'USD',
    taxReportingStatus: 'None',
    annualRevenue: '$8,200,000',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Domestic Holdings',
      parentContextLabel: 'Linked operating entity set',
    },
    activityLog: [
      { date: '2026-03-11', action: 'State composite return prep started', actor: 'James Park' },
      { date: '2026-03-06', action: 'Delaware franchise tax filed', actor: 'System' },
      { date: '2026-02-28', action: 'Property appraisal documents attached', actor: 'Sarah Chen' },
      { date: '2026-02-15', action: 'Notice response submitted — NY DTF', actor: 'David Kim' },
    ],
    comments: [],
  },
  {
    id: 'third-party-investors',
    name: 'Third-Party Investors',
    legalName: 'Third-Party Investors',
    category: 'Third-Party',
    jurisdiction: 'N/A',
    status: 'Active',
    taxClassification: '',
    ownerTeam: '',
    scopeIds: ['atlas-master-fund', 'tax-year-2026'],
    structureSummary: 'Represents external third-party ownership stakes across the structure.',
    requestCount: 0,
    documentCount: 0,
    openQuestions: 0,
    lastReviewDate: '',
    notes: 'Placeholder entity representing aggregate third-party / external ownership interests.',
    ein: '',
    dateFormed: '',
    fiscalYearEnd: '',
    registeredAgent: '',
    address: '',
    checkTheBoxElection: '',
    treatyCountry: '',
    fatcaStatus: '',
    stateFilingJurisdictions: [],
    structureRole: 'Third-Party',
    formationType: '',
    functionalCurrency: 'USD',
    taxReportingStatus: '',
    annualRevenue: '',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: '',
      parentContextLabel: 'External ownership interests',
    },
    activityLog: [],
    comments: [],
  },
  {
    id: 'drip-ventures-inc',
    name: 'Drip Ventures Inc',
    legalName: 'Drip Ventures Inc.',
    category: 'Operating Company',
    jurisdiction: 'California',
    status: 'Active',
    taxClassification: 'Corporation',
    ownerTeam: 'Portfolio Reporting',
    scopeIds: ['fed-state-compliance', 'tax-year-2026', 'atlas-master-fund'],
    structureSummary: 'Operating subsidiary with state filing exposure and recurring apportionment questions.',
    requestCount: 2,
    documentCount: 7,
    openQuestions: 3,
    lastReviewDate: '2026-03-08',
    notes: 'Good downstream candidate for embedded Requests and Documents views.',
    ein: '82-4437891',
    dateFormed: '2020-01-10',
    fiscalYearEnd: 'December 31',
    registeredAgent: 'CSC — Lawyers Incorporating Service',
    address: '2710 Gateway Oaks Dr, Suite 150N, Sacramento, CA 95833',
    checkTheBoxElection: 'N/A — domestic corporation',
    treatyCountry: 'N/A',
    fatcaStatus: 'N/A — domestic entity',
    stateFilingJurisdictions: ['California', 'New York', 'Texas'],
    structureRole: 'Operating Company',
    formationType: 'Corp',
    functionalCurrency: 'USD',
    taxReportingStatus: 'PFIC',
    annualRevenue: '$2,500,000',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Domestic Holdings',
      parentContextLabel: 'Child of Smith Real Estate LLC',
    },
    activityLog: [
      { date: '2026-03-08', action: 'Apportionment question opened for CA/NY', actor: 'Maria Lopez' },
      { date: '2026-03-03', action: 'Federal return draft uploaded', actor: 'System' },
      { date: '2026-02-25', action: 'Revenue allocation worksheet reviewed', actor: 'James Park' },
      { date: '2026-02-10', action: 'Entity created in platform', actor: 'Sarah Chen' },
    ],
    comments: [],
  },
];

export const entitiesService = {
  getAccessibleEntities(): EntityRecord[] {
    return ENTITY_RECORDS;
  },

  getScopedEntities(selection: ScopeSelection): EntityRecord[] {
    return ENTITY_RECORDS.filter((entity) => matchesScope(entity.scopeIds, selection));
  },

  getAccessibleEntityById(id: string): EntityRecord | undefined {
    return ENTITY_RECORDS.find((entity) => entity.id === id);
  },

  getVersion(): number {
    return _version;
  },

  subscribe(cb: Listener): () => void {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },

  addEntity(entity: EntityRecord): void {
    ENTITY_RECORDS = [entity, ...ENTITY_RECORDS];
    _version++;
    _notify();
  },

  updateEntity(id: string, updates: Partial<Omit<EntityRecord, 'id'>>): void {
    ENTITY_RECORDS = ENTITY_RECORDS.map((e) => (e.id === id ? { ...e, ...updates } : e));
    _version++;
    _notify();
  },

  deleteEntity(id: string): void {
    ENTITY_RECORDS = ENTITY_RECORDS.filter((e) => e.id !== id);
    _version++;
    _notify();
  },

  addEntityComment(id: string, comment: RecordComment): void {
    ENTITY_RECORDS = ENTITY_RECORDS.map((e) =>
      e.id === id ? { ...e, comments: [...e.comments, comment] } : e
    );
    _version++;
    _notify();
  },
};
