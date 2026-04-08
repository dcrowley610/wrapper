import { useNavigate } from 'react-router-dom';
import type { RequestInstance, RequestType } from '../../types';
import { formatTaxonomyBreadcrumb, FREQUENCY_LABEL } from '../../config';
import styles from '../../RequestsModule.module.css';

type TemplateSectionProps = {
  request: RequestInstance;
  requestType: RequestType | undefined;
};

export function TemplateSection({ request, requestType }: TemplateSectionProps) {
  const navigate = useNavigate();
  const snapshot = request.templateSnapshot;

  if (!snapshot) {
    return (
      <>
        <h2 className={styles.sectionTitle}>Process reference</h2>
        <p className={styles.sectionCopy}>
          This request was not created from a process definition. It may have been created before the process system was introduced.
        </p>
        {request.requestTypeId && requestType && (
          <div className={styles.notesBlock}>
            <strong>Linked type:</strong>{' '}
            <button
              className={styles.linkButton}
              onClick={() => navigate(`/requests/types/${request.requestTypeId}`)}
              type="button"
            >
              {requestType.name}
            </button>
          </div>
        )}
      </>
    );
  }

  const breadcrumb = formatTaxonomyBreadcrumb(snapshot.taxonomy);

  return (
    <>
      <h2 className={styles.sectionTitle}>Process reference</h2>
      <p className={styles.sectionCopy}>
        Snapshot of the process definition at the time this instance was created.
      </p>

      <dl className={styles.definitionList}>
        <dt>Process name</dt>
        <dd>{snapshot.typeName}</dd>
        <dt>Description</dt>
        <dd>{snapshot.typeDescription}</dd>
        {breadcrumb && (
          <>
            <dt>Taxonomy</dt>
            <dd><span className={styles.taxonomyBreadcrumb}>{breadcrumb}</span></dd>
          </>
        )}
        <dt>Frequency</dt>
        <dd><span className={`${styles.frequencyBadge} ${styles[`freq_${snapshot.defaultFrequency.replace('-', '_')}`] ?? ''}`}>{FREQUENCY_LABEL[snapshot.defaultFrequency]}</span></dd>
        <dt>Instructions</dt>
        <dd>{snapshot.defaultInstructions || '—'}</dd>
        <dt>Expected output</dt>
        <dd>{snapshot.defaultExpectedOutput || '—'}</dd>
        <dt>Snapshot date</dt>
        <dd>{snapshot.snapshotDate}</dd>
      </dl>

      {request.requestTypeId && requestType && (
        <div style={{ marginTop: 16 }}>
          <button
            className={styles.linkButton}
            onClick={() => navigate(`/requests/types/${request.requestTypeId}`)}
            type="button"
          >
            View current process definition &rarr;
          </button>
        </div>
      )}
    </>
  );
}
