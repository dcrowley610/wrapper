/**
 * Structures Module Services
 * API and data access layer for structures domain
 */

import type { ScopeSelection } from '../../../platform/context';
import { entitiesService } from '../../entities/services';
import { ownershipService } from '../../entities/services';
import type { EntityRecord } from '../../entities/types';
import type { AnnotationEdge, EntityNode, OwnershipEdge } from '../types';

export type StructureGraph = {
  nodes: EntityNode[];
  ownershipEdges: OwnershipEdge[];
  annotationEdges: AnnotationEdge[];
};

function mapEntityType(record: EntityRecord): EntityNode['data']['entityType'] {
  switch (record.category) {
    case 'Fund Vehicle':
      return 'partnership';
    case 'Blocker':
      return 'corporation';
    case 'Holding Company':
      return 'llc';
    case 'Investment Level':
      return 'corporation';
    case 'Third-Party':
      return 'corporation';
  }
}

function mapClassificationKey(record: EntityRecord): string {
  if (record.taxClassification === 'Partnership') return 'partnership';
  if (record.taxClassification === 'Corporation') return 'corporation';
  if (record.taxClassification === 'Reverse Hybrid') return 'reverse_hybrid';
  return 'corporation';
}

function mapStatus(record: EntityRecord): EntityNode['data']['status'] {
  switch (record.status) {
    case 'Active':
      return 'active';
    case 'Inactive':
      return 'inactive';
    case 'Pending Review':
      return 'active';
  }
}

function mapEntityToNode(record: EntityRecord): EntityNode {
  return {
    id: record.id,
    type: 'entity',
    position: { x: 0, y: 0 },
    data: {
      label: record.name,
      entityType: mapEntityType(record),
      classificationKey: mapClassificationKey(record),
      jurisdiction: record.jurisdiction,
      status: mapStatus(record),
      ein: record.ein,
      dateFormed: record.dateFormed,
      address: record.address,
      notes: record.notes,
      entityRecordId: record.id,
    },
  };
}

function collectRelatedEntityIds(scopedEntities: EntityRecord[], accessibleEntities: EntityRecord[], dealId?: string): string[] {
  const allIds = new Set(accessibleEntities.map((e) => e.id));
  let relationships = ownershipService.getAllRelationships();
  if (dealId != null) {
    relationships = relationships.filter((r) => r.dealId === dealId);
  }

  // Build bidirectional adjacency from ownership relationships
  const neighbors = new Map<string, Set<string>>();
  for (const rel of relationships) {
    if (!allIds.has(rel.ownerEntityId) || !allIds.has(rel.ownedEntityId)) continue;
    if (!neighbors.has(rel.ownerEntityId)) neighbors.set(rel.ownerEntityId, new Set());
    if (!neighbors.has(rel.ownedEntityId)) neighbors.set(rel.ownedEntityId, new Set());
    neighbors.get(rel.ownerEntityId)!.add(rel.ownedEntityId);
    neighbors.get(rel.ownedEntityId)!.add(rel.ownerEntityId);
  }

  const included = new Set<string>();
  const queue = scopedEntities.map((e) => e.id);

  while (queue.length > 0) {
    const entityId = queue.shift() as string;
    if (included.has(entityId)) continue;
    included.add(entityId);

    const related = neighbors.get(entityId);
    if (related) {
      for (const relatedId of related) {
        if (!included.has(relatedId)) queue.push(relatedId);
      }
    }
  }

  return Array.from(included);
}

function buildOwnershipEdges(entityIds: Set<string>, dealId?: string): OwnershipEdge[] {
  let relationships = ownershipService.getAllRelationships();
  if (dealId != null) {
    relationships = relationships.filter((r) => r.dealId === dealId);
  }
  return relationships
    .filter((rel) => entityIds.has(rel.ownerEntityId) && entityIds.has(rel.ownedEntityId))
    .map((rel) => ({
      id: `ownership-${rel.dealId}-${rel.ownerEntityId}-${rel.ownedEntityId}`,
      source: rel.ownerEntityId,
      target: rel.ownedEntityId,
      type: 'ownership',
      data: {
        dealId: rel.dealId,
        ownershipPercent: rel.ownershipDecimal * 100,
        ownershipType: 'direct',
      },
    }));
}

export const structuresApi = {
  loadStructureGraph(selection: ScopeSelection, dealId?: string): StructureGraph {
    const accessibleEntities = entitiesService.getAccessibleEntities();
    const scopedEntities = entitiesService.getScopedEntities(selection);
    const relatedEntityIds = collectRelatedEntityIds(scopedEntities, accessibleEntities, dealId);
    const visibleEntityIds = new Set(relatedEntityIds);
    const graphEntities = accessibleEntities.filter((entity) => visibleEntityIds.has(entity.id));

    return {
      nodes: graphEntities.map(mapEntityToNode),
      ownershipEdges: buildOwnershipEdges(visibleEntityIds, dealId),
      annotationEdges: [],
    };
  },
};
