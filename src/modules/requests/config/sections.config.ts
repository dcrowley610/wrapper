import type { SectionConfig } from '../../../components/ModulePage/SectionNav';

export type RequestSectionKey =
  | 'overview'
  | 'template'
  | 'recurrence'
  | 'documents'
  | 'deliverables'
  | 'entities'
  | 'execution'
  | 'process'
  | 'activity';

export const REQUEST_SECTIONS: SectionConfig[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'template', label: 'Template' },
  { key: 'recurrence', label: 'Recurrence' },
  { key: 'documents', label: 'Documents' },
  { key: 'deliverables', label: 'Deliverables' },
  { key: 'entities', label: 'Linked' },
  { key: 'execution', label: 'Execution' },
  { key: 'process', label: 'Process' },
  { key: 'activity', label: 'Activity' },
];

export type RequestProcessSectionKey = 'overview' | 'defaults' | 'history';

/** Backward-compat alias */
export type RequestTypeSectionKey = RequestProcessSectionKey;

export const REQUEST_PROCESS_SECTIONS: SectionConfig[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'defaults', label: 'Defaults' },
  { key: 'history', label: 'Instance History' },
];

/** Backward-compat alias */
export const REQUEST_TYPE_SECTIONS = REQUEST_PROCESS_SECTIONS;
