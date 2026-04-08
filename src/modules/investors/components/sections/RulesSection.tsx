import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

export function RulesSection({ investor }: { investor: InvestorRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Rules</h2>
      <p className={styles.sectionCopy}>
        Reusable investor-specific logic for withholding, disclosures, and edge-case handling.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {investor.name}</span>
        <div className={styles.ruleCard}>
          <h4>Withholding Rule</h4>
          <p>
            Apply {investor.withholdingRate} withholding rate. Profile: {investor.withholdingProfile}.
          </p>
        </div>
        <div className={styles.ruleCard}>
          <h4>Treaty Position</h4>
          <p>
            {investor.treatyClaimCountry !== 'N/A'
              ? `Treaty benefit claimed under ${investor.treatyClaimCountry} treaty. ${investor.chapter3Status}.`
              : 'No treaty position applicable.'}
          </p>
        </div>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Rules module, filtered to this investor.
        </p>
      </div>
    </>
  );
}
