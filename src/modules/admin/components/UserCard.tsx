import { memo } from 'react';
import type { PlatformUser } from '../types';
import { adminService } from '../services';
import styles from '../AdminModule.module.css';

type Props = {
  user: PlatformUser;
  onOpen: (id: string) => void;
};

export const UserCard = memo(function UserCard({ user, onOpen }: Props) {
  const groups = adminService.getGroupsForUser(user.id);

  return (
    <tr className={styles.tableRow} onClick={() => onOpen(user.id)}>
      <td>
        <div className={styles.userName}>{user.name}</div>
        <div className={styles.userEmail}>{user.email}</div>
      </td>
      <td>{user.title}</td>
      <td>
        <span className={`${styles.statusPill} ${user.status === 'Inactive' ? styles.statusInactive : ''}`}>
          {user.status}
        </span>
      </td>
      <td>
        <div className={styles.groupPills}>
          {groups.map((g) => (
            <span
              key={g.id}
              className={`${styles.groupPill} ${g.type === 'role' ? styles.pillRole : styles.pillFund}`}
            >
              {g.type === 'role' ? g.roleLabel : g.name.replace(' Access', '')}
            </span>
          ))}
        </div>
      </td>
    </tr>
  );
});
