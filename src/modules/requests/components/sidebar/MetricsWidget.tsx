import type { WorkflowRequest } from '../../types';
import { FREQUENCY_LABEL } from '../../config';
import styles from '../../RequestsModule.module.css';

export function MetricsWidget({ request }: { request: WorkflowRequest }) {
  return (
    <div className={styles.sidePanel}>
      <h3 className={styles.sidePanelTitle}>Details</h3>
      <dl className={styles.definitionList}>
        <dt>Expected Date</dt>
        <dd>{request.latestExpectedDate || 'Not set'}</dd>
        {request.dueDate && (
          <>
            <dt>Due Date</dt>
            <dd>{request.dueDate}</dd>
          </>
        )}
        {request.fundId && (
          <>
            <dt>Fund</dt>
            <dd>{request.fundId}</dd>
          </>
        )}
        {request.taxYear && (
          <>
            <dt>Tax Year</dt>
            <dd>{request.taxYear}</dd>
          </>
        )}
        {request.frequency && (
          <>
            <dt>Frequency</dt>
            <dd>{FREQUENCY_LABEL[request.frequency]}</dd>
          </>
        )}
        {request.requestor && (
          <>
            <dt>Requestor</dt>
            <dd>{request.requestor}</dd>
          </>
        )}
        {(request.periodStart || request.periodEnd) && (
          <>
            <dt>Period</dt>
            <dd>{request.periodStart} — {request.periodEnd}</dd>
          </>
        )}
        <dt>Created</dt>
        <dd>{request.createdDate}</dd>
        <dt>Last Updated</dt>
        <dd>{request.lastUpdatedDate}</dd>
        <dt>Documents</dt>
        <dd>{request.requiredDocuments.length}</dd>
        <dt>Entities</dt>
        <dd>{request.linkedEntities.length}</dd>
      </dl>
    </div>
  );
}
