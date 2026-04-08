import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services';
import { GroupCard } from '../GroupCard';
import styles from '../../AdminModule.module.css';

export function GroupListSection() {
  const navigate = useNavigate();
  const fundGroups = adminService.getGroupsByType('fund-access');
  const roleGroups = adminService.getGroupsByType('role');

  function handleOpen(id: string) {
    navigate(`/admin/groups/${id}`);
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Groups</h2>
      <p className={styles.sectionCopy}>
        Fund-level access groups control which funds a user can see. Role groups classify users by function.
      </p>

      <div className={styles.groupSection}>
        <div className={styles.groupSectionLabel}>Fund Access Groups</div>
        <div className={styles.groupGrid}>
          {fundGroups.map((g) => (
            <GroupCard key={g.id} group={g} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      <div className={styles.groupSection}>
        <div className={styles.groupSectionLabel}>Role Groups</div>
        <div className={styles.groupGrid}>
          {roleGroups.map((g) => (
            <GroupCard key={g.id} group={g} onOpen={handleOpen} />
          ))}
        </div>
      </div>
    </>
  );
}
