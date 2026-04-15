import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { DealCard } from '../components/DealCard';
import { DealTable, ALL_DEAL_COLUMNS, DEFAULT_DEAL_COLUMNS } from '../components/DealTable';
import { ColumnPicker } from '../../../components/ColumnPicker/ColumnPicker';
import { MultiSelectDropdown } from '../../../components/MultiSelectDropdown';
import { DealEditModal } from '../components/DealEditModal';
import { DealIntakeForm } from '../components/DealIntakeForm';
import { RecordCommentModal } from '../../../components/RecordCommentModal/RecordCommentModal';
import { DEAL_FILTERS } from '../config';
import { SCOPE_DIMENSIONS } from '../../../platform/context/platformContext.types';
import { useDealsVersion } from '../hooks/useDealsVersion';
import { dealsService } from '../services';
import { identityOrchestrator } from '../../identity/services';
import type { DealRecord } from '../types';
import styles from '../DealsModule.module.css';

const DealImport = lazy(() => import('../components/DealImport').then((m) => ({ default: m.DealImport })));

type ViewMode = 'table' | 'cards';

export function DealListPage() {
  const { scopeSelection } = usePlatformContext();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    status: DEAL_FILTERS[0].options[0],
    investmentType: DEAL_FILTERS[1].options[0],
  });
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);
  const [showIntake, setShowIntake] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const [selectedDeals, setSelectedDeals] = useState<string[]>([]);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);
  const [selectedYears, setSelectedYears] = useState<string[]>([]);
  const [selectedInvestors, setSelectedInvestors] = useState<string[]>([]);

  const STORAGE_KEY = 'deal-visible-columns';
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_DEAL_COLUMNS;
  });

  function handleColumnsChange(keys: string[]) {
    setVisibleColumns(keys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  }

  const version = useDealsVersion();

  const allDeals = useMemo(() => dealsService.getAccessibleDeals(), [version]);

  const dealOptions = useMemo(
    () => allDeals.map((d) => ({ value: d.id, label: d.name })),
    [allDeals],
  );
  const fundOptions = useMemo(
    () => SCOPE_DIMENSIONS.fund.map((f) => ({ value: f.id, label: f.label })),
    [],
  );
  const yearOptions = useMemo(
    () => SCOPE_DIMENSIONS.taxYear.map((y) => ({ value: y.id, label: y.label })),
    [],
  );
  const investorOptions = useMemo(
    () => SCOPE_DIMENSIONS.investor.map((i) => ({ value: i.id, label: i.label })),
    [],
  );

  const visibleDeals = useMemo(() => {
    const scopedDeals = dealsService.getScopedDeals(scopeSelection);
    return scopedDeals.filter((deal) => {
      const matchesSearch =
        searchValue.trim().length === 0 ||
        `${deal.name} ${deal.owner} ${deal.investmentType}`
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      const matchesStatus = filters.status === 'All statuses' || deal.status === filters.status;
      const matchesType = filters.investmentType === 'All types' || deal.investmentType === filters.investmentType;

      const matchesDeal = selectedDeals.length === 0 || selectedDeals.includes(deal.id);
      const matchesFund = selectedFunds.length === 0 || deal.scopeIds.some((id) => selectedFunds.includes(id));
      const matchesYear = selectedYears.length === 0 || deal.scopeIds.some((id) => selectedYears.includes(id));
      const matchesInvestor = selectedInvestors.length === 0 || deal.scopeIds.some((id) => selectedInvestors.includes(id));

      return matchesSearch && matchesStatus && matchesType && matchesDeal && matchesFund && matchesYear && matchesInvestor;
    });
  }, [scopeSelection, searchValue, filters, selectedDeals, selectedFunds, selectedYears, selectedInvestors, version]);

  const sortedDeals = useMemo(() => {
    const sorted = [...visibleDeals];
    sorted.sort((a, b) => {
      const aVal = String((a as any)[sortKey] ?? '');
      const bVal = String((b as any)[sortKey] ?? '');
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [visibleDeals, sortKey, sortDir]);

  const handleOpenDeal = useCallback((id: string) => navigate(`/deals/${id}`), [navigate]);

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
    if (window.confirm('Delete this deal?')) {
      dealsService.deleteDeal(id);
    }
  }
  function handleComment(id: string) { setCommentTargetId(id); }
  function handleSaveEdit(id: string, updates: Partial<DealRecord>) {
    dealsService.updateDeal(id, updates);
    setEditTargetId(null);
  }

  function handleIntakeSubmit(deal: DealRecord) {
    dealsService.addDeal(deal);
    setShowIntake(false);
  }

  const [importBanner, setImportBanner] = useState<{ autoMatched: number; tasksCreated: number } | null>(null);

  function handleImportSubmit(deals: DealRecord[]) {
    const records = deals.map((d) => ({
      rawName: d.name,
      rawAttributes: {
        investmentType: d.investmentType || '',
        sector: d.sector || '',
        geographicFocus: d.geographicFocus || '',
        closingDate: d.closingDate || '',
      },
      scopeIds: d.scopeIds || [],
    }));
    const result = identityOrchestrator.ingestAndResolve(records, 'deal', 'csv_import', 'import', 'Current User');

    for (const r of result.results) {
      if (r.action === 'auto_matched') {
        const matching = deals.find((d) => d.name === records[result.results.indexOf(r)]?.rawName);
        if (matching) dealsService.addDeal(matching);
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
              <div className={styles.eyebrow}>Deal Workspace</div>
              <h1 className={styles.title}>Deals with ownership, income, and investment detail.</h1>
              <p className={styles.lead}>
                Click into any deal to open the deal workspace with ownership, tax, and entity detail.
              </p>
            </div>
            <div className={styles.heroActions}>
              <button className={styles.heroActionBtn} onClick={() => setShowIntake(true)} type="button">+ New deal</button>
              <button className={styles.heroActionBtn} onClick={() => setShowImport(true)} type="button">Import</button>
              <ColumnPicker
                columns={ALL_DEAL_COLUMNS.filter((c) => c.key !== 'name')}
                visibleKeys={visibleColumns}
                onChange={handleColumnsChange}
                defaultKeys={DEFAULT_DEAL_COLUMNS}
              />
            </div>
          </div>
        </div>
      </section>

      {showIntake && (() => {
        const intakeScopeIds = [
          ...scopeSelection.fundIds,
          ...scopeSelection.taxYearIds,
          ...scopeSelection.workstreamIds,
          ...scopeSelection.investorIds,
        ];
        return <DealIntakeForm onSubmit={handleIntakeSubmit} onCancel={() => setShowIntake(false)} scopeIds={intakeScopeIds} />;
      })()}

      {showImport && (
        <Suspense fallback={<div className={styles.emptyState}>Loading import tools...</div>}>
          <DealImport onImport={handleImportSubmit} onCancel={() => setShowImport(false)} />
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
        <div className={styles.viewToggle}>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'table' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('table')}
            type="button"
          >
            Table
          </button>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'cards' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('cards')}
            type="button"
          >
            Cards
          </button>
        </div>

        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <label className={styles.fieldLabel} htmlFor="deal-search">
              Search deals
            </label>
            <input
              id="deal-search"
              className={styles.input}
              placeholder="Search by name, owner, or investment type"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
          </div>

          <div className={styles.filterRow}>
            {DEAL_FILTERS.map((filter) => (
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
            <MultiSelectDropdown label="Deal" options={dealOptions} selected={selectedDeals} onChange={setSelectedDeals} />
            <MultiSelectDropdown label="Fund" options={fundOptions} selected={selectedFunds} onChange={setSelectedFunds} />
            <MultiSelectDropdown label="Tax Year" options={yearOptions} selected={selectedYears} onChange={setSelectedYears} />
            <MultiSelectDropdown label="Investor" options={investorOptions} selected={selectedInvestors} onChange={setSelectedInvestors} />
          </div>
        </div>

        {viewMode === 'table' ? (
          sortedDeals.length > 0 ? (
            <DealTable
              deals={sortedDeals}
              sortKey={sortKey}
              sortDirection={sortDir}
              onSort={handleSort}
              onOpen={handleOpenDeal}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onComment={handleComment}
              visibleColumns={visibleColumns}
              onColumnsChange={handleColumnsChange}
            />
          ) : (
            <div className={styles.emptyState}>No deals match this scope and filter combination yet.</div>
          )
        ) : (
          <div className={styles.recordGrid}>
            {visibleDeals.length > 0 ? (
              visibleDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} onOpen={handleOpenDeal} />
              ))
            ) : (
              <div className={styles.emptyState}>No deals match this scope and filter combination yet.</div>
            )}
          </div>
        )}

        {editTargetId && (() => {
          const deal = dealsService.getAccessibleDealById(editTargetId);
          if (!deal) return null;
          return <DealEditModal deal={deal} onSave={handleSaveEdit} onCancel={() => setEditTargetId(null)} />;
        })()}

        {commentTargetId && (() => {
          const deal = dealsService.getAccessibleDealById(commentTargetId);
          if (!deal) return null;
          return (
            <RecordCommentModal
              title={`Comments — ${deal.name}`}
              comments={deal.comments}
              onAddComment={(comment) => dealsService.addDealComment(commentTargetId, comment)}
              onClose={() => setCommentTargetId(null)}
            />
          );
        })()}
      </section>
    </div>
  );
}
