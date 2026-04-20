import { fundsService } from '../../modules/home/services/funds.service';
import { dealsService } from '../../modules/deals/services/deals.service';

// --- Legacy types (kept temporarily for backward compat) ---
export type ScopeKind = 'fund' | 'legalEntity' | 'taxYear' | 'workstream';

export type ScopeOption = {
  id: string;
  label: string;
  kind: ScopeKind;
  description: string;
};

export const MOCK_SCOPE_OPTIONS: ScopeOption[] = [
  ...fundsService.getFundScopeDimensionOptions().map((opt) => ({
    id: opt.id,
    label: opt.label,
    kind: 'fund' as const,
    description: opt.description,
  })),
  {
    id: 'tax-year-2026',
    label: 'Tax Year 2026',
    kind: 'taxYear',
    description: 'Cross-functional tax year close and filing scope.',
  },
  {
    id: 'fed-state-compliance',
    label: 'Federal + State Compliance',
    kind: 'workstream',
    description: 'Shared workstream covering return prep, review, and notices.',
  },
];

// --- New multi-dimensional scope types ---

export type ScopeDimension = 'fund' | 'taxYear' | 'workstream' | 'investor' | 'deal' | 'entityCategory';

export type ScopeDimensionOption = {
  id: string;
  label: string;
  dimension: ScopeDimension;
  description: string;
};

export type ScopeSelection = {
  fundIds: string[];
  taxYearIds: string[];
  workstreamIds: string[];
  investorIds: string[];
  dealIds: string[];
  entityCategoryIds: string[];
};

export type ScopePreset = {
  id: string;
  label: string;
  description: string;
  selection: ScopeSelection;
};

export const SCOPE_DIMENSIONS: Record<ScopeDimension, ScopeDimensionOption[]> = {
  fund: fundsService.getFundScopeDimensionOptions(),
  taxYear: [
    { id: 'tax-year-2024', label: '2024', dimension: 'taxYear', description: 'Tax year 2024 scope.' },
    { id: 'tax-year-2025', label: '2025', dimension: 'taxYear', description: 'Tax year 2025 scope.' },
    { id: 'tax-year-2026', label: '2026', dimension: 'taxYear', description: 'Cross-functional tax year close and filing scope.' },
  ],
  workstream: [
    { id: 'fed-state-compliance', label: 'Federal + State Compliance', dimension: 'workstream', description: 'Shared workstream covering return prep, review, and notices.' },
  ],
  investor: [
    { id: 'northlight-pension', label: 'Northlight Pension', dimension: 'investor', description: 'Institutional investor — US tax-exempt trust.' },
    { id: 'meridian-family-office', label: 'Meridian Family Office', dimension: 'investor', description: 'UK-based family office with treaty review.' },
    { id: 'blue-harbor-feeder', label: 'Blue Harbor Feeder', dimension: 'investor', description: 'Cayman Islands feeder SPC.' },
    { id: 'alex-rivera', label: 'Alex Rivera', dimension: 'investor', description: 'Canadian individual investor.' },
  ],
  deal: [],
  entityCategory: [
    { id: 'Fund Vehicle', label: 'Fund Vehicle', dimension: 'entityCategory', description: 'Master funds, feeders, and fund-level vehicles.' },
    { id: 'Holding Company', label: 'Holding Company', dimension: 'entityCategory', description: 'Intermediate holding entities within a deal structure.' },
    { id: 'Blocker', label: 'Blocker', dimension: 'entityCategory', description: 'Corporate blockers used for tax planning.' },
    { id: 'Investment Level', label: 'Investment Level', dimension: 'entityCategory', description: 'Portfolio / investment-level operating entities.' },
    { id: 'Third-Party', label: 'Third-Party', dimension: 'entityCategory', description: 'External entities tracked for context.' },
  ],
};

export const SCOPE_PRESETS: ScopePreset[] = [
  { id: 'brep-ix-2026', label: 'BREP IX / 2026', description: 'BREP IX fund scoped to tax year 2026.', selection: { fundIds: ['blackstone-re-ix'], taxYearIds: ['tax-year-2026'], workstreamIds: [], investorIds: [], dealIds: [], entityCategoryIds: [] } },
  { id: 'brep-ix-all-years', label: 'BREP IX — All Years', description: 'All tax years for BREP IX.', selection: { fundIds: ['blackstone-re-ix'], taxYearIds: [], workstreamIds: [], investorIds: [], dealIds: [], entityCategoryIds: [] } },
  { id: 'compliance-2026', label: 'State Compliance — 2026', description: 'Federal + State Compliance workstream for 2026.', selection: { fundIds: [], taxYearIds: ['tax-year-2026'], workstreamIds: ['fed-state-compliance'], investorIds: [], dealIds: [], entityCategoryIds: [] } },
  { id: 'bip-all-years', label: 'BIP I — All Years', description: 'All tax years for Blackstone Infrastructure Partners I.', selection: { fundIds: ['bip-i'], taxYearIds: [], workstreamIds: [], investorIds: [], dealIds: [], entityCategoryIds: [] } },
  { id: 'everything', label: 'All Funds / All Years', description: 'No scope filter — show everything.', selection: { fundIds: [], taxYearIds: [], workstreamIds: [], investorIds: [], dealIds: [], entityCategoryIds: [] } },
];

function getMostRecentTaxYearId(): string[] {
  const mostRecentTaxYear = SCOPE_DIMENSIONS.taxYear
    .map((option) => ({ option, year: Number.parseInt(option.label, 10) }))
    .filter(({ year }) => Number.isFinite(year))
    .sort((a, b) => b.year - a.year)[0]?.option;

  return mostRecentTaxYear ? [mostRecentTaxYear.id] : [];
}

export const DEFAULT_SCOPE_SELECTION: ScopeSelection = {
  fundIds: [],
  taxYearIds: getMostRecentTaxYearId(),
  workstreamIds: [],
  investorIds: [],
  dealIds: [],
  entityCategoryIds: [],
};

export function matchesScope(recordScopeIds: string[], selection: ScopeSelection): boolean {
  const checks = [selection.fundIds, selection.taxYearIds, selection.workstreamIds, selection.investorIds, selection.dealIds];
  return checks.every(
    (ids) => ids.length === 0 || ids.some((id) => recordScopeIds.includes(id))
  );
}

export function computeScopeLabel(selection: ScopeSelection): string {
  const parts: string[] = [];

  if (selection.fundIds.length === 0) {
    parts.push('All Funds');
  } else if (selection.fundIds.length === 1) {
    const opt = fundsService.getFundScopeDimensionOptions().find((f) => f.id === selection.fundIds[0]);
    parts.push(opt?.label ?? selection.fundIds[0]);
  } else {
    parts.push(`${selection.fundIds.length} Funds`);
  }

  if (selection.taxYearIds.length === 0) {
    parts.push('All Years');
  } else if (selection.taxYearIds.length === 1) {
    const opt = SCOPE_DIMENSIONS.taxYear.find((y) => y.id === selection.taxYearIds[0]);
    parts.push(opt?.label ?? selection.taxYearIds[0]);
  } else {
    parts.push(`${selection.taxYearIds.length} Years`);
  }

  if (selection.workstreamIds.length > 0) {
    if (selection.workstreamIds.length === 1) {
      const opt = SCOPE_DIMENSIONS.workstream.find((w) => w.id === selection.workstreamIds[0]);
      parts.push(opt?.label ?? selection.workstreamIds[0]);
    } else {
      parts.push(`${selection.workstreamIds.length} Workstreams`);
    }
  }

  if (selection.investorIds.length > 0) {
    if (selection.investorIds.length === 1) {
      const opt = SCOPE_DIMENSIONS.investor.find((i) => i.id === selection.investorIds[0]);
      parts.push(opt?.label ?? selection.investorIds[0]);
    } else {
      parts.push(`${selection.investorIds.length} Investors`);
    }
  }

  if (selection.dealIds.length > 0) {
    if (selection.dealIds.length === 1) {
      const opt = dealsService.getDealScopeDimensionOptions().find((d) => d.id === selection.dealIds[0]);
      parts.push(opt?.label ?? selection.dealIds[0]);
    } else {
      parts.push(`${selection.dealIds.length} Deals`);
    }
  }

  if (selection.entityCategoryIds.length > 0) {
    if (selection.entityCategoryIds.length === 1) {
      parts.push(selection.entityCategoryIds[0]);
    } else {
      parts.push(`${selection.entityCategoryIds.length} Entity Types`);
    }
  }

  return parts.join(' / ');
}

export type NavigationTarget = {
  module: string;
  params?: Record<string, string>;
} | null;

export type PlatformContextValue = {
  // New multi-dimensional scope
  scopeDimensions: Record<ScopeDimension, ScopeDimensionOption[]>;
  scopePresets: ScopePreset[];
  scopeSelection: ScopeSelection;
  setScopeSelection: (selection: ScopeSelection) => void;
  scopeLabel: string;

  // Legacy (kept for backward compat during migration)
  scopeOptions: ScopeOption[];
  selectedScope: ScopeOption;
  setSelectedScopeId: (scopeId: string) => void;

  // Navigation
  navigateTo: (module: string, params?: Record<string, string>) => void;
  navigationTarget: NavigationTarget;
  clearNavigationTarget: () => void;
};
