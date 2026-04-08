import { useState } from 'react';
import styles from '../IdentityModule.module.css';

type ResolutionActionBarProps = {
  taskStatus: string;
  selectedCandidateId: string | null;
  hasPendingCandidates: boolean;
  onConfirmMatch: () => void;
  onCreateNew: () => void;
  onRejectCandidate: () => void;
  onDefer: (reason: string) => void;
};

export function ResolutionActionBar({
  taskStatus,
  selectedCandidateId,
  hasPendingCandidates,
  onConfirmMatch,
  onCreateNew,
  onRejectCandidate,
  onDefer,
}: ResolutionActionBarProps) {
  const [showDefer, setShowDefer] = useState(false);
  const [deferReason, setDeferReason] = useState('');

  if (taskStatus === 'resolved' || taskStatus === 'deferred') {
    return (
      <div className={styles.actionBar}>
        <span className={`${styles.badge} ${taskStatus === 'resolved' ? styles.badgeResolved : styles.badgeDeferred}`}>
          Task {taskStatus}
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={styles.actionBar}>
        <button
          className={styles.btnPrimary}
          disabled={!selectedCandidateId}
          onClick={onConfirmMatch}
          type="button"
        >
          Confirm Match
        </button>
        <button
          className={styles.btnSecondary}
          onClick={onCreateNew}
          type="button"
        >
          Create New Master
        </button>
        {hasPendingCandidates && selectedCandidateId && (
          <button
            className={styles.btnDanger}
            onClick={onRejectCandidate}
            type="button"
          >
            Reject Candidate
          </button>
        )}
        <button
          className={styles.btnSecondary}
          onClick={() => setShowDefer(true)}
          type="button"
        >
          Defer
        </button>
      </div>

      {showDefer && (
        <div className={styles.modalOverlay} onClick={() => setShowDefer(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <p className={styles.modalTitle}>Defer Task</p>
            <textarea
              className={styles.textarea}
              placeholder="Reason for deferring..."
              value={deferReason}
              onChange={(e) => setDeferReason(e.target.value)}
            />
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setShowDefer(false)} type="button">
                Cancel
              </button>
              <button
                className={styles.btnPrimary}
                disabled={!deferReason.trim()}
                onClick={() => {
                  onDefer(deferReason.trim());
                  setShowDefer(false);
                  setDeferReason('');
                }}
                type="button"
              >
                Defer
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
