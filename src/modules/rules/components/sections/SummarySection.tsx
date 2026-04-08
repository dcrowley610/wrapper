import type { ProcessRun } from '../../types';
import { RUN_STATUS_CONFIG, STEP_STATUS_CONFIG } from '../../config';
import { StatusBadge } from '../shared/StatusBadge';
import { ProgressBar } from '../shared/ProgressBar';
import styles from '../../RulesModule.module.css';

type SummarySectionProps = {
  run: ProcessRun;
};

export function SummarySection({ run }: SummarySectionProps) {
  const completedSteps = run.steps.filter((s) => s.status === 'completed').length;
  const exceptionCount = run.steps.filter((s) => s.isException).length;
  const exceptions = run.steps.filter((s) => s.isException);
  const allDecisions = run.steps.flatMap((s) => s.decisions);
  const aiCandidates = run.steps.filter((s) => s.aiAutomationCandidate && s.aiAutomationNotes);
  const blockedSteps = run.steps.filter((s) => s.status === 'blocked');

  return (
    <div>
      <h3 className={styles.sectionTitle}>Manager Summary</h3>

      <div className={styles.summaryBox}>
        <h4 className={styles.summaryBoxTitle}>Execution Overview</h4>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryMetricLabel}>Status</span>
          <span className={styles.summaryMetricValue}>
            <StatusBadge status={run.status} configMap={RUN_STATUS_CONFIG} />
          </span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryMetricLabel}>Progress</span>
          <span className={styles.summaryMetricValue}>{completedSteps}/{run.steps.length} steps</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryMetricLabel}>Owner</span>
          <span className={styles.summaryMetricValue}>{run.owner}</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryMetricLabel}>Due Date</span>
          <span className={styles.summaryMetricValue}>{run.dueDate ?? 'Not set'}</span>
        </div>
        <div className={styles.summaryMetric}>
          <span className={styles.summaryMetricLabel}>Exceptions</span>
          <span className={styles.summaryMetricValue}>
            {exceptionCount > 0 ? <span className={styles.exceptionCount}>{exceptionCount}</span> : '0'}
          </span>
        </div>
        <div style={{ marginTop: 8 }}>
          <ProgressBar completed={completedSteps} total={run.steps.length} hasExceptions={exceptionCount > 0} />
        </div>
      </div>

      {exceptions.length > 0 && (
        <div className={styles.summaryBox}>
          <h4 className={styles.summaryBoxTitle}>Exceptions ({exceptions.length})</h4>
          {exceptions.map((s) => (
            <div key={s.id} className={styles.summaryMetric}>
              <span className={styles.summaryMetricLabel}>Step {s.order}: {s.title}</span>
              <span className={styles.exceptionCount}>{s.exceptionReason}</span>
            </div>
          ))}
        </div>
      )}

      {blockedSteps.length > 0 && (
        <div className={styles.summaryBox}>
          <h4 className={styles.summaryBoxTitle}>Blocked Steps ({blockedSteps.length})</h4>
          {blockedSteps.map((s) => (
            <div key={s.id} className={styles.summaryMetric}>
              <span className={styles.summaryMetricLabel}>Step {s.order}: {s.title}</span>
              <span className={styles.summaryMetricValue}>
                <StatusBadge status={s.status} configMap={STEP_STATUS_CONFIG} />
              </span>
            </div>
          ))}
        </div>
      )}

      {allDecisions.length > 0 && (
        <div className={styles.summaryBox}>
          <h4 className={styles.summaryBoxTitle}>Decisions Recorded ({allDecisions.length})</h4>
          {allDecisions.map((d) => (
            <div key={d.id} style={{ padding: '4px 0', borderBottom: '1px solid #eef3f7', fontSize: '0.78rem' }}>
              <div style={{ fontWeight: 700, color: '#123047' }}>{d.decisionText}</div>
              <div style={{ fontSize: '0.76rem', color: '#6a7f90' }}>
                {d.decidedBy} &middot; {new Date(d.timestamp).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Future AI integration point: AI-generated summary, bottleneck analysis, pattern detection */}
      {aiCandidates.length > 0 && (
        <div className={styles.summaryBox}>
          <h4 className={styles.summaryBoxTitle}>
            <span className={styles.aiLabel}>AI</span> Automation Opportunities ({aiCandidates.length})
          </h4>
          {aiCandidates.map((s) => (
            <div key={s.id} className={styles.aiOpportunityItem}>
              <strong>Step {s.order}: {s.title}</strong> &mdash; {s.aiAutomationNotes}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
