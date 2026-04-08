import { memo } from 'react';
import type { UserGroup } from '../types';
import styles from '../AdminModule.module.css';

type Props = {
  group: UserGroup;
  onOpen: (id: string) => void;
};

export const GroupCard = memo(function GroupCard({ group, onOpen }: Props) {
  return (
    <button className={styles.groupCard} onClick={() => onOpen(group.id)} type="button">
      <div className={styles.groupCardHeader}>
        <h3 className={styles.groupCardTitle}>{group.name}</h3>
        <span className={`${styles.groupPill} ${group.type === 'role' ? styles.pillRole : styles.pillFund}`}>
          {group.type === 'role' ? 'Role' : 'Fund Access'}
        </span>
      </div>
      <p className={styles.groupCardDesc}>{group.description}</p>
      <div className={styles.groupCardMeta}>
        <span className={styles.memberCount}>{group.memberIds.length} members</span>
        {group.fundIds.length > 0 && (
          <span className={styles.memberCount}>{group.fundIds.length} fund(s)</span>
        )}
      </div>
    </button>
  );
});
