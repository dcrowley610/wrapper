import { useNavigate } from 'react-router-dom';
import type { RequestInstance } from '../../types';
import { STATUS_CONFIG } from '../../config';
import { requestsService } from '../../services';
import styles from '../../RequestsModule.module.css';

type PriorPeriodSectionProps = {
  request: RequestInstance;
};

export function PriorPeriodSection({ request }: PriorPeriodSectionProps) {
  const navigate = useNavigate();
  const priorRef = request.priorPeriodRef;
  const priorInstance = request.priorRequestInstanceId
    ? requestsService.getRequestById(request.priorRequestInstanceId)
    : undefined;

  if (!priorRef && !priorInstance) {
    return (
      <>
        <h2 className={styles.sectionTitle}>Prior period reference</h2>
        <p className={styles.sectionCopy}>
          No prior period reference is linked to this request.
        </p>
        <p className={styles.emptyState}>
          If a prior-year version of this request exists, it can be linked here for cross-period context.
        </p>
      </>
    );
  }

  const prior = priorRef;

  return (
    <>
      <h2 className={styles.sectionTitle}>Prior period reference</h2>
      <p className={styles.sectionCopy}>
        Details from the prior period version of this request, preserved for cross-period learning.
      </p>

      <div className={styles.priorPeriodCard}>
        <div className={styles.priorPeriodCardHeader}>
          <button
            className={styles.linkButton}
            onClick={() => navigate(`/requests/${request.priorRequestInstanceId}`)}
            type="button"
          >
            {request.priorRequestInstanceId}
          </button>
          {prior && (
            <span className={styles.pill}>{STATUS_CONFIG[prior.priorStatus]?.label ?? prior.priorStatus}</span>
          )}
        </div>

        {prior && (
          <dl className={styles.definitionList}>
            <dt>Prior due date</dt>
            <dd>{prior.priorDueDate || '—'}</dd>
            <dt>Prior assignee</dt>
            <dd>{prior.priorAssignee || '—'}</dd>
            <dt>Prior notes</dt>
            <dd>{prior.priorNotes || '—'}</dd>
            <dt>Completion summary</dt>
            <dd>{prior.priorCompletionSummary || '—'}</dd>
          </dl>
        )}

        {priorInstance?.executionMethod && (
          <div style={{ marginTop: 16 }}>
            <h3 className={styles.sectionTitle} style={{ fontSize: '0.92rem' }}>Prior execution method</h3>
            <dl className={styles.definitionList}>
              <dt>Fulfillment method</dt>
              <dd>{priorInstance.executionMethod.fulfillmentMethod}</dd>
              <dt>Source system</dt>
              <dd>{priorInstance.executionMethod.sourceSystem || '—'}</dd>
              <dt>Step summary</dt>
              <dd>{priorInstance.executionMethod.stepSummary || '—'}</dd>
              <dt>Effectiveness</dt>
              <dd>{priorInstance.executionMethod.methodEffectiveness || '—'}</dd>
              <dt>Issues encountered</dt>
              <dd>{priorInstance.executionMethod.issuesEncountered || '—'}</dd>
            </dl>
          </div>
        )}
      </div>
    </>
  );
}
