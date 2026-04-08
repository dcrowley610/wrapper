import type { SectionConfig } from '../../components/ModulePage/SectionNav';

export type DocumentSectionKey = 'fields' | 'entities' | 'rules' | 'comments';

export const DOCUMENT_SECTIONS: SectionConfig[] = [
  { key: 'fields', label: 'Extracted Fields' },
  { key: 'entities', label: 'Linked Entities' },
  { key: 'rules', label: 'Rules Triggered' },
  { key: 'comments', label: 'Comments' },
];

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export const DOCUMENT_FILTERS: FilterConfig[] = [
  { key: 'status', label: 'Status', options: ['All statuses', 'Pending Review', 'In Review', 'Reviewed', 'Flagged'] },
  { key: 'category', label: 'Category', options: ['All categories', 'K-1', 'W-8BEN', 'Notice', 'Allocation'] },
  { key: 'documentType', label: 'Type', options: ['All types', 'PDF', 'Excel'] },
];
