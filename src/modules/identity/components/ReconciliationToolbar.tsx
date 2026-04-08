import type { MasterDomain, TaskStatus } from '../types';
import styles from '../IdentityModule.module.css';

type ReconciliationToolbarProps = {
  domainFilter: MasterDomain | 'all';
  onDomainChange: (domain: MasterDomain | 'all') => void;
  statusFilter: TaskStatus | 'all';
  onStatusChange: (status: TaskStatus | 'all') => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function ReconciliationToolbar({
  domainFilter,
  onDomainChange,
  statusFilter,
  onStatusChange,
  searchValue,
  onSearchChange,
}: ReconciliationToolbarProps) {
  return (
    <div className={styles.filterRow}>
      <div className={styles.filterField}>
        <label className={styles.fieldLabel}>Domain</label>
        <select
          className={styles.select}
          value={domainFilter}
          onChange={(e) => onDomainChange(e.target.value as MasterDomain | 'all')}
        >
          <option value="all">All</option>
          <option value="entity">Entity</option>
          <option value="investor">Investor</option>
          <option value="deal">Deal</option>
        </select>
      </div>
      <div className={styles.filterField}>
        <label className={styles.fieldLabel}>Status</label>
        <select
          className={styles.select}
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'all')}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="deferred">Deferred</option>
        </select>
      </div>
      <div className={styles.filterField} style={{ flex: 1 }}>
        <label className={styles.fieldLabel}>Search</label>
        <input
          className={styles.input}
          type="text"
          placeholder="Search by name..."
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
