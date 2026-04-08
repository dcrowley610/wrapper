import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { ControversyCard } from '../components/ControversyCard';
import { CONTROVERSY_FILTERS } from '../config';
import { controversyService } from '../services';
import styles from '../ControversyModule.module.css';

export function ControversyListPage() {
  const { scopeSelection } = usePlatformContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    status: CONTROVERSY_FILTERS[0].options[0],
    category: CONTROVERSY_FILTERS[1].options[0],
  });

  const visibleRecords = useMemo(() => {
    const scopeRecords = controversyService.getScopedControversies(scopeSelection);
    return scopeRecords.filter((record) => {
      const matchesSearch =
        searchValue.trim().length === 0 ||
        `${record.name} ${record.issuingAuthority} ${record.assignedTo} ${record.issueType}`
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      const matchesStatus = filters.status === 'All statuses' || record.status === filters.status;
      const matchesCategory = filters.category === 'All categories' || record.category === filters.category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [scopeSelection, searchValue, filters]);

  const handleOpenRecord = useCallback((id: string) => navigate(`/controversy/${id}`), [navigate]);

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.eyebrow}>Controversy Workspace</div>
          <h1 className={styles.title}>Notices, audits, and exams in one place.</h1>
        </div>
      </section>

      <section className={styles.workspace}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <label className={styles.fieldLabel} htmlFor="controversy-search">
              Search matters
            </label>
            <input
              id="controversy-search"
              className={styles.input}
              placeholder="Search by name, authority, assignee, or issue type"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            {CONTROVERSY_FILTERS.map((filter) => (
              <label key={filter.key} className={styles.filterField}>
                <span className={styles.fieldLabel}>{filter.label}</span>
                <select
                  className={styles.select}
                  value={filters[filter.key]}
                  onChange={(event) =>
                    setFilters((prev) => ({ ...prev, [filter.key]: event.target.value }))
                  }
                >
                  {filter.options.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.listHeader}>
          <div>
            <h2 className={styles.sectionTitle}>Active matters</h2>
            <p className={styles.sectionCopy}>
              Click into any matter to view details, manage deadlines, and connect to related
              entities, investors, and documents.
            </p>
          </div>
          <span className={styles.countPill}>{visibleRecords.length} visible</span>
        </div>

        <div className={styles.recordGrid}>
          {visibleRecords.length > 0 ? (
            visibleRecords.map((record) => (
              <ControversyCard
                key={record.id}
                record={record}
                onOpen={handleOpenRecord}
              />
            ))
          ) : (
            <div className={styles.emptyState}>
              No controversy matters match this scope and filter combination yet.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
