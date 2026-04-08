import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

export function AttributesSection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Attributes</h2>
      <p className={styles.sectionCopy}>
        Core entity record details, classifications, jurisdictional facts, and extensible metadata.
      </p>
      <dl className={styles.definitionList}>
        <dt>EIN</dt>
        <dd>{entity.ein}</dd>
        <dt>Date Formed</dt>
        <dd>{entity.dateFormed}</dd>
        <dt>Fiscal Year End</dt>
        <dd>{entity.fiscalYearEnd}</dd>
        <dt>Jurisdiction</dt>
        <dd>{entity.jurisdiction}</dd>
        <dt>Registered Agent</dt>
        <dd>{entity.registeredAgent}</dd>
        <dt>Address</dt>
        <dd>{entity.address}</dd>
        <dt>Tax Classification</dt>
        <dd>{entity.taxClassification}</dd>
        <dt>Check-the-Box Election</dt>
        <dd>{entity.checkTheBoxElection}</dd>
        <dt>FATCA Status</dt>
        <dd>{entity.fatcaStatus}</dd>
        <dt>Treaty Country</dt>
        <dd>{entity.treatyCountry}</dd>
      </dl>
      {entity.stateFilingJurisdictions.length > 0 && (
        <>
          <h3 className={styles.sidePanelTitle} style={{ marginTop: 18 }}>
            State Filing Jurisdictions
          </h3>
          <div className={styles.pillRow}>
            {entity.stateFilingJurisdictions.map((state) => (
              <span key={state} className={styles.pill}>
                {state}
              </span>
            ))}
          </div>
        </>
      )}
    </>
  );
}
