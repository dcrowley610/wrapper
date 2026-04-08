import { memo } from 'react';
import type { EntityRecord } from '../types';
import styles from '../EntitiesModule.module.css';

type EntityCardProps = {
  entity: EntityRecord;
  onOpen: (entityId: string) => void;
};

export const EntityCard = memo(function EntityCard({ entity, onOpen }: EntityCardProps) {
  return (
    <button className={styles.recordCard} onClick={() => onOpen(entity.id)} type="button">
      <div className={styles.recordHeader}>
        <div>
          <h3 className={styles.recordTitle}>{entity.name}</h3>
          <p className={styles.recordSubtitle}>{entity.legalName}</p>
        </div>
        <span className={styles.recordStatus}>{entity.status}</span>
      </div>
      <p className={styles.recordSummary}>{entity.structureSummary}</p>
      <div className={styles.recordMeta}>
        <span>{entity.category}</span>
        <span>{entity.jurisdiction}</span>
        <span>{entity.taxClassification}</span>
      </div>
    </button>
  );
});
