import type { RuleReference } from '../../types';
import styles from '../../RulesModule.module.css';

type RuleReferenceChipProps = {
  rule: RuleReference;
};

export function RuleReferenceChip({ rule }: RuleReferenceChipProps) {
  return (
    <span className={styles.ruleChip} title={rule.applicationNote}>
      <span className={styles.ruleChipType}>{rule.ruleType}</span>
      {rule.ruleName}
    </span>
  );
}
