import type { SectionConfig } from '../../components/ModulePage/SectionNav';

export type InvestorSectionKey =
  | 'overview'
  | 'demographics'
  | 'withholding'
  | 'questions'
  | 'requests'
  | 'documents'
  | 'rules'
  | 'review'
  | 'activity';

export const INVESTOR_SECTIONS: SectionConfig[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'demographics', label: 'Demographics' },
  { key: 'withholding', label: 'Withholding' },
  { key: 'questions', label: 'Questions' },
  { key: 'requests', label: 'Requests' },
  { key: 'documents', label: 'Documents' },
  { key: 'rules', label: 'Rules' },
  { key: 'review', label: 'Review' },
  { key: 'activity', label: 'Activity' },
];

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export const INVESTOR_FILTERS: FilterConfig[] = [
  { key: 'status', label: 'Status', options: ['All statuses', 'Active', 'Watchlist', 'Offboarded'] },
  { key: 'class', label: 'Class', options: ['All classes', 'Institutional', 'Family Office', 'Individual', 'Feeder'] },
];
