import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { DraggableHeaderRow } from '../../../components/DraggableHeaderRow/DraggableHeaderRow';
import type { ComputedOwnership, EntityRecord, OwnershipRelationship } from '../types';
import styles from '../EntitiesModule.module.css';

export const ALL_OWNERSHIP_COLUMNS = [
  { key: 'owner', label: 'Owner', default: true },
  { key: 'owned', label: 'Owned Entity', default: true },
  { key: 'deal', label: 'Deal', default: true },
  { key: 'percent', label: 'Ownership %', default: true },
  { key: 'type', label: 'Type', default: true },
  { key: 'path', label: 'Path', default: false },
  { key: 'ownerCategory', label: 'Owner Category', default: false },
  { key: 'ownedJurisdiction', label: 'Owned Jurisdiction', default: false },
];

export const DEFAULT_OWNERSHIP_COLUMNS = ALL_OWNERSHIP_COLUMNS.filter((c) => c.default).map((c) => c.key);

type OwnershipTableProps = {
  relationships: ComputedOwnership[];
  entities: EntityRecord[];
  directRelationships: OwnershipRelationship[];
  searchValue: string;
  sortKey: string;
  sortDirection: 'asc' | 'desc';
  onSort: (key: string) => void;
  relationshipFilter: string;
  dealFilter: string;
  deals: { id: string; name: string }[];
  visibleColumns: string[];
  onColumnsChange: (keys: string[]) => void;
};

export function OwnershipTable({
  relationships,
  entities,
  directRelationships,
  searchValue,
  sortKey,
  sortDirection,
  onSort,
  relationshipFilter,
  dealFilter,
  deals,
  visibleColumns,
  onColumnsChange,
}: OwnershipTableProps) {
  const navigate = useNavigate();

  const columns = useMemo(() => {
    const colMap = new Map(ALL_OWNERSHIP_COLUMNS.map((col) => [col.key, col]));
    return visibleColumns.filter((key) => colMap.has(key)).map((key) => colMap.get(key)!);
  }, [visibleColumns]);

  const entityMap = useMemo(() => {
    const m = new Map<string, EntityRecord>();
    for (const e of entities) m.set(e.id, e);
    return m;
  }, [entities]);

  const dealMap = useMemo(() => {
    const m = new Map<string, string>();
    for (const d of deals) m.set(d.id, d.name);
    return m;
  }, [deals]);

  const resolveName = (id: string) => entityMap.get(id)?.name ?? id;
  const resolveDealName = (id: string) => dealMap.get(id) ?? id;

  const filteredDirect = useMemo(() => {
    if (dealFilter === 'All deals') return directRelationships;
    return directRelationships.filter((r) => r.dealId === dealFilter);
  }, [directRelationships, dealFilter]);

  const ownershipTotals = useMemo(() => {
    const totals = new Map<string, number>();
    for (const rel of filteredDirect) {
      const key = `${rel.ownedEntityId}::${rel.dealId}`;
      totals.set(key, (totals.get(key) ?? 0) + rel.ownershipDecimal);
    }
    return totals;
  }, [filteredDirect]);

  const incompleteEntities = useMemo(() => {
    const results: { id: string; dealId: string; name: string; dealName: string; total: number }[] = [];
    for (const [compositeKey, total] of ownershipTotals) {
      const [entityId, dealId] = compositeKey.split('::');
      if (Math.abs(total - 1) > 0.001) {
        results.push({
          id: entityId,
          dealId,
          name: resolveName(entityId),
          dealName: resolveDealName(dealId),
          total,
        });
      }
    }
    return results;
  }, [ownershipTotals, entityMap, dealMap]);

  const rows = useMemo(() => {
    let filtered = relationships;

    if (dealFilter !== 'All deals') {
      filtered = filtered.filter((r) => r.dealId === dealFilter);
    }

    if (relationshipFilter !== 'All types') {
      filtered = filtered.filter((r) => r.relationshipKind === relationshipFilter);
    }

    if (searchValue.trim()) {
      const q = searchValue.toLowerCase();
      filtered = filtered.filter((r) => {
        const owner = entityMap.get(r.ownerEntityId);
        const owned = entityMap.get(r.ownedEntityId);
        const text = [
          owner?.name, owner?.jurisdiction,
          owned?.name, owned?.jurisdiction,
          resolveDealName(r.dealId),
        ].filter(Boolean).join(' ').toLowerCase();
        return text.includes(q);
      });
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      let aVal = '';
      let bVal = '';
      switch (sortKey) {
        case 'deal': aVal = resolveDealName(a.dealId); bVal = resolveDealName(b.dealId); break;
        case 'owner': aVal = resolveName(a.ownerEntityId); bVal = resolveName(b.ownerEntityId); break;
        case 'owned': aVal = resolveName(a.ownedEntityId); bVal = resolveName(b.ownedEntityId); break;
        case 'percent': return sortDirection === 'asc'
          ? a.computedOwnershipDecimal - b.computedOwnershipDecimal
          : b.computedOwnershipDecimal - a.computedOwnershipDecimal;
        case 'type': aVal = a.relationshipKind; bVal = b.relationshipKind; break;
        case 'ownerCategory': aVal = entityMap.get(a.ownerEntityId)?.category ?? ''; bVal = entityMap.get(b.ownerEntityId)?.category ?? ''; break;
        case 'ownedJurisdiction': aVal = entityMap.get(a.ownedEntityId)?.jurisdiction ?? ''; bVal = entityMap.get(b.ownedEntityId)?.jurisdiction ?? ''; break;
        default: aVal = resolveName(a.ownerEntityId); bVal = resolveName(b.ownerEntityId);
      }
      const cmp = aVal.localeCompare(bVal);
      return sortDirection === 'asc' ? cmp : -cmp;
    });

    return sorted;
  }, [relationships, searchValue, sortKey, sortDirection, relationshipFilter, dealFilter, entityMap, dealMap]);

  if (rows.length === 0) {
    return <div className={styles.emptyState}>No ownership relationships match the current filters.</div>;
  }

  return (
    <>
      {incompleteEntities.length > 0 && (
        <div style={{
          padding: '10px 14px',
          marginBottom: 12,
          background: '#fef3cd',
          border: '1px solid #e6c964',
          borderRadius: 6,
          fontSize: '0.82rem',
          color: '#6b5900',
        }}>
          <strong>Ownership validation:</strong> All entities must be 100% owned per deal.
          {incompleteEntities.map((e) => (
            <div key={`${e.id}-${e.dealId}`} style={{ marginTop: 4 }}>
              {e.name} ({e.dealName}): <strong>{(e.total * 100).toFixed(1)}%</strong> total direct ownership
              {e.total === 0 ? ' (unowned)' : ` (missing ${((1 - e.total) * 100).toFixed(1)}%)`}
            </div>
          ))}
        </div>
      )}
    <table className={styles.recordTable}>
      <thead>
        <DraggableHeaderRow
          columns={columns}
          sortKey={sortKey}
          sortDirection={sortDirection}
          onSort={onSort}
          onReorder={onColumnsChange}
          sortIndicatorClass={styles.sortIndicator}
        />
      </thead>
      <tbody>
        {rows.map((rel, i) => {
          const owner = entityMap.get(rel.ownerEntityId);
          const owned = entityMap.get(rel.ownedEntityId);
          const pct = (rel.computedOwnershipDecimal * 100).toFixed(1);
          const pathNames = rel.pathEntityIds.map(resolveName).join(' \u2192 ');

          const cellMap: Record<string, React.ReactNode> = {
            owner: <td key="owner"><button className={styles.titleLink} style={{ fontWeight: 600 }} onClick={() => navigate(`/entities/${rel.ownerEntityId}`)} type="button">{owner?.name ?? rel.ownerEntityId}</button></td>,
            owned: <td key="owned"><button className={styles.titleLink} onClick={() => navigate(`/entities/${rel.ownedEntityId}`)} type="button">{owned?.name ?? rel.ownedEntityId}</button></td>,
            deal: <td key="deal"><button className={styles.titleLink} onClick={() => navigate(`/deals/${rel.dealId}`)} type="button">{resolveDealName(rel.dealId)}</button></td>,
            percent: <td key="percent" style={{ fontWeight: rel.computedOwnershipDecimal >= 0.5 ? 700 : 400 }}>{pct}%</td>,
            type: <td key="type"><span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.04em', color: rel.relationshipKind === 'direct' ? '#1678a2' : '#6a7f90' }}>{rel.relationshipKind}</span></td>,
            path: <td key="path" style={{ fontSize: '0.8rem', color: '#587082' }}>{pathNames}</td>,
            ownerCategory: <td key="ownerCategory">{owner?.category ?? '—'}</td>,
            ownedJurisdiction: <td key="ownedJurisdiction">{owned?.jurisdiction ?? '—'}</td>,
          };

          return (
            <tr key={`${rel.dealId}-${rel.ownerEntityId}-${rel.ownedEntityId}-${rel.relationshipKind}-${i}`}>
              {columns.map((col) => cellMap[col.key])}
            </tr>
          );
        })}
      </tbody>
    </table>
    </>
  );
}
