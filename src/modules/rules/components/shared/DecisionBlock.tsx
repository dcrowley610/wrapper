import type { StepDecision } from '../../types';
import styles from '../../RulesModule.module.css';

type DecisionBlockProps = {
  decisions: StepDecision[];
};

export function DecisionBlock({ decisions }: DecisionBlockProps) {
  if (decisions.length === 0) return null;

  return (
    <div>
      {decisions.map((d) => (
        <div key={d.id} className={styles.decisionBlock}>
          <div className={styles.decisionText}>{d.decisionText}</div>
          <div className={styles.decisionRationale}>{d.rationale}</div>
          <div className={styles.decisionMeta}>
            {d.decidedBy} &middot; {new Date(d.timestamp).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
