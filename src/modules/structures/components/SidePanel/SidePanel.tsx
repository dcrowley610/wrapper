import type { EntityData, EntityType } from '../../types';
import { resolveClassification, resolveNodeColors } from '../../utils/entityStyles';
import { getJurisdictionFill, getBorderOverlay } from '../../data/annotationStyles';
import { entitiesService } from '../../../entities/services';
import { usePlatformContext, matchesScope } from '../../../../platform/context';
import styles from './SidePanel.module.css';

interface SidePanelProps {
  entity: EntityData | null;
  onClose: () => void;
}

const TYPE_LABELS: Record<EntityType, string> = {
  corporation: 'Corporation',
  llc: 'Limited Liability Company',
  partnership: 'Partnership',
  trust: 'Trust',
  individual: 'Individual',
};

export function SidePanel({ entity, onClose }: SidePanelProps) {
  const { navigateTo, scopeSelection, scopeLabel } = usePlatformContext();

  if (!entity) return null;

  const classification = resolveClassification(entity);
  const colors = resolveNodeColors(entity);
  const jurisdictionFill = entity.jurisdictionFillKey
    ? getJurisdictionFill(entity.jurisdictionFillKey)
    : undefined;
  const borderOverlay = entity.borderOverlayKey
    ? getBorderOverlay(entity.borderOverlayKey)
    : undefined;

  const entityRecordId = entity.entityRecordId as string | undefined;
  const entityRecord = entityRecordId
    ? entitiesService.getAccessibleEntityById(entityRecordId)
    : undefined;
  const isOutsideScope = entityRecord
    ? !matchesScope(entityRecord.scopeIds, scopeSelection)
    : false;

  return (
    <aside className={styles.panel}>
      <header className={styles.header}>
        <h2 className={styles.title}>{entity.label}</h2>
        <button onClick={onClose} className={styles.closeBtn}>
          &times;
        </button>
      </header>
      <div className={styles.badgeRow}>
        <span className={styles.badge} style={{ backgroundColor: colors.borderColor }}>
          {classification.label}
        </span>
        {entity.status && (
          <span className={`${styles.status} ${styles[entity.status]}`}>
            {entity.status}
          </span>
        )}
      </div>
      <div className={styles.contextSection}>
        <div className={styles.contextCard}>
          <p className={styles.contextLabel}>Workspace Scope</p>
          <p className={styles.contextValue}>{scopeLabel}</p>
        </div>
        {entityRecord && (
          <div className={styles.contextCard}>
            <p className={styles.contextLabel}>Record Context</p>
            <p className={styles.contextValue}>
              {entityRecord.context.fundFamilyLabel} / {entityRecord.context.fundLabel}
            </p>
            {entityRecord.context.parentContextLabel && (
              <p className={styles.contextMeta}>{entityRecord.context.parentContextLabel}</p>
            )}
          </div>
        )}
        {isOutsideScope && entityRecord && (
          <div className={styles.outsideScopeBadge}>
            Outside current workspace: viewing {entityRecord.context.fundLabel} while scoped to {scopeLabel}
          </div>
        )}
      </div>
      <dl className={styles.details}>
        <dt>Type</dt>
        <dd>{TYPE_LABELS[entity.entityType]}</dd>
        <dt>Classification</dt>
        <dd>{classification.description}</dd>
        {entity.jurisdiction && (
          <>
            <dt>Jurisdiction</dt>
            <dd>
              {entity.jurisdiction}
              {jurisdictionFill && ` (${jurisdictionFill.label})`}
            </dd>
          </>
        )}
        {borderOverlay && (
          <>
            <dt>Border Overlay</dt>
            <dd>{borderOverlay.label}</dd>
          </>
        )}
        {entity.ein && (
          <>
            <dt>EIN</dt>
            <dd>{entity.ein}</dd>
          </>
        )}
        {entity.dateFormed && (
          <>
            <dt>Date Formed</dt>
            <dd>{entity.dateFormed}</dd>
          </>
        )}
        {entity.address && (
          <>
            <dt>Address</dt>
            <dd>{entity.address}</dd>
          </>
        )}
        {entity.notes && (
          <>
            <dt>Notes</dt>
            <dd>{entity.notes}</dd>
          </>
        )}
      </dl>
      {entityRecord && (
        <div className={styles.summaryBlock}>
          <p className={styles.summaryTitle}>Entity Workspace Context</p>
          <div className={styles.summaryGrid}>
            <div>
              <span className={styles.summaryLabel}>Owner Team</span>
              <span className={styles.summaryValue}>{entityRecord.ownerTeam}</span>
            </div>
            <div>
              <span className={styles.summaryLabel}>Requests</span>
              <span className={styles.summaryValue}>{entityRecord.requestCount}</span>
            </div>
            <div>
              <span className={styles.summaryLabel}>Documents</span>
              <span className={styles.summaryValue}>{entityRecord.documentCount}</span>
            </div>
            <div>
              <span className={styles.summaryLabel}>Last Review</span>
              <span className={styles.summaryValue}>{entityRecord.lastReviewDate}</span>
            </div>
          </div>
        </div>
      )}
      {entityRecordId && (
        <button
          className={styles.viewInEntitiesBtn}
          onClick={() => navigateTo('entities', { entityId: entityRecordId })}
          type="button"
        >
          View in Entities
        </button>
      )}
    </aside>
  );
}
