import { useState } from 'react';
import type { ProcessRun } from '../../types';
import { ProgressBar } from '../shared/ProgressBar';
import { StepCard } from '../shared/StepCard';
import styles from '../../RulesModule.module.css';

type StepsSectionProps = {
  run: ProcessRun;
};

export function StepsSection({ run }: StepsSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const completedSteps = run.steps.filter((s) => s.status === 'completed').length;
  const exceptionCount = run.steps.filter((s) => s.isException).length;
  const sorted = [...run.steps].sort((a, b) => a.order - b.order);

  return (
    <div>
      <h3 className={styles.sectionTitle}>Process Steps</h3>

      <div style={{ marginTop: 8, marginBottom: 12 }}>
        <ProgressBar completed={completedSteps} total={run.steps.length} hasExceptions={exceptionCount > 0} />
      </div>

      {sorted.map((step) => (
        <StepCard
          key={step.id}
          step={step}
          isExpanded={expandedId === step.id}
          onToggle={() => setExpandedId(expandedId === step.id ? null : step.id)}
        />
      ))}
    </div>
  );
}
