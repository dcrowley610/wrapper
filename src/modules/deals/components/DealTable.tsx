import { memo, useMemo } from 'react';
import type { DealRecord } from '../types';
import { DraggableHeaderRow } from '../../../components/DraggableHeaderRow/DraggableHeaderRow';
import styles from '../DealsModule.module.css';

export const ALL_DEAL_COLUMNS = [
  { key: 'name', label: 'Name', default: true },
  { key: 'owner', label: 'Owner', default: true },
  { key: 'investmentType', label: 'Type', default: true },
  { key: 'taxYear', label: 'Year', default: true },
  { key: 'status', label: 'Status', default: true },
  { key: 'taxableIncome', label: 'Taxable Income', default: false },
  { key: 'closingDate', label: 'Closing Date', default: false },
  { key: 'currency', label: 'Currency', default: false },
  { key: 'geographicFocus', label: 'Geography', default: false },
  { key: 'sector', label: 'Sector', default: false },
  { key: 'requestCount', label: 'Requests', default: false },
  { key: 'documentCount', label: 'Documents', default: false },
  { key: 'openQuestions', label: 'Open Q\'s', default: false },
  { key: 'lastReviewDate', label: 'Last Review', default: false },
];

export const DEFAULT_DEAL_COLUMNS = ALL_DEAL_COLUMNS.filter((c) => c.default).map((c) => c.key);

type DealTableProps = {
  deals: DealRecord[];
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  onOpen: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onComment: (id: string) => void;
  visibleColumns: string[];
  onColumnsChange: (keys: string[]) => void;
};

export const DealTable = memo(function DealTable({
  deals, sortKey, sortDirection, onSort, onOpen, onEdit, onDelete, onComment, visibleColumns, onColumnsChange,
}: DealTableProps) {
  const columns = useMemo(() => {
    const colMap = new Map(ALL_DEAL_COLUMNS.map((col) => [col.key, col]));
    const nameCol = colMap.get('name')!;
    const ordered = visibleColumns
      .filter((key) => key !== 'name' && colMap.has(key))
      .map((key) => colMap.get(key)!);
    return [nameCol, ...ordered];
  }, [visibleColumns]);

  return (
    <table className={styles.recordTable}>
      <thead>
        <DraggableHeaderRow
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={onSort}
          onReorder={onColumnsChange}
          fixedFirstKey="name"
          showActions
          sortIndicatorClass={styles.sortIndicator}
        />
      </thead>
      <tbody>
        {deals.map((deal) => (
          <tr key={deal.id}>
            {columns.map((col) =>
              col.key === 'name' ? (
                <td key={col.key}>
                  <button className={styles.titleLink} onClick={() => onOpen(deal.id)} type="button">
                    {deal.name}
                  </button>
                  <div className={styles.tableCellMeta}>
                    <span>{deal.taxableIncome}</span>
                  </div>
                </td>
              ) : (
                <td key={col.key}>{String((deal as any)[col.key] ?? '—') || '—'}</td>
              )
            )}
            <td>
              <div className={styles.actionCell}>
                <button className={styles.actionBtn} onClick={() => onEdit(deal.id)} type="button" title="Edit deal">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                  </svg>
                </button>
                <button className={styles.actionBtn} onClick={() => onDelete(deal.id)} type="button" title="Delete deal">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                  </svg>
                </button>
                <button className={styles.actionBtn} onClick={() => onComment(deal.id)} type="button" title="View comments">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 2h12v9H5l-3 3V2z" />
                  </svg>
                  {deal.comments.length > 0 && (
                    <span className={styles.commentBadge}>{deal.comments.length}</span>
                  )}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
});
