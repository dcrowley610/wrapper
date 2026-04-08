import { lazy, Suspense, useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { EntityCard } from '../components/EntityCard';
import { EntityTable, ALL_ENTITY_COLUMNS, DEFAULT_ENTITY_COLUMNS } from '../components/EntityTable';
import { ColumnPicker } from '../../../components/ColumnPicker/ColumnPicker';
import { EntityEditModal } from '../components/EntityEditModal';
import { EntityIntakeForm } from '../components/EntityIntakeForm';
import { RecordCommentModal } from '../../../components/RecordCommentModal/RecordCommentModal';
import { ENTITY_FILTERS } from '../config';
import { useEntitiesVersion } from '../hooks/useEntitiesVersion';
import { entitiesService, ownershipService } from '../services';
import { dealsService } from '../../deals/services';
import { OwnershipTable, ALL_OWNERSHIP_COLUMNS, DEFAULT_OWNERSHIP_COLUMNS } from '../components/OwnershipTable';
import { identityOrchestrator } from '../../identity/services';
import type { EntityRecord } from '../types';
import styles from '../EntitiesModule.module.css';

const StructuresPage = lazy(() => import('../../structures/pages/StructuresPage'));
const EntityImport = lazy(() => import('../components/EntityImport').then((m) => ({ default: m.EntityImport })));

type ViewMode = 'table' | 'cards' | 'ownership' | 'structures';

export function EntityListPage() {
  const { scopeSelection } = usePlatformContext();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState<Record<string, string>>({
    status: ENTITY_FILTERS[0].options[0],
    category: ENTITY_FILTERS[1].options[0],
  });
  const [sortKey, setSortKey] = useState('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);
  const [showIntake, setShowIntake] = useState(false);
  const [showImport, setShowImport] = useState(false);
  const [ownershipSearch, setOwnershipSearch] = useState('');
  const [ownershipSortKey, setOwnershipSortKey] = useState('owner');
  const [ownershipSortDir, setOwnershipSortDir] = useState<'asc' | 'desc'>('asc');
  const [ownershipRelFilter, setOwnershipRelFilter] = useState('All types');
  const [ownershipDealFilter, setOwnershipDealFilter] = useState('All deals');

  const STORAGE_KEY = 'entity-visible-columns';
  const [visibleColumns, setVisibleColumns] = useState<string[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_ENTITY_COLUMNS;
  });

  function handleColumnsChange(keys: string[]) {
    setVisibleColumns(keys);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
  }

  const OWN_STORAGE_KEY = 'ownership-visible-columns';
  const [ownershipVisibleColumns, setOwnershipVisibleColumns] = useState<string[]>(() => {
    const stored = localStorage.getItem(OWN_STORAGE_KEY);
    return stored ? JSON.parse(stored) : DEFAULT_OWNERSHIP_COLUMNS;
  });

  function handleOwnershipColumnsChange(keys: string[]) {
    setOwnershipVisibleColumns(keys);
    localStorage.setItem(OWN_STORAGE_KEY, JSON.stringify(keys));
  }

  const entitiesVersion = useEntitiesVersion();

  const visibleEntities = useMemo(() => {
    const scopeEntities = entitiesService.getScopedEntities(scopeSelection);
    return scopeEntities.filter((entity) => {
      const matchesSearch =
        searchValue.trim().length === 0 ||
        `${entity.name} ${entity.legalName} ${entity.jurisdiction} ${entity.ownerTeam}`
          .toLowerCase()
          .includes(searchValue.toLowerCase());

      const matchesStatus = filters.status === 'All statuses' || entity.status === filters.status;
      const matchesCategory = filters.category === 'All categories' || entity.category === filters.category;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [scopeSelection, searchValue, filters, entitiesVersion]);

  const sortedEntities = useMemo(() => {
    const sorted = [...visibleEntities];
    sorted.sort((a, b) => {
      const aVal = String((a as any)[sortKey] ?? '');
      const bVal = String((b as any)[sortKey] ?? '');
      const cmp = aVal.localeCompare(bVal);
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [visibleEntities, sortKey, sortDir]);

  const allEntities = useMemo(() => entitiesService.getAccessibleEntities(), [entitiesVersion]);
  const allDeals = useMemo(() => dealsService.getAccessibleDeals(), [entitiesVersion]);
  const computedOwnership = useMemo(() => ownershipService.computeAllOwnership(), [entitiesVersion]);
  const directRelationships = useMemo(() => ownershipService.getAllRelationships(), [entitiesVersion]);

  const handleOpenEntity = useCallback((id: string) => navigate(`/entities/${id}`), [navigate]);

  function handleSort(key: string) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function handleOwnershipSort(key: string) {
    if (ownershipSortKey === key) {
      setOwnershipSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setOwnershipSortKey(key);
      setOwnershipSortDir('asc');
    }
  }

  function handleEdit(id: string) { setEditTargetId(id); }
  function handleDelete(id: string) {
    if (window.confirm('Delete this entity?')) {
      entitiesService.deleteEntity(id);
    }
  }
  function handleComment(id: string) { setCommentTargetId(id); }
  function handleSaveEdit(id: string, updates: Partial<EntityRecord>) {
    entitiesService.updateEntity(id, updates);
    setEditTargetId(null);
  }

  function handleIntakeSubmit(entity: EntityRecord) {
    entitiesService.addEntity(entity);
    setShowIntake(false);
  }

  const [importBanner, setImportBanner] = useState<{ autoMatched: number; tasksCreated: number } | null>(null);

  function handleImportSubmit(entities: EntityRecord[]) {
    const records = entities.map((e) => ({
      rawName: e.name || e.legalName,
      rawAttributes: {
        legalName: e.legalName || '',
        jurisdiction: e.jurisdiction || '',
        category: e.category || '',
        ein: e.ein || '',
        taxClassification: e.taxClassification || '',
      },
      scopeIds: e.scopeIds || [],
    }));
    const result = identityOrchestrator.ingestAndResolve(records, 'entity', 'csv_import', 'import', 'Current User');

    // Add auto-matched entities to the domain service
    for (const r of result.results) {
      if (r.action === 'auto_matched') {
        const matching = entities.find((e) => (e.name || e.legalName) === records[result.results.indexOf(r)]?.rawName);
        if (matching) entitiesService.addEntity(matching);
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
              <div className={styles.eyebrow}>Entity Workspace</div>
              <h1 className={styles.title}>Entity records with room for tax work, not just metadata.</h1>
              <p className={styles.lead}>
                Click into any entity to open the domain workspace. This is designed to become the landing
                target for future links from Structures.
              </p>
            </div>
            <div className={styles.heroActions}>
              <button className={styles.heroActionBtn} onClick={() => setShowIntake(true)} type="button">+ New entity</button>
              <button className={styles.heroActionBtn} onClick={() => setShowImport(true)} type="button">Import</button>
              {viewMode === 'table' && (
                <ColumnPicker
                  columns={ALL_ENTITY_COLUMNS.filter((c) => c.key !== 'name')}
                  visibleKeys={visibleColumns}
                  onChange={handleColumnsChange}
                  defaultKeys={DEFAULT_ENTITY_COLUMNS}
                />
              )}
              {viewMode === 'ownership' && (
                <ColumnPicker
                  columns={ALL_OWNERSHIP_COLUMNS}
                  visibleKeys={ownershipVisibleColumns}
                  onChange={handleOwnershipColumnsChange}
                  defaultKeys={DEFAULT_OWNERSHIP_COLUMNS}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {showIntake && (
        <EntityIntakeForm onSubmit={handleIntakeSubmit} onCancel={() => setShowIntake(false)} />
      )}

      {showImport && (
        <Suspense fallback={<div className={styles.emptyState}>Loading import tools...</div>}>
          <EntityImport onImport={handleImportSubmit} onCancel={() => setShowImport(false)} />
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
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'ownership' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('ownership')}
            type="button"
          >
            Ownership
          </button>
          <button
            className={`${styles.viewToggleBtn} ${viewMode === 'structures' ? styles.viewToggleBtnActive : ''}`}
            onClick={() => setViewMode('structures')}
            type="button"
          >
            Structures
          </button>
          {viewMode === 'structures' && (
            <button className={styles.fullPageBtn} onClick={() => navigate('/structures')} type="button">
              Open full page
            </button>
          )}
        </div>

        {(viewMode === 'table' || viewMode === 'cards') && (
          <>
            <div className={styles.toolbar}>
              <div className={styles.searchWrap}>
                <label className={styles.fieldLabel} htmlFor="entity-search">
                  Search entities
                </label>
                <input
                  id="entity-search"
                  className={styles.input}
                  placeholder="Search by name, legal name, jurisdiction, or owner"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
              </div>

              <div className={styles.filterRow}>
                {ENTITY_FILTERS.map((filter) => (
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

            {viewMode === 'table' && (
              sortedEntities.length > 0 ? (
                <EntityTable
                  entities={sortedEntities}
                  sortKey={sortKey}
                  sortDirection={sortDir}
                  onSort={handleSort}
                  onOpen={handleOpenEntity}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onComment={handleComment}
                  visibleColumns={visibleColumns}
                  onColumnsChange={handleColumnsChange}
                />
              ) : (
                <div className={styles.emptyState}>
                  No entities match this scope and filter combination yet.
                </div>
              )
            )}

            {viewMode === 'cards' && (
              <div className={styles.recordGrid}>
                {visibleEntities.length > 0 ? (
                  visibleEntities.map((entity) => (
                    <EntityCard key={entity.id} entity={entity} onOpen={handleOpenEntity} />
                  ))
                ) : (
                  <div className={styles.emptyState}>
                    No entities match this scope and filter combination yet.
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {viewMode === 'ownership' && (
        <section className={styles.workspace} style={{ paddingTop: 0 }}>
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <label className={styles.fieldLabel} htmlFor="ownership-search">
                Search ownership
              </label>
              <input
                id="ownership-search"
                className={styles.input}
                placeholder="Search by entity name or jurisdiction"
                value={ownershipSearch}
                onChange={(e) => setOwnershipSearch(e.target.value)}
              />
            </div>
            <div className={styles.filterRow}>
              <label className={styles.filterField}>
                <span className={styles.fieldLabel}>Deal</span>
                <select
                  className={styles.select}
                  value={ownershipDealFilter}
                  onChange={(e) => setOwnershipDealFilter(e.target.value)}
                >
                  <option value="All deals">All deals</option>
                  {allDeals.map((d) => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </label>
              <label className={styles.filterField}>
                <span className={styles.fieldLabel}>Relationship type</span>
                <select
                  className={styles.select}
                  value={ownershipRelFilter}
                  onChange={(e) => setOwnershipRelFilter(e.target.value)}
                >
                  <option value="All types">All types</option>
                  <option value="direct">direct</option>
                  <option value="indirect">indirect</option>
                </select>
              </label>
            </div>
          </div>
          <OwnershipTable
            relationships={computedOwnership}
            entities={allEntities}
            directRelationships={directRelationships}
            searchValue={ownershipSearch}
            sortKey={ownershipSortKey}
            sortDirection={ownershipSortDir}
            onSort={handleOwnershipSort}
            relationshipFilter={ownershipRelFilter}
            dealFilter={ownershipDealFilter}
            deals={allDeals}
            visibleColumns={ownershipVisibleColumns}
            onColumnsChange={handleOwnershipColumnsChange}
          />
        </section>
      )}

      {viewMode === 'structures' && (
        <div className={styles.structuresContainer}>
          <Suspense fallback={<div style={{ padding: 28, color: '#587082' }}>Loading structures...</div>}>
            <StructuresPage />
          </Suspense>
        </div>
      )}

      {editTargetId && (() => {
        const entity = entitiesService.getAccessibleEntityById(editTargetId);
        if (!entity) return null;
        return <EntityEditModal entity={entity} onSave={handleSaveEdit} onCancel={() => setEditTargetId(null)} />;
      })()}

      {commentTargetId && (() => {
        const entity = entitiesService.getAccessibleEntityById(commentTargetId);
        if (!entity) return null;
        return (
          <RecordCommentModal
            title={`Comments — ${entity.name}`}
            comments={entity.comments}
            onAddComment={(comment) => entitiesService.addEntityComment(commentTargetId, comment)}
            onClose={() => setCommentTargetId(null)}
          />
        );
      })()}
    </div>
  );
}
