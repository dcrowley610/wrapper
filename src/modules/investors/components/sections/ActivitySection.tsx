import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

export function ActivitySection({ investor }: { investor: InvestorRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Activity</h2>
      <p className={styles.sectionCopy}>
        Operational history across investor communications, requests, documents, and review actions.
      </p>
      <div className={styles.activityTimeline}>
        {investor.activityLog.map((entry, i) => (
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
