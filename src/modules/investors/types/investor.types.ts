import type { RecordComment } from '../../../types/comment';

export type InvestorStatus = 'Active' | 'Watchlist' | 'Offboarded';
export type InvestorClass = 'Institutional' | 'Family Office' | 'Individual' | 'Feeder';

export type OpenQuestion = {
  id: string;
  question: string;
  askedDate: string;
  status: 'Open' | 'Answered' | 'Escalated';
};

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

export type InvestorRecord = {
  id: string;
  name: string;
  investorClass: InvestorClass;
  domicile: string;
  status: InvestorStatus;
  withholdingProfile: string;
  serviceTeam: string;
  scopeIds: string[];
  commitment: string;
  openQuestions: number;
  requestCount: number;
  lastActivityDate: string;
  notes: string;
  legalName: string;
  contactName: string;
  contactEmail: string;
  taxIdType: string;
  taxIdLast4: string;
  entityType: string;
  withholdingRate: string;
  w8FormType: string;
  w8ExpirationDate: string;
  treatyClaimCountry: string;
  chapter3Status: string;
  chapter4Status: string;
  openQuestionsList: OpenQuestion[];
  activityLog: ActivityEntry[];
  documentCount: number;
  lastReviewDate: string;
  capitalAccount: string;
  ownershipPercentage: string;
  investorType: string;
  allocationPercentage: string;
  taxExempt: string;
  kycStatus: string;
  context: RecordContext;
  comments: RecordComment[];
};
