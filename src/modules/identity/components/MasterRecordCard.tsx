import type { MasterRecord } from '../types';
import styles from '../IdentityModule.module.css';

type MasterRecordCardProps = {
  master: MasterRecord;
};

export function MasterRecordCard({ master }: MasterRecordCardProps) {
  return (
    <div className={styles.sourceCard}>
      <h3 className={styles.sectionTitle}>Master Record</h3>
      <p className={styles.sourceLabel}>Canonical Name</p>
      <p className={styles.sourceValue} style={{ fontWeight: 700 }}>{master.canonicalName}</p>

      <p className={styles.sourceLabel}>Normalized Name</p>
      <p className={styles.sourceValue}>{master.normalizedName}</p>

      <dl className={styles.attrGrid}>
        <dt>ID</dt><dd>{master.id}</dd>
        <dt>Domain</dt><dd>{master.domain}</dd>
        <dt>Status</dt><dd>{master.status}</dd>
        {master.domain === 'entity' && (
          <>
            <dt>Jurisdiction</dt><dd>{master.jurisdiction}</dd>
            <dt>EIN</dt><dd>{master.ein || '—'}</dd>
            <dt>Category</dt><dd>{master.category}</dd>
          </>
        )}
        {master.domain === 'investor' && (
          <>
            <dt>Domicile</dt><dd>{master.domicile}</dd>
            <dt>Class</dt><dd>{master.investorClass}</dd>
            <dt>Tax ID</dt><dd>{master.taxIdType} ****{master.taxIdLast4}</dd>
          </>
        )}
        {master.domain === 'deal' && (
          <>
            <dt>Type</dt><dd>{master.investmentType}</dd>
            <dt>Sector</dt><dd>{master.sector}</dd>
            <dt>Focus</dt><dd>{master.geographicFocus}</dd>
          </>
        )}
      </dl>
    </div>
  );
}
