import { useNavigate } from 'react-router-dom';
import type { RequestInstance, RequestType } from '../../types';
import { FREQUENCY_LABEL, STATUS_CONFIG } from '../../config';
import { requestsService } from '../../services';
import { PriorPeriodSection } from './PriorPeriodSection';
import styles from '../../RequestsModule.module.css';

type RecurrenceSectionProps = {
  request: RequestInstance;
  requestType: RequestType | undefined;
};

export function RecurrenceSection({ request, requestType }: RecurrenceSectionProps) {
  const navigate = useNavigate();

  const isRecurring = request.frequency !== 'ad-hoc';
  const similarRequests = requestsService.getSimilarRequests(request);
  const sameFundInstances = similarRequests
    .filter((r) => r.fundId === request.fundId)
    .sort((a, b) => a.taxYear.localeCompare(b.taxYear));

  return (
    <>
      <h2 className={styles.sectionTitle}>Recurrence</h2>
      <p className={styles.sectionCopy}>
        Frequency, recurrence driver, and history of related instances.
      </p>

      <div className={styles.metricsRow}>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>
            <span className={`${styles.frequencyBadge} ${styles[`freq_${request.frequency.replace('-', '_')}`] ?? ''}`}>
              {FREQUENCY_LABEL[request.frequency]}
            </span>
          </p>
          <p className={styles.miniMetricLabel}>Frequency</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{isRecurring ? 'Yes' : 'No'}</p>
          <p className={styles.miniMetricLabel}>Recurring</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{request.createdFromRecurringRun ? 'Yes' : 'No'}</p>
          <p className={styles.miniMetricLabel}>Auto-generated</p>
        </div>
      </div>

      {requestType && (
        <dl className={styles.definitionList} style={{ marginTop: 18 }}>
          <dt>Recurrence driver</dt>
          <dd>{requestType.recurrenceDriver || '—'}</dd>
          <dt>Default due offset</dt>
          <dd>{requestType.defaultDueOffsetDays} days from period start</dd>
        </dl>
      )}

      {sameFundInstances.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '0.92rem' }}>Instance timeline (same process + fund)</h3>
          <table className={styles.requestTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Tax Year</th>
                <th>Status</th>
                <th>Owner</th>
                <th>Due Date</th>
              </tr>
            </thead>
            <tbody>
              {sameFundInstances.map((r) => (
                <tr key={r.id}>
                  <td>
                    <button
                      className={styles.linkButton}
                      onClick={() => navigate(`/requests/${r.id}`)}
                      type="button"
                    >
                      {r.id}
                    </button>
                  </td>
                  <td>{r.taxYear}</td>
                  <td><span className={styles.pill}>{STATUS_CONFIG[r.status].label}</span></td>
                  <td>{r.owner}</td>
                  <td>{r.dueDate || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {similarRequests.filter((r) => r.fundId !== request.fundId).length > 0 && (
        <div style={{ marginTop: 24 }}>
          <h3 className={styles.sectionTitle} style={{ fontSize: '0.92rem' }}>Similar requests (other funds)</h3>
          <table className={styles.requestTable}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Fund</th>
                <th>Tax Year</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {similarRequests.filter((r) => r.fundId !== request.fundId).map((r) => (
                <tr key={r.id}>
                  <td>
                    <button className={styles.linkButton} onClick={() => navigate(`/requests/${r.id}`)} type="button">
                      {r.id}
                    </button>
                  </td>
                  <td>{r.fundId ?? '—'}</td>
                  <td>{r.taxYear}</td>
                  <td><span className={styles.pill}>{STATUS_CONFIG[r.status].label}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <hr style={{ margin: '24px 0', border: 'none', borderTop: '1px solid #d6e2eb' }} />
      <PriorPeriodSection request={request} />
    </>
  );
}
