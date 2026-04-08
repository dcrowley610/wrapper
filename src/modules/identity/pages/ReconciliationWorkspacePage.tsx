import { useState, useMemo } from 'react';
import type { MasterDomain, TaskStatus, ReconciliationTask, MasterRecord } from '../types';
import { identityService, reconciliationService, identityOrchestrator } from '../services';
import { useIdentityVersion, useReconciliationVersion } from '../hooks';
import { ReconciliationToolbar } from '../components/ReconciliationToolbar';
import { TaskListSection } from '../components/TaskListSection';
import { SourceRecordCard } from '../components/SourceRecordCard';
import { MatchCandidatesSection } from '../components/MatchCandidatesSection';
import { ResolutionActionBar } from '../components/ResolutionActionBar';
import { AuditHistorySection } from '../components/AuditHistorySection';
import styles from '../IdentityModule.module.css';

export function ReconciliationWorkspacePage() {
  const identityVersion = useIdentityVersion();
  const reconciliationVersion = useReconciliationVersion();

  const [domainFilter, setDomainFilter] = useState<MasterDomain | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'all'>('all');
  const [searchValue, setSearchValue] = useState('');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null);

  // Gather data
  const allTasks = useMemo(() => {
    void reconciliationVersion;
    return reconciliationService.getAllTasks(
      domainFilter === 'all' ? undefined : domainFilter,
      statusFilter === 'all' ? undefined : statusFilter,
    );
  }, [domainFilter, statusFilter, reconciliationVersion]);

  const sourceRecordMap = useMemo(() => {
    void identityVersion;
    const map = new Map<string, ReturnType<typeof identityService.getSourceRecordById>>();
    for (const task of allTasks) {
      const src = identityService.getSourceRecordById(task.sourceRecordId);
      if (src) map.set(task.sourceRecordId, src);
    }
    return map as Map<string, NonNullable<ReturnType<typeof identityService.getSourceRecordById>>>;
  }, [allTasks, identityVersion]);

  const filteredTasks = useMemo(() => {
    if (!searchValue.trim()) return allTasks;
    const q = searchValue.toLowerCase();
    return allTasks.filter((task) => {
      const src = sourceRecordMap.get(task.sourceRecordId);
      return src?.rawName.toLowerCase().includes(q) || task.id.toLowerCase().includes(q);
    });
  }, [allTasks, searchValue, sourceRecordMap]);

  // Summary metrics
  const openCount = useMemo(() => {
    void reconciliationVersion;
    return reconciliationService.getAllTasks(undefined, 'open').length;
  }, [reconciliationVersion]);

  const resolvedCount = useMemo(() => {
    void reconciliationVersion;
    return reconciliationService.getAllTasks(undefined, 'resolved').length;
  }, [reconciliationVersion]);

  const totalMasters = useMemo(() => {
    void identityVersion;
    return identityService.getAllMasters().length;
  }, [identityVersion]);

  // Selected task detail
  const selectedTask = useMemo<ReconciliationTask | null>(() => {
    if (!selectedTaskId) return null;
    return reconciliationService.getTaskById(selectedTaskId) || null;
  }, [selectedTaskId, reconciliationVersion]);

  const selectedSource = useMemo(() => {
    if (!selectedTask) return null;
    return identityService.getSourceRecordById(selectedTask.sourceRecordId) || null;
  }, [selectedTask, identityVersion]);

  const selectedCandidates = useMemo(() => {
    if (!selectedTaskId) return [];
    return reconciliationService.getCandidatesForTask(selectedTaskId);
  }, [selectedTaskId, reconciliationVersion]);

  const mastersMap = useMemo(() => {
    void identityVersion;
    const map = new Map<string, MasterRecord>();
    for (const c of selectedCandidates) {
      const m = identityService.getMasterById(c.candidateMasterId);
      if (m) map.set(m.id, m);
    }
    return map;
  }, [selectedCandidates, identityVersion]);

  const selectedHistory = useMemo(() => {
    if (!selectedTaskId) return [];
    return reconciliationService.getHistoryForTask(selectedTaskId);
  }, [selectedTaskId, reconciliationVersion]);

  // Actions
  function handleConfirmMatch() {
    if (!selectedTaskId || !selectedCandidateId) return;
    identityOrchestrator.confirmMatch(selectedTaskId, selectedCandidateId, 'Current User');
    setSelectedCandidateId(null);
  }

  function handleCreateNew() {
    if (!selectedTaskId) return;
    identityOrchestrator.createNewMaster(selectedTaskId, 'Current User');
    setSelectedCandidateId(null);
  }

  function handleRejectCandidate() {
    if (!selectedTaskId || !selectedCandidateId) return;
    identityOrchestrator.rejectCandidate(selectedTaskId, selectedCandidateId, 'Current User');
    setSelectedCandidateId(null);
  }

  function handleDefer(reason: string) {
    if (!selectedTaskId) return;
    identityOrchestrator.deferTask(selectedTaskId, 'Current User', reason);
  }

  return (
    <div className={styles.page}>
      <div className={styles.heroCard}>
        <span className={styles.eyebrow}>Identity Resolution</span>
        <h1 className={styles.title}>Reconciliation Workspace</h1>
        <p className={styles.lead}>
          Review and resolve identity matches across entities, investors, and deals.
          Confirm matches, create new master records, or defer for later review.
        </p>

        <div className={styles.metricsRow}>
          <div className={styles.miniMetric}>
            <p className={styles.miniMetricValue}>{openCount}</p>
            <p className={styles.miniMetricLabel}>Open Tasks</p>
          </div>
          <div className={styles.miniMetric}>
            <p className={styles.miniMetricValue}>{resolvedCount}</p>
            <p className={styles.miniMetricLabel}>Resolved</p>
          </div>
          <div className={styles.miniMetric}>
            <p className={styles.miniMetricValue}>{totalMasters}</p>
            <p className={styles.miniMetricLabel}>Master Records</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <ReconciliationToolbar
          domainFilter={domainFilter}
          onDomainChange={setDomainFilter}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          searchValue={searchValue}
          onSearchChange={setSearchValue}
        />
      </div>

      <div className={styles.splitLayout}>
        <div className={styles.taskListPanel}>
          <div className={styles.card}>
            <h2 className={styles.sectionTitle}>Tasks ({filteredTasks.length})</h2>
            <TaskListSection
              tasks={filteredTasks}
              sourceRecords={sourceRecordMap}
              selectedTaskId={selectedTaskId}
              onSelectTask={(id) => {
                setSelectedTaskId(id);
                setSelectedCandidateId(null);
              }}
            />
          </div>
        </div>

        <div className={styles.detailPanel}>
          {selectedTask && selectedSource ? (
            <div className={styles.card}>
              <SourceRecordCard source={selectedSource} />

              <MatchCandidatesSection
                candidates={selectedCandidates}
                masters={mastersMap}
                onSelectCandidate={setSelectedCandidateId}
                selectedCandidateId={selectedCandidateId}
              />

              <ResolutionActionBar
                taskStatus={selectedTask.status}
                selectedCandidateId={selectedCandidateId}
                hasPendingCandidates={selectedCandidates.some((c) => c.status === 'pending')}
                onConfirmMatch={handleConfirmMatch}
                onCreateNew={handleCreateNew}
                onRejectCandidate={handleRejectCandidate}
                onDefer={handleDefer}
              />

              <AuditHistorySection history={selectedHistory} />
            </div>
          ) : (
            <div className={styles.card}>
              <div className={styles.emptyState}>
                Select a task from the list to view details and take action.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReconciliationWorkspacePage;
