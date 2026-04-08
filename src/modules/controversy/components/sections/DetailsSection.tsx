import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function DetailsSection({ record }: { record: ControversyRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Case details</h2>
      <p className={styles.sectionCopy}>
        Issuing authority, issue classification, scope, and statute information.
      </p>
      <dl className={styles.definitionList}>
        <dt>Category</dt>
        <dd>{record.category}</dd>
        <dt>Issuing Authority</dt>
        <dd>{record.issuingAuthority}</dd>
        <dt>Issue Type</dt>
        <dd>{record.issueType}</dd>
        <dt>Amount at Issue</dt>
        <dd>{record.amountAtIssue}</dd>
        <dt>Notice Date</dt>
        <dd>{record.noticeDate}</dd>
        <dt>Response Deadline</dt>
        <dd>{record.responseDeadline}</dd>
        <dt>Statute of Limitations</dt>
        <dd>{record.statuteOfLimitations}</dd>
        <dt>Assigned To</dt>
        <dd>{record.assignedTo}</dd>
        <dt>Assigned Team</dt>
        <dd>{record.assignedTeam}</dd>
      </dl>
      {record.taxYearsAffected.length > 0 && (
        <>
          <h3 className={styles.sidePanelTitle} style={{ marginTop: 18 }}>
            Tax Years Affected
          </h3>
          <div className={styles.pillRow}>
            {record.taxYearsAffected.map((year) => (
              <span key={year} className={styles.pill}>{year}</span>
            ))}
          </div>
        </>
      )}
      {record.notes && (
        <div className={styles.notesBlock} style={{ marginTop: 18 }}>
          <strong>Notes:</strong> {record.notes}
        </div>
      )}
    </>
  );
}
