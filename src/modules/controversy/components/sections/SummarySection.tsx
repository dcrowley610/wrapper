import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function SummarySection({ record }: { record: ControversyRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Case summary</h2>
      <p className={styles.sectionCopy}>
        Overview of this controversy matter, key metrics, and current posture.
      </p>
      <div className={styles.metricsRow}>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{record.amountAtIssue}</p>
          <p className={styles.miniMetricLabel}>Amount at Issue</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{record.documentCount}</p>
          <p className={styles.miniMetricLabel}>Documents</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{record.openQuestions}</p>
          <p className={styles.miniMetricLabel}>Open Questions</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{record.responseDeadline}</p>
          <p className={styles.miniMetricLabel}>Response Deadline</p>
        </div>
      </div>
      <div className={styles.notesBlock}>{record.summary}</div>
      <div className={styles.ownerCallout}>Assigned: {record.assignedTo} ({record.assignedTeam})</div>
    </>
  );
}
