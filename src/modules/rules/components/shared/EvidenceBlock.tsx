import type { StepEvidence } from '../../types';
import { EVIDENCE_TYPE_LABELS } from '../../config';
import styles from '../../RulesModule.module.css';

type EvidenceBlockProps = {
  evidence: StepEvidence[];
};

export function EvidenceBlock({ evidence }: EvidenceBlockProps) {
  if (evidence.length === 0) return null;

  return (
    <div>
      {evidence.map((ev) => (
        <div key={ev.id} className={styles.evidenceItem}>
          <span className={styles.evidenceIcon}>&#9679;</span>
          <div className={styles.evidenceText}>
            <div className={styles.evidenceSource}>{ev.source}</div>
            <div className={styles.evidenceDesc}>{ev.description}</div>
            <div className={styles.evidenceType}>
              {EVIDENCE_TYPE_LABELS[ev.evidenceType]}
              {ev.documentRef && <> &middot; Ref: {ev.documentRef}</>}
              {' '}&middot; {ev.addedBy} &middot; {ev.addedDate}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
