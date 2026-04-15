import type { RecordComment } from '../../../types/comment';

export type FundFamily = {
  id: string;
  name: string;
  shortName: string;
  description: string;
  comments: RecordComment[];
};

export type Fund = {
  id: string;
  name: string;
  shortNameFund: string;
  fundFamilyId: string;
  scopeId: string;
  comments: RecordComment[];
};
