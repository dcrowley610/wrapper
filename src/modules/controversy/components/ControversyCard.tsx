import { memo } from 'react';
import type { ControversyRecord } from '../types';
import styles from '../ControversyModule.module.css';

type ControversyCardProps = {
  record: ControversyRecord;
  onOpen: (id: string) => void;
};

export const ControversyCard = memo(function ControversyCard({ record, onOpen }: ControversyCardProps) {
  return (
    <button className={styles.recordCard} onClick={() => onOpen(record.id)} type="button">
      <div className={styles.recordHeader}>
        <div>
          <h3 className={styles.recordTitle}>{record.name}</h3>
          <p className={styles.recordSubtitle}>{record.issuingAuthority}</p>
        </div>
        <span className={`${styles.recordStatus} ${styles[`priority${record.priority}`]}`}>
          {record.priority}
        </span>
      </div>
      <p className={styles.recordSummary}>{record.summary}</p>
      <div className={styles.recordMeta}>
        <span>{record.category}</span>
        <span>{record.status}</span>
        <span>Due: {record.responseDeadline}</span>
      </div>
    </button>
  );
});
