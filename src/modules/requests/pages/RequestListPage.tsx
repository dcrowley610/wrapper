import { lazy, Suspense, useCallback, useMemo, useReducer, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext, matchesScope } from '../../../platform/context';
import { SCOPE_DIMENSIONS } from '../../../platform/context/platformContext.types';
import type { RequestComment, RequestFormState, RequestStatus, WorkflowRequest } from '../types';
import { REQUEST_FILTERS, STATUS_CONFIG, FREQUENCY_LABEL } from '../config';
import { requestsService, requestTypesService, requestPlaybooksService } from '../services';
import { RequestTable } from '../components/RequestTable';
import { RequestKanbanBoard } from '../components/RequestKanbanBoard';
import { RequestIntakeForm } from '../components/RequestIntakeForm';
import { RequestEditModal } from '../components/RequestEditModal';
import { RequestCommentModal } from '../components/RequestCommentModal';
import styles from '../RequestsModule.module.css';

const RequestImport = lazy(() =>
  import('../components/RequestImport').then((m) => ({ default: m.RequestImport })),
);

type ListAction =
  | { type: 'SET_STATUS'; requestId: string; status: RequestStatus }
  | { type: 'SET_OWNER'; requestId: string; owner: string }
  | { type: 'ADD_REQUEST'; request: WorkflowRequest }
  | { type: 'EDIT_REQUEST'; requestId: string; updates: RequestFormState }
  | { type: 'DELETE_REQUEST'; requestId: string }
  | { type: 'ADD_COMMENT'; requestId: string; comment: RequestComment };

function listReducer(state: WorkflowRequest[], action: ListAction): WorkflowRequest[] {
  switch (action.type) {
    case 'SET_STATUS':
      return state.map((r) =>
        r.id === action.requestId
          ? { ...r, status: action.status, stage: STATUS_CONFIG[action.status].stage, lastUpdatedDate: new Date().toISOString().slice(0, 10) }
          : r
      );
    case 'SET_OWNER':
      return state.map((r) => {
        if (r.id !== action.requestId) return r;
        const newStatus = r.status === 'new' ? 'assigned' as const : r.status;
        return { ...r, owner: action.owner, status: newStatus, stage: STATUS_CONFIG[newStatus].stage, lastUpdatedDate: new Date().toISOString().slice(0, 10) };
      });
    case 'ADD_REQUEST':
      return [action.request, ...state];
    case 'EDIT_REQUEST':
      return state.map((r) =>
        r.id === action.requestId
          ? { ...r, ...action.updates, lastUpdatedDate: new Date().toISOString().slice(0, 10) }
          : r
      );
    case 'DELETE_REQUEST':
      return state.filter((r) => r.id !== action.requestId);
    case 'ADD_COMMENT':
      return state.map((r) =>
        r.id === action.requestId
          ? { ...r, comments: [...r.comments, action.comment] }
          : r
      );
  }
}

type ViewMode = 'table' | 'board';

let requestCounter = 0;

function createRequestId() {
  requestCounter += 1;
  return `REQ-${String(1050 + requestCounter).padStart(4, '0')}`;
}

const STATUS_LABEL_MAP: Record<string, RequestStatus | null> = {
  'All statuses': null,
  'New Intake': 'new',
  'Assigned': 'assigned',
  'In Progress': 'inProgress',
  'In Review': 'inReview',
  'Completed': 'completed',
};

const FREQUENCY_LABEL_MAP: Record<string, string | null> = {
  'All frequencies': null,
  'Annual': 'annual',
  'Quarterly': 'quarterly',
  'Monthly': 'monthly',
  'Event-driven': 'event-driven',
  'Ad hoc': 'ad-hoc',
};

export function RequestListPage() {
  const { scopeSelection } = usePlatformContext();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const f of REQUEST_FILTERS) initial[f.key] = f.options[0];
    return initial;
  });
  const [showIntake, setShowIntake] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [editingRequestId, setEditingRequestId] = useState<string | null>(null);
  const [commentingRequestId, setCommentingRequestId] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const initialRequests = requestsService.getScopedRequests(scopeSelection);
  const [requests, dispatch] = useReducer(listReducer, initialRequests);

  const scopeRequests = useMemo(
    () => requests.filter((r) => matchesScope(r.scopeIds, scopeSelection)),
    [requests, scopeSelection],
  );

  const visibleRequests = useMemo(() => {
    return scopeRequests.filter((r) => {
      const playbookName = r.playbookId ? (requestPlaybooksService.getById(r.playbookId)?.name ?? '') : '';
      const matchesSearch =
        searchValue.trim().length === 0 ||
        `${r.id} ${r.title} ${r.summary} ${r.owner} ${playbookName}`
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      const statusKey = STATUS_LABEL_MAP[filters.status];
      const matchesStatus = statusKey === null || statusKey === undefined || r.status === statusKey;
      const matchesOwner = filters.owner === 'All owners' || r.owner === filters.owner;

      const freqKey = FREQUENCY_LABEL_MAP[filters.frequency];
      const matchesFreq = freqKey === null || freqKey === undefined || r.frequency === freqKey;

      const matchesDomain =
        !filters.domain || filters.domain === 'All domains' ||
        r.templateSnapshot?.taxonomy.domain === filters.domain;

      const matchesFund =
        !filters.fund || filters.fund === 'All funds' ||
        SCOPE_DIMENSIONS.fund.find((f) => f.label === filters.fund)?.id === r.fundId;

      const matchesTaxYear =
        !filters.taxYear || filters.taxYear === 'All years' ||
        r.taxYear === filters.taxYear;

      return matchesSearch && matchesStatus && matchesOwner && matchesFreq && matchesDomain && matchesFund && matchesTaxYear;
    });
  }, [scopeRequests, searchValue, filters]);

  const sorted = useMemo(() => {
    return [...visibleRequests].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey] as string;
      const bVal = (b as Record<string, unknown>)[sortKey] as string;
      const cmp = (aVal ?? '').localeCompare(bVal ?? '');
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [visibleRequests, sortKey, sortDirection]);

  const handleSort = useCallback((key: string) => {
    if (key === sortKey) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey]);

  const { openCount, assignedCount, inProgressCount, completedCount, recurringCount } = useMemo(() => ({
    openCount: scopeRequests.filter((r) => r.status === 'new').length,
    assignedCount: scopeRequests.filter((r) => r.status === 'assigned').length,
    inProgressCount: scopeRequests.filter((r) => r.status === 'inProgress' || r.status === 'inReview').length,
    completedCount: scopeRequests.filter((r) => r.status === 'completed').length,
    recurringCount: scopeRequests.filter((r) => r.frequency !== 'ad-hoc').length,
  }), [scopeRequests]);

  const handleStatusChange = useCallback(
    (id: string, status: RequestStatus) => dispatch({ type: 'SET_STATUS', requestId: id, status }),
    [],
  );

  const handleOwnerChange = useCallback(
    (id: string, owner: string) => dispatch({ type: 'SET_OWNER', requestId: id, owner }),
    [],
  );

  const handleOpenRequest = useCallback(
    (id: string) => navigate(`/requests/${id}`),
    [navigate],
  );

  const handleEdit = useCallback((id: string) => setEditingRequestId(id), []);

  const handleDelete = useCallback((id: string) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      dispatch({ type: 'DELETE_REQUEST', requestId: id });
    }
  }, []);

  const handleComment = useCallback(
    (id: string) => setCommentingRequestId(id),
    [],
  );

  const handleAddComment = useCallback(
    (id: string, comment: RequestComment) => dispatch({ type: 'ADD_COMMENT', requestId: id, comment }),
    [],
  );

  const handleExpandComment = useCallback(() => {
    if (commentingRequestId) {
      navigate(`/requests/${commentingRequestId}/activity`);
      setCommentingRequestId(null);
    }
  }, [commentingRequestId, navigate]);

  const handleEditSave = useCallback((id: string, form: RequestFormState) => {
    dispatch({ type: 'EDIT_REQUEST', requestId: id, updates: form });
    setEditingRequestId(null);
  }, []);

  const editingRequest = editingRequestId ? requests.find((r) => r.id === editingRequestId) ?? null : null;
  const commentingRequest = commentingRequestId ? requests.find((r) => r.id === commentingRequestId) ?? null : null;

  function buildRequest(form: RequestFormState): WorkflowRequest {
    const today = new Date().toISOString().slice(0, 10);
    const type = form.requestTypeId
      ? requestTypesService.getRequestTypeById(form.requestTypeId)
      : undefined;

    return {
      id: createRequestId(),
      scopeIds: [
        ...(form.fundId ? [form.fundId] : scopeSelection.fundIds),
        ...(form.taxYear ? [`tax-year-${form.taxYear}`] : scopeSelection.taxYearIds),
        ...(scopeSelection.workstreamIds.length > 0 ? scopeSelection.workstreamIds : []),
      ],
      status: 'new',
      stage: STATUS_CONFIG.new.stage,
      title: form.title,
      summary: form.summary,
      owner: form.owner,
      latestExpectedDate: form.latestExpectedDate,
      playbookId: form.playbookId || null,
      linkedEntities: [],
      requiredDocuments: [],
      deliverables: [],
      activityLog: [
        { date: today, action: `Request created${type ? ` from type: ${type.name}` : ''}`, actor: form.requestor || 'Current User' },
      ],
      comments: [],
      createdDate: today,
      lastUpdatedDate: today,
      requestTypeId: form.requestTypeId || null,
      fundId: form.fundId || null,
      entityId: null,
      dealId: null,
      taxYear: form.taxYear || '',
      periodStart: form.taxYear ? `${form.taxYear}-01-01` : '',
      periodEnd: form.taxYear ? `${form.taxYear}-12-31` : '',
      requestor: form.requestor || '',
      dueDate: form.dueDate || '',
      frequency: form.frequency || 'ad-hoc',
      createdFromRecurringRun: false,
      priorRequestInstanceId: null,
      priorPeriodRef: null,
      templateSnapshot: type ? {
        typeName: type.name,
        typeDescription: type.description,
        playbookName: requestPlaybooksService.getById(type.playbookId)?.name ?? type.defaultPlaybook,
        taxonomy: { ...type.taxonomy },
        defaultFrequency: type.defaultFrequency,
        defaultInstructions: type.defaultInstructions,
        defaultExpectedOutput: type.defaultExpectedOutput,
        snapshotDate: today,
      } : null,
      executionMethod: null,
      completionSummary: '',
    };
  }

  function handleIntakeSubmit(form: RequestFormState) {
    const request = buildRequest(form);
    requestsService.addRequest(request);
    dispatch({ type: 'ADD_REQUEST', request });
    setShowIntake(false);
  }

  function handleImportSubmit(forms: RequestFormState[]) {
    for (const form of forms) {
      const request = buildRequest(form);
      requestsService.addRequest(request);
      dispatch({ type: 'ADD_REQUEST', request });
    }
    setShowImport(false);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.heroCardInner}>
            <div>
              <div className={styles.eyebrow}>Workflow Cockpit</div>
              <h1 className={styles.title}>Information requests, end to end.</h1>
            </div>
            <div className={styles.heroActions}>
              <button className={styles.intakeToggleBtn} onClick={() => setShowIntake(true)} type="button">+ New request</button>
              <button className={styles.intakeToggleBtn} onClick={() => setShowImport(true)} type="button">Import</button>
            </div>
          </div>
          <div className={styles.metricsRow}>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{openCount}</p>
              <p className={styles.miniMetricLabel}>New</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{assignedCount}</p>
              <p className={styles.miniMetricLabel}>Assigned</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{inProgressCount}</p>
              <p className={styles.miniMetricLabel}>Active</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{completedCount}</p>
              <p className={styles.miniMetricLabel}>Complete</p>
            </div>
            <div className={styles.miniMetric}>
              <p className={styles.miniMetricValue}>{recurringCount}</p>
              <p className={styles.miniMetricLabel}>Recurring</p>
            </div>
          </div>
        </div>
      </section>

      {showIntake && (
        <RequestIntakeForm
          onSubmit={handleIntakeSubmit}
          onCancel={() => setShowIntake(false)}
        />
      )}

      <section className={styles.workspace}>
        {viewMode === 'table' && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <label className={styles.fieldLabel} htmlFor="req-search">Search requests</label>
                <input
                  id="req-search"
                  className={styles.input}
                  placeholder="Search by ID, title, owner, or playbook"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </div>
              <div className={styles.filterRow}>
                {REQUEST_FILTERS.map((filter) => (
                  <label key={filter.key} className={styles.filterField}>
                    <span className={styles.fieldLabel}>{filter.label}</span>
                    <select
                      className={styles.select}
                      value={filters[filter.key] ?? filter.options[0]}
                      onChange={(e) => setFilters((prev) => ({ ...prev, [filter.key]: e.target.value }))}
                    >
                      {filter.options.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.listHeader}>
              <div className={styles.viewToggle}>
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'table' ? styles.viewToggleBtnActive : ''}`}
                  onClick={() => setViewMode('table')}
                  type="button"
                >
                  Table
                </button>
                <button
                  className={`${styles.viewToggleBtn} ${viewMode === 'board' ? styles.viewToggleBtnActive : ''}`}
                  onClick={() => setViewMode('board')}
                  type="button"
                >
                  Board
                </button>
              </div>
              <h2 className={styles.sectionTitle}>All requests</h2>
              <span className={styles.sectionCopy}>Click a request to open lifecycle view. Change status inline.</span>
              <span className={styles.countPill}>{sorted.length} visible</span>
              <button
                className={styles.typeLibraryBtn}
                onClick={() => navigate('/requests/types')}
                type="button"
              >
                Request Library
              </button>
            </div>

            {sorted.length > 0 ? (
              <RequestTable
                requests={sorted}
                sortKey={sortKey}
                sortDirection={sortDirection}
                onSort={handleSort}
                onStatusChange={handleStatusChange}
                onOwnerChange={handleOwnerChange}
                onOpen={handleOpenRequest}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onComment={handleComment}
              />
            ) : (
              <div className={styles.emptyState}>No requests match this scope and filter combination.</div>
            )}
          </>
        )}

        {viewMode === 'board' && (
          <>
          <div className={styles.listHeader}>
            <div className={styles.viewToggle}>
              <button
                className={`${styles.viewToggleBtn} ${viewMode === 'table' ? styles.viewToggleBtnActive : ''}`}
                onClick={() => setViewMode('table')}
                type="button"
              >
                Table
              </button>
              <button
                className={`${styles.viewToggleBtn} ${viewMode === 'board' ? styles.viewToggleBtnActive : ''}`}
                onClick={() => setViewMode('board')}
                type="button"
              >
                Board
              </button>
            </div>
            <h2 className={styles.sectionTitle}>All requests</h2>
            <span className={styles.countPill}>{scopeRequests.length} visible</span>
            <button
              className={styles.typeLibraryBtn}
              onClick={() => navigate('/requests/types')}
              type="button"
            >
              Type Library
            </button>
          </div>
          <RequestKanbanBoard
            requests={scopeRequests}
            onStatusChange={handleStatusChange}
            onOwnerChange={handleOwnerChange}
            onOpen={handleOpenRequest}
          />
          </>
        )}

        {showImport && (
          <Suspense fallback={<div className={styles.emptyState}>Loading import tools...</div>}>
            <RequestImport
              onImport={handleImportSubmit}
              onCancel={() => setShowImport(false)}
            />
          </Suspense>
        )}

        {editingRequest && (
          <RequestEditModal
            request={editingRequest}
            onSave={handleEditSave}
            onCancel={() => setEditingRequestId(null)}
          />
        )}

        {commentingRequest && (
          <RequestCommentModal
            request={commentingRequest}
            onAddComment={handleAddComment}
            onExpand={handleExpandComment}
            onClose={() => setCommentingRequestId(null)}
          />
        )}
      </section>
    </div>
  );
}
