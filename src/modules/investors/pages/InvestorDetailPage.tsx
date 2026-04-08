import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePlatformContext, matchesScope } from '../../../platform/context';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { INVESTOR_SECTIONS } from '../config';
import type { InvestorSectionKey } from '../config';
import type { InvestorRecord } from '../types';
import { investorsService } from '../services';
import { useInvestorsVersion } from '../hooks/useInvestorsVersion';
import { fundsService } from '../../home/services/funds.service';
import { OverviewSection } from '../components/sections/OverviewSection';
import { InvestorEditModal } from '../components/InvestorEditModal';
import { DemographicsSection } from '../components/sections/DemographicsSection';
import { WithholdingSection } from '../components/sections/WithholdingSection';
import { QuestionsSection } from '../components/sections/QuestionsSection';
import { RequestsSection } from '../components/sections/RequestsSection';
import { DocumentsSection } from '../components/sections/DocumentsSection';
import { RulesSection } from '../components/sections/RulesSection';
import { ReviewSection } from '../components/sections/ReviewSection';
import { ActivitySection } from '../components/sections/ActivitySection';
import styles from '../InvestorsModule.module.css';

function renderSection(section: InvestorSectionKey, investor: InvestorRecord, onEdit?: () => void) {
  switch (section) {
    case 'overview':
      return <OverviewSection investor={investor} onEdit={onEdit} />;
    case 'demographics':
      return <DemographicsSection investor={investor} />;
    case 'withholding':
      return <WithholdingSection investor={investor} />;
    case 'questions':
      return <QuestionsSection investor={investor} />;
    case 'requests':
      return <RequestsSection investor={investor} />;
    case 'documents':
      return <DocumentsSection investor={investor} />;
    case 'rules':
      return <RulesSection investor={investor} />;
    case 'review':
      return <ReviewSection investor={investor} />;
    case 'activity':
      return <ActivitySection investor={investor} />;
  }
}

export function InvestorDetailPage() {
  const { investorId, section } = useParams();
  const navigate = useNavigate();
  const { scopeSelection, scopeLabel } = usePlatformContext();
  const [editing, setEditing] = useState(false);
  useInvestorsVersion();

  const activeSection = (section ?? 'overview') as InvestorSectionKey;

  const investor = investorId ? investorsService.getAccessibleInvestorById(investorId) : undefined;

  if (!investor) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Investor not found.</div>
      </div>
    );
  }

  const isOutsideScope = !matchesScope(investor.scopeIds, scopeSelection);

  return (
    <div className={styles.page}>
      <section className={styles.detailHero}>
        <div className={styles.detailHeroCard}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.eyebrow}>Investor Workspace</div>
              <h1 className={styles.detailTitle}>{investor.name}</h1>
              <p className={styles.detailSubtitle}>{investor.legalName}</p>
              <div className={styles.headerPills}>
                <span className={styles.pill}>{investor.investorClass}</span>
                <span className={styles.pill}>{investor.domicile}</span>
                <span className={styles.pill}>{investor.withholdingProfile}</span>
              </div>
            </div>
            <div className={styles.detailHeaderActions}>
              <span className={styles.recordStatus}>{investor.status}</span>
              <button className={styles.backButton} onClick={() => navigate('/investors')} type="button">
                Back to investors
              </button>
            </div>
          </div>
          <p className={styles.contextLine}>
            {fundsService.resolveFundFamilyLabel(investor.scopeIds) ?? investor.context.fundFamilyLabel} / {fundsService.resolveFundLabel(investor.scopeIds) ?? investor.context.fundLabel}
            {investor.context.parentContextLabel && ` — ${investor.context.parentContextLabel}`}
            {' '}&middot; Scope: {scopeLabel}
          </p>
          {isOutsideScope && (
            <div className={styles.outsideScopeBadge}>
              Outside current workspace: viewing {investor.context.fundLabel} while scoped to {scopeLabel}
            </div>
          )}
        </div>
      </section>

      <section className={styles.detailWorkspace}>
        <SectionNav
          sections={INVESTOR_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/investors/${investorId}/${key}`)}
        />

        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            {renderSection(activeSection, investor, () => setEditing(true))}
            {editing && (
              <InvestorEditModal
                investor={investor}
                onSave={(id, updates) => {
                  investorsService.updateInvestor(id, updates);
                  setEditing(false);
                }}
                onCancel={() => setEditing(false)}
              />
            )}
          </div>

          <aside className={styles.sideStack}>
            <div className={styles.sidePanel}>
              <h3 className={styles.sidePanelTitle}>Investor snapshot</h3>
              <dl className={styles.definitionList}>
                <dt>Domicile</dt>
                <dd>{investor.domicile}</dd>
                <dt>Withholding</dt>
                <dd>{investor.withholdingProfile}</dd>
                <dt>Capital Account</dt>
                <dd>{investor.capitalAccount}</dd>
                <dt>Ownership</dt>
                <dd>{investor.ownershipPercentage}</dd>
                <dt>Documents</dt>
                <dd>{investor.documentCount}</dd>
                <dt>Last Review</dt>
                <dd>{investor.lastReviewDate}</dd>
              </dl>
            </div>

            <div className={styles.sidePanel}>
              <h3 className={styles.sidePanelTitle}>Withholding</h3>
              <dl className={styles.definitionList}>
                <dt>Rate</dt>
                <dd>{investor.withholdingRate}</dd>
                <dt>W-8 Form</dt>
                <dd>{investor.w8FormType}</dd>
                <dt>Expires</dt>
                <dd>{investor.w8ExpirationDate || 'N/A'}</dd>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
