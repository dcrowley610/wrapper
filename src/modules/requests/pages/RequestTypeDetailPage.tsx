import { useNavigate, useParams } from 'react-router-dom';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { REQUEST_PROCESS_SECTIONS, FREQUENCY_LABEL, formatTaxonomyBreadcrumb, STATUS_CONFIG } from '../config';
import type { RequestProcessSectionKey } from '../config';
import { requestTypesService, requestsService, requestCategoriesService, requestPlaybooksService } from '../services';
import styles from '../RequestsModule.module.css';

const VALID_SECTIONS: RequestProcessSectionKey[] = ['overview', 'defaults', 'history'];

export function RequestProcessDetailPage() {
  const { typeId, section } = useParams();
  const navigate = useNavigate();

  const activeSection = VALID_SECTIONS.includes(section as RequestProcessSectionKey)
    ? (section as RequestProcessSectionKey)
    : 'overview';

  const requestProcess = typeId ? requestTypesService.getRequestTypeById(typeId) : undefined;

  if (!requestProcess) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Process not found.</div>
      </div>
    );
  }

  const instances = requestsService.getRequestsByTypeId(requestProcess.id);
  const breadcrumb = formatTaxonomyBreadcrumb(requestProcess.taxonomy);
  const category = requestCategoriesService.getById(requestProcess.categoryId);

  return (
    <div className={styles.page}>
      <section className={styles.detailWorkspace}>
        <SectionNav
          sections={REQUEST_PROCESS_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/requests/types/${typeId}/${key}`)}
          accentColor="#1678a2"
        />

        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            {activeSection === 'overview' && (
              <>
                <h2 className={styles.sectionTitle}>{requestProcess.name}</h2>
                <p className={styles.sectionCopy}>{requestProcess.description}</p>

                {(breadcrumb || category) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16, alignItems: 'center' }}>
                    {breadcrumb && (
                      <span className={styles.taxonomyBreadcrumb}>{breadcrumb}</span>
                    )}
                    {category && (
                      <span className={styles.pill}>{category.name}</span>
                    )}
                  </div>
                )}

                <div className={styles.metricsRow}>
                  <div className={styles.miniMetric}>
                    <p className={styles.miniMetricValue}>
                      <span className={`${styles.frequencyBadge} ${styles[`freq_${requestProcess.defaultFrequency.replace('-', '_')}`] ?? ''}`}>
                        {FREQUENCY_LABEL[requestProcess.defaultFrequency]}
                      </span>
                    </p>
                    <p className={styles.miniMetricLabel}>Frequency</p>
                  </div>
                  <div className={styles.miniMetric}>
                    <p className={styles.miniMetricValue}>{instances.length}</p>
                    <p className={styles.miniMetricLabel}>Instances</p>
                  </div>
                  <div className={styles.miniMetric}>
                    <p className={styles.miniMetricValue}>{requestProcess.standardizationLevel}</p>
                    <p className={styles.miniMetricLabel}>Standardization</p>
                  </div>
                </div>

                <dl className={styles.definitionList} style={{ marginTop: 18 }}>
                  <dt>Recurrence driver</dt>
                  <dd>{requestProcess.recurrenceDriver || '—'}</dd>
                  <dt>Risk notes</dt>
                  <dd>{requestProcess.riskNotes || '—'}</dd>
                  <dt>Tags</dt>
                  <dd>{requestProcess.tags.length > 0 ? requestProcess.tags.join(', ') : '—'}</dd>
                  <dt>Created</dt>
                  <dd>{requestProcess.createdDate}</dd>
                  <dt>Last modified</dt>
                  <dd>{requestProcess.lastModifiedDate}</dd>
                </dl>
              </>
            )}

            {activeSection === 'defaults' && (
              <>
                <h2 className={styles.sectionTitle}>Default values</h2>
                <p className={styles.sectionCopy}>
                  These defaults are applied when a new instance is created from this process. They can be overridden per-instance.
                </p>
                <dl className={styles.definitionList}>
                  <dt>Default owner</dt>
                  <dd>{requestProcess.defaultOwner || '—'}</dd>
                  <dt>Default playbook</dt>
                  <dd>{requestPlaybooksService.getById(requestProcess.playbookId)?.name ?? requestProcess.defaultPlaybook ?? '—'}</dd>
                  <dt>Default priority</dt>
                  <dd>{requestProcess.defaultPriority || '—'}</dd>
                  <dt>Due offset (days from period start)</dt>
                  <dd>{requestProcess.defaultDueOffsetDays}</dd>
                  <dt>Default instructions</dt>
                  <dd style={{ whiteSpace: 'pre-wrap' }}>{requestProcess.defaultInstructions || '—'}</dd>
                  <dt>Expected output</dt>
                  <dd style={{ whiteSpace: 'pre-wrap' }}>{requestProcess.defaultExpectedOutput || '—'}</dd>
                </dl>
              </>
            )}

            {activeSection === 'history' && (
              <>
                <h2 className={styles.sectionTitle}>Instance history</h2>
                <p className={styles.sectionCopy}>
                  All request instances that have been created from this process.
                </p>
                {instances.length > 0 ? (
                  <table className={styles.requestTable}>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Fund</th>
                        <th>Tax Year</th>
                        <th>Status</th>
                        <th>Owner</th>
                        <th>Due Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {instances.map((inst) => (
                        <tr key={inst.id}>
                          <td>
                            <button
                              className={styles.linkButton}
                              onClick={() => navigate(`/requests/${inst.id}`)}
                              type="button"
                            >
                              {inst.id}
                            </button>
                          </td>
                          <td>{inst.title}</td>
                          <td>{inst.fundId ?? '—'}</td>
                          <td>{inst.taxYear || '—'}</td>
                          <td><span className={styles.pill}>{STATUS_CONFIG[inst.status].label}</span></td>
                          <td>{inst.owner}</td>
                          <td>{inst.dueDate || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className={styles.emptyState}>No instances have been created from this process yet.</div>
                )}
              </>
            )}
          </div>

          <aside className={styles.sideStack}>
            <div className={styles.sidePanel}>
              <h3 className={styles.sidePanelTitle}>Actions</h3>
              <button
                className={styles.typeLibraryBtn}
                onClick={() => navigate('/requests/types')}
                type="button"
                style={{ marginBottom: 8, width: '100%' }}
              >
                Back to Request Library
              </button>
            </div>
            <div className={styles.sidePanel}>
              <h3 className={styles.sidePanelTitle}>Summary</h3>
              <dl className={styles.definitionList}>
                <dt>Frequency</dt>
                <dd>{FREQUENCY_LABEL[requestProcess.defaultFrequency]}</dd>
                <dt>Instances</dt>
                <dd>{instances.length}</dd>
                <dt>Status</dt>
                <dd>{requestProcess.active ? 'Active' : 'Archived'}</dd>
              </dl>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

/** Backward-compat alias */
export const RequestTypeDetailPage = RequestProcessDetailPage;
