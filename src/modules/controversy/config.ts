import type { SectionConfig } from '../../components/ModulePage/SectionNav';

export type ControversySectionKey =
  | 'summary'
  | 'details'
  | 'timeline'
  | 'entities'
  | 'investors'
  | 'documents'
  | 'rules'
  | 'activity';

export const CONTROVERSY_SECTIONS: SectionConfig[] = [
  { key: 'summary', label: 'Summary' },
  { key: 'details', label: 'Case Details' },
  { key: 'timeline', label: 'Deadlines' },
  { key: 'entities', label: 'Entities' },
  { key: 'investors', label: 'Investors' },
  { key: 'documents', label: 'Documents' },
  { key: 'rules', label: 'Rules' },
  { key: 'activity', label: 'Activity' },
];

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export const CONTROVERSY_FILTERS: FilterConfig[] = [
  { key: 'status', label: 'Status', options: ['All statuses', 'Open', 'In Progress', 'Pending Response', 'Resolved', 'Closed'] },
  { key: 'category', label: 'Category', options: ['All categories', 'Notice', 'Audit', 'Exam', 'Appeal'] },
];
