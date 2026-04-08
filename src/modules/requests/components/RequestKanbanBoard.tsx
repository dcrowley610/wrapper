import type { RequestStatus, WorkflowRequest } from '../types';
import { OWNER_OPTIONS, STATUS_CONFIG, WORKFLOW_COLUMNS, FREQUENCY_LABEL } from '../config';
import { requestTypesService } from '../services';
import styles from '../RequestsModule.module.css';

type RequestKanbanBoardProps = {
  requests: WorkflowRequest[];
  onStatusChange: (requestId: string, status: RequestStatus) => void;
  onOwnerChange: (requestId: string, owner: string) => void;
  onOpen: (requestId: string) => void;
};

export function RequestKanbanBoard({ requests, onStatusChange, onOwnerChange, onOpen }: RequestKanbanBoardProps) {
  return (
    <div className={styles.kanbanBoard}>
      {WORKFLOW_COLUMNS.map((col) => {
        const colRequests = requests.filter((r) => r.status === col);
        const cfg = STATUS_CONFIG[col];

        return (
          <div key={col} className={styles.kanbanColumn}>
            <div className={styles.kanbanColumnHeader}>
              {cfg.label} ({colRequests.length})
            </div>
            <div className={styles.kanbanColumnBody}>
              {colRequests.map((req) => {
                const typeName = req.requestTypeId
                  ? requestTypesService.getRequestTypeById(req.requestTypeId)?.name
                  : undefined;

                return (
                  <div key={req.id} className={styles.kanbanCard}>
                    <button onClick={() => onOpen(req.id)} type="button">
                      {req.title}
                    </button>
                    <div className={styles.kanbanCardMeta}>
                      <span>{req.latestExpectedDate || 'No date'}</span>
                      <span className={`${styles.frequencyBadge} ${styles[`freq_${req.frequency.replace('-', '_')}`] ?? ''}`}>
                        {FREQUENCY_LABEL[req.frequency]}
                      </span>
                      {req.priorRequestInstanceId && (
                        <span className={styles.priorPeriodDot} title={`Prior: ${req.priorRequestInstanceId}`}>&#9679;</span>
                      )}
                    </div>
                    {typeName && (
                      <div className={styles.typeLabel}>{typeName}</div>
                    )}
                    <div style={{ marginTop: 8, display: 'flex', gap: 6 }}>
                      <select
                        className={styles.inlineSelect}
                        value={req.status}
                        onChange={(e) => onStatusChange(req.id, e.target.value as RequestStatus)}
                        style={{ flex: 1 }}
                      >
                        {Object.entries(STATUS_CONFIG).map(([key, c]) => (
                          <option key={key} value={key}>{c.label}</option>
                        ))}
                      </select>
                      <select
                        className={styles.inlineSelect}
                        value={req.owner}
                        onChange={(e) => onOwnerChange(req.id, e.target.value)}
                        style={{ flex: 1 }}
                      >
                        {OWNER_OPTIONS.map((o) => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
