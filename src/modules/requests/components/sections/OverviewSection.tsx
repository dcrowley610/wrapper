import { useNavigate } from 'react-router-dom';
import type { RequestInstance } from '../../types';
import { STATUS_CONFIG, FREQUENCY_LABEL, formatTaxonomyBreadcrumb } from '../../config';
import { requestTypesService, requestPlaybooksService } from '../../services';
import styles from '../../RequestsModule.module.css';

export function OverviewSection({ request }: { request: RequestInstance }) {
  const navigate = useNavigate();
  const requestType = request.requestTypeId
    ? requestTypesService.getRequestTypeById(request.requestTypeId)
    : undefined;

  const taxonomy = request.templateSnapshot?.taxonomy ?? requestType?.taxonomy;
  const breadcrumb = taxonomy ? formatTaxonomyBreadcrumb(taxonomy) : '';

  return (
    <>
      <h2 className={styles.sectionTitle}>Request overview</h2>
      <p className={styles.sectionCopy}>
        Summary, current stage, and key details for this information request.
      </p>

      {/* Type badge + taxonomy breadcrumb */}
      {(requestType || breadcrumb) && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 14, alignItems: 'center' }}>
          {requestType && (
            <button
              className={styles.linkButton}
              onClick={() => navigate(`/requests/types/${requestType.id}`)}
              type="button"
            >
              {requestType.name}
            </button>
          )}
          {breadcrumb && (
            <span className={styles.taxonomyBreadcrumb}>{breadcrumb}</span>
          )}
          <span className={`${styles.frequencyBadge} ${styles[`freq_${request.frequency.replace('-', '_')}`] ?? ''}`}>
            {FREQUENCY_LABEL[request.frequency]}
          </span>
          {request.priorRequestInstanceId && (
            <button
              className={styles.linkButton}
              onClick={() => navigate(`/requests/${request.id}/recurrence`)}
              type="button"
            >
              Prior: {request.priorRequestInstanceId}
            </button>
          )}
        </div>
      )}

      <div className={styles.metricsRow}>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{STATUS_CONFIG[request.status].label}</p>
          <p className={styles.miniMetricLabel}>Status</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{request.requiredDocuments.length}</p>
          <p className={styles.miniMetricLabel}>Documents</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{request.linkedEntities.length}</p>
          <p className={styles.miniMetricLabel}>Linked Entities</p>
        </div>
        <div className={styles.miniMetric}>
          <p className={styles.miniMetricValue}>{request.latestExpectedDate || 'None'}</p>
          <p className={styles.miniMetricLabel}>Expected Date</p>
        </div>
      </div>

      <div className={styles.notesBlock}>{request.summary}</div>
      <div className={styles.ownerCallout}>
        Owner: {request.owner} &middot; Playbook: {request.playbookId ? (requestPlaybooksService.getById(request.playbookId)?.name ?? request.playbookId) : 'None'}
      </div>

      <dl className={styles.definitionList} style={{ marginTop: 18 }}>
        <dt>Stage</dt>
        <dd>{request.stage}</dd>
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
        {request.requestor && (
          <>
            <dt>Requestor</dt>
            <dd>{request.requestor}</dd>
          </>
        )}
        {request.dueDate && (
          <>
            <dt>Due Date</dt>
            <dd>{request.dueDate}</dd>
          </>
        )}
        <dt>Created</dt>
        <dd>{request.createdDate}</dd>
        <dt>Last Updated</dt>
        <dd>{request.lastUpdatedDate}</dd>
        <dt>Scope</dt>
        <dd>{request.scopeIds.join(', ')}</dd>
      </dl>
    </>
  );
}
