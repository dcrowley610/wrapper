import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlatformContext, matchesScope } from '../../../platform/context';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { DEAL_SECTIONS } from '../config';
import type { DealSectionKey } from '../config';
import type { DealRecord } from '../types';
import { dealsService } from '../services';
import { useDealsVersion } from '../hooks/useDealsVersion';
import { fundsService } from '../../home/services/funds.service';
import { OverviewSection } from '../components/sections/OverviewSection';
import { DealEditModal } from '../components/DealEditModal';
import { EntitiesSection } from '../components/sections/EntitiesSection';
import { RecentActivityWidget } from '../components/sidebar/RecentActivityWidget';
import { OpenIssuesWidget } from '../components/sidebar/OpenIssuesWidget';
import styles from '../DealsModule.module.css';

const VALID_SECTIONS: DealSectionKey[] = ['overview', 'entities'];

function renderSection(section: DealSectionKey, deal: DealRecord, onEdit?: () => void) {
  switch (section) {
    case 'overview':
      return <OverviewSection deal={deal} onEdit={onEdit} />;
    case 'entities':
      return <EntitiesSection deal={deal} />;
  }
}

export function DealDetailPage() {
  const { dealId, section } = useParams();
  const navigate = useNavigate();
  const { scopeSelection, scopeLabel } = usePlatformContext();
  const [editing, setEditing] = useState(false);
  useDealsVersion();

  const activeSection = VALID_SECTIONS.includes(section as DealSectionKey)
    ? (section as DealSectionKey)
    : 'overview';

  const deal = dealId ? dealsService.getAccessibleDealById(dealId) : undefined;

  if (!deal) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Deal not found.</div>
      </div>
    );
  }

  const isOutsideScope = !matchesScope(deal.scopeIds, scopeSelection);

  return (
    <div className={styles.page}>
      <section className={styles.detailHero}>
        <div className={styles.detailHeroCard}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.eyebrow}>Deal Workspace</div>
              <h1 className={styles.detailTitle}>{deal.name}</h1>
              <p className={styles.detailSubtitle}>{deal.owner}</p>
              <div className={styles.headerPills}>
                <span className={styles.pill}>{deal.investmentType}</span>
                <span className={styles.pill}>TY {deal.taxYear}</span>
                <span className={styles.pill}>{deal.taxableIncome}</span>
              </div>
            </div>
            <div className={styles.detailHeaderActions}>
              <span className={styles.recordStatus}>{deal.status}</span>
              <button className={styles.backButton} onClick={() => navigate('/deals')} type="button">
                Back to deals
              </button>
            </div>
          </div>
          <p className={styles.contextLine}>
            {fundsService.resolveFundFamilyLabel(deal.scopeIds) ?? deal.context.fundFamilyLabel} / {fundsService.resolveFundLabel(deal.scopeIds) ?? deal.context.fundLabel}
            {deal.context.parentContextLabel && ` — ${deal.context.parentContextLabel}`}
            {' '}&middot; Scope: {scopeLabel}
          </p>
          {isOutsideScope && (
            <div className={styles.outsideScopeBadge}>
              Outside current workspace: viewing {deal.context.fundLabel} while scoped to {scopeLabel}
            </div>
          )}
        </div>
      </section>

      <section className={styles.detailWorkspace}>
        <SectionNav
          sections={DEAL_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/deals/${dealId}/${key}`)}
          accentColor="#6366f1"
        />

        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            {renderSection(activeSection, deal, () => setEditing(true))}
            {editing && (
              <DealEditModal
                deal={deal}
                onSave={(id, updates) => {
                  dealsService.updateDeal(id, updates);
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
              />
            )}
          </div>

          <aside className={styles.sideStack}>
            <RecentActivityWidget deal={deal} />
            <OpenIssuesWidget deal={deal} />
          </aside>
        </div>
      </section>
    </div>
  );
}
