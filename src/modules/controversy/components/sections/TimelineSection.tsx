import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function TimelineSection({ record }: { record: ControversyRecord }) {
  const now = new Date();
  const deadline = new Date(record.responseDeadline);
  const daysUntilDeadline = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isUrgent = daysUntilDeadline <= 30 && daysUntilDeadline > 0;
  const isPast = daysUntilDeadline < 0;

  return (
    <>
      <h2 className={styles.sectionTitle}>Deadlines &amp; milestones</h2>
      <p className={styles.sectionCopy}>
        Key dates, response windows, and statute tracking for this matter.
      </p>
      <div className={styles.deadlineCard}>
        <div className={styles.deadlineHeader}>
          <span className={styles.deadlineLabel}>Response Deadline</span>
          {isUrgent && <span className={styles.warningBadge}>{daysUntilDeadline} days remaining</span>}
          {isPast && <span className={styles.dangerBadge}>Past due</span>}
        </div>
        <p className={styles.deadlineDate}>{record.responseDeadline}</p>
      </div>
      <dl className={styles.definitionList}>
        <dt>Notice Received</dt>
        <dd>{record.noticeDate}</dd>
        <dt>Response Deadline</dt>
        <dd>{record.responseDeadline}</dd>
        <dt>Statute of Limitations</dt>
        <dd>{record.statuteOfLimitations}</dd>
        <dt>Last Activity</dt>
        <dd>{record.lastActivityDate}</dd>
      </dl>
    </>
  );
}
