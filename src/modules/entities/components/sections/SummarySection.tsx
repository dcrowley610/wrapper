import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

export function SummarySection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Entity summary</h2>
      <p className={styles.sectionCopy}>
        A concise workspace overview for owner team, classification, open work, and filing posture.
      </p>
      <div className={styles.metricsRow}>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{entity.requestCount}</p>
          <p className={styles.miniMetricLabel}>Requests</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{entity.documentCount}</p>
          <p className={styles.miniMetricLabel}>Documents</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{entity.openQuestions}</p>
          <p className={styles.miniMetricLabel}>Open Questions</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{entity.lastReviewDate}</p>
          <p className={styles.miniMetricLabel}>Last Review</p>
        </div>
      </div>
      <div className={styles.notesBlock}>{entity.notes}</div>
      <div className={styles.ownerCallout}>Owner Team: {entity.ownerTeam}</div>
    </>
  );
}
