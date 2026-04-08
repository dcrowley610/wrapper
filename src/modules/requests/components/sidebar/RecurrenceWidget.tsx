import { useNavigate } from 'react-router-dom';
import type { RequestInstance, RequestType } from '../../types';
import { FREQUENCY_LABEL } from '../../config';
import styles from '../../RequestsModule.module.css';

type RecurrenceWidgetProps = {
  request: RequestInstance;
  requestType: RequestType | undefined;
};

export function RecurrenceWidget({ request, requestType }: RecurrenceWidgetProps) {
  const navigate = useNavigate();
  const isRecurring = request.frequency !== 'ad-hoc';

  return (
    <div className={styles.sidePanel}>
      <h3 className={styles.sidePanelTitle}>Recurrence</h3>
      <dl className={styles.definitionList}>
        <dt>Frequency</dt>
        <dd>
          <span className={`${styles.frequencyBadge} ${styles[`freq_${request.frequency.replace('-', '_')}`] ?? ''}`}>
            {FREQUENCY_LABEL[request.frequency]}
          </span>
        </dd>
        <dt>Recurrence</dt>
        <dd>{isRecurring ? 'Recurring' : 'Ad hoc'}</dd>
        {requestType?.recurrenceDriver && (
          <>
            <dt>Driver</dt>
            <dd>{requestType.recurrenceDriver}</dd>
          </>
        )}
        {request.priorRequestInstanceId && (
          <>
            <dt>Prior period</dt>
            <dd>
              <button
                className={styles.linkButton}
                onClick={() => navigate(`/requests/${request.priorRequestInstanceId}`)}
                type="button"
              >
                {request.priorRequestInstanceId}
              </button>
            </dd>
          </>
        )}
      </dl>
    </div>
  );
}
