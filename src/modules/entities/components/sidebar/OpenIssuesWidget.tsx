import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

const MOCK_ISSUES = [
  'Verify check-the-box election status',
  'Missing W-8BEN for treaty claim',
  'State filing jurisdiction review pending',
];

export function OpenIssuesWidget({ entity }: { entity: EntityRecord }) {
  const issues = MOCK_ISSUES.slice(0, entity.openQuestions);

  return (
    <div className={styles.sidePanel}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.sidePanelTitle}>Open issues</h3>
        <span className={styles.countPill}>{entity.openQuestions}</span>
      </div>
      {issues.length > 0 ? (
        <ul className={styles.issueList}>
          {issues.map((issue, i) => (
            <li key={i} className={styles.issueItem}>{issue}</li>
          ))}
        </ul>
      ) : (
        <p className={styles.sidebarText}>No open issues.</p>
      )}
    </div>
  );
}
