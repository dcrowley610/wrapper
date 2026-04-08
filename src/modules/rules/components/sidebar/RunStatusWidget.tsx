import type { ProcessRunStatus } from '../../types';
import { RUN_STATUS_CONFIG, RUN_STATUS_ORDER } from '../../config';
import styles from '../../RulesModule.module.css';

type RunStatusWidgetProps = {
  currentStatus: ProcessRunStatus;
  onStatusChange: (status: ProcessRunStatus) => void;
};

export function RunStatusWidget({ currentStatus, onStatusChange }: RunStatusWidgetProps) {
  const currentIndex = RUN_STATUS_ORDER.indexOf(currentStatus);
  // Exclude 'cancelled' from the stepper track — it's a terminal state, not a progression step
  const displayStatuses = RUN_STATUS_ORDER.filter((s) => s !== 'cancelled');

  return (
    <div className={styles.sidePanel}>
      <h4 className={styles.sidePanelTitle}>Process Status</h4>
      <div className={styles.stepperTrack}>
        {displayStatuses.map((status) => {
          const idx = RUN_STATUS_ORDER.indexOf(status);
          let cls = styles.stepperStep;
          if (status === currentStatus) cls += ` ${styles.stepperStepActive}`;
          else if (idx < currentIndex) cls += ` ${styles.stepperStepComplete}`;

          return (
            <button
              key={status}
              className={cls}
              onClick={() => onStatusChange(status)}
              type="button"
            >
              {RUN_STATUS_CONFIG[status].label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
