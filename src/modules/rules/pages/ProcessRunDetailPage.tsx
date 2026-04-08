import { useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { PROCESS_RUN_SECTIONS, RUN_STATUS_CONFIG } from '../config';
import type { ProcessRunSectionKey } from '../config';
import type { ProcessRun, ProcessRunStatus, StepStatus, StepNote, StepEvidence, StepDecision } from '../types';
import { processService } from '../services';
import { OverviewSection } from '../components/sections/OverviewSection';
import { StepsSection } from '../components/sections/StepsSection';
import { TimelineSection } from '../components/sections/TimelineSection';
import { SummarySection } from '../components/sections/SummarySection';
import { RunStatusWidget } from '../components/sidebar/RunStatusWidget';
import { RunMetricsWidget } from '../components/sidebar/RunMetricsWidget';
import { LinkedRecordWidget } from '../components/sidebar/LinkedRecordWidget';
import styles from '../RulesModule.module.css';

// ─── Reducer ─────────────────────────────────────────────────

type ProcessRunAction =
  | { type: 'SET_RUN_STATUS'; status: ProcessRunStatus }
  | { type: 'SET_STEP_STATUS'; stepId: string; status: StepStatus }
  | { type: 'SET_RUN_OWNER'; owner: string }
  | { type: 'TOGGLE_EXCEPTION'; stepId: string; reason: string | null }
  | { type: 'ADD_NOTE'; stepId: string; note: StepNote }
  | { type: 'ADD_EVIDENCE'; stepId: string; evidence: StepEvidence }
  | { type: 'ADD_DECISION'; stepId: string; decision: StepDecision };

function runReducer(state: ProcessRun, action: ProcessRunAction): ProcessRun {
  const now = new Date().toISOString().slice(0, 10);

  switch (action.type) {
    case 'SET_RUN_STATUS':
      return { ...state, status: action.status, lastUpdatedDate: now };

    case 'SET_STEP_STATUS':
      return {
        ...state,
        lastUpdatedDate: now,
        steps: state.steps.map((s) =>
          s.id === action.stepId
            ? {
                ...s,
                status: action.status,
                startedDate: action.status === 'inProgress' && !s.startedDate ? now : s.startedDate,
                completedDate: action.status === 'completed' ? now : s.completedDate,
              }
            : s,
        ),
      };

    case 'SET_RUN_OWNER':
      return { ...state, owner: action.owner, lastUpdatedDate: now };

    case 'TOGGLE_EXCEPTION':
      return {
        ...state,
        lastUpdatedDate: now,
        steps: state.steps.map((s) =>
          s.id === action.stepId
            ? { ...s, isException: action.reason !== null, exceptionReason: action.reason }
            : s,
        ),
      };

    case 'ADD_NOTE':
      return {
        ...state,
        lastUpdatedDate: now,
        steps: state.steps.map((s) =>
          s.id === action.stepId ? { ...s, notes: [...s.notes, action.note] } : s,
        ),
      };

    case 'ADD_EVIDENCE':
      return {
        ...state,
        lastUpdatedDate: now,
        steps: state.steps.map((s) =>
          s.id === action.stepId ? { ...s, evidence: [...s.evidence, action.evidence] } : s,
        ),
      };

    case 'ADD_DECISION':
      return {
        ...state,
        lastUpdatedDate: now,
        steps: state.steps.map((s) =>
          s.id === action.stepId ? { ...s, decisions: [...s.decisions, action.decision] } : s,
        ),
      };
  }
}

// ─── Section Rendering ───────────────────────────────────────

const VALID_SECTIONS: ProcessRunSectionKey[] = ['overview', 'steps', 'timeline', 'summary'];

function renderSection(section: ProcessRunSectionKey, run: ProcessRun) {
  switch (section) {
    case 'overview':
      return <OverviewSection run={run} />;
    case 'steps':
      return <StepsSection run={run} />;
    case 'timeline':
      return <TimelineSection run={run} />;
    case 'summary':
      return <SummarySection run={run} />;
  }
}

// ─── Page Component ──────────────────────────────────────────

export function ProcessRunDetailPage() {
  const { runId, section } = useParams();
  const navigate = useNavigate();

  const activeSection = VALID_SECTIONS.includes(section as ProcessRunSectionKey)
    ? (section as ProcessRunSectionKey)
    : 'overview';

  const initialRun = runId ? processService.getRunById(runId) : undefined;
  const [run, dispatch] = useReducer(runReducer, initialRun as ProcessRun);

  if (!initialRun || !run) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Process run not found.</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.detailHero}>
        <button className={styles.backButton} onClick={() => navigate('/rules')} type="button">
          Back to rules
        </button>
        <div className={styles.detailHeroCard}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.eyebrow}>Process {run.id}</div>
              <h1 className={styles.detailTitle}>{run.name}</h1>
              <div className={styles.headerPills}>
                <span className={`${styles.pill} ${styles[RUN_STATUS_CONFIG[run.status].colorClass] ?? ''}`}>
                  {RUN_STATUS_CONFIG[run.status].label}
                </span>
                <span className={styles.pill}>{run.processType}</span>
                <span className={styles.pill}>Due: {run.dueDate ?? 'Not set'}</span>
              </div>
            </div>
            <span className={`${styles.statusBadge} ${styles[RUN_STATUS_CONFIG[run.status].colorClass] ?? ''}`}>
              {RUN_STATUS_CONFIG[run.status].label}
            </span>
          </div>
          <p className={styles.contextLine}>
            Owner: {run.owner} &middot; Template: {run.templateName ?? 'Ad-hoc'} &middot; Created: {run.createdDate}
          </p>
        </div>
      </section>

      <section className={styles.detailWorkspace}>
        <SectionNav
          sections={PROCESS_RUN_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/rules/process/${runId}/${key}`)}
          accentColor="#1678a2"
        />

        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            {renderSection(activeSection, run)}
          </div>

          <aside className={styles.sideStack}>
            <RunStatusWidget
              currentStatus={run.status}
              onStatusChange={(status) => dispatch({ type: 'SET_RUN_STATUS', status })}
            />
            <RunMetricsWidget run={run} />
            <LinkedRecordWidget record={run.linkedRecord} />
          </aside>
        </div>
      </section>
    </div>
  );
}
