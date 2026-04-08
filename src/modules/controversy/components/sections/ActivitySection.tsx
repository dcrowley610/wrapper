import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function ActivitySection({ record }: { record: ControversyRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Activity</h2>
      <p className={styles.sectionCopy}>
        Chronological record of actions, communications, and milestones for this matter.
      </p>
      <div className={styles.activityTimeline}>
        {record.activityLog.map((entry, i) => (
          <div key={i} className={styles.activityEntry}>
            <div className={styles.activityDate}>{entry.date}</div>
            <div className={styles.activityAction}>{entry.action}</div>
            <div className={styles.activityActor}>{entry.actor}</div>
          </div>
        ))}
      </div>
    </>
  );
}
