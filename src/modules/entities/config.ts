import type { SectionConfig } from '../../components/ModulePage/SectionNav';

export type EntitySectionKey =
  | 'overview'
  | 'structure'
  | 'documents'
  | 'requests'
  | 'tax';

export const ENTITY_SECTIONS: SectionConfig[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'structure', label: 'Ownership / Structure' },
  { key: 'documents', label: 'Documents' },
  { key: 'requests', label: 'Workflow / Requests' },
  { key: 'tax', label: 'Tax Attributes / Rules' },
];

export type FilterConfig = {
  key: string;
  label: string;
  options: string[];
};

export const ENTITY_FILTERS: FilterConfig[] = [
  { key: 'status', label: 'Status', options: ['All statuses', 'Active', 'Pending Review', 'Inactive'] },
  { key: 'category', label: 'Category', options: ['All categories', 'Fund Vehicle', 'Blocker', 'Operating Company', 'Holding Company', 'Third-Party'] },
];
