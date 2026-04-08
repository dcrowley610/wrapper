import type {
  ReconciliationTask,
  ReconciliationActionHistory,
  MatchCandidate,
  MasterDomain,
  TaskStatus,
} from '../types';
import { normalize } from '../normalization';

type Listener = () => void;

let _version = 0;
const _listeners = new Set<Listener>();
function _notify() {
  _version++;
  _listeners.forEach((cb) => cb());
}

// ── Demo Reconciliation Tasks ──

let TASKS: ReconciliationTask[] = [
  {
    id: 'task-1', sourceRecordId: 'src-1', domain: 'entity',
    status: 'open', priority: 'medium', candidateCount: 1,
    topCandidateScore: 93.2, topCandidateTier: 'suggested',
    resolvedDate: '', resolvedBy: '', resolutionAction: '', resolutionMasterId: '',
    createdDate: '2026-03-20',
  },
  {
    id: 'task-2', sourceRecordId: 'src-2', domain: 'entity',
    status: 'open', priority: 'medium', candidateCount: 1,
    topCandidateScore: 88.5, topCandidateTier: 'suggested',
    resolvedDate: '', resolvedBy: '', resolutionAction: '', resolutionMasterId: '',
    createdDate: '2026-03-22',
  },
  {
    id: 'task-3', sourceRecordId: 'src-3', domain: 'investor',
    status: 'open', priority: 'high', candidateCount: 1,
    topCandidateScore: 78.3, topCandidateTier: 'review_required',
    resolvedDate: '', resolvedBy: '', resolutionAction: '', resolutionMasterId: '',
    createdDate: '2026-03-25',
  },
  {
    id: 'task-4', sourceRecordId: 'src-4', domain: 'deal',
    status: 'open', priority: 'low', candidateCount: 1,
    topCandidateScore: 52.1, topCandidateTier: 'likely_new',
    resolvedDate: '', resolvedBy: '', resolutionAction: '', resolutionMasterId: '',
    createdDate: '2026-03-28',
  },
];

// ── Demo Match Candidates ──

const srcNorm1 = normalize('Atlas Master Fund LP');
const srcNorm2 = normalize('Smith Real Estate, L.L.C.');
const srcNorm3 = normalize('Meridian Family Office Limited');
const srcNorm4 = normalize('Brep IX Real Estate Equity');

let CANDIDATES: MatchCandidate[] = [
  {
    id: 'mc-1', sourceRecordId: 'src-1', candidateMasterId: 'me-atlas-master-fund',
    compositeScore: 93.2, tier: 'suggested',
    scoreComponents: [
      { factor: 'exact_stripped', weight: 1, rawScore: 85, weightedScore: 85, explanation: 'Exact match after stripping legal suffixes' },
      { factor: 'jaro_winkler', weight: 1, rawScore: 33.6, weightedScore: 33.6, explanation: 'Jaro-Winkler similarity: 96.0%' },
      { factor: 'token_sort', weight: 1, rawScore: 19.2, weightedScore: 19.2, explanation: 'Token sort ratio: 96.0%' },
      { factor: 'jurisdiction_match', weight: 1, rawScore: 8, weightedScore: 8, explanation: 'Same jurisdiction: Cayman Islands' },
      { factor: 'category_match', weight: 1, rawScore: 8, weightedScore: 8, explanation: 'Same category/class: Fund Vehicle' },
    ],
    aiScore: 95.2, aiExplanation: 'Very high confidence: "Atlas Master Fund LP" is almost certainly "Atlas Master Fund". Names are effectively identical after normalization.',
    status: 'pending',
  },
  {
    id: 'mc-2', sourceRecordId: 'src-2', candidateMasterId: 'me-smith-real-estate',
    compositeScore: 88.5, tier: 'suggested',
    scoreComponents: [
      { factor: 'exact_stripped', weight: 1, rawScore: 85, weightedScore: 85, explanation: 'Exact match after stripping legal suffixes' },
      { factor: 'jaro_winkler', weight: 1, rawScore: 31.5, weightedScore: 31.5, explanation: 'Jaro-Winkler similarity: 90.0%' },
      { factor: 'token_sort', weight: 1, rawScore: 18, weightedScore: 18, explanation: 'Token sort ratio: 90.0%' },
      { factor: 'jurisdiction_match', weight: 1, rawScore: 8, weightedScore: 8, explanation: 'Same jurisdiction: Delaware' },
    ],
    aiScore: 90.5, aiExplanation: 'High confidence: "Smith Real Estate, L.L.C." likely matches "Smith Real Estate LLC". Minor differences appear to be formatting or abbreviation variations.',
    status: 'pending',
  },
  {
    id: 'mc-3', sourceRecordId: 'src-3', candidateMasterId: 'mi-meridian',
    compositeScore: 78.3, tier: 'review_required',
    scoreComponents: [
      { factor: 'jaro_winkler', weight: 1, rawScore: 28, weightedScore: 28, explanation: 'Jaro-Winkler similarity: 80.0%' },
      { factor: 'token_sort', weight: 1, rawScore: 16, weightedScore: 16, explanation: 'Token sort ratio: 80.0%' },
      { factor: 'acronym_match', weight: 1, rawScore: 10, weightedScore: 10, explanation: 'Acronym match: "MFO"' },
      { factor: 'jurisdiction_match', weight: 1, rawScore: 8, weightedScore: 8, explanation: 'Same jurisdiction: United Kingdom' },
      { factor: 'category_match', weight: 1, rawScore: 8, weightedScore: 8, explanation: 'Same category/class: Family Office' },
      { factor: 'scope_overlap', weight: 1, rawScore: 8, weightedScore: 8, explanation: 'Scope overlap: atlas-master-fund, tax-year-2026' },
    ],
    aiScore: 75.3, aiExplanation: 'Moderate confidence: "Meridian Family Office Limited" may match "Meridian Family Office". Names share significant overlap but "Limited" suffix difference warrants review.',
    status: 'pending',
  },
  {
    id: 'mc-4', sourceRecordId: 'src-4', candidateMasterId: 'md-brep-ix-realty',
    compositeScore: 52.1, tier: 'likely_new',
    scoreComponents: [
      { factor: 'jaro_winkler', weight: 1, rawScore: 24.5, weightedScore: 24.5, explanation: 'Jaro-Winkler similarity: 70.0%' },
      { factor: 'token_sort', weight: 1, rawScore: 14, weightedScore: 14, explanation: 'Token sort ratio: 70.0%' },
      { factor: 'category_match', weight: 1, rawScore: 8, weightedScore: 8, explanation: 'Same category/class: Real Estate' },
      { factor: 'scope_overlap', weight: 1, rawScore: 4, weightedScore: 4, explanation: 'Scope overlap: tax-year-2026' },
    ],
    aiScore: 49.1, aiExplanation: 'Low confidence: "Brep IX Real Estate Equity" has some similarity to "BREP IX Realty Equity" but differences suggest these may be distinct deals.',
    status: 'pending',
  },
];

// ── Demo Action History ──

let HISTORY: ReconciliationActionHistory[] = [
  {
    id: 'ah-1', taskId: 'task-1', actionType: 'task_created', actor: 'System',
    timestamp: '2026-03-20T10:00:00Z',
    metadata: { sourceFileName: 'q1_entities.csv', rawName: 'Atlas Master Fund LP' },
    description: 'Task created for source record "Atlas Master Fund LP" from CSV import',
  },
  {
    id: 'ah-2', taskId: 'task-2', actionType: 'task_created', actor: 'System',
    timestamp: '2026-03-22T14:30:00Z',
    metadata: { sourceFileName: 'tax_memo_2026.pdf', rawName: 'Smith Real Estate, L.L.C.' },
    description: 'Task created for source record "Smith Real Estate, L.L.C." from document extraction',
  },
  {
    id: 'ah-3', taskId: 'task-3', actionType: 'task_created', actor: 'System',
    timestamp: '2026-03-25T09:15:00Z',
    metadata: { sourceFileName: 'investor_update.xlsx', rawName: 'Meridian Family Office Limited' },
    description: 'Task created for source record "Meridian Family Office Limited" from CSV import',
  },
  {
    id: 'ah-4', taskId: 'task-4', actionType: 'task_created', actor: 'System',
    timestamp: '2026-03-28T16:45:00Z',
    metadata: { rawName: 'Brep IX Real Estate Equity' },
    description: 'Task created for source record "Brep IX Real Estate Equity" from manual entry',
  },
];

let _nextTaskId = 100;
let _nextCandidateId = 100;
let _nextHistoryId = 100;

export const reconciliationService = {
  // ── Tasks ──
  getAllTasks(domain?: MasterDomain, status?: TaskStatus): ReconciliationTask[] {
    let result = TASKS;
    if (domain) result = result.filter((t) => t.domain === domain);
    if (status) result = result.filter((t) => t.status === status);
    return result;
  },

  getTaskById(id: string): ReconciliationTask | undefined {
    return TASKS.find((t) => t.id === id);
  },

  getTaskBySourceRecordId(sourceRecordId: string): ReconciliationTask | undefined {
    return TASKS.find((t) => t.sourceRecordId === sourceRecordId);
  },

  addTask(task: ReconciliationTask): void {
    TASKS = [task, ...TASKS];
    _notify();
  },

  updateTask(id: string, updates: Partial<ReconciliationTask>): void {
    TASKS = TASKS.map((t) => (t.id === id ? { ...t, ...updates } : t));
    _notify();
  },

  nextTaskId(): string {
    return `task-${_nextTaskId++}`;
  },

  // ── Candidates ──
  getCandidatesForSource(sourceRecordId: string): MatchCandidate[] {
    return CANDIDATES.filter((c) => c.sourceRecordId === sourceRecordId);
  },

  getCandidatesForTask(taskId: string): MatchCandidate[] {
    const task = TASKS.find((t) => t.id === taskId);
    if (!task) return [];
    return CANDIDATES.filter((c) => c.sourceRecordId === task.sourceRecordId);
  },

  addCandidate(candidate: MatchCandidate): void {
    CANDIDATES = [candidate, ...CANDIDATES];
    _notify();
  },

  updateCandidate(id: string, updates: Partial<MatchCandidate>): void {
    CANDIDATES = CANDIDATES.map((c) => (c.id === id ? { ...c, ...updates } : c));
    _notify();
  },

  nextCandidateId(): string {
    return `mc-${_nextCandidateId++}`;
  },

  // ── History ──
  getHistoryForTask(taskId: string): ReconciliationActionHistory[] {
    return HISTORY.filter((h) => h.taskId === taskId).sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
  },

  addHistory(entry: ReconciliationActionHistory): void {
    HISTORY = [entry, ...HISTORY];
    _notify();
  },

  nextHistoryId(): string {
    return `ah-${_nextHistoryId++}`;
  },

  // ── Subscription ──
  getVersion(): number {
    return _version;
  },

  subscribe(cb: Listener): () => void {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },
};
