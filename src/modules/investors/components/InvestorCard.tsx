import { memo } from 'react';
import type { InvestorRecord } from '../types';
import styles from '../InvestorsModule.module.css';

type InvestorCardProps = {
  investor: InvestorRecord;
  onOpen: (investorId: string) => void;
};

export const InvestorCard = memo(function InvestorCard({ investor, onOpen }: InvestorCardProps) {
  return (
    <button className={styles.recordCard} onClick={() => onOpen(investor.id)} type="button">
      <div className={styles.recordHeader}>
        <div>
          <h3 className={styles.recordTitle}>{investor.name}</h3>
          <p className={styles.recordSubtitle}>{investor.investorClass}</p>
        </div>
        <span className={styles.recordStatus}>{investor.status}</span>
      </div>
      <p className={styles.recordSummary}>{investor.notes}</p>
      <div className={styles.recordMeta}>
        <span>{investor.domicile}</span>
        <span>{investor.withholdingProfile}</span>
        <span>{investor.commitment}</span>
      </div>
    </button>
  );
});
