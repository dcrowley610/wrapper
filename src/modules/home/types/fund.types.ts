import type { RecordComment } from '../../../types/comment';

export type FundFamily = {
  id: string;
  name: string;
  description: string;
  comments: RecordComment[];
};

export type Fund = {
  id: string;
  name: string;
  fundFamilyId: string;
  scopeId: string;
  entityCount: number;
  dealCount: number;
  comments: RecordComment[];
};
