import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { LinkedEntity } from '../../types';
import type { FieldAction } from '../../pages/DocumentReviewPage';
import { identityService } from '../../../identity/services';
import styles from '../../DocumentsModule.module.css';

type LinkedEntitiesSectionProps = {
  linkedEntities: LinkedEntity[];
  dispatch: React.Dispatch<FieldAction>;
};

export function LinkedEntitiesSection({ linkedEntities, dispatch }: LinkedEntitiesSectionProps) {
  const navigate = useNavigate();

  const linkableEntities = useMemo(() => {
    return identityService.getAllMasters('entity').map((m) => ({
      entityId: m.id,
      entityName: m.canonicalName,
      entityType: 'Entity',
    }));
  }, []);

  const alreadyLinked = new Set(linkedEntities.map((e) => e.entityId));
  const available = linkableEntities.filter((e) => !alreadyLinked.has(e.entityId));

  function handleLink(entity: { entityId: string; entityName: string; entityType: string }) {
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
        Entities, investors, and workflows connected to this document.
      </p>
      {linkedEntities.length > 0 ? (
        <div className={styles.linkedList}>
          {linkedEntities.map((entity) => (
            <div key={entity.entityId} className={styles.linkedCard}>
              <div>
                <p className={styles.linkedName}>{entity.entityName}</p>
                <p className={styles.linkedMeta}>{entity.entityType} &middot; Linked {entity.linkedDate}</p>
              </div>
              {entity.entityType === 'Entity' && (
                <button
                  className={styles.linkButton}
                  onClick={() => navigate(`/entities/${entity.entityId}`)}
                  type="button"
                  style={{ marginTop: 0 }}
                >
                  View
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No entities linked to this document yet.</div>
      )}
      {available.length > 0 && (
        <div>
          <p className={styles.fieldLabel} style={{ marginTop: 18 }}>Link another entity</p>
          <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
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
        </div>
      )}
    </>
  );
}
