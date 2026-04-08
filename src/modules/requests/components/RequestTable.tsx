import { memo } from 'react';
import type { RequestStatus, WorkflowRequest } from '../types';
import { OWNER_OPTIONS, STATUS_CONFIG, FREQUENCY_LABEL } from '../config';
import { requestTypesService } from '../services';
import styles from '../RequestsModule.module.css';

type RequestTableProps = {
  requests: WorkflowRequest[];
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  onStatusChange: (requestId: string, status: RequestStatus) => void;
  onOwnerChange: (requestId: string, owner: string) => void;
  onOpen: (requestId: string) => void;
  onEdit: (requestId: string) => void;
  onDelete: (requestId: string) => void;
  onComment: (requestId: string) => void;
};

const COLUMNS = [
  { key: 'id', label: 'ID' },
  { key: 'title', label: 'Title' },
  { key: 'status', label: 'Status' },
  { key: 'owner', label: 'Owner' },
  { key: 'frequency', label: 'Freq' },
  { key: 'taxYear', label: 'Year' },
  { key: 'latestExpectedDate', label: 'Expected' },
];

export const RequestTable = memo(function RequestTable({
  requests, sortKey, sortDirection, onSort, onStatusChange, onOwnerChange, onOpen, onEdit, onDelete, onComment,
}: RequestTableProps) {
  return (
    <table className={styles.requestTable}>
      <thead>
        <tr>
          {COLUMNS.map((col) => (
            <th key={col.key} onClick={() => onSort(col.key)}>
              {col.label}
              {sortKey === col.key && (
                <span className={styles.sortIndicator}>{sortDirection === 'asc' ? '\u25B2' : '\u25BC'}</span>
              )}
            </th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((req) => {
          const typeName = req.requestTypeId
            ? requestTypesService.getRequestTypeById(req.requestTypeId)?.name ?? 'Unknown'
            : 'Legacy';

          return (
            <tr key={req.id}>
              <td>{req.id}</td>
              <td>
                <button className={styles.titleLink} onClick={() => onOpen(req.id)} type="button">
                  {req.title}
                </button>
                <div className={styles.tableCellMeta}>
                  <span className={styles.typeLabel}>{typeName}</span>
                  {req.priorRequestInstanceId && (
                    <span className={styles.priorPeriodDot} title={`Prior: ${req.priorRequestInstanceId}`}>&#9679;</span>
                  )}
                </div>
              </td>
              <td>
                <select
                  className={styles.inlineSelect}
                  value={req.status}
                  onChange={(e) => onStatusChange(req.id, e.target.value as RequestStatus)}
                >
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  className={styles.inlineSelect}
                  value={req.owner}
                  onChange={(e) => onOwnerChange(req.id, e.target.value)}
                >
                  {OWNER_OPTIONS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </td>
              <td>
                <span className={`${styles.frequencyBadge} ${styles[`freq_${req.frequency.replace('-', '_')}`] ?? ''}`}>
                  {FREQUENCY_LABEL[req.frequency]}
                </span>
              </td>
              <td>{req.taxYear || '—'}</td>
              <td>{req.latestExpectedDate || '—'}</td>
              <td>
                <div className={styles.actionCell}>
                  <button className={styles.actionBtn} onClick={() => onEdit(req.id)} type="button" title="Edit request">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                    </svg>
                  </button>
                  <button className={styles.actionBtn} onClick={() => onDelete(req.id)} type="button" title="Delete request">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                    </svg>
                  </button>
                  <button className={styles.actionBtn} onClick={() => onComment(req.id)} type="button" title="View comments">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 2h12v9H5l-3 3V2z" />
                    </svg>
                    {req.comments.length > 0 && (
                      <span className={styles.commentBadge}>{req.comments.length}</span>
                    )}
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
});
