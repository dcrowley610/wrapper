import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

export function DemographicsSection({ investor }: { investor: InvestorRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Demographics</h2>
      <p className={styles.sectionCopy}>
        Core investor record data including class, domicile, identification profile, and relationship facts.
      </p>
      <dl className={styles.definitionList}>
        <dt>Legal Name</dt>
        <dd>{investor.legalName}</dd>
        <dt>Investor Class</dt>
        <dd>{investor.investorClass}</dd>
        <dt>Domicile</dt>
        <dd>{investor.domicile}</dd>
        <dt>Entity Type</dt>
        <dd>{investor.entityType}</dd>
        <dt>Contact Name</dt>
        <dd>{investor.contactName}</dd>
        <dt>Contact Email</dt>
        <dd>{investor.contactEmail}</dd>
        <dt>Tax ID Type</dt>
        <dd>{investor.taxIdType}</dd>
        <dt>Tax ID (last 4)</dt>
        <dd>***{investor.taxIdLast4}</dd>
      </dl>
    </>
  );
}
