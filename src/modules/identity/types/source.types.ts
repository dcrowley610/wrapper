import type { MasterDomain } from './master.types';
import type { NormalizationResult } from './normalization.types';

export type SourceSystem = 'csv_import' | 'document_extraction' | 'manual_entry';
export type SourceRecordStatus = 'pending' | 'matched' | 'new_master_created' | 'rejected';

export type SourceObjectRecord = {
  id: string;
  domain: MasterDomain;
  sourceSystem: SourceSystem;
  sourceFileName: string;
  sourceRowIndex: number;
  rawName: string;
  rawAttributes: Record<string, string>;
  normalizedResult: NormalizationResult | null;
  status: SourceRecordStatus;
  ingestedDate: string;
  ingestedBy: string;
};

export type ObjectAlias = {
  id: string;
  masterId: string;
  domain: MasterDomain;
  aliasName: string;
  normalizedAliasName: string;
  source: string;
  createdDate: string;
  createdBy: string;
  isActive: boolean;
};

export type XwalkStatus = 'approved' | 'pending' | 'expired' | 'rejected';

export type ObjectXwalk = {
  id: string;
  sourceRecordId: string;
  masterId: string;
  domain: MasterDomain;
  status: XwalkStatus;
  approvedDate: string;
  approvedBy: string;
  expiredDate: string;
  createdDate: string;
};
