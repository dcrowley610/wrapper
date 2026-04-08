import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

function isExpiringSoon(dateStr: string): boolean {
  if (!dateStr) return false;
  const expDate = new Date(dateStr);
  const now = new Date();
  const diffDays = (expDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 0 && diffDays <= 90;
}

export function WithholdingSection({ investor }: { investor: InvestorRecord }) {
  const expiring = isExpiringSoon(investor.w8ExpirationDate);

  return (
    <>
      <h2 className={styles.sectionTitle}>Withholding</h2>
      <p className={styles.sectionCopy}>
        Withholding control center for documentation, rates, and exceptions.
      </p>
      <dl className={styles.definitionList}>
        <dt>Withholding Profile</dt>
        <dd>{investor.withholdingProfile}</dd>
        <dt>Withholding Rate</dt>
        <dd>{investor.withholdingRate}</dd>
        <dt>W-8 Form Type</dt>
        <dd>{investor.w8FormType}</dd>
        <dt>W-8 Expiration</dt>
        <dd>
          {investor.w8ExpirationDate || 'N/A'}
          {expiring && (
            <span className={styles.warningBadge} style={{ marginLeft: 8 }}>
              Expiring Soon
            </span>
          )}
        </dd>
        <dt>Treaty Claim Country</dt>
        <dd>{investor.treatyClaimCountry}</dd>
        <dt>Chapter 3 Status</dt>
        <dd>{investor.chapter3Status}</dd>
        <dt>Chapter 4 Status</dt>
        <dd>{investor.chapter4Status}</dd>
      </dl>
    </>
  );
}
