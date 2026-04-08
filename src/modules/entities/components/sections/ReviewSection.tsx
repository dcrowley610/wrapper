import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

export function ReviewSection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Review</h2>
      <p className={styles.sectionCopy}>
        Reviewer assignments, review status, sign-off notes, and unresolved issues before filing.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {entity.name}</span>
        <div className={styles.reviewBanner}>
          Review Status: {entity.status === 'Pending Review' ? 'Awaiting Review' : 'Up to Date'}
        </div>
        <div className={styles.reviewRow}>
          <strong>Primary Reviewer:</strong> Sarah Chen &middot; Last reviewed: {entity.lastReviewDate}
        </div>
        <ul className={styles.checklist}>
          <li>Verify tax classification is current</li>
          <li>Confirm all state filings are accounted for</li>
          <li>Review open questions ({entity.openQuestions} outstanding)</li>
          <li>Validate document completeness ({entity.documentCount} attached)</li>
        </ul>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Review module, filtered to this entity.
        </p>
      </div>
    </>
  );
}
