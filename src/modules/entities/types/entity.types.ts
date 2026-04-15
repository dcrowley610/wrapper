import type { RecordComment } from '../../../types/comment';

export type EntityStatus = 'Active' | 'Pending Review' | 'Inactive';
export type EntityCategory = 'Fund Vehicle' | 'Blocker' | 'Operating Company' | 'Holding Company' | 'Third-Party';

export type ActivityEntry = {
  date: string;
  action: string;
  actor: string;
};

export type RecordContext = {
  fundFamilyLabel: string;
  fundLabel: string;
  parentContextLabel?: string;
};

export type EntityRecord = {
  id: string;
  name: string;
  legalName: string;
  category: EntityCategory;
  jurisdiction: string;
  status: EntityStatus;
  taxClassification: string;
  ownerTeam: string;
  scopeIds: string[];
  associatedFundIds: string[];
  associatedDealIds: string[];
  structureSummary: string;
  requestCount: number;
  documentCount: number;
  openQuestions: number;
  lastReviewDate: string;
  notes: string;
  ein: string;
  dateFormed: string;
  fiscalYearEnd: string;
  registeredAgent: string;
  address: string;
  checkTheBoxElection: string;
  treatyCountry: string;
  fatcaStatus: string;
  stateFilingJurisdictions: string[];
  structureRole: string;
  formationType: string;
  functionalCurrency: string;
  taxReportingStatus: string;
  annualRevenue: string;
  activityLog: ActivityEntry[];
  comments: RecordComment[];
  context: RecordContext;
};
