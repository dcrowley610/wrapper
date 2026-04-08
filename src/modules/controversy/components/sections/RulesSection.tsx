import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function RulesSection({ record }: { record: ControversyRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Rules</h2>
      <p className={styles.sectionCopy}>
        Applicable rules, precedents, and reusable knowledge for this type of controversy.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {record.name}</span>
        <div className={styles.ruleCard}>
          <h4>Response Protocol</h4>
          <p>
            {record.category} matters from {record.issuingAuthority} require response within
            60 days of notice date. Current deadline: {record.responseDeadline}.
          </p>
        </div>
        <div className={styles.ruleCard}>
          <h4>Statute Tracking</h4>
          <p>
            Statute of limitations expires {record.statuteOfLimitations}. Monitor for
            extension requests or tolling agreements.
          </p>
        </div>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Rules module, filtered to this matter.
        </p>
      </div>
    </>
  );
}
