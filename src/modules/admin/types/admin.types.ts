export type GroupType = 'fund-access' | 'role';

export type RoleLabel = 'Service Provider' | 'Real Estate' | 'Private Equity' | 'Infrastructure';

export type UserGroup = {
  id: string;
  name: string;
  type: GroupType;
  description: string;
  fundIds: string[];
  roleLabel: RoleLabel | null;
  memberIds: string[];
};

export type UserStatus = 'Active' | 'Inactive';

export type PlatformUser = {
  id: string;
  name: string;
  email: string;
  title: string;
  status: UserStatus;
  groupIds: string[];
};
