import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { processService } from '../services';
import { RUN_STATUS_CONFIG, PROCESS_TYPE_LABELS } from '../config';
import { StatusBadge } from '../components/shared/StatusBadge';
import { ProgressBar } from '../components/shared/ProgressBar';
import styles from '../RulesModule.module.css';

export function ProcessTemplateListPage() {
  const navigate = useNavigate();
  const { scopeSelection } = usePlatformContext();

  const templates = processService.getAllTemplates();
  const runs = processService.getScopedRuns(scopeSelection);

  const activeRuns = runs.filter((r) => r.status === 'inProgress' || r.status === 'blocked' || r.status === 'inReview');
  const completedRuns = runs.filter((r) => r.status === 'completed');
  const totalExceptions = runs.reduce((sum, r) => sum + r.steps.filter((s) => s.isException).length, 0);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.eyebrow}>Rules &amp; Process Capture</div>
          <h1 className={styles.title}>Process Capture</h1>
          <p className={styles.lead}>
            Structured capture of how work gets done — steps, decisions, evidence, and exceptions.
            The operational memory of your tax platform.
          </p>
          <div className={styles.metricsRow}>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{templates.length}</p>
              <p className={styles.miniMetricLabel}>Templates</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{activeRuns.length}</p>
              <p className={styles.miniMetricLabel}>Active Runs</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{completedRuns.length}</p>
              <p className={styles.miniMetricLabel}>Completed</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>
                {totalExceptions > 0 ? <span className={styles.exceptionCount}>{totalExceptions}</span> : '0'}
              </p>
              <p className={styles.miniMetricLabel}>Exceptions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates */}
      <section className={styles.workspace}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>Process Templates</h2>
        </div>

        {templates.map((tpl) => (
          <div key={tpl.id} className={styles.templateCard}>
            <div className={styles.templateCardHeader}>
              <div>
                <h3 className={styles.templateName}>{tpl.name}</h3>
                <p className={styles.templateDesc}>{tpl.description}</p>
              </div>
              <span className={styles.pill}>
                {PROCESS_TYPE_LABELS[tpl.processType]}
              </span>
            </div>
            <div className={styles.templateMeta}>
              <span className={styles.templateTag}>{tpl.defaultSteps.length} steps</span>
              <span className={styles.templateTag}>v{tpl.version}</span>
              {tpl.tags.map((tag) => (
                <span key={tag} className={styles.templateTag}>{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Recent Runs */}
      <section className={styles.workspace}>
        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>Process Runs</h2>
        </div>

        {runs.length === 0 && (
          <div className={styles.emptyState}>No process runs in the current scope.</div>
        )}

        {runs.map((run) => {
          const completed = run.steps.filter((s) => s.status === 'completed').length;
          const exceptions = run.steps.filter((s) => s.isException).length;

          return (
            <div key={run.id} className={styles.templateCard}>
              <div className={styles.templateCardHeader}>
                <div>
                  <h3 className={styles.templateName}>
                    <button
                      className={styles.panelRunLink}
                      onClick={() => navigate(`/rules/process/${run.id}`)}
                      type="button"
                      style={{ fontSize: '0.88rem' }}
                    >
                      {run.name}
                    </button>
                  </h3>
                  <p className={styles.templateDesc}>
                    {run.linkedRecord.parentLabel} &middot; Owner: {run.owner}
                  </p>
                </div>
                <StatusBadge status={run.status} configMap={RUN_STATUS_CONFIG} />
              </div>
              <div style={{ marginTop: 6 }}>
                <ProgressBar completed={completed} total={run.steps.length} hasExceptions={exceptions > 0} />
              </div>
              <div className={styles.templateMeta}>
                {run.dueDate && <span className={styles.templateTag}>Due: {run.dueDate}</span>}
                {exceptions > 0 && (
                  <span className={styles.templateTag} style={{ background: '#fef2f2', color: '#991b1b' }}>
                    {exceptions} exception{exceptions > 1 ? 's' : ''}
                  </span>
                )}
                <span className={styles.templateTag}>Updated: {run.lastUpdatedDate}</span>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}
