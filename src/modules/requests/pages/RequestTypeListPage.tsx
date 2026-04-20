import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import type { RequestProcess, RequestProcessFormState, RequestCategory, RequestCategoryFormState } from '../types';
import { addDomain, renameDomain } from '../config';
import { requestTypesService, requestCategoriesService, requestPlaybooksService } from '../services';
import { RequestProcessCard } from '../components/RequestTypeCard';
import { RequestProcessForm } from '../components/RequestTypeForm';
import { RequestCategoryForm } from '../components/RequestCategoryForm';
import styles from '../RequestsModule.module.css';

export function RequestLibraryPage() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [showCreateProcess, setShowCreateProcess] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [editingCategory, setEditingCategory] = useState<RequestCategory | null>(null);
  const [modalFullscreen, setModalFullscreen] = useState(false);
  const [showCreateDomain, setShowCreateDomain] = useState(false);
  const [editingDomain, setEditingDomain] = useState<string | null>(null);
  const [newDomainName, setNewDomainName] = useState('');
  const [, forceUpdate] = useState(0);

  const allProcesses = requestTypesService.getActiveRequestTypes();
  const allCategories = requestCategoriesService.getAll();

  const filteredProcesses = useMemo(() => {
    if (!searchValue.trim()) return allProcesses;
    return requestTypesService.searchRequestTypes(searchValue);
  }, [allProcesses, searchValue]);

  const allPlaybooks = requestPlaybooksService.getAll();

  // Group by domain > category > playbook > processes
  type PlaybookGroup = { playbookName: string; playbookId: string; processes: RequestProcess[] };
  type CategoryGroup = { category: RequestCategory | undefined; playbooks: Map<string, PlaybookGroup> };
  const grouped = useMemo(() => {
    const map = new Map<string, Map<string, CategoryGroup>>();
    for (const proc of filteredProcesses) {
      const domain = proc.taxonomy.domain || 'Uncategorized';
      const cat = requestCategoriesService.getById(proc.categoryId);
      const categoryName = cat?.name || proc.taxonomy.category || 'General';
      if (!map.has(domain)) map.set(domain, new Map());
      const catMap = map.get(domain)!;
      if (!catMap.has(categoryName)) catMap.set(categoryName, { category: cat, playbooks: new Map() });
      const catGroup = catMap.get(categoryName)!;
      const pb = requestPlaybooksService.getById(proc.playbookId);
      const pbName = pb?.name ?? proc.defaultPlaybook ?? 'No playbook';
      if (!catGroup.playbooks.has(proc.playbookId)) {
        catGroup.playbooks.set(proc.playbookId, { playbookName: pbName, playbookId: proc.playbookId, processes: [] });
      }
      catGroup.playbooks.get(proc.playbookId)!.processes.push(proc);
    }
    return map;
  }, [filteredProcesses]);

  function handleCreateProcess(_form: RequestProcessFormState) {
    setShowCreateProcess(false);
    setModalFullscreen(false);
  }

  function handleCreateCategory(_form: RequestCategoryFormState) {
    setShowCreateCategory(false);
    setModalFullscreen(false);
  }

  function handleEditCategory(_form: RequestCategoryFormState) {
    setEditingCategory(null);
    setModalFullscreen(false);
  }

  function handleCreateDomain() {
    if (!newDomainName.trim()) return;
    addDomain(newDomainName.trim());
    setShowCreateDomain(false);
    setNewDomainName('');
    setModalFullscreen(false);
    forceUpdate((n) => n + 1);
  }

  function handleEditDomain() {
    if (!newDomainName.trim() || !editingDomain) return;
    renameDomain(editingDomain, newDomainName.trim());
    setEditingDomain(null);
    setNewDomainName('');
    setModalFullscreen(false);
    forceUpdate((n) => n + 1);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.eyebrow}>Request Library</div>
          <h1 className={styles.title}>Categories and processes</h1>
          <div className={styles.metricsRow}>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{allCategories.length}</p>
              <p className={styles.miniMetricLabel}>Categories</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{allPlaybooks.length}</p>
              <p className={styles.miniMetricLabel}>Playbooks</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{allProcesses.length}</p>
              <p className={styles.miniMetricLabel}>Active processes</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{allProcesses.filter((t) => t.defaultFrequency === 'annual').length}</p>
              <p className={styles.miniMetricLabel}>Annual</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{allProcesses.filter((t) => t.defaultFrequency === 'quarterly').length}</p>
              <p className={styles.miniMetricLabel}>Quarterly</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{allProcesses.filter((t) => t.defaultFrequency === 'event-driven').length}</p>
              <p className={styles.miniMetricLabel}>Event-driven</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <label className={styles.fieldLabel} htmlFor="process-search">Search processes</label>
            <input
              id="process-search"
              className={styles.input}
              placeholder="Search by name, description, or tag"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
        </div>

        <div className={styles.listHeader}>
          <h2 className={styles.sectionTitle}>All processes</h2>
          <span className={styles.countPill}>{filteredProcesses.length} process{filteredProcesses.length !== 1 ? 'es' : ''}</span>
          <button className={styles.typeLibraryBtn} onClick={() => navigate('/requests')} type="button">
            Back to Requests
          </button>
        </div>

        {Array.from(grouped.entries()).map(([domain, catMap]) => (
          <div key={domain} style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
              <h3 className={styles.sectionTitle} style={{ fontSize: '1rem', marginBottom: 0 }}>{domain}</h3>
              <button
                className={styles.linkButton}
                onClick={() => { setEditingDomain(domain); setNewDomainName(domain); }}
                type="button"
                style={{ fontSize: '0.78rem' }}
              >
                Edit
              </button>
            </div>
            {Array.from(catMap.entries()).map(([categoryName, { category, playbooks: pbMap }]) => (
              <div key={categoryName} style={{ marginLeft: 16, marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <h4 className={styles.sectionTitle} style={{ fontSize: '0.88rem', color: '#6a7f90', marginBottom: 0 }}>{categoryName}</h4>
                  {category && (
                    <button
                      className={styles.linkButton}
                      onClick={() => setEditingCategory(category)}
                      type="button"
                      style={{ fontSize: '0.78rem' }}
                    >
                      Edit
                    </button>
                  )}
                </div>
                {Array.from(pbMap.entries()).map(([pbId, { playbookName, processes }]) => (
                  <div key={pbId} style={{ marginLeft: 16, marginBottom: 12 }}>
                    <h5 className={styles.sectionTitle} style={{ fontSize: '0.82rem', color: '#345060', marginBottom: 6, fontStyle: 'italic' }}>
                      {playbookName}
                    </h5>
                    <div className={styles.typeCardGrid}>
                      {processes.map((proc) => (
                        <RequestProcessCard
                          key={proc.id}
                          requestType={proc}
                          onClick={() => navigate(`/requests/types/${proc.id}`)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {filteredProcesses.length === 0 && (
          <div className={styles.emptyState}>No processes match your search.</div>
        )}

        <div className={styles.intakeToggle}>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className={styles.intakeToggleBtn} onClick={() => setShowCreateProcess(true)} type="button">
              + Create process
            </button>
            <button className={styles.intakeToggleBtn} onClick={() => setShowCreateCategory(true)} type="button">
              + Create category
            </button>
            <button className={styles.intakeToggleBtn} onClick={() => { setShowCreateDomain(true); setNewDomainName(''); }} type="button">
              + Create domain
            </button>
          </div>
        </div>

        {editingCategory && createPortal(
          <div className={styles.importOverlay} onClick={() => { setEditingCategory(null); setModalFullscreen(false); }}>
            <div className={`${styles.importModal} ${modalFullscreen ? styles.importModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeaderRow}>
                <h3 className={styles.importTitle}>Edit category: {editingCategory.name}</h3>
                <div>
                  <button className={styles.modalIconBtn} onClick={() => setModalFullscreen((f) => !f)} type="button" title="Toggle full screen">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
                    </svg>
                  </button>
                  <button className={styles.modalIconBtn} onClick={() => { setEditingCategory(null); setModalFullscreen(false); }} type="button" title="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              <RequestCategoryForm
                initial={{ name: editingCategory.name, description: editingCategory.description, domain: editingCategory.domain }}
                onSubmit={handleEditCategory}
                onCancel={() => { setEditingCategory(null); setModalFullscreen(false); }}
                submitLabel="Save category"
              />
            </div>
          </div>,
          document.body,
        )}

        {showCreateProcess && createPortal(
          <div className={styles.importOverlay} onClick={() => { setShowCreateProcess(false); setModalFullscreen(false); }}>
            <div className={`${styles.importModal} ${modalFullscreen ? styles.importModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeaderRow}>
                <h3 className={styles.importTitle}>Create process</h3>
                <div>
                  <button className={styles.modalIconBtn} onClick={() => setModalFullscreen((f) => !f)} type="button" title="Toggle full screen">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
                    </svg>
                  </button>
                  <button className={styles.modalIconBtn} onClick={() => { setShowCreateProcess(false); setModalFullscreen(false); }} type="button" title="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              <RequestProcessForm
                onSubmit={handleCreateProcess}
                onCancel={() => { setShowCreateProcess(false); setModalFullscreen(false); }}
              />
            </div>
          </div>,
          document.body,
        )}

        {showCreateCategory && createPortal(
          <div className={styles.importOverlay} onClick={() => { setShowCreateCategory(false); setModalFullscreen(false); }}>
            <div className={`${styles.importModal} ${modalFullscreen ? styles.importModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeaderRow}>
                <h3 className={styles.importTitle}>Create category</h3>
                <div>
                  <button className={styles.modalIconBtn} onClick={() => setModalFullscreen((f) => !f)} type="button" title="Toggle full screen">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
                    </svg>
                  </button>
                  <button className={styles.modalIconBtn} onClick={() => { setShowCreateCategory(false); setModalFullscreen(false); }} type="button" title="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              <RequestCategoryForm
                onSubmit={handleCreateCategory}
                onCancel={() => { setShowCreateCategory(false); setModalFullscreen(false); }}
              />
            </div>
          </div>,
          document.body,
        )}

        {showCreateDomain && createPortal(
          <div className={styles.importOverlay} onClick={() => { setShowCreateDomain(false); setModalFullscreen(false); }}>
            <div className={`${styles.importModal} ${modalFullscreen ? styles.importModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeaderRow}>
                <h3 className={styles.importTitle}>Create domain</h3>
                <div>
                  <button className={styles.modalIconBtn} onClick={() => setModalFullscreen((f) => !f)} type="button" title="Toggle full screen">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
                    </svg>
                  </button>
                  <button className={styles.modalIconBtn} onClick={() => { setShowCreateDomain(false); setModalFullscreen(false); }} type="button" title="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.intakeForm}>
                <div className={styles.intakeFormFull}>
                  <label className={styles.fieldLabel}>Domain name</label>
                  <input className={styles.input} value={newDomainName} onChange={(e) => setNewDomainName(e.target.value)} placeholder="e.g., Tax Compliance" />
                </div>
                <div className={styles.intakeActions}>
                  <button className={styles.cancelBtn} onClick={() => { setShowCreateDomain(false); setModalFullscreen(false); }} type="button">Cancel</button>
                  <button className={styles.submitBtn} onClick={handleCreateDomain} type="button" disabled={!newDomainName.trim()}>Create domain</button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}

        {editingDomain && createPortal(
          <div className={styles.importOverlay} onClick={() => { setEditingDomain(null); setModalFullscreen(false); }}>
            <div className={`${styles.importModal} ${modalFullscreen ? styles.importModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeaderRow}>
                <h3 className={styles.importTitle}>Edit domain: {editingDomain}</h3>
                <div>
                  <button className={styles.modalIconBtn} onClick={() => setModalFullscreen((f) => !f)} type="button" title="Toggle full screen">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
                    </svg>
                  </button>
                  <button className={styles.modalIconBtn} onClick={() => { setEditingDomain(null); setModalFullscreen(false); }} type="button" title="Close">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="4" y1="4" x2="12" y2="12" />
                      <line x1="12" y1="4" x2="4" y2="12" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className={styles.intakeForm}>
                <div className={styles.intakeFormFull}>
                  <label className={styles.fieldLabel}>Domain name</label>
                  <input className={styles.input} value={newDomainName} onChange={(e) => setNewDomainName(e.target.value)} placeholder="e.g., Tax Compliance" />
                </div>
                <div className={styles.intakeActions}>
                  <button className={styles.cancelBtn} onClick={() => { setEditingDomain(null); setModalFullscreen(false); }} type="button">Cancel</button>
                  <button className={styles.submitBtn} onClick={handleEditDomain} type="button" disabled={!newDomainName.trim()}>Save domain</button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
      </section>
    </div>
  );
}

/** Backward-compat alias */
export const RequestTypeListPage = RequestLibraryPage;
