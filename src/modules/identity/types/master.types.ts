export type MasterDomain = 'entity' | 'investor' | 'deal';
export type MasterStatus = 'active' | 'merged' | 'inactive';

export type MasterRecordBase = {
  id: string;
  domain: MasterDomain;
  canonicalName: string;
  normalizedName: string;
  status: MasterStatus;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  scopeIds: string[];
};

export type MasterEntity = MasterRecordBase & {
  domain: 'entity';
  legalName: string;
  jurisdiction: string;
  ein: string;
  category: string;
  taxClassification: string;
};

export type MasterInvestor = MasterRecordBase & {
  domain: 'investor';
  legalName: string;
  investorClass: string;
  domicile: string;
  taxIdType: string;
  taxIdLast4: string;
};

export type MasterDeal = MasterRecordBase & {
  domain: 'deal';
  investmentType: string;
  sector: string;
  geographicFocus: string;
  closingDate: string;
};

export type MasterRecord = MasterEntity | MasterInvestor | MasterDeal;
