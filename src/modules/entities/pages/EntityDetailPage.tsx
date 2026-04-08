import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlatformContext, matchesScope } from '../../../platform/context';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { ENTITY_SECTIONS } from '../config';
import type { EntitySectionKey } from '../config';
import type { EntityRecord } from '../types';
import { entitiesService } from '../services';
import { useEntitiesVersion } from '../hooks/useEntitiesVersion';
import { fundsService } from '../../home/services/funds.service';
import { OverviewSection } from '../components/sections/OverviewSection';
import { EntityEditModal } from '../components/EntityEditModal';
import { StructureSection } from '../components/sections/StructureSection';
import { DocumentsSection } from '../components/sections/DocumentsSection';
import { RequestsSection } from '../components/sections/RequestsSection';
import { TaxAttributesSection } from '../components/sections/TaxAttributesSection';
import { RecentActivityWidget } from '../components/sidebar/RecentActivityWidget';
import { OpenIssuesWidget } from '../components/sidebar/OpenIssuesWidget';
import { AssignedTasksWidget } from '../components/sidebar/AssignedTasksWidget';
import styles from '../EntitiesModule.module.css';

const VALID_SECTIONS: EntitySectionKey[] = ['overview', 'structure', 'documents', 'requests', 'tax'];

function renderSection(section: EntitySectionKey, entity: EntityRecord, onEdit?: () => void) {
  switch (section) {
    case 'overview':
      return <OverviewSection entity={entity} onEdit={onEdit} />;
    case 'structure':
      return <StructureSection entity={entity} />;
    case 'documents':
      return <DocumentsSection entity={entity} />;
    case 'requests':
      return <RequestsSection entity={entity} />;
    case 'tax':
      return <TaxAttributesSection entity={entity} />;
  }
}

export function EntityDetailPage() {
  const { entityId, section } = useParams();
  const navigate = useNavigate();
  const { scopeSelection, scopeLabel } = usePlatformContext();
  const [editing, setEditing] = useState(false);
  useEntitiesVersion();

  const activeSection = VALID_SECTIONS.includes(section as EntitySectionKey)
    ? (section as EntitySectionKey)
    : 'overview';

  const entity = entityId ? entitiesService.getAccessibleEntityById(entityId) : undefined;

  if (!entity) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Entity not found.</div>
      </div>
    );
  }

  const isOutsideScope = !matchesScope(entity.scopeIds, scopeSelection);

  return (
    <div className={styles.page}>
      <section className={styles.detailHero}>
        <div className={styles.detailHeroCard}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.eyebrow}>Entity Workspace</div>
              <h1 className={styles.detailTitle}>{entity.name}</h1>
              <p className={styles.detailSubtitle}>{entity.legalName}</p>
              <div className={styles.headerPills}>
                <span className={styles.pill}>{entity.category}</span>
                <span className={styles.pill}>{entity.jurisdiction}</span>
                <span className={styles.pill}>EIN: {entity.ein}</span>
                <span className={styles.pill}>{entity.taxClassification}</span>
              </div>
            </div>
            <div className={styles.detailHeaderActions}>
              <span className={styles.recordStatus}>{entity.status}</span>
              <button className={styles.backButton} onClick={() => navigate('/entities')} type="button">
                Back to entities
              </button>
            </div>
          </div>
          <p className={styles.contextLine}>
            {fundsService.resolveFundFamilyLabel(entity.scopeIds) ?? entity.context.fundFamilyLabel} / {fundsService.resolveFundLabel(entity.scopeIds) ?? entity.context.fundLabel}
            {entity.context.parentContextLabel && ` — ${entity.context.parentContextLabel}`}
            {' '}&middot; Scope: {scopeLabel}
          </p>
          {isOutsideScope && (
            <div className={styles.outsideScopeBadge}>
              Outside current workspace: viewing {entity.context.fundLabel} while scoped to {scopeLabel}
            </div>
          )}
        </div>
      </section>

      <section className={styles.detailWorkspace}>
        <SectionNav
          sections={ENTITY_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/entities/${entityId}/${key}`)}
        />

        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            {renderSection(activeSection, entity, () => setEditing(true))}
            {editing && (
              <EntityEditModal
                entity={entity}
                onSave={(id, updates) => {
                  entitiesService.updateEntity(id, updates);
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
              />
            )}
          </div>

          <aside className={styles.sideStack}>
            <RecentActivityWidget entity={entity} />
            <OpenIssuesWidget entity={entity} />
            <AssignedTasksWidget />
          </aside>
        </div>
      </section>
    </div>
  );
}
