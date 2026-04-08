import type { FundFamily, Fund } from '../types/fund.types';
import type { ScopeDimensionOption } from '../../../platform/context/platformContext.types';
import type { RecordComment } from '../../../types/comment';

let _version = 0;

type Listener = () => void;
const _listeners = new Set<Listener>();

function _notify() {
  _listeners.forEach((cb) => cb());
}

let FUND_FAMILIES: FundFamily[] = [
  {
    id: 'atlas-opportunistic',
    name: 'Atlas Opportunistic Platform',
    description: 'Multi-strategy opportunistic fund platform with master-feeder and blocker structures.',
    comments: [],
  },
  {
    id: 'blackstone-re',
    name: 'Blackstone Real Estate Partners',
    description: 'Real estate private equity fund family focused on global property investments.',
    comments: [],
  },
];

let FUNDS: Fund[] = [
  {
    id: 'atlas-master-fund',
    name: 'Atlas Master Fund',
    fundFamilyId: 'atlas-opportunistic',
    scopeId: 'atlas-master-fund',
    entityCount: 4,
    dealCount: 2,
    comments: [],
  },
  {
    id: 'atlas-blocker-lux',
    name: 'Atlas Blocker Lux',
    fundFamilyId: 'atlas-opportunistic',
    scopeId: 'atlas-blocker-lux',
    entityCount: 2,
    dealCount: 1,
    comments: [],
  },
  {
    id: 'brep-ix',
    name: 'BREP IX',
    fundFamilyId: 'blackstone-re',
    scopeId: 'brep-ix',
    entityCount: 0,
    dealCount: 1,
    comments: [],
  },
  {
    id: 'brep-x',
    name: 'BREP X',
    fundFamilyId: 'blackstone-re',
    scopeId: 'brep-x',
    entityCount: 0,
    dealCount: 0,
    comments: [],
  },
];

export const fundsService = {
  getFundFamilies(): FundFamily[] {
    return FUND_FAMILIES;
  },

  getFunds(): Fund[] {
    return FUNDS;
  },

  getFundsByFamily(familyId: string): Fund[] {
    return FUNDS.filter((f) => f.fundFamilyId === familyId);
  },

  getFundFamilyById(id: string): FundFamily | undefined {
    return FUND_FAMILIES.find((ff) => ff.id === id);
  },

  getVersion(): number {
    return _version;
  },

  subscribe(cb: Listener): () => void {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },

  addFundFamily(family: FundFamily): void {
    FUND_FAMILIES = [...FUND_FAMILIES, family];
    _version++;
    _notify();
  },

  addFund(fund: Fund): void {
    FUNDS = [...FUNDS, fund];
    _version++;
    _notify();
  },

  updateFundFamily(id: string, updates: Partial<Omit<FundFamily, 'id'>>): void {
    FUND_FAMILIES = FUND_FAMILIES.map((ff) => (ff.id === id ? { ...ff, ...updates } : ff));
    _version++;
    _notify();
  },

  updateFund(id: string, updates: Partial<Omit<Fund, 'id' | 'scopeId'>>): void {
    FUNDS = FUNDS.map((f) => (f.id === id ? { ...f, ...updates } : f));
    _version++;
    _notify();
  },

  deleteFund(id: string): void {
    FUNDS = FUNDS.filter((f) => f.id !== id);
    _version++;
    _notify();
  },

  deleteFundFamily(id: string): void {
    FUND_FAMILIES = FUND_FAMILIES.filter((ff) => ff.id !== id);
    _version++;
    _notify();
  },

  addFundComment(id: string, comment: RecordComment): void {
    FUNDS = FUNDS.map((f) =>
      f.id === id ? { ...f, comments: [...f.comments, comment] } : f
    );
    _version++;
    _notify();
  },

  addFundFamilyComment(id: string, comment: RecordComment): void {
    FUND_FAMILIES = FUND_FAMILIES.map((ff) =>
      ff.id === id ? { ...ff, comments: [...ff.comments, comment] } : ff
    );
    _version++;
    _notify();
  },

  getFundScopeDimensionOptions(): ScopeDimensionOption[] {
    return FUNDS.map((f) => ({
      id: f.scopeId,
      label: f.name,
      dimension: 'fund' as const,
      description: '',
    }));
  },

  resolveFundLabel(scopeIds: string[]): string | undefined {
    const fund = FUNDS.find((f) => scopeIds.includes(f.scopeId));
    return fund?.name;
  },

  resolveFundFamilyLabel(scopeIds: string[]): string | undefined {
    const fund = FUNDS.find((f) => scopeIds.includes(f.scopeId));
    if (!fund) return undefined;
    const family = FUND_FAMILIES.find((ff) => ff.id === fund.fundFamilyId);
    return family?.name;
  },
};
