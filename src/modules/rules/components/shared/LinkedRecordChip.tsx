import { useNavigate } from 'react-router-dom';
import type { LinkedRecord } from '../../types';
import styles from '../../RulesModule.module.css';

type LinkedRecordChipProps = {
  record: LinkedRecord;
};

const PARENT_TYPE_ROUTES: Record<string, string> = {
  request: '/requests',
  entity: '/entities',
  investor: '/investors',
  controversy: '/controversy',
  document: '/documents',
};

export function LinkedRecordChip({ record }: LinkedRecordChipProps) {
  const navigate = useNavigate();
  const basePath = PARENT_TYPE_ROUTES[record.parentType] ?? '';

  return (
    <button
      className={styles.linkedChip}
      onClick={() => navigate(`${basePath}/${record.parentId}`)}
      type="button"
    >
      <span className={styles.linkedChipType}>{record.parentType}</span>
      {record.parentLabel}
    </button>
  );
}
