import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

export function ReviewSection({ investor }: { investor: InvestorRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Review</h2>
      <p className={styles.sectionCopy}>
        Service-level review workflows, escalations, and sign-off checkpoints.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {investor.name}</span>
        <div className={styles.reviewBanner}>
          Review Status: {investor.status === 'Watchlist' ? 'Needs Attention' : 'Up to Date'}
        </div>
        <div className={styles.reviewRow}>
          <strong>Primary Reviewer:</strong> {investor.serviceTeam} &middot; Last reviewed: {investor.lastReviewDate}
        </div>
        <ul className={styles.checklist}>
          <li>Verify withholding documentation is current</li>
          <li>Confirm investor classification</li>
          <li>Review open questions ({investor.openQuestions} outstanding)</li>
          <li>Validate document completeness ({investor.documentCount} attached)</li>
        </ul>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Review module, filtered to this investor.
        </p>
      </div>
    </>
  );
}
