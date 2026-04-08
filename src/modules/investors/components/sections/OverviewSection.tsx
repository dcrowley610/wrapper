import type { InvestorRecord } from '../../types';
import { identityService } from '../../../identity/services';
import styles from '../../InvestorsModule.module.css';

type OverviewSectionProps = {
  investor: InvestorRecord;
  onEdit?: () => void;
};

export function OverviewSection({ investor, onEdit }: OverviewSectionProps) {
  const masterId = identityService.getMasterIdForDomainRecord(investor.id);
  const aliases = masterId ? identityService.getAliasesForMaster(masterId) : [];

  return (
    <>
      {onEdit && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button className={styles.submitBtn} onClick={onEdit} type="button">Edit</button>
        </div>
      )}
      <h2 className={styles.sectionTitle}>Investor overview</h2>
      <p className={styles.sectionCopy}>
        At-a-glance view of service team, commitment, withholding posture, and current activity.
      </p>
      <div className={styles.metricsRow}>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{investor.commitment}</p>
          <p className={styles.miniMetricLabel}>Commitment</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{investor.openQuestions}</p>
          <p className={styles.miniMetricLabel}>Open Questions</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{investor.requestCount}</p>
          <p className={styles.miniMetricLabel}>Requests</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{investor.lastActivityDate}</p>
          <p className={styles.miniMetricLabel}>Last Activity</p>
        </div>
      </div>
      <div className={styles.notesBlock}>{investor.notes}</div>
      <div className={styles.ownerCallout}>Service Team: {investor.serviceTeam}</div>
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
