import type { DealRecord } from '../../types';
import { identityService } from '../../../identity/services';
import styles from '../../DealsModule.module.css';

type OverviewSectionProps = {
  deal: DealRecord;
  onEdit?: () => void;
};

export function OverviewSection({ deal, onEdit }: OverviewSectionProps) {
  const masterId = identityService.getMasterIdForDomainRecord(deal.id);
  const aliases = masterId ? identityService.getAliasesForMaster(masterId) : [];
  return (
    <>
      {onEdit && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button className={styles.submitBtn} onClick={onEdit} type="button">Edit</button>
        </div>
      )}
      <h2 className={styles.sectionTitle}>Deal summary</h2>
      <p className={styles.sectionCopy}>
        Key financial and operational details for this deal.
      </p>

      <div className={styles.metricsRow}>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{deal.taxableIncome}</p>
          <p className={styles.miniMetricLabel}>Taxable Income</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{deal.requestCount}</p>
          <p className={styles.miniMetricLabel}>Requests</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{deal.documentCount}</p>
          <p className={styles.miniMetricLabel}>Documents</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{deal.linkedEntityIds.length}</p>
          <p className={styles.miniMetricLabel}>Linked</p>
        </div>
      </div>

      <dl className={styles.definitionList}>
        <dt>Investment Type</dt>
        <dd>{deal.investmentType}</dd>
        <dt>Tax Year</dt>
        <dd>{deal.taxYear}</dd>
        <dt>Owner</dt>
        <dd>{deal.owner}</dd>
        <dt>Last Review</dt>
        <dd>{deal.lastReviewDate}</dd>
      </dl>

      {deal.notes && <div className={styles.notesBlock}>{deal.notes}</div>}
      <div className={styles.ownerCallout}>Deal Owner: {deal.owner}</div>
      {aliases.length > 0 && (
        <div className={styles.placeholderBlock} style={{ marginTop: 14 }}>
          <h3 className={styles.placeholderTitle}>Known Aliases</h3>
          <ul className={styles.sideList}>
            {aliases.map((alias) => (
              <li key={alias.id}>
                {alias.aliasName}
                <span style={{ color: '#8a9baa', marginLeft: 8 }}>— {alias.source}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
