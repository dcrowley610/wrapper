import { useNavigate } from 'react-router-dom';
import type { WorkflowRequest } from '../../types';
import type { DetailAction } from '../../pages/RequestDetailPage';
import styles from '../../RequestsModule.module.css';

type EntitiesSectionProps = {
  request: WorkflowRequest;
  dispatch: React.Dispatch<DetailAction>;
};

const LINKABLE_ENTITIES = [
  { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity' },
  { entityId: 'atlas-blocker-lux', entityName: 'Atlas Blocker Lux', entityType: 'Entity' },
  { entityId: 'smith-real-estate-llc', entityName: 'Smith Real Estate LLC', entityType: 'Entity' },
  { entityId: 'drip-ventures-inc', entityName: 'Drip Ventures Inc', entityType: 'Entity' },
];

export function EntitiesSection({ request, dispatch }: EntitiesSectionProps) {
  const navigate = useNavigate();
  const alreadyLinked = new Set(request.linkedEntities.map((e) => e.entityId));
  const available = LINKABLE_ENTITIES.filter((e) => !alreadyLinked.has(e.entityId));

  function handleLink(entity: typeof LINKABLE_ENTITIES[number]) {
    dispatch({
      type: 'LINK_ENTITY',
      entity: {
        entityId: entity.entityId,
        entityName: entity.entityName,
        entityType: entity.entityType,
        linkedDate: new Date().toISOString().slice(0, 10),
      },
    });
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Linked entities</h2>
      <p className={styles.sectionCopy}>
        Entities and funds connected to this request.
      </p>
      {request.linkedEntities.length > 0 ? (
        <div className={styles.linkedList}>
          {request.linkedEntities.map((entity) => (
            <div key={entity.entityId} className={styles.linkedCard}>
              <div>
                <p className={styles.linkedName}>{entity.entityName}</p>
                <p className={styles.linkedMeta}>{entity.entityType} &middot; Linked {entity.linkedDate}</p>
              </div>
              <button
                className={styles.linkButton}
                onClick={() => navigate(`/entities/${entity.entityId}`)}
                type="button"
                style={{ marginTop: 0 }}
              >
                View
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No entities linked to this request yet.</div>
      )}
      {available.length > 0 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
          {available.map((entity) => (
            <button
              key={entity.entityId}
              className={styles.linkButton}
              onClick={() => handleLink(entity)}
              type="button"
              style={{ marginTop: 0 }}
            >
              + {entity.entityName}
            </button>
          ))}
        </div>
      )}
    </>
  );
}
