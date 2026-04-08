import { memo, useMemo } from 'react';
import type { InvestorRecord } from '../types';
import { DraggableHeaderRow } from '../../../components/DraggableHeaderRow/DraggableHeaderRow';
import styles from '../InvestorsModule.module.css';

export const ALL_INVESTOR_COLUMNS = [
  { key: 'name', label: 'Name', default: true },
  { key: 'investorClass', label: 'Class', default: true },
  { key: 'domicile', label: 'Domicile', default: true },
  { key: 'withholdingProfile', label: 'Withholding', default: true },
  { key: 'status', label: 'Status', default: true },
  { key: 'legalName', label: 'Legal Name', default: false },
  { key: 'serviceTeam', label: 'Service Team', default: false },
  { key: 'contactName', label: 'Contact', default: false },
  { key: 'contactEmail', label: 'Email', default: false },
  { key: 'withholdingRate', label: 'Withholding Rate', default: false },
  { key: 'w8FormType', label: 'W-8 Form', default: false },
  { key: 'treatyClaimCountry', label: 'Treaty Country', default: false },
  { key: 'capitalAccount', label: 'Capital Account', default: false },
  { key: 'ownershipPercentage', label: 'Ownership %', default: false },
  { key: 'investorType', label: 'Investor Type', default: false },
  { key: 'allocationPercentage', label: 'Allocation %', default: false },
  { key: 'taxExempt', label: 'Tax Exempt', default: false },
  { key: 'kycStatus', label: 'KYC Status', default: false },
  { key: 'requestCount', label: 'Requests', default: false },
  { key: 'documentCount', label: 'Documents', default: false },
  { key: 'lastReviewDate', label: 'Last Review', default: false },
];

export const DEFAULT_INVESTOR_COLUMNS = ALL_INVESTOR_COLUMNS.filter((c) => c.default).map((c) => c.key);

type InvestorTableProps = {
  investors: InvestorRecord[];
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

export const InvestorTable = memo(function InvestorTable({
  investors, sortKey, sortDirection, onSort, onOpen, onEdit, onDelete, onComment, visibleColumns, onColumnsChange,
}: InvestorTableProps) {
  const columns = useMemo(() => {
    const colMap = new Map(ALL_INVESTOR_COLUMNS.map((col) => [col.key, col]));
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
        {investors.map((investor) => (
          <tr key={investor.id}>
            {columns.map((col) =>
              col.key === 'name' ? (
                <td key={col.key}>
                  <button className={styles.titleLink} onClick={() => onOpen(investor.id)} type="button">
                    {investor.name}
                  </button>
                  <div className={styles.tableCellMeta}>
                    <span>{investor.commitment}</span>
                  </div>
                </td>
              ) : (
                <td key={col.key}>{String((investor as any)[col.key] ?? '—')}</td>
              )
            )}
            <td>
              <div className={styles.actionCell}>
                <button className={styles.actionBtn} onClick={() => onEdit(investor.id)} type="button" title="Edit investor">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                  </svg>
                </button>
                <button className={styles.actionBtn} onClick={() => onDelete(investor.id)} type="button" title="Delete investor">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                  </svg>
                </button>
                <button className={styles.actionBtn} onClick={() => onComment(investor.id)} type="button" title="View comments">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 2h12v9H5l-3 3V2z" />
                  </svg>
                  {investor.comments.length > 0 && (
                    <span className={styles.commentBadge}>{investor.comments.length}</span>
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
