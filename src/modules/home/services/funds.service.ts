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
    id: 'blackstone-infra',
    name: 'Blackstone Infrastructure Partners',
    shortName: 'Infra',
    description: 'Infrastructure open-ended fund platform',
    comments: [],
  },
  {
    id: 'blackstone-re',
    name: 'Blackstone Real Estate Partners',
    shortName: 'BREP',
    description: 'Real estate private equity fund family focused on global property investments.',
    comments: [],
  },
];

let FUNDS: Fund[] = [
  {
    id: 'blackstone-re-ix',
    name: 'Blackstone Real Estate Partners IX',
    shortNameFund: 'BREPIX',
    fundFamilyId: 'blackstone-re',
    scopeId: 'blackstone-re-ix',
    comments: [],
  },
  {
    id: 'blackstone-re-x',
    name: 'Blackstone Real Estate Partners X',
    shortNameFund: 'BREPX',
    fundFamilyId: 'blackstone-re',
    scopeId: 'blackstone-re-x',
    comments: [],
  },
  {
    id: 'bip-i',
    name: 'Blackstone Infrastructure Partners I',
    shortNameFund: 'BIP',
    fundFamilyId: 'blackstone-infra',
    scopeId: 'bip-i',
    comments: [],
  },
  {
    id: 'bx-infra-i',
    name: 'BXInfra',
    shortNameFund: 'BXInfra',
    fundFamilyId: 'blackstone-infra',
    scopeId: 'bx-infra-i',
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
