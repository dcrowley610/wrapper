import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { InvestorTable, ALL_INVESTOR_COLUMNS, DEFAULT_INVESTOR_COLUMNS } from '../components/InvestorTable';
import { ColumnPicker } from '../../../components/ColumnPicker/ColumnPicker';
import { InvestorEditModal } from '../components/InvestorEditModal';
import { InvestorIntakeForm } from '../components/InvestorIntakeForm';
import { RecordCommentModal } from '../../../components/RecordCommentModal/RecordCommentModal';
import { INVESTOR_FILTERS } from '../config';
import { useInvestorsVersion } from '../hooks/useInvestorsVersion';
import { investorsService } from '../services';
import { identityOrchestrator } from '../../identity/services';
import type { InvestorRecord } from '../types';
import styles from '../InvestorsModule.module.css';

const InvestorImport = lazy(() => import('../components/InvestorImport').then((m) => ({ default: m.InvestorImport })));

export function InvestorListPage() {
  const { scopeSelection } = usePlatformContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    status: INVESTOR_FILTERS[0].options[0],
    class: INVESTOR_FILTERS[1].options[0],
  });
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);
  const [showIntake, setShowIntake] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const STORAGE_KEY = 'investor-visible-columns';
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_INVESTOR_COLUMNS;
  });

  function handleColumnsChange(keys: string[]) {
    setVisibleColumns(keys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  }

  const version = useInvestorsVersion();

  const visibleInvestors = useMemo(() => {
    const scopeInvestors = investorsService.getScopedInvestors(scopeSelection);
    return scopeInvestors.filter((investor) => {
      const matchesSearch =
        searchValue.trim().length === 0 ||
        `${investor.name} ${investor.domicile} ${investor.withholdingProfile} ${investor.serviceTeam}`
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      const matchesStatus = filters.status === 'All statuses' || investor.status === filters.status;
      const matchesClass = filters.class === 'All classes' || investor.investorClass === filters.class;

      return matchesSearch && matchesStatus && matchesClass;
    });
  }, [scopeSelection, searchValue, filters, version]);

  const sortedInvestors = useMemo(() => {
    const sorted = [...visibleInvestors];
    sorted.sort((a, b) => {
      const aVal = String((a as any)[sortKey] ?? '');
      const bVal = String((b as any)[sortKey] ?? '');
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [visibleInvestors, sortKey, sortDir]);

  const handleOpenInvestor = useCallback((id: string) => navigate(`/investors/${id}`), [navigate]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }
  function handleEdit(id: string) { setEditTargetId(id); }
  function handleDelete(id: string) {
    if (window.confirm('Delete this investor?')) {
      investorsService.deleteInvestor(id);
    }
  }
  function handleComment(id: string) { setCommentTargetId(id); }
  function handleSaveEdit(id: string, updates: Partial<InvestorRecord>) {
    investorsService.updateInvestor(id, updates);
    setEditTargetId(null);
  }

  function handleIntakeSubmit(investor: InvestorRecord) {
    investorsService.addInvestor(investor);
    setShowIntake(false);
  }

  const [importBanner, setImportBanner] = useState<{ autoMatched: number; tasksCreated: number } | null>(null);

  function handleImportSubmit(investors: InvestorRecord[]) {
    const records = investors.map((inv) => ({
      rawName: inv.name || inv.legalName,
      rawAttributes: {
        legalName: inv.legalName || '',
        domicile: inv.domicile || '',
        investorClass: inv.investorClass || '',
        taxIdType: inv.taxIdType || '',
        taxIdLast4: inv.taxIdLast4 || '',
      },
      scopeIds: inv.scopeIds || [],
    }));
    const result = identityOrchestrator.ingestAndResolve(records, 'investor', 'csv_import', 'import', 'Current User');

    for (const r of result.results) {
      if (r.action === 'auto_matched') {
        const matching = investors.find((inv) => (inv.name || inv.legalName) === records[result.results.indexOf(r)]?.rawName);
        if (matching) investorsService.addInvestor(matching);
      }
    }

    if (result.tasksCreated > 0) {
      setImportBanner({ autoMatched: result.autoMatched, tasksCreated: result.tasksCreated });
    }
    setShowImport(false);
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.heroCardInner}>
            <div>
              <div className={styles.eyebrow}>Investor Workspace</div>
              <h1 className={styles.title}>Investor records that can grow into a full service workspace.</h1>
              <p className={styles.lead}>
                Open an investor detail view to see where Questions, Requests, Documents, Rules,
                Review, and Activity can later plug in as filtered capability surfaces.
              </p>
            </div>
            <div className={styles.heroActions}>
              <button className={styles.heroActionBtn} onClick={() => setShowIntake(true)} type="button">+ New investor</button>
              <button className={styles.heroActionBtn} onClick={() => setShowImport(true)} type="button">Import</button>
              <ColumnPicker
                columns={ALL_INVESTOR_COLUMNS.filter((c) => c.key !== 'name')}
                visibleKeys={visibleColumns}
                onChange={handleColumnsChange}
                defaultKeys={DEFAULT_INVESTOR_COLUMNS}
              />
            </div>
          </div>
        </div>
      </section>

      {showIntake && (
        <InvestorIntakeForm onSubmit={handleIntakeSubmit} onCancel={() => setShowIntake(false)} />
      )}

      {showImport && (
        <Suspense fallback={<div className={styles.emptyState}>Loading import tools...</div>}>
          <InvestorImport onImport={handleImportSubmit} onCancel={() => setShowImport(false)} />
        </Suspense>
      )}

      {importBanner && (
        <div className={styles.reviewBanner}>
          {importBanner.autoMatched} auto-matched, {importBanner.tasksCreated} need review
          {' — '}
          <a href="/review" style={{ color: 'inherit', textDecoration: 'underline' }}>Go to Review</a>
          <button
            type="button"
            onClick={() => setImportBanner(null)}
            style={{ marginLeft: 12, background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
          >
            &times;
          </button>
        </div>
      )}

      <section className={styles.workspace}>
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <label className={styles.fieldLabel} htmlFor="investor-search">
              Search investors
            </label>
            <input
              id="investor-search"
              className={styles.input}
              placeholder="Search by name, domicile, withholding profile, or team"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            {INVESTOR_FILTERS.map((filter) => (
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

        {sortedInvestors.length > 0 ? (
          <InvestorTable
            investors={sortedInvestors}
            sortKey={sortKey}
            sortDirection={sortDir}
            onSort={handleSort}
            onOpen={handleOpenInvestor}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComment={handleComment}
            visibleColumns={visibleColumns}
            onColumnsChange={handleColumnsChange}
          />
        ) : (
          <div className={styles.emptyState}>No investors match this scope and filter combination yet.</div>
        )}

        {editTargetId && (() => {
          const investor = investorsService.getAccessibleInvestorById(editTargetId);
          if (!investor) return null;
          return <InvestorEditModal investor={investor} onSave={handleSaveEdit} onCancel={() => setEditTargetId(null)} />;
        })()}

        {commentTargetId && (() => {
          const investor = investorsService.getAccessibleInvestorById(commentTargetId);
          if (!investor) return null;
          return (
            <RecordCommentModal
              title={`Comments — ${investor.name}`}
              comments={investor.comments}
              onAddComment={(comment) => investorsService.addInvestorComment(commentTargetId, comment)}
              onClose={() => setCommentTargetId(null)}
            />
          );
        })()}
      </section>
    </div>
  );
}
