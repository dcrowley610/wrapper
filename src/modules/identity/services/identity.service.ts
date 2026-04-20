import type {
  MasterRecord,
  MasterEntity,
  MasterInvestor,
  MasterDeal,
  MasterDomain,
  ObjectAlias,
  ObjectXwalk,
  SourceObjectRecord,
} from '../types';
import { normalize } from '../normalization';

type Listener = () => void;

let _version = 0;
const _listeners = new Set<Listener>();
function _notify() {
  _version++;
  _listeners.forEach((cb) => cb());
}

// ── Seed Master Entities ──

function makeMasterEntity(
  id: string, name: string, legalName: string, jurisdiction: string,
  ein: string, category: string, taxClassification: string, scopeIds: string[],
): MasterEntity {
  const norm = normalize(name);
  return {
    id, domain: 'entity', canonicalName: name, normalizedName: norm.normalizedNameFull,
    status: 'active', createdDate: '2026-01-01', createdBy: 'System',
    lastModifiedDate: '2026-01-01', lastModifiedBy: 'System', scopeIds,
    legalName, jurisdiction, ein, category, taxClassification,
  };
}

function makeMasterInvestor(
  id: string, name: string, legalName: string, investorClass: string,
  domicile: string, taxIdType: string, taxIdLast4: string, scopeIds: string[],
): MasterInvestor {
  const norm = normalize(name);
  return {
    id, domain: 'investor', canonicalName: name, normalizedName: norm.normalizedNameFull,
    status: 'active', createdDate: '2026-01-01', createdBy: 'System',
    lastModifiedDate: '2026-01-01', lastModifiedBy: 'System', scopeIds,
    legalName, investorClass, domicile, taxIdType, taxIdLast4,
  };
}

function makeMasterDeal(
  id: string, name: string, investmentType: string, sector: string,
  geographicFocus: string, closingDate: string, scopeIds: string[],
): MasterDeal {
  const norm = normalize(name);
  return {
    id, domain: 'deal', canonicalName: name, normalizedName: norm.normalizedNameFull,
    status: 'active', createdDate: '2026-01-01', createdBy: 'System',
    lastModifiedDate: '2026-01-01', lastModifiedBy: 'System', scopeIds,
    investmentType, sector, geographicFocus, closingDate,
  };
}

let MASTERS: MasterRecord[] = [
  makeMasterEntity('me-atlas-master-fund', 'Atlas Master Fund', 'Atlas Master Fund, L.P.', 'Cayman Islands', '98-7654321', 'Fund Vehicle', 'Partnership', ['bip-i', 'tax-year-2026', 'tax-year-2025']),
  makeMasterEntity('me-atlas-blocker-lux', 'Atlas Blocker Lux', 'Atlas Blocker Lux S.a r.l.', 'Luxembourg', '98-1112233', 'Blocker', 'Corporation', ['bx-infra-i', 'tax-year-2026', 'tax-year-2025']),
  makeMasterEntity('me-smith-real-estate', 'Smith Real Estate LLC', 'Smith Real Estate LLC', 'Delaware', '47-5559876', 'Holding Company', 'Reverse Hybrid', ['bip-i', 'fed-state-compliance', 'tax-year-2026']),
  makeMasterEntity('me-third-party', 'Third-Party Investors', 'Third-Party Investors', 'N/A', '', 'Third-Party', '', ['bip-i', 'tax-year-2026']),
  makeMasterEntity('me-drip-ventures', 'Drip Ventures Inc', 'Drip Ventures Inc.', 'California', '82-4437891', 'Investment Level', 'Corporation', ['fed-state-compliance', 'tax-year-2026', 'bip-i']),
  makeMasterInvestor('mi-northlight', 'Northlight Pension Trust', 'Northlight Pension Trust', 'Institutional', 'United States', 'EIN', '4321', ['bip-i', 'tax-year-2026', 'northlight-pension']),
  makeMasterInvestor('mi-meridian', 'Meridian Family Office', 'Meridian Family Office Ltd', 'Family Office', 'United Kingdom', 'GIIN', '7890', ['bip-i', 'fed-state-compliance', 'tax-year-2026', 'meridian-family-office']),
  makeMasterInvestor('mi-blue-harbor', 'Blue Harbor Feeder SPC', 'Blue Harbor Feeder SPC Ltd', 'Feeder', 'Cayman Islands', 'GIIN', '5566', ['bx-infra-i', 'bip-i', 'tax-year-2026', 'blue-harbor-feeder']),
  makeMasterInvestor('mi-alex-rivera', 'Alex Rivera', 'Alex Rivera', 'Individual', 'Canada', 'ITIN', '9012', ['tax-year-2026', 'bip-i', 'alex-rivera']),
  makeMasterDeal('md-atlas-infra', 'Atlas Infrastructure Acquisition', 'Infrastructure', 'Infrastructure', 'North America', '2026-01-15', ['bip-i', 'tax-year-2026']),
  makeMasterDeal('md-atlas-lux-debt', 'Atlas Lux Debt Facility', 'Debt', 'Financial Services', 'Europe', '', ['bx-infra-i', 'tax-year-2026']),
  makeMasterDeal('md-brep-ix-realty', 'BREP IX Realty Equity', 'Real Estate', 'Real Estate', 'North America', '2025-11-30', ['blackstone-re-ix', 'tax-year-2026']),
  makeMasterDeal('md-smith-re-equity', 'Smith RE Equity Rollup', 'Equity', 'Real Estate', 'North America', '2026-02-28', ['bip-i', 'fed-state-compliance', 'tax-year-2026']),
];

// ── Seed Aliases (one per master — canonical name itself) ──

let nextAliasId = 100;
function makeAlias(masterId: string, domain: MasterDomain, name: string): ObjectAlias {
  const norm = normalize(name);
  return {
    id: `alias-${nextAliasId++}`, masterId, domain, aliasName: name,
    normalizedAliasName: norm.normalizedNameFull,
    source: 'seed', createdDate: '2026-01-01', createdBy: 'System', isActive: true,
  };
}

let ALIASES: ObjectAlias[] = [
  makeAlias('me-atlas-master-fund', 'entity', 'Atlas Master Fund'),
  makeAlias('me-atlas-blocker-lux', 'entity', 'Atlas Blocker Lux'),
  makeAlias('me-smith-real-estate', 'entity', 'Smith Real Estate LLC'),
  makeAlias('me-third-party', 'entity', 'Third-Party Investors'),
  makeAlias('me-drip-ventures', 'entity', 'Drip Ventures Inc'),
  makeAlias('mi-northlight', 'investor', 'Northlight Pension Trust'),
  makeAlias('mi-meridian', 'investor', 'Meridian Family Office'),
  makeAlias('mi-blue-harbor', 'investor', 'Blue Harbor Feeder SPC'),
  makeAlias('mi-alex-rivera', 'investor', 'Alex Rivera'),
  makeAlias('md-atlas-infra', 'deal', 'Atlas Infrastructure Acquisition'),
  makeAlias('md-atlas-lux-debt', 'deal', 'Atlas Lux Debt Facility'),
  makeAlias('md-brep-ix-realty', 'deal', 'BREP IX Realty Equity'),
  makeAlias('md-smith-re-equity', 'deal', 'Smith RE Equity Rollup'),
];

// ── Seed Xwalks (one per existing domain record → master) ──

let XWALKS: ObjectXwalk[] = [
  { id: 'xw-1', sourceRecordId: 'atlas-master-fund', masterId: 'me-atlas-master-fund', domain: 'entity', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-2', sourceRecordId: 'atlas-blocker-lux', masterId: 'me-atlas-blocker-lux', domain: 'entity', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-3', sourceRecordId: 'smith-real-estate-llc', masterId: 'me-smith-real-estate', domain: 'entity', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-4', sourceRecordId: 'third-party-investors', masterId: 'me-third-party', domain: 'entity', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-5', sourceRecordId: 'drip-ventures-inc', masterId: 'me-drip-ventures', domain: 'entity', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-6', sourceRecordId: 'northlight-pension', masterId: 'mi-northlight', domain: 'investor', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-7', sourceRecordId: 'meridian-family-office', masterId: 'mi-meridian', domain: 'investor', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-8', sourceRecordId: 'blue-harbor-feeder', masterId: 'mi-blue-harbor', domain: 'investor', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-9', sourceRecordId: 'alex-rivera', masterId: 'mi-alex-rivera', domain: 'investor', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-10', sourceRecordId: 'atlas-infra-acquisition', masterId: 'md-atlas-infra', domain: 'deal', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-11', sourceRecordId: 'atlas-lux-debt-facility', masterId: 'md-atlas-lux-debt', domain: 'deal', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-12', sourceRecordId: 'brep-ix-realty-equity', masterId: 'md-brep-ix-realty', domain: 'deal', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
  { id: 'xw-13', sourceRecordId: 'smith-re-equity-roll', masterId: 'md-smith-re-equity', domain: 'deal', status: 'approved', approvedDate: '2026-01-01', approvedBy: 'System', expiredDate: '', createdDate: '2026-01-01' },
];

// ── Demo Source Records (slight name variations for matching demo) ──

let SOURCE_RECORDS: SourceObjectRecord[] = [
  {
    id: 'src-1', domain: 'entity', sourceSystem: 'csv_import',
    sourceFileName: 'q1_entities.csv', sourceRowIndex: 1,
    rawName: 'Atlas Master Fund LP', rawAttributes: { jurisdiction: 'Cayman Islands', category: 'Fund Vehicle', ein: '98-7654321' },
    normalizedResult: normalize('Atlas Master Fund LP'),
    status: 'pending', ingestedDate: '2026-03-20', ingestedBy: 'Sarah Chen',
  },
  {
    id: 'src-2', domain: 'entity', sourceSystem: 'document_extraction',
    sourceFileName: 'tax_memo_2026.pdf', sourceRowIndex: 0,
    rawName: 'Smith Real Estate, L.L.C.', rawAttributes: { jurisdiction: 'Delaware', category: 'Holding Company' },
    normalizedResult: normalize('Smith Real Estate, L.L.C.'),
    status: 'pending', ingestedDate: '2026-03-22', ingestedBy: 'System',
  },
  {
    id: 'src-3', domain: 'investor', sourceSystem: 'csv_import',
    sourceFileName: 'investor_update.xlsx', sourceRowIndex: 3,
    rawName: 'Meridian Family Office Limited', rawAttributes: { domicile: 'United Kingdom', investorClass: 'Family Office' },
    normalizedResult: normalize('Meridian Family Office Limited'),
    status: 'pending', ingestedDate: '2026-03-25', ingestedBy: 'James Park',
  },
  {
    id: 'src-4', domain: 'deal', sourceSystem: 'manual_entry',
    sourceFileName: '', sourceRowIndex: 0,
    rawName: 'Brep IX Real Estate Equity', rawAttributes: { investmentType: 'Real Estate', sector: 'Real Estate', geographicFocus: 'North America' },
    normalizedResult: normalize('Brep IX Real Estate Equity'),
    status: 'pending', ingestedDate: '2026-03-28', ingestedBy: 'Maria Lopez',
  },
];

let _nextId = 200;

export const identityService = {
  // ── Masters ──
  getAllMasters(domain?: MasterDomain): MasterRecord[] {
    return domain ? MASTERS.filter((m) => m.domain === domain) : MASTERS;
  },

  getMasterById(id: string): MasterRecord | undefined {
    return MASTERS.find((m) => m.id === id);
  },

  addMaster(master: MasterRecord): void {
    MASTERS = [master, ...MASTERS];
    _notify();
  },

  updateMaster(id: string, updates: Partial<MasterRecord>): void {
    MASTERS = MASTERS.map((m) => (m.id === id ? { ...m, ...updates } as MasterRecord : m));
    _notify();
  },

  // ── Aliases ──
  getAllAliases(domain?: MasterDomain): ObjectAlias[] {
    return domain ? ALIASES.filter((a) => a.domain === domain) : ALIASES;
  },

  getAliasesForMaster(masterId: string): ObjectAlias[] {
    return ALIASES.filter((a) => a.masterId === masterId);
  },

  addAlias(alias: ObjectAlias): void {
    ALIASES = [alias, ...ALIASES];
    _notify();
  },

  // ── Xwalks ──
  getAllXwalks(): ObjectXwalk[] {
    return XWALKS;
  },

  getMasterIdForDomainRecord(domainRecordId: string): string | null {
    const xwalk = XWALKS.find((x) => x.sourceRecordId === domainRecordId && x.status === 'approved');
    return xwalk?.masterId ?? null;
  },

  addXwalk(xwalk: ObjectXwalk): void {
    XWALKS = [xwalk, ...XWALKS];
    _notify();
  },

  updateXwalk(id: string, updates: Partial<ObjectXwalk>): void {
    XWALKS = XWALKS.map((x) => (x.id === id ? { ...x, ...updates } : x));
    _notify();
  },

  // ── Source Records ──
  getAllSourceRecords(): SourceObjectRecord[] {
    return SOURCE_RECORDS;
  },

  getSourceRecordById(id: string): SourceObjectRecord | undefined {
    return SOURCE_RECORDS.find((s) => s.id === id);
  },

  addSourceRecord(record: SourceObjectRecord): void {
    SOURCE_RECORDS = [record, ...SOURCE_RECORDS];
    _notify();
  },

  updateSourceRecord(id: string, updates: Partial<SourceObjectRecord>): void {
    SOURCE_RECORDS = SOURCE_RECORDS.map((s) => (s.id === id ? { ...s, ...updates } : s));
    _notify();
  },

  // ── ID generation ──
  nextId(prefix: string): string {
    return `${prefix}-${_nextId++}`;
  },

  // ── Subscription ──
  getVersion(): number {
    return _version;
  },

  subscribe(cb: Listener): () => void {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },
};
