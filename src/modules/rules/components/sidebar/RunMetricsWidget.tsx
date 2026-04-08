import type { ProcessRun } from '../../types';
import { ProgressBar } from '../shared/ProgressBar';
import styles from '../../RulesModule.module.css';

type RunMetricsWidgetProps = {
  run: ProcessRun;
};

export function RunMetricsWidget({ run }: RunMetricsWidgetProps) {
  const completedSteps = run.steps.filter((s) => s.status === 'completed').length;
  const exceptionCount = run.steps.filter((s) => s.isException).length;
  const totalEvidence = run.steps.reduce((sum, s) => sum + s.evidence.length, 0);
  const totalDecisions = run.steps.reduce((sum, s) => sum + s.decisions.length, 0);

  return (
    <div className={styles.sidePanel}>
      <h4 className={styles.sidePanelTitle}>Metrics</h4>
      <div style={{ marginTop: 8 }}>
        <ProgressBar completed={completedSteps} total={run.steps.length} hasExceptions={exceptionCount > 0} />
      </div>
      <dl className={styles.definitionList}>
        <dt>Steps</dt>
        <dd>{completedSteps}/{run.steps.length}</dd>
        <dt>Exceptions</dt>
        <dd>{exceptionCount > 0 ? <span className={styles.exceptionCount}>{exceptionCount}</span> : '0'}</dd>
        <dt>Evidence</dt>
        <dd>{totalEvidence} items</dd>
        <dt>Decisions</dt>
        <dd>{totalDecisions} recorded</dd>
        <dt>Due</dt>
        <dd>{run.dueDate ?? 'Not set'}</dd>
        <dt>Created</dt>
        <dd>{run.createdDate}</dd>
        <dt>Updated</dt>
        <dd>{run.lastUpdatedDate}</dd>
      </dl>
    </div>
  );
}
