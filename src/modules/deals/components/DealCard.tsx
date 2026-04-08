import { memo } from 'react';
import type { DealRecord } from '../types';
import styles from '../DealsModule.module.css';

type Props = {
  deal: DealRecord;
  onOpen: (id: string) => void;
};

export const DealCard = memo(function DealCard({ deal, onOpen }: Props) {
  return (
    <button className={styles.recordCard} onClick={() => onOpen(deal.id)} type="button">
      <div className={styles.recordHeader}>
        <div>
          <h3 className={styles.recordTitle}>{deal.name}</h3>
          <p className={styles.recordSubtitle}>{deal.owner}</p>
        </div>
        <span className={styles.recordStatus}>{deal.status}</span>
      </div>
      <p className={styles.recordSummary}>{deal.notes}</p>
      <div className={styles.recordMeta}>
        <span>{deal.investmentType}</span>
        <span>{deal.taxableIncome}</span>
        <span>TY {deal.taxYear}</span>
      </div>
    </button>
  );
});
