import type { OwnershipRelationship, ComputedOwnership } from '../types';

let _version = 0;
type Listener = () => void;
const _listeners = new Set<Listener>();
function _notify() { _listeners.forEach((cb) => cb()); }

let OWNERSHIP_RECORDS: OwnershipRelationship[] = [
  // atlas-infra-acquisition
  {
    id: 'own-1',
    dealId: 'atlas-infra-acquisition',
    ownerEntityId: 'third-party-investors',
    ownedEntityId: 'atlas-master-fund',
    ownershipDecimal: 1.00,
    effectiveDate: '2018-04-15',
    notes: 'External LP investors',
  },
  {
    id: 'own-2',
    dealId: 'atlas-infra-acquisition',
    ownerEntityId: 'atlas-master-fund',
    ownedEntityId: 'smith-real-estate-llc',
    ownershipDecimal: 0.65,
    effectiveDate: '2018-04-15',
    notes: 'Majority holding',
  },
  {
    id: 'own-3',
    dealId: 'atlas-infra-acquisition',
    ownerEntityId: 'third-party-investors',
    ownedEntityId: 'smith-real-estate-llc',
    ownershipDecimal: 0.35,
    effectiveDate: '2018-04-15',
    notes: 'External co-investment',
  },
  // atlas-lux-debt-facility
  {
    id: 'own-4',
    dealId: 'atlas-lux-debt-facility',
    ownerEntityId: 'atlas-master-fund',
    ownedEntityId: 'atlas-blocker-lux',
    ownershipDecimal: 0.80,
    effectiveDate: '2019-09-01',
    notes: 'Primary blocker stake',
  },
  {
    id: 'own-5',
    dealId: 'atlas-lux-debt-facility',
    ownerEntityId: 'third-party-investors',
    ownedEntityId: 'atlas-blocker-lux',
    ownershipDecimal: 0.20,
    effectiveDate: '2019-09-01',
    notes: 'Minority third-party stake',
  },
  // smith-re-equity-roll
  {
    id: 'own-6',
    dealId: 'smith-re-equity-roll',
    ownerEntityId: 'atlas-master-fund',
    ownedEntityId: 'smith-real-estate-llc',
    ownershipDecimal: 0.65,
    effectiveDate: '2018-04-15',
    notes: 'Majority holding',
  },
  {
    id: 'own-7',
    dealId: 'smith-re-equity-roll',
    ownerEntityId: 'third-party-investors',
    ownedEntityId: 'smith-real-estate-llc',
    ownershipDecimal: 0.35,
    effectiveDate: '2018-04-15',
    notes: 'External co-investment',
  },
  {
    id: 'own-8',
    dealId: 'smith-re-equity-roll',
    ownerEntityId: 'smith-real-estate-llc',
    ownedEntityId: 'drip-ventures-inc',
    ownershipDecimal: 0.50,
    effectiveDate: '2020-01-10',
    notes: 'Operating subsidiary',
  },
  {
    id: 'own-9',
    dealId: 'smith-re-equity-roll',
    ownerEntityId: 'atlas-blocker-lux',
    ownedEntityId: 'drip-ventures-inc',
    ownershipDecimal: 0.25,
    effectiveDate: '2020-06-15',
    notes: 'Secondary position via blocker',
  },
  {
    id: 'own-10',
    dealId: 'smith-re-equity-roll',
    ownerEntityId: 'third-party-investors',
    ownedEntityId: 'drip-ventures-inc',
    ownershipDecimal: 0.25,
    effectiveDate: '2020-01-10',
    notes: 'External minority position',
  },
];

/**
 * Compute all direct + indirect ownership relationships via cycle-safe DFS.
 * Groups by dealId so indirect chains never cross deal boundaries.
 */
function computeAll(relationships: OwnershipRelationship[]): ComputedOwnership[] {
  const results: ComputedOwnership[] = [];

  // Group relationships by dealId
  const byDeal = new Map<string, OwnershipRelationship[]>();
  for (const rel of relationships) {
    if (!byDeal.has(rel.dealId)) byDeal.set(rel.dealId, []);
    byDeal.get(rel.dealId)!.push(rel);
  }

  for (const [dealId, dealRels] of byDeal) {
    // Direct relationships
    for (const rel of dealRels) {
      results.push({
        dealId,
        ownerEntityId: rel.ownerEntityId,
        ownedEntityId: rel.ownedEntityId,
        relationshipKind: 'direct',
        pathEntityIds: [rel.ownerEntityId, rel.ownedEntityId],
        computedOwnershipDecimal: rel.ownershipDecimal,
      });
    }

    // Build adjacency: owner -> [(ownedId, decimal)]
    const adj = new Map<string, { ownedId: string; decimal: number }[]>();
    for (const rel of dealRels) {
      if (!adj.has(rel.ownerEntityId)) adj.set(rel.ownerEntityId, []);
      adj.get(rel.ownerEntityId)!.push({ ownedId: rel.ownedEntityId, decimal: rel.ownershipDecimal });
    }

    // Collect all entities that are owners (potential roots for indirect chains)
    const ownerIds = new Set(dealRels.map((r) => r.ownerEntityId));

    for (const rootId of ownerIds) {
      // DFS from each owner to find indirect chains (path length > 2)
      function dfs(currentId: string, currentDecimal: number, path: string[], visited: Set<string>) {
        const children = adj.get(currentId);
        if (!children) return;
        for (const { ownedId, decimal } of children) {
          if (visited.has(ownedId)) continue; // cycle guard
          const chainedDecimal = currentDecimal * decimal;
          const newPath = [...path, ownedId];
          if (newPath.length > 2) {
            // This is indirect (at least one intermediary)
            results.push({
              dealId,
              ownerEntityId: rootId,
              ownedEntityId: ownedId,
              relationshipKind: 'indirect',
              pathEntityIds: newPath,
              computedOwnershipDecimal: chainedDecimal,
            });
          }
          visited.add(ownedId);
          dfs(ownedId, chainedDecimal, newPath, visited);
          visited.delete(ownedId);
        }
      }

      const visited = new Set<string>([rootId]);
      dfs(rootId, 1, [rootId], visited);
    }
  }

  return results;
}

export const ownershipService = {
  getAllRelationships(): OwnershipRelationship[] {
    return OWNERSHIP_RECORDS;
  },

  getRelationshipById(id: string): OwnershipRelationship | undefined {
    return OWNERSHIP_RECORDS.find((r) => r.id === id);
  },

  getDirectOwners(entityId: string, dealId?: string): OwnershipRelationship[] {
    return OWNERSHIP_RECORDS.filter((r) =>
      r.ownedEntityId === entityId && (dealId == null || r.dealId === dealId)
    );
  },

  getDirectChildren(entityId: string, dealId?: string): OwnershipRelationship[] {
    return OWNERSHIP_RECORDS.filter((r) =>
      r.ownerEntityId === entityId && (dealId == null || r.dealId === dealId)
    );
  },

  computeAllOwnership(dealId?: string): ComputedOwnership[] {
    const rels = dealId != null
      ? OWNERSHIP_RECORDS.filter((r) => r.dealId === dealId)
      : OWNERSHIP_RECORDS;
    return computeAll(rels);
  },

  computeOwnershipFor(entityId: string, dealId?: string): ComputedOwnership[] {
    const rels = dealId != null
      ? OWNERSHIP_RECORDS.filter((r) => r.dealId === dealId)
      : OWNERSHIP_RECORDS;
    return computeAll(rels).filter(
      (c) => c.ownerEntityId === entityId || c.ownedEntityId === entityId,
    );
  },

  addRelationship(rel: OwnershipRelationship): void {
    OWNERSHIP_RECORDS = [...OWNERSHIP_RECORDS, rel];
    _version++;
    _notify();
  },

  updateRelationship(id: string, updates: Partial<Omit<OwnershipRelationship, 'id'>>): void {
    OWNERSHIP_RECORDS = OWNERSHIP_RECORDS.map((r) => (r.id === id ? { ...r, ...updates } : r));
    _version++;
    _notify();
  },

  deleteRelationship(id: string): void {
    OWNERSHIP_RECORDS = OWNERSHIP_RECORDS.filter((r) => r.id !== id);
    _version++;
    _notify();
  },

  getVersion(): number {
    return _version;
  },

  subscribe(cb: Listener): () => void {
    _listeners.add(cb);
    return () => _listeners.delete(cb);
  },
};
