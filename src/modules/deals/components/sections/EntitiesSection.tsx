import { useNavigate } from 'react-router-dom';
import type { DealRecord } from '../../types';
import { entitiesService } from '../../../entities/services';
import styles from '../../DealsModule.module.css';

export function EntitiesSection({ deal }: { deal: DealRecord }) {
  const navigate = useNavigate();

  const linkedEntities = deal.linkedEntityIds
    .map((id) => entitiesService.getAccessibleEntityById(id))
    .filter(Boolean);

  return (
    <>
      <h2 className={styles.sectionTitle}>Linked entities</h2>
      <p className={styles.sectionCopy}>
        Entities involved in this deal. Click to open the entity workspace.
      </p>

      {linkedEntities.length > 0 ? (
        linkedEntities.map((entity) => (
          <div
            key={entity!.id}
            className={styles.entityLinkCard}
            onClick={() => navigate(`/entities/${entity!.id}`)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && navigate(`/entities/${entity!.id}`)}
          >
            <h4>{entity!.name}</h4>
            <p>{entity!.category} &middot; {entity!.jurisdiction} &middot; {entity!.status}</p>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          No entities are linked to this deal yet.
        </div>
      )}
    </>
  );
}
