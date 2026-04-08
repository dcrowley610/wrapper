import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

export function ActivitySection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Activity</h2>
      <p className={styles.sectionCopy}>
        Operational timeline for work performed across requests, document updates, reviews, and workflow events.
      </p>
      <div className={styles.activityTimeline}>
        {entity.activityLog.map((entry, i) => (
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
