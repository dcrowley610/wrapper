import type { RequestStatus } from '../../types';
import { STATUS_CONFIG, WORKFLOW_COLUMNS } from '../../config';
import styles from '../../RequestsModule.module.css';

type StatusStepperWidgetProps = {
  currentStatus: RequestStatus;
  onStatusChange: (status: RequestStatus) => void;
};

export function StatusStepperWidget({ currentStatus, onStatusChange }: StatusStepperWidgetProps) {
  const currentIndex = WORKFLOW_COLUMNS.indexOf(currentStatus);

  return (
    <div className={styles.sidePanel}>
      <h3 className={styles.sidePanelTitle}>Workflow status</h3>
      <div className={styles.stepperTrack}>
        {WORKFLOW_COLUMNS.map((col, i) => {
          let cls = styles.stepperStep;
          if (i < currentIndex) cls += ` ${styles.stepperStepComplete}`;
          if (i === currentIndex) cls += ` ${styles.stepperStepActive}`;

          return (
            <button
              key={col}
              className={cls}
              onClick={() => onStatusChange(col)}
              type="button"
              title={STATUS_CONFIG[col].stage}
            >
              {STATUS_CONFIG[col].label}
            </button>
          );
        })}
      </div>
      <p style={{ marginTop: 10, fontSize: '0.85rem', color: '#6a7f90' }}>
        {STATUS_CONFIG[currentStatus].stage}
      </p>
    </div>
  );
}
