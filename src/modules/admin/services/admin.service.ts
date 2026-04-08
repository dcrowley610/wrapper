import type { PlatformUser, UserGroup, GroupType } from '../types';

let _version = 0;

let GROUPS: UserGroup[] = [
  // Fund-access groups
  {
    id: 'fund-atlas-master',
    name: 'Atlas Master Fund Access',
    type: 'fund-access',
    description: 'Grants access to Atlas Master Fund entities, deals, and documents.',
    fundIds: ['atlas-master-fund'],
    roleLabel: null,
    memberIds: ['sarah-chen', 'james-park', 'maria-lopez', 'tom-harris'],
  },
  {
    id: 'fund-atlas-blocker',
    name: 'Atlas Blocker Lux Access',
    type: 'fund-access',
    description: 'Grants access to Atlas Blocker Lux entities, deals, and documents.',
    fundIds: ['atlas-blocker-lux'],
    roleLabel: null,
    memberIds: ['david-kim', 'sarah-chen', 'lisa-wong'],
  },
  {
    id: 'fund-brep-ix',
    name: 'BREP IX Access',
    type: 'fund-access',
    description: 'Grants access to BREP IX fund entities, deals, and documents.',
    fundIds: ['brep-ix'],
    roleLabel: null,
    memberIds: ['sarah-chen', 'james-park', 'rachel-nguyen'],
  },
  {
    id: 'fund-brep-x',
    name: 'BREP X Access',
    type: 'fund-access',
    description: 'Grants access to BREP X fund entities, deals, and documents.',
    fundIds: ['brep-x'],
    roleLabel: null,
    memberIds: ['james-park', 'rachel-nguyen'],
  },

  // Role groups
  {
    id: 'role-service-provider',
    name: 'Service Provider',
    type: 'role',
    description: 'External tax, legal, and audit service providers with limited platform access.',
    fundIds: [],
    roleLabel: 'Service Provider',
    memberIds: ['tom-harris', 'lisa-wong', 'mark-davidson'],
  },
  {
    id: 'role-real-estate',
    name: 'Real Estate',
    type: 'role',
    description: 'Real estate investment team members across all fund families.',
    fundIds: [],
    roleLabel: 'Real Estate',
    memberIds: ['sarah-chen', 'rachel-nguyen'],
  },
  {
    id: 'role-private-equity',
    name: 'Private Equity',
    type: 'role',
    description: 'Private equity investment team members.',
    fundIds: [],
    roleLabel: 'Private Equity',
    memberIds: ['james-park', 'maria-lopez'],
  },
  {
    id: 'role-infrastructure',
    name: 'Infrastructure',
    type: 'role',
    description: 'Infrastructure investment team members.',
    fundIds: [],
    roleLabel: 'Infrastructure',
    memberIds: ['david-kim', 'james-park'],
  },
];

let USERS: PlatformUser[] = [
  {
    id: 'sarah-chen',
    name: 'Sarah Chen',
    email: 'sarah.chen@platform.com',
    title: 'Senior Tax Manager',
    status: 'Active',
    groupIds: ['fund-atlas-master', 'fund-atlas-blocker', 'fund-brep-ix', 'role-real-estate'],
  },
  {
    id: 'james-park',
    name: 'James Park',
    email: 'james.park@platform.com',
    title: 'Tax Director',
    status: 'Active',
    groupIds: ['fund-atlas-master', 'fund-brep-ix', 'fund-brep-x', 'role-private-equity', 'role-infrastructure'],
  },
  {
    id: 'david-kim',
    name: 'David Kim',
    email: 'david.kim@platform.com',
    title: 'International Tax Analyst',
    status: 'Active',
    groupIds: ['fund-atlas-blocker', 'role-infrastructure'],
  },
  {
    id: 'maria-lopez',
    name: 'Maria Lopez',
    email: 'maria.lopez@platform.com',
    title: 'Tax Operations Lead',
    status: 'Active',
    groupIds: ['fund-atlas-master', 'role-private-equity'],
  },
  {
    id: 'tom-harris',
    name: 'Tom Harris',
    email: 'tom.harris@deloitte.com',
    title: 'Tax Partner — Deloitte',
    status: 'Active',
    groupIds: ['fund-atlas-master', 'role-service-provider'],
  },
  {
    id: 'lisa-wong',
    name: 'Lisa Wong',
    email: 'lisa.wong@pwc.com',
    title: 'Senior Manager — PwC',
    status: 'Active',
    groupIds: ['fund-atlas-blocker', 'role-service-provider'],
  },
  {
    id: 'mark-davidson',
    name: 'Mark Davidson',
    email: 'mark.davidson@ey.com',
    title: 'Director — EY',
    status: 'Inactive',
    groupIds: ['role-service-provider'],
  },
  {
    id: 'rachel-nguyen',
    name: 'Rachel Nguyen',
    email: 'rachel.nguyen@platform.com',
    title: 'Real Estate Tax Analyst',
    status: 'Active',
    groupIds: ['fund-brep-ix', 'fund-brep-x', 'role-real-estate'],
  },
];

export const adminService = {
  getUsers(): PlatformUser[] {
    return USERS;
  },

  getUserById(id: string): PlatformUser | undefined {
    return USERS.find((u) => u.id === id);
  },

  getGroups(): UserGroup[] {
    return GROUPS;
  },

  getGroupById(id: string): UserGroup | undefined {
    return GROUPS.find((g) => g.id === id);
  },

  getGroupsByType(type: GroupType): UserGroup[] {
    return GROUPS.filter((g) => g.type === type);
  },

  getUsersByGroup(groupId: string): PlatformUser[] {
    const group = GROUPS.find((g) => g.id === groupId);
    if (!group) return [];
    return USERS.filter((u) => group.memberIds.includes(u.id));
  },

  getGroupsForUser(userId: string): UserGroup[] {
    const user = USERS.find((u) => u.id === userId);
    if (!user) return [];
    return GROUPS.filter((g) => user.groupIds.includes(g.id));
  },

  getVersion(): number {
    return _version;
  },

  updateUser(id: string, updates: Partial<Omit<PlatformUser, 'id'>>): void {
    USERS = USERS.map((u) => (u.id === id ? { ...u, ...updates } : u));
    _version++;
  },

  updateGroup(id: string, updates: Partial<Omit<UserGroup, 'id' | 'type' | 'roleLabel'>>): void {
    GROUPS = GROUPS.map((g) => (g.id === id ? { ...g, ...updates } : g));
    _version++;
  },

  setUserGroups(userId: string, groupIds: string[]): void {
    // Update user's groupIds
    USERS = USERS.map((u) => (u.id === userId ? { ...u, groupIds: [...groupIds] } : u));
    // Sync group memberIds
    GROUPS = GROUPS.map((g) => {
      const shouldInclude = groupIds.includes(g.id);
      const currentlyIncludes = g.memberIds.includes(userId);
      if (shouldInclude && !currentlyIncludes) {
        return { ...g, memberIds: [...g.memberIds, userId] };
      }
      if (!shouldInclude && currentlyIncludes) {
        return { ...g, memberIds: g.memberIds.filter((mid) => mid !== userId) };
      }
      return g;
    });
    _version++;
  },

  setGroupMembers(groupId: string, memberIds: string[]): void {
    // Update group's memberIds
    GROUPS = GROUPS.map((g) => (g.id === groupId ? { ...g, memberIds: [...memberIds] } : g));
    // Sync user groupIds
    USERS = USERS.map((u) => {
      const shouldInclude = memberIds.includes(u.id);
      const currentlyIncludes = u.groupIds.includes(groupId);
      if (shouldInclude && !currentlyIncludes) {
        return { ...u, groupIds: [...u.groupIds, groupId] };
      }
      if (!shouldInclude && currentlyIncludes) {
        return { ...u, groupIds: u.groupIds.filter((gid) => gid !== groupId) };
      }
      return u;
    });
    _version++;
  },
};
