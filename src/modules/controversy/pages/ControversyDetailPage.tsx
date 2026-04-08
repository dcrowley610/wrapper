import { useNavigate, useParams } from 'react-router-dom';
import { usePlatformContext, matchesScope } from '../../../platform/context';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { CONTROVERSY_SECTIONS } from '../config';
import type { ControversySectionKey } from '../config';
import type { ControversyRecord } from '../types';
import { controversyService } from '../services';
import { fundsService } from '../../home/services/funds.service';
import { SummarySection } from '../components/sections/SummarySection';
import { DetailsSection } from '../components/sections/DetailsSection';
import { TimelineSection } from '../components/sections/TimelineSection';
import { EntitiesSection } from '../components/sections/EntitiesSection';
import { InvestorsSection } from '../components/sections/InvestorsSection';
import { DocumentsSection } from '../components/sections/DocumentsSection';
import { RulesSection } from '../components/sections/RulesSection';
import { ActivitySection } from '../components/sections/ActivitySection';
import styles from '../ControversyModule.module.css';

function renderSection(section: ControversySectionKey, record: ControversyRecord) {
  switch (section) {
    case 'summary':
      return <SummarySection record={record} />;
    case 'details':
      return <DetailsSection record={record} />;
    case 'timeline':
      return <TimelineSection record={record} />;
    case 'entities':
      return <EntitiesSection record={record} />;
    case 'investors':
      return <InvestorsSection record={record} />;
    case 'documents':
      return <DocumentsSection record={record} />;
    case 'rules':
      return <RulesSection record={record} />;
    case 'activity':
      return <ActivitySection record={record} />;
  }
}

export function ControversyDetailPage() {
  const { recordId, section } = useParams();
  const navigate = useNavigate();
  const { scopeSelection, scopeLabel } = usePlatformContext();

  const activeSection = (section ?? 'summary') as ControversySectionKey;

  const record = recordId ? controversyService.getAccessibleControversyById(recordId) : undefined;

  if (!record) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Controversy matter not found.</div>
      </div>
    );
  }

  const isOutsideScope = !matchesScope(record.scopeIds, scopeSelection);

  return (
    <div className={styles.page}>
      <section className={styles.detailHero}>
        <button className={styles.backButton} onClick={() => navigate('/controversy')} type="button">
          Back to matters
        </button>
        <div className={styles.detailHeroCard}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.eyebrow}>Controversy Workspace</div>
              <h1 className={styles.detailTitle}>{record.name}</h1>
              <p className={styles.detailSubtitle}>{record.issuingAuthority}</p>
              <div className={styles.headerPills}>
                <span className={styles.pill}>{record.category}</span>
                <span className={`${styles.recordStatus} ${styles[`priority${record.priority}`]}`}>{record.priority}</span>
                <span className={styles.pill}>{record.status}</span>
                <span className={styles.pill}>Due: {record.responseDeadline}</span>
              </div>
            </div>
          </div>
          <p className={styles.contextLine}>
            {fundsService.resolveFundFamilyLabel(record.scopeIds) ?? record.context.fundFamilyLabel} / {fundsService.resolveFundLabel(record.scopeIds) ?? record.context.fundLabel}
            {record.context.parentContextLabel && ` — ${record.context.parentContextLabel}`}
            {' '}&middot; Scope: {scopeLabel}
          </p>
          {isOutsideScope && (
            <div className={styles.outsideScopeBadge}>
              Outside current workspace: viewing {record.context.fundLabel} while scoped to {scopeLabel}
            </div>
          )}
        </div>
      </section>

      <section className={styles.detailWorkspace}>
        <SectionNav
          sections={CONTROVERSY_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/controversy/${recordId}/${key}`)}
          accentColor="#7c2d12"
        />

        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            {renderSection(activeSection, record)}
          </div>

          <aside className={styles.sideStack}>
            <div className={styles.sidePanel}>
              <h3 className={styles.sidePanelTitle}>Matter snapshot</h3>
              <dl className={styles.definitionList}>
                <dt>Category</dt>
                <dd>{record.category}</dd>
                <dt>Priority</dt>
                <dd>{record.priority}</dd>
                <dt>Authority</dt>
                <dd>{record.issuingAuthority}</dd>
                <dt>Documents</dt>
                <dd>{record.documentCount}</dd>
                <dt>Questions</dt>
                <dd>{record.openQuestions}</dd>
                <dt>Last Activity</dt>
                <dd>{record.lastActivityDate}</dd>
              </dl>
            </div>

            <div className={styles.sidePanel}>
              <h3 className={styles.sidePanelTitle}>Linked records</h3>
              <dl className={styles.definitionList}>
                <dt>Entities</dt>
                <dd>{record.linkedEntities.length || 'None'}</dd>
                <dt>Investors</dt>
                <dd>{record.linkedInvestors.length || 'None'}</dd>
                <dt>Tax Years</dt>
                <dd>{record.taxYearsAffected.join(', ')}</dd>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
