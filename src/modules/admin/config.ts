import type { SectionConfig } from '../../components/ModulePage/SectionNav';

export type AdminSectionKey = 'users' | 'groups';

export const ADMIN_SECTIONS: SectionConfig[] = [
  { key: 'users', label: 'Users' },
  { key: 'groups', label: 'Groups' },
];
