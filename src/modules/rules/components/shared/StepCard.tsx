import type { ProcessRunStep } from '../../types';
import { STEP_STATUS_CONFIG, STEP_TYPE_LABELS } from '../../config';
import { StatusBadge } from './StatusBadge';
import { EvidenceBlock } from './EvidenceBlock';
import { NoteBlock } from './NoteBlock';
import { DecisionBlock } from './DecisionBlock';
import { RuleReferenceChip } from './RuleReferenceChip';
import { ExceptionBanner } from './ExceptionBanner';
import styles from '../../RulesModule.module.css';

type StepCardProps = {
  step: ProcessRunStep;
  isExpanded: boolean;
  onToggle: () => void;
};

function getOrderClass(step: ProcessRunStep): string {
  if (step.isException) return styles.stepOrderException;
  if (step.status === 'completed') return styles.stepOrderCompleted;
  if (step.status === 'inProgress') return styles.stepOrderInProgress;
  return '';
}

export function StepCard({ step, isExpanded, onToggle }: StepCardProps) {
  const hasContent =
    step.evidence.length > 0 ||
    step.notes.length > 0 ||
    step.decisions.length > 0 ||
    step.ruleReferences.length > 0 ||
    step.isException;

  return (
    <div className={styles.stepCard}>
      <div className={styles.stepCardHeader} onClick={onToggle}>
        <span className={`${styles.stepOrder} ${getOrderClass(step)}`}>{step.order}</span>
        <span className={styles.stepTitle}>{step.title}</span>
        <span className={styles.stepMeta}>
          <span className={styles.stepOwner}>{step.owner}</span>
          <StatusBadge status={step.status} configMap={STEP_STATUS_CONFIG} />
          <span style={{ fontSize: 10, color: '#8a9baa' }}>{STEP_TYPE_LABELS[step.stepType]}</span>
          {step.isException && <span className={styles.exceptionIcon}>!</span>}
          <span className={`${styles.chevron} ${isExpanded ? styles.chevronOpen : ''}`}>&#9656;</span>
        </span>
      </div>

      {isExpanded && (
        <div className={styles.stepCardBody}>
          <p className={styles.stepDescription}>{step.description}</p>

          {step.isException && step.exceptionReason && (
            <ExceptionBanner reason={step.exceptionReason} />
          )}

          {step.decisions.length > 0 && (
            <div className={styles.stepSection}>
              <div className={styles.stepSectionLabel}>Decisions</div>
              <DecisionBlock decisions={step.decisions} />
            </div>
          )}

          {step.evidence.length > 0 && (
            <div className={styles.stepSection}>
              <div className={styles.stepSectionLabel}>Evidence / Sources</div>
              <EvidenceBlock evidence={step.evidence} />
            </div>
          )}

          {step.notes.length > 0 && (
            <div className={styles.stepSection}>
              <div className={styles.stepSectionLabel}>Notes</div>
              <NoteBlock notes={step.notes} />
            </div>
          )}

          {step.ruleReferences.length > 0 && (
            <div className={styles.stepSection}>
              <div className={styles.stepSectionLabel}>Rules Referenced</div>
              <div>
                {step.ruleReferences.map((r) => (
                  <RuleReferenceChip key={r.ruleId} rule={r} />
                ))}
              </div>
            </div>
          )}

          {step.aiAutomationCandidate && step.aiAutomationNotes && (
            <div className={styles.stepSection}>
              <div className={styles.stepSectionLabel}>
                <span className={styles.aiLabel}>AI</span> Automation Opportunity
              </div>
              <div style={{ fontSize: '0.76rem', color: '#557082' }}>{step.aiAutomationNotes}</div>
            </div>
          )}

          {!hasContent && (
            <div style={{ color: '#8a9baa', fontSize: '0.78rem' }}>
              No evidence, notes, or decisions recorded yet.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
