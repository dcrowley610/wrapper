import type { RecordComment } from '../../../types/comment';

export type DealStatus = 'Active' | 'Pending Review' | 'Closed';

export type InvestmentType = 'Equity' | 'Debt' | 'Real Estate' | 'Fund of Funds' | 'Infrastructure';

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

export type DealRecord = {
  id: string;
  name: string;
  owner: string;
  investmentType: InvestmentType;
  taxableIncome: string;
  taxYear: string;
  status: DealStatus;
  linkedEntityIds: string[];
  scopeIds: string[];
  requestCount: number;
  documentCount: number;
  openQuestions: number;
  lastReviewDate: string;
  notes: string;
  closingDate: string;
  currency: string;
  geographicFocus: string;
  sector: string;
  activityLog: ActivityEntry[];
  context: RecordContext;
  comments: RecordComment[];
};
