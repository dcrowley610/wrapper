export type ListViewProfile = {
  defaultColumns?: string[];
  hiddenColumns?: string[];
  defaultFilters?: Record<string, string>;
};

export type DealListProfile = ListViewProfile & {
  terminology?: {
    deal?: string;
    dealPlural?: string;
  };
};

export type EntityListProfile = ListViewProfile & {
  categoryOrder?: string[];
};

export type FundViewProfile = {
  dealList?: DealListProfile;
  entityList?: EntityListProfile;
  investorList?: ListViewProfile;
  requestList?: ListViewProfile;
};

const FUND_VIEW_PROFILES: Record<string, FundViewProfile> = {
  'blackstone-re-ix': {
    dealList: {
      defaultColumns: ['name', 'sector', 'geographicFocus', 'closingDate', 'taxableIncome', 'status'],
      hiddenColumns: ['currency'],
      terminology: {
        deal: 'asset',
        dealPlural: 'assets',
      },
    },
    entityList: {
      categoryOrder: ['Investment Level', 'Holding Company', 'Blocker', 'Fund Vehicle', 'Third-Party'],
    },
  },

  'bip-i': {
    dealList: {
      defaultColumns: ['name', 'investmentType', 'sector', 'geographicFocus', 'taxableIncome', 'status'],
      defaultFilters: {
        status: 'Active',
      },
    },
  },
};

export function getFundViewProfile(fundId: string): FundViewProfile | undefined {
  return FUND_VIEW_PROFILES[fundId];
}
