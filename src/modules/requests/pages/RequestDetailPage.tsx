import { useReducer } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { REQUEST_SECTIONS, STATUS_CONFIG } from '../config';
import type { RequestSectionKey } from '../config';
import type { DeliverableInstance, DeliverableStatus, ExecutionMethod, LinkedEntity, RequestComment, RequestStatus, WorkflowRequest } from '../types';
import { requestsService, requestTypesService } from '../services';
import { OverviewSection } from '../components/sections/OverviewSection';
import { TemplateSection } from '../components/sections/TemplateSection';
import { RecurrenceSection } from '../components/sections/RecurrenceSection';

import { ExecutionMethodSection } from '../components/sections/ExecutionMethodSection';
import { DocumentsSection } from '../components/sections/DocumentsSection';
import { EntitiesSection } from '../components/sections/EntitiesSection';
import { ActivitySection } from '../components/sections/ActivitySection';
import { ProcessSection } from '../components/sections/ProcessSection';
import { DeliverablesSection } from '../components/sections/DeliverablesSection';
import { StatusStepperWidget } from '../components/sidebar/StatusStepperWidget';
import { AssignmentWidget } from '../components/sidebar/AssignmentWidget';
import { RecurrenceWidget } from '../components/sidebar/RecurrenceWidget';
import { MetricsWidget } from '../components/sidebar/MetricsWidget';
import styles from '../RequestsModule.module.css';

export type DetailAction =
  | { type: 'SET_STATUS'; status: RequestStatus }
  | { type: 'SET_OWNER'; owner: string }
  | { type: 'LINK_ENTITY'; entity: LinkedEntity }
  | { type: 'ADD_COMMENT'; comment: RequestComment }
  | { type: 'SET_EXECUTION_METHOD'; executionMethod: ExecutionMethod }
  | { type: 'SET_COMPLETION_SUMMARY'; completionSummary: string }
  | { type: 'ADD_DELIVERABLE'; deliverable: DeliverableInstance }
  | { type: 'UPDATE_DELIVERABLE'; id: string; field: keyof DeliverableInstance; value: string }
  | { type: 'REMOVE_DELIVERABLE'; id: string }
  | { type: 'ROLLOVER_DELIVERABLES'; deliverables: DeliverableInstance[] }
  | { type: 'ADD_DELIVERABLE_COMMENT'; deliverableId: string; comment: RequestComment }
  | { type: 'ATTACH_FILE'; id: string; fileLink: string; fileName: string }
  | { type: 'DETACH_FILE'; id: string };

const STATUS_RANK: Record<DeliverableStatus, number> = {
  'not-started': 0,
  'pending': 1,
  'received': 2,
  'reviewed': 3,
};

function applyParentRollup(deliverables: DeliverableInstance[]): DeliverableInstance[] {
  let arr = [...deliverables];
  const byId = new Map<string, number>();
  for (let i = 0; i < arr.length; i++) byId.set(arr[i].id, i);

  // Collect parent ids
  const parentIds = new Set<string>();
  for (const d of arr) {
    if (d.parentId && byId.has(d.parentId)) parentIds.add(d.parentId);
  }

  // Iterate until stable
  let changed = true;
  while (changed) {
    changed = false;
    for (const pid of parentIds) {
      const idx = byId.get(pid)!;
      const parent = arr[idx];
      const children = arr.filter((d) => d.parentId === pid);
      if (children.length === 0) continue;

      let newStatus: DeliverableStatus;
      if (children.every((c) => c.status === 'reviewed')) {
        newStatus = 'reviewed';
      } else if (children.every((c) => STATUS_RANK[c.status] >= STATUS_RANK['received'])) {
        newStatus = 'received';
      } else if (children.every((c) => STATUS_RANK[c.status] >= STATUS_RANK['pending'])) {
        newStatus = 'pending';
      } else {
        newStatus = 'not-started';
      }

      if (newStatus !== parent.status) {
        arr = arr.map((d, i) => (i === idx ? { ...d, status: newStatus } : d));
        changed = true;
      }
    }
  }
  return arr;
}

function detailReducer(state: WorkflowRequest, action: DetailAction): WorkflowRequest {
  switch (action.type) {
    case 'SET_STATUS':
      return {
        ...state,
        status: action.status,
        stage: STATUS_CONFIG[action.status].stage,
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    case 'SET_OWNER': {
      const newStatus = state.status === 'new' ? 'assigned' as const : state.status;
      return {
        ...state,
        owner: action.owner,
        status: newStatus,
        stage: STATUS_CONFIG[newStatus].stage,
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    }
    case 'LINK_ENTITY':
      return {
        ...state,
        linkedEntities: [...state.linkedEntities, action.entity],
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    case 'ADD_COMMENT':
      return {
        ...state,
        comments: [...state.comments, action.comment],
      };
    case 'SET_EXECUTION_METHOD':
      return {
        ...state,
        executionMethod: action.executionMethod,
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    case 'SET_COMPLETION_SUMMARY':
      return {
        ...state,
        completionSummary: action.completionSummary,
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    case 'ADD_DELIVERABLE':
      return {
        ...state,
        deliverables: [...state.deliverables, action.deliverable],
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    case 'UPDATE_DELIVERABLE': {
      let updated = state.deliverables.map((d) =>
        d.id === action.id ? { ...d, [action.field]: action.value } : d,
      );
      if (action.field === 'status') {
        updated = applyParentRollup(updated);
      }
      return {
        ...state,
        deliverables: updated,
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    }
    case 'REMOVE_DELIVERABLE': {
      const toRemove = new Set<string>();
      function collectDescendants(id: string) {
        toRemove.add(id);
        for (const d of state.deliverables) {
          if (d.parentId === id) collectDescendants(d.id);
        }
      }
      collectDescendants(action.id);
      return {
        ...state,
        deliverables: state.deliverables.filter((d) => !toRemove.has(d.id)),
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    }
    case 'ROLLOVER_DELIVERABLES':
      return {
        ...state,
        deliverables: [...state.deliverables, ...action.deliverables],
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    case 'ATTACH_FILE': {
      let updated = state.deliverables.map((d) => {
        if (d.id !== action.id) return d;
        const newStatus: DeliverableStatus =
          d.status === 'not-started' || d.status === 'pending' ? 'received' : d.status;
        return { ...d, fileLink: action.fileLink, fileName: action.fileName, status: newStatus };
      });
      updated = applyParentRollup(updated);
      return {
        ...state,
        deliverables: updated,
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    }
    case 'DETACH_FILE':
      return {
        ...state,
        deliverables: state.deliverables.map((d) =>
          d.id === action.id ? { ...d, fileLink: '', fileName: undefined } : d,
        ),
        lastUpdatedDate: new Date().toISOString().slice(0, 10),
      };
    case 'ADD_DELIVERABLE_COMMENT':
      return {
        ...state,
        deliverables: state.deliverables.map((d) =>
          d.id === action.deliverableId
            ? { ...d, comments: [...d.comments, action.comment] }
            : d,
        ),
      };
  }
}

const VALID_SECTIONS: RequestSectionKey[] = [
  'overview', 'template', 'recurrence',
  'documents', 'deliverables', 'entities', 'execution', 'process', 'activity',
];

function renderSection(
  section: RequestSectionKey,
  request: WorkflowRequest,
  dispatch: React.Dispatch<DetailAction>,
  requestType: ReturnType<typeof requestTypesService.getRequestTypeById>,
) {
  switch (section) {
    case 'overview':
      return <OverviewSection request={request} />;
    case 'template':
      return <TemplateSection request={request} requestType={requestType} />;
    case 'recurrence':
      return <RecurrenceSection request={request} requestType={requestType} />;
    case 'documents':
      return <DocumentsSection request={request} />;
    case 'deliverables':
      return <DeliverablesSection request={request} dispatch={dispatch} />;
    case 'entities':
      return <EntitiesSection request={request} dispatch={dispatch} />;
    case 'execution':
      return <ExecutionMethodSection request={request} dispatch={dispatch} />;
    case 'process':
      return <ProcessSection request={request} />;
    case 'activity':
      return <ActivitySection request={request} dispatch={dispatch} />;
  }
}

export function RequestDetailPage() {
  const { requestId, section } = useParams();
  const navigate = useNavigate();

  const activeSection = VALID_SECTIONS.includes(section as RequestSectionKey)
    ? (section as RequestSectionKey)
    : 'overview';

  const initialRequest = requestId ? requestsService.getRequestById(requestId) : undefined;
  const [request, dispatch] = useReducer(detailReducer, initialRequest as WorkflowRequest);

  if (!initialRequest || !request) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Request not found.</div>
      </div>
    );
  }

  const FULL_WIDTH_SECTIONS = new Set(['documents', 'deliverables', 'entities']);
  const hideSidebar = FULL_WIDTH_SECTIONS.has(activeSection);

  const requestType = request.requestTypeId
    ? requestTypesService.getRequestTypeById(request.requestTypeId)
    : undefined;

  return (
    <div className={styles.page}>
      <section className={styles.detailWorkspace}>
        <h1 className={styles.detailTitle}>{request.title}</h1>
        <SectionNav
          sections={REQUEST_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/requests/${requestId}/${key}`)}
          accentColor="#1678a2"
        />

        <div className={styles.detailGrid}>
          <div className={styles.detailPanel} style={hideSidebar ? { flex: 1 } : undefined}>
            {renderSection(activeSection, request, dispatch, requestType)}
          </div>

          {!hideSidebar && (
            <aside className={styles.sideStack}>
              <StatusStepperWidget
                currentStatus={request.status}
                onStatusChange={(status) => dispatch({ type: 'SET_STATUS', status })}
              />
              <AssignmentWidget
                owner={request.owner}
                playbookId={request.playbookId}
                onOwnerChange={(owner) => dispatch({ type: 'SET_OWNER', owner })}
              />
              <RecurrenceWidget request={request} requestType={requestType} />
              <MetricsWidget request={request} />
            </aside>
          )}
        </div>
      </section>
    </div>
  );
}
