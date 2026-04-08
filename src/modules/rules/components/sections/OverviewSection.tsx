import type { ProcessRun } from '../../types';
import { RUN_STATUS_CONFIG, PROCESS_TYPE_LABELS } from '../../config';
import { StatusBadge } from '../shared/StatusBadge';
import { ProgressBar } from '../shared/ProgressBar';
import { LinkedRecordChip } from '../shared/LinkedRecordChip';
import styles from '../../RulesModule.module.css';

type OverviewSectionProps = {
  run: ProcessRun;
};

export function OverviewSection({ run }: OverviewSectionProps) {
  const completedSteps = run.steps.filter((s) => s.status === 'completed').length;
  const exceptionCount = run.steps.filter((s) => s.isException).length;

  return (
    <div>
      <h3 className={styles.sectionTitle}>Overview</h3>

      <div className={styles.metricsRow}>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>
            <StatusBadge status={run.status} configMap={RUN_STATUS_CONFIG} />
          </p>
          <p className={styles.miniMetricLabel}>Status</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{completedSteps}/{run.steps.length}</p>
          <p className={styles.miniMetricLabel}>Steps Done</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>
            {exceptionCount > 0 ? <span className={styles.exceptionCount}>{exceptionCount}</span> : '0'}
          </p>
          <p className={styles.miniMetricLabel}>Exceptions</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{run.dueDate ?? 'N/A'}</p>
          <p className={styles.miniMetricLabel}>Due Date</p>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <ProgressBar completed={completedSteps} total={run.steps.length} hasExceptions={exceptionCount > 0} />
      </div>

      {run.description && (
        <div className={styles.notesBlock}>
          {run.description}
        </div>
      )}

      <div className={styles.ownerCallout}>
        Owner: {run.owner}
        {run.templateName && <> &middot; Template: {run.templateName}</>}
      </div>

      <dl className={styles.definitionList}>
        <dt>Process Type</dt>
        <dd>{PROCESS_TYPE_LABELS[run.processType]}</dd>
        <dt>Created</dt>
        <dd>{run.createdDate}</dd>
        <dt>Started</dt>
        <dd>{run.startedDate ?? 'Not started'}</dd>
        <dt>Last Updated</dt>
        <dd>{run.lastUpdatedDate}</dd>
        <dt>Scope</dt>
        <dd>{run.scopeIds.join(', ')}</dd>
      </dl>

      <div style={{ marginTop: 12 }}>
        <div className={styles.stepSectionLabel}>Linked Record</div>
        <LinkedRecordChip record={run.linkedRecord} />
      </div>
    </div>
  );
}
