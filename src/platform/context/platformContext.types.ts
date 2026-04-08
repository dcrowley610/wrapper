import { fundsService } from '../../modules/home/services/funds.service';

// --- Legacy types (kept temporarily for backward compat) ---
export type ScopeKind = 'fund' | 'legalEntity' | 'taxYear' | 'workstream';

export type ScopeOption = {
  id: string;
  label: string;
  kind: ScopeKind;
  description: string;
};

export const MOCK_SCOPE_OPTIONS: ScopeOption[] = [
  {
    id: 'atlas-master-fund',
    label: 'Atlas Master Fund',
    kind: 'fund',
    description: 'Primary master fund for 2026 tax orchestration.',
  },
  {
    id: 'atlas-blocker-lux',
    label: 'Atlas Blocker Lux',
    kind: 'legalEntity',
    description: 'Lux blocker entity with active structure and compliance tasks.',
  },
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
  {
    id: 'brep-ix',
    label: 'BREP IX',
    kind: 'fund',
    description: 'Blackstone Real Estate Partners IX fund scope.',
  },
  {
    id: 'brep-x',
    label: 'BREP X',
    kind: 'fund',
    description: 'Blackstone Real Estate Partners X fund scope.',
  },
];

// --- New multi-dimensional scope types ---

export type ScopeDimension = 'fund' | 'taxYear' | 'workstream' | 'investor';

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
};

export type ScopePreset = {
  id: string;
  label: string;
  description: string;
  selection: ScopeSelection;
};

export const SCOPE_DIMENSIONS: Record<ScopeDimension, ScopeDimensionOption[]> = {
  fund: [
    { id: 'atlas-master-fund', label: 'Atlas Master Fund', dimension: 'fund', description: 'Primary master fund for 2026 tax orchestration.' },
    { id: 'atlas-blocker-lux', label: 'Atlas Blocker Lux', dimension: 'fund', description: 'Lux blocker entity with active structure and compliance tasks.' },
    { id: 'brep-ix', label: 'BREP IX', dimension: 'fund', description: 'Blackstone Real Estate Partners IX fund scope.' },
    { id: 'brep-x', label: 'BREP X', dimension: 'fund', description: 'Blackstone Real Estate Partners X fund scope.' },
  ],
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
};

export const SCOPE_PRESETS: ScopePreset[] = [
  { id: 'brep-ix-2026', label: 'BREP IX / 2026', description: 'BREP IX fund scoped to tax year 2026.', selection: { fundIds: ['brep-ix'], taxYearIds: ['tax-year-2026'], workstreamIds: [], investorIds: [] } },
  { id: 'brep-ix-all-years', label: 'BREP IX — All Years', description: 'All tax years for BREP IX.', selection: { fundIds: ['brep-ix'], taxYearIds: [], workstreamIds: [], investorIds: [] } },
  { id: 'compliance-2026', label: 'State Compliance — 2026', description: 'Federal + State Compliance workstream for 2026.', selection: { fundIds: [], taxYearIds: ['tax-year-2026'], workstreamIds: ['fed-state-compliance'], investorIds: [] } },
  { id: 'all-blockers', label: 'All Blockers — All Years', description: 'Atlas Blocker Lux across all tax years.', selection: { fundIds: ['atlas-blocker-lux'], taxYearIds: [], workstreamIds: [], investorIds: [] } },
  { id: 'everything', label: 'All Funds / All Years', description: 'No scope filter — show everything.', selection: { fundIds: [], taxYearIds: [], workstreamIds: [], investorIds: [] } },
];

export const DEFAULT_SCOPE_SELECTION: ScopeSelection = {
  fundIds: ['atlas-master-fund'],
  taxYearIds: ['tax-year-2026'],
  workstreamIds: [],
  investorIds: [],
};

export function matchesScope(recordScopeIds: string[], selection: ScopeSelection): boolean {
  const checks = [selection.fundIds, selection.taxYearIds, selection.workstreamIds, selection.investorIds];
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
