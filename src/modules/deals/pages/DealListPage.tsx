import { lazy, Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { useFundViewProfile } from '../../../platform/hooks/useFundViewProfile';
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

const GLOBAL_COLUMNS_KEY = 'deal-visible-columns';

function baseFilterDefaults(): Record<string, string> {
  return {
    status: DEAL_FILTERS[0].options[0],
    investmentType: DEAL_FILTERS[1].options[0],
  };
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function DealListPage() {
  const { scopeSelection } = usePlatformContext();
  const profile = useFundViewProfile();
  const navigate = useNavigate();

  const dealTerm = profile?.dealList?.terminology?.deal ?? 'deal';
  const dealsTerm = profile?.dealList?.terminology?.dealPlural ?? 'deals';
  const DealTerm = capitalize(dealTerm);
  const DealsTerm = capitalize(dealsTerm);

  const availableColumnDefs = useMemo(() => {
    const hidden = new Set(profile?.dealList?.hiddenColumns ?? []);
    return ALL_DEAL_COLUMNS.filter((c) => !hidden.has(c.key));
  }, [profile]);

  const availableKeysSet = useMemo(
    () => new Set(availableColumnDefs.map((c) => c.key)),
    [availableColumnDefs],
  );

  const dealDefaultColumns = useMemo(() => {
    const fromProfile = profile?.dealList?.defaultColumns?.filter((id) => availableKeysSet.has(id));
    if (fromProfile && fromProfile.length > 0) return fromProfile;
    return DEFAULT_DEAL_COLUMNS.filter((id) => availableKeysSet.has(id));
  }, [profile, availableKeysSet]);

  const storageKey = useMemo(() => {
    return scopeSelection.fundIds.length === 1
      ? `${GLOBAL_COLUMNS_KEY}:${scopeSelection.fundIds[0]}`
      : GLOBAL_COLUMNS_KEY;
  }, [scopeSelection.fundIds]);

  const readStoredColumns = useCallback(
    (key: string): string[] | null => {
      const stored = localStorage.getItem(key);
      if (!stored) return null;
      try {
        const parsed = JSON.parse(stored);
        if (!Array.isArray(parsed)) return null;
        return parsed.filter((id): id is string => typeof id === 'string' && availableKeysSet.has(id));
      } catch {
        return null;
      }
    },
    [availableKeysSet],
  );

  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>(() => ({
    ...baseFilterDefaults(),
    ...(profile?.dealList?.defaultFilters ?? {}),
  }));
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);
  const [showIntake, setShowIntake] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [selectedFunds, setSelectedFunds] = useState<string[]>([]);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    return readStoredColumns(storageKey) ?? dealDefaultColumns;
  });

  // Re-seed columns when fund scope (→ storageKey) or the fund's profile defaults change.
  useEffect(() => {
    setVisibleColumns(readStoredColumns(storageKey) ?? dealDefaultColumns);
  }, [storageKey, dealDefaultColumns, readStoredColumns]);

  // Re-seed filters when the selected fund changes; preserves user edits within a selection.
  useEffect(() => {
    setFilters({
      ...baseFilterDefaults(),
      ...(profile?.dealList?.defaultFilters ?? {}),
    });
  }, [profile]);

  const handleColumnsChange = useCallback(
    (keys: string[]) => {
      const validated = keys.filter((k) => availableKeysSet.has(k));
      setVisibleColumns(validated);
      localStorage.setItem(storageKey, JSON.stringify(validated));
    },
    [availableKeysSet, storageKey],
  );

  const effectiveVisibleColumns = useMemo(
    () => visibleColumns.filter((k) => availableKeysSet.has(k)),
    [visibleColumns, availableKeysSet],
  );

  const version = useDealsVersion();

  const fundOptions = useMemo(
    () => SCOPE_DIMENSIONS.fund.map((f) => ({ value: f.id, label: f.label })),
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

      const matchesFund = selectedFunds.length === 0 || deal.scopeIds.some((id) => selectedFunds.includes(id));

      return matchesSearch && matchesStatus && matchesType && matchesFund;
    });
  }, [scopeSelection, searchValue, filters, selectedFunds, version]);

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
    if (window.confirm(`Delete this ${dealTerm}?`)) {
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
              <div className={styles.eyebrow}>{DealTerm} Workspace</div>
              <h1 className={styles.title}>{DealsTerm} with ownership, income, and investment detail.</h1>
              <p className={styles.lead}>
                Click into any {dealTerm} to open the {dealTerm} workspace with ownership, tax, and entity detail.
              </p>
            </div>
            <div className={styles.heroActions}>
              <button className={styles.heroActionBtn} onClick={() => setShowIntake(true)} type="button">+ New {dealTerm}</button>
              <button className={styles.heroActionBtn} onClick={() => setShowImport(true)} type="button">Import</button>
              <ColumnPicker
                columns={availableColumnDefs.filter((c) => c.key !== 'name')}
                visibleKeys={effectiveVisibleColumns}
                onChange={handleColumnsChange}
                defaultKeys={dealDefaultColumns}
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
        <div className={styles.toolbar}>
          <div className={styles.searchWrap}>
            <label className={styles.fieldLabel} htmlFor="deal-search">
              Search {dealsTerm}
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
            <MultiSelectDropdown label="Fund" options={fundOptions} selected={selectedFunds} onChange={setSelectedFunds} />
          </div>
        </div>

        {sortedDeals.length > 0 ? (
          <DealTable
            deals={sortedDeals}
            sortKey={sortKey}
            sortDirection={sortDir}
            onSort={handleSort}
            onOpen={handleOpenDeal}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onComment={handleComment}
            visibleColumns={effectiveVisibleColumns}
            onColumnsChange={handleColumnsChange}
          />
        ) : (
          <div className={styles.emptyState}>No {dealsTerm} match this scope and filter combination yet.</div>
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
