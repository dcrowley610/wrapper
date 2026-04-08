import type { TriggeredRule } from '../../types';
import styles from '../../DocumentsModule.module.css';

type TriggeredRulesSectionProps = {
  rules: TriggeredRule[];
};

function severityCardClass(severity: TriggeredRule['severity']): string {
  switch (severity) {
    case 'info': return styles.severityInfo;
    case 'warning': return styles.severityWarning;
    case 'error': return styles.severityError;
  }
}

function severityBadgeClass(severity: TriggeredRule['severity']): string {
  switch (severity) {
    case 'info': return styles.severityBadgeInfo;
    case 'warning': return styles.severityBadgeWarning;
    case 'error': return styles.severityBadgeError;
  }
}

export function TriggeredRulesSection({ rules }: TriggeredRulesSectionProps) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Rules triggered</h2>
      <p className={styles.sectionCopy}>
        Automated rules that flagged issues or require attention for this document.
      </p>
      {rules.length > 0 ? (
        <div style={{ marginTop: 14 }}>
          {rules.map((rule) => (
            <div key={rule.ruleId} className={`${styles.ruleCard} ${severityCardClass(rule.severity)}`}>
              <h4>
                {rule.ruleName}
                <span className={`${styles.ruleSeverityBadge} ${severityBadgeClass(rule.severity)}`}>
                  {rule.severity}
                </span>
              </h4>
              <p>{rule.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyState}>No rules triggered for this document.</div>
      )}
    </>
  );
}
