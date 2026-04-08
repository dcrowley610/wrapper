import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function InvestorsSection({ record }: { record: ControversyRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Linked investors</h2>
      <p className={styles.sectionCopy}>
        Investors affected by or relevant to this controversy matter.
      </p>
      {record.linkedInvestors.length > 0 ? (
        <div className={styles.linkedList}>
          {record.linkedInvestors.map((investor) => (
            <div key={investor.id} className={styles.linkedCard}>
              <div>
                <p className={styles.linkedName}>{investor.label}</p>
                <p className={styles.linkedMeta}>Investor record</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No investors linked to this matter.</div>
      )}
    </>
  );
}
