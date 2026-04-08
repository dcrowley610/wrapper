import type { DealRecord } from '../../types';
import styles from '../../DealsModule.module.css';

export function OpenIssuesWidget({ deal }: { deal: DealRecord }) {
  if (deal.openQuestions === 0) return null;

  return (
    <div className={styles.sidePanel}>
      <h3 className={styles.sidePanelTitle}>Open questions</h3>
      <ul className={styles.issueList}>
        {Array.from({ length: deal.openQuestions }, (_, i) => (
          <li key={i} className={styles.issueItem}>
            Open question {i + 1} for {deal.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
