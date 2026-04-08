import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

export function RulesSection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Rules</h2>
      <p className={styles.sectionCopy}>
        Entity-specific rules, assumptions, elections, and reusable knowledge that should persist across cycles.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {entity.name}</span>
        <div className={styles.ruleCard}>
          <h4>Tax Classification Rule</h4>
          <p>
            This entity is classified as {entity.taxClassification}. Check-the-box election:
            {' '}{entity.checkTheBoxElection}.
          </p>
        </div>
        <div className={styles.ruleCard}>
          <h4>Filing Jurisdiction Rule</h4>
          <p>
            {entity.stateFilingJurisdictions.length > 0
              ? `Must file in: ${entity.stateFilingJurisdictions.join(', ')}.`
              : `No state filing jurisdictions configured. Jurisdiction: ${entity.jurisdiction}.`}
          </p>
        </div>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Rules module, filtered to this entity.
        </p>
      </div>
    </>
  );
}
