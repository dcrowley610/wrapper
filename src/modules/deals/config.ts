import type { SectionConfig } from '../../components/ModulePage/SectionNav';

export type DealSectionKey = 'overview' | 'entities';

export const DEAL_SECTIONS: SectionConfig[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'entities', label: 'Linked' },
];

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export const DEAL_FILTERS: FilterConfig[] = [
  { key: 'status', label: 'Status', options: ['All statuses', 'Active', 'Pending Review', 'Closed'] },
  { key: 'investmentType', label: 'Investment Type', options: ['All types', 'Equity', 'Debt', 'Real Estate', 'Fund of Funds', 'Infrastructure'] },
];
