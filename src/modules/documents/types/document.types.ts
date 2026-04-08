export type DocumentType = 'PDF' | 'Excel';
export type DocumentStatus = 'Pending Review' | 'In Review' | 'Reviewed' | 'Flagged';
export type FieldStatus = 'pending' | 'confirmed' | 'overridden';

export type ExtractedField = {
  id: string;
  label: string;
  extractedValue: string;
  confirmedValue: string | null;
  status: FieldStatus;
  confidence: number;
  overrideExplanation: string | null;
};

export type LinkedEntity = {
  entityId: string;
  entityName: string;
  entityType: string;
  linkedDate: string;
};

export type TriggeredRule = {
  ruleId: string;
  ruleName: string;
  description: string;
  severity: 'info' | 'warning' | 'error';
  fieldId: string | null;
};

export type DocumentComment = {
  id: string;
  author: string;
  text: string;
  timestamp: string;
  fieldId: string | null;
};

export type DocumentRecord = {
  id: string;
  title: string;
  fileName: string;
  documentType: DocumentType;
  status: DocumentStatus;
  category: string;
  entityName: string;
  entityId: string;
  uploadedBy: string;
  uploadDate: string;
  taxYear: string;
  scopeIds: string[];
  extractedFields: ExtractedField[];
  linkedEntities: LinkedEntity[];
  triggeredRules: TriggeredRule[];
  comments: DocumentComment[];
};
