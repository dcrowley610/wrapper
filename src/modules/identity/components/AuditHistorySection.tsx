import type { ReconciliationActionHistory } from '../types';
import styles from '../IdentityModule.module.css';

type AuditHistorySectionProps = {
  history: ReconciliationActionHistory[];
};

export function AuditHistorySection({ history }: AuditHistorySectionProps) {
  if (history.length === 0) return null;

  return (
    <div>
      <h3 className={styles.sectionTitle}>Audit History</h3>
      <div className={styles.timeline}>
        {history.map((entry) => (
          <div key={entry.id} className={styles.timelineEntry}>
            <p className={styles.timelineDate}>
              {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString()}
            </p>
            <p className={styles.timelineAction}>{entry.description}</p>
            <p className={styles.timelineActor}>{entry.actor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
