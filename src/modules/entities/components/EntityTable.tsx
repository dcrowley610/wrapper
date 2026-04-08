import { memo, useMemo } from 'react';
import type { EntityRecord } from '../types';
import { DraggableHeaderRow } from '../../../components/DraggableHeaderRow/DraggableHeaderRow';
import styles from '../EntitiesModule.module.css';

export const ALL_ENTITY_COLUMNS = [
  { key: 'name', label: 'Name', default: true },
  { key: 'legalName', label: 'Legal Name', default: false },
  { key: 'category', label: 'Category', default: true },
  { key: 'jurisdiction', label: 'Jurisdiction', default: true },
  { key: 'status', label: 'Status', default: true },
  { key: 'ownerTeam', label: 'Owner Team', default: false },
  { key: 'taxClassification', label: 'Tax Class', default: false },
  { key: 'ein', label: 'EIN', default: false },
  { key: 'dateFormed', label: 'Date Formed', default: false },
  { key: 'fiscalYearEnd', label: 'FY End', default: false },
  { key: 'formationType', label: 'Formation', default: false },
  { key: 'functionalCurrency', label: 'Currency', default: false },
  { key: 'taxReportingStatus', label: 'Tax Reporting', default: false },
  { key: 'annualRevenue', label: 'Revenue', default: false },
  { key: 'requestCount', label: 'Requests', default: false },
  { key: 'documentCount', label: 'Documents', default: false },
  { key: 'openQuestions', label: 'Open Q\'s', default: false },
  { key: 'lastReviewDate', label: 'Last Review', default: false },
];

export const DEFAULT_ENTITY_COLUMNS = ALL_ENTITY_COLUMNS.filter((c) => c.default).map((c) => c.key);

type EntityTableProps = {
  entities: EntityRecord[];
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

export const EntityTable = memo(function EntityTable({
  entities, sortKey, sortDirection, onSort, onOpen, onEdit, onDelete, onComment, visibleColumns, onColumnsChange,
}: EntityTableProps) {
  const columns = useMemo(() => {
    const colMap = new Map(ALL_ENTITY_COLUMNS.map((col) => [col.key, col]));
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
        {entities.map((entity) => (
          <tr key={entity.id}>
            {columns.map((col) =>
              col.key === 'name' ? (
                <td key={col.key}>
                  <button className={styles.titleLink} onClick={() => onOpen(entity.id)} type="button">
                    {entity.name}
                  </button>
                  <div className={styles.tableCellMeta}>
                    <span>{entity.legalName}</span>
                  </div>
                </td>
              ) : (
                <td key={col.key}>{String((entity as any)[col.key] ?? '—')}</td>
              )
            )}
            <td>
              <div className={styles.actionCell}>
                <button className={styles.actionBtn} onClick={() => onEdit(entity.id)} type="button" title="Edit entity">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                  </svg>
                </button>
                <button className={styles.actionBtn} onClick={() => onDelete(entity.id)} type="button" title="Delete entity">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                  </svg>
                </button>
                <button className={styles.actionBtn} onClick={() => onComment(entity.id)} type="button" title="View comments">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 2h12v9H5l-3 3V2z" />
                  </svg>
                  {entity.comments.length > 0 && (
                    <span className={styles.commentBadge}>{entity.comments.length}</span>
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
