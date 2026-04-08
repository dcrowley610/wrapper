import { useNavigate } from 'react-router-dom';
import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function EntitiesSection({ record }: { record: ControversyRecord }) {
  const navigate = useNavigate();

  return (
    <>
      <h2 className={styles.sectionTitle}>Linked entities</h2>
      <p className={styles.sectionCopy}>
        Entities affected by or related to this controversy matter.
      </p>
      {record.linkedEntities.length > 0 ? (
        <div className={styles.linkedList}>
          {record.linkedEntities.map((entity) => (
            <div key={entity.id} className={styles.linkedCard}>
              <div>
                <p className={styles.linkedName}>{entity.label}</p>
                <p className={styles.linkedMeta}>Entity record</p>
              </div>
              <button
                className={styles.linkedAction}
                onClick={() => navigate(`/entities/${entity.id}`)}
                type="button"
              >
                View in Entities
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No entities linked to this matter.</div>
      )}
    </>
  );
}
