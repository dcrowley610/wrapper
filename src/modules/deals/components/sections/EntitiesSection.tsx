import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { DealRecord } from '../../types';
import { entitiesService } from '../../../entities/services';
import { dealsService } from '../../services';
import { EntityIntakeForm } from '../../../entities/components/EntityIntakeForm';
import styles from '../../DealsModule.module.css';

type Mode = 'view' | 'link' | 'create';

export function EntitiesSection({ deal }: { deal: DealRecord }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('view');

  const allEntities = entitiesService.getAccessibleEntities();

  // Entities linked via deal's linkedEntityIds
  const linkedEntities = deal.linkedEntityIds
    .map((id) => entitiesService.getAccessibleEntityById(id))
    .filter(Boolean);

  // Entities that associate themselves with this deal via associatedDealIds (but aren't already linked)
  const associatedEntities = allEntities.filter(
    (e) => e.associatedDealIds?.includes(deal.id) && !deal.linkedEntityIds.includes(e.id),
  );

  const allLinkedIds = new Set([
    ...deal.linkedEntityIds,
    ...associatedEntities.map((e) => e.id),
  ]);
  const availableEntities = allEntities.filter(
    (e) => !allLinkedIds.has(e.id),
  );

  function handleLink(entityId: string) {
    dealsService.updateDeal(deal.id, {
      linkedEntityIds: [...deal.linkedEntityIds, entityId],
    });
    setMode('view');
  }

  function handleUnlink(entityId: string) {
    dealsService.updateDeal(deal.id, {
      linkedEntityIds: deal.linkedEntityIds.filter((id) => id !== entityId),
    });
  }

  function handleCreateAndLink(entity: Parameters<typeof entitiesService.addEntity>[0]) {
    const entityWithScope = { ...entity, scopeIds: deal.scopeIds ?? [] };
    entitiesService.addEntity(entityWithScope);
    dealsService.updateDeal(deal.id, {
      linkedEntityIds: [...deal.linkedEntityIds, entity.id],
    });
    setMode('view');
  }

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
            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
          >
            <div
              style={{ flex: 1, cursor: 'pointer' }}
              onClick={() => navigate(`/entities/${entity!.id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && navigate(`/entities/${entity!.id}`)}
            >
              <h4>{entity!.name}</h4>
              <p>{entity!.category} &middot; {entity!.jurisdiction} &middot; {entity!.status}</p>
            </div>
            <button
              className={styles.cancelBtn}
              style={{ padding: '2px 8px', fontSize: 13, lineHeight: 1, flexShrink: 0 }}
              onClick={() => handleUnlink(entity!.id)}
              title="Unlink entity"
              type="button"
            >
              &times;
            </button>
          </div>
        ))
      ) : (
        <div className={styles.emptyState}>
          No entities are linked to this deal yet.
        </div>
      )}

      {associatedEntities.length > 0 && (
        <>
          <h3 className={styles.sectionTitle} style={{ fontSize: 14, marginTop: 16 }}>Associated via entity</h3>
          <p className={styles.sectionCopy}>
            These entities list this deal in their associations.
          </p>
          {associatedEntities.map((entity) => (
            <div
              key={entity.id}
              className={styles.entityLinkCard}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}
            >
              <div
                style={{ flex: 1, cursor: 'pointer' }}
                onClick={() => navigate(`/entities/${entity.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && navigate(`/entities/${entity.id}`)}
              >
                <h4>{entity.name}</h4>
                <p>{entity.category} &middot; {entity.jurisdiction} &middot; {entity.status}</p>
              </div>
            </div>
          ))}
        </>
      )}

      {mode === 'view' && (
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <button className={styles.submitBtn} onClick={() => setMode('link')} type="button">
            + Link existing
          </button>
          <button className={styles.submitBtn} onClick={() => setMode('create')} type="button">
            + Create new
          </button>
        </div>
      )}

      {mode === 'link' && (
        <div style={{ marginTop: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ fontSize: 12, color: '#345060' }}>Select an entity to link</strong>
            <button className={styles.cancelBtn} onClick={() => setMode('view')} type="button">Cancel</button>
          </div>
          {availableEntities.length > 0 ? (
            availableEntities.map((entity) => (
              <div
                key={entity.id}
                className={styles.entityLinkCard}
                onClick={() => handleLink(entity.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && handleLink(entity.id)}
              >
                <h4>{entity.name}</h4>
                <p>{entity.category} &middot; {entity.jurisdiction} &middot; {entity.status}</p>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              All entities are already linked to this deal.
            </div>
          )}
        </div>
      )}

      {mode === 'create' && (
        <div style={{ marginTop: 12 }}>
          <EntityIntakeForm
            onSubmit={handleCreateAndLink}
            onCancel={() => setMode('view')}
            scopeIds={deal.scopeIds ?? []}
          />
        </div>
      )}
    </>
  );
}
