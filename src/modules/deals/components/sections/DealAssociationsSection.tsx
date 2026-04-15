import { useNavigate } from 'react-router-dom';
import type { DealRecord } from '../../types';
import { entitiesService } from '../../../entities/services';
import styles from '../../DealsModule.module.css';

type DealAssociationsSectionProps = {
  deal: DealRecord;
};

export function DealAssociationsSection({ deal }: DealAssociationsSectionProps) {
  const navigate = useNavigate();
  const allEntities = entitiesService.getAccessibleEntities();

  const linkedEntities = deal.linkedEntityIds
    .map((id) => entitiesService.getAccessibleEntityById(id))
    .filter(Boolean);

  const associatedEntities = allEntities.filter(
    (e) => e.associatedDealIds?.includes(deal.id) && !deal.linkedEntityIds.includes(e.id),
  );

  const hasAny = linkedEntities.length > 0 || associatedEntities.length > 0;

  if (!hasAny) return null;

  return (
    <div className={styles.associationBlock}>
      <h3 className={styles.placeholderTitle}>Linked Entities</h3>

      {linkedEntities.length > 0 && (
        <div className={styles.associationGroup}>
          <p className={styles.miniMetricLabel}>Direct Links</p>
          {linkedEntities.map((entity) => (
            <div key={entity!.id} className={styles.associationItem}>
              <button
                className={styles.associationLink}
                onClick={() => navigate(`/entities/${entity!.id}`)}
                type="button"
              >
                {entity!.name}
              </button>
              <span>&middot;</span>
              <span>{entity!.category} &middot; {entity!.status}</span>
            </div>
          ))}
        </div>
      )}

      {associatedEntities.length > 0 && (
        <div className={styles.associationGroup}>
          <p className={styles.miniMetricLabel}>Associated via Entity</p>
          {associatedEntities.map((entity) => (
            <div key={entity.id} className={styles.associationItem}>
              <button
                className={styles.associationLink}
                onClick={() => navigate(`/entities/${entity.id}`)}
                type="button"
              >
                {entity.name}
              </button>
              <span>&middot;</span>
              <span>{entity.category} &middot; {entity.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
