import { useState, useCallback, useMemo } from 'react';
import type { EntityNode, OwnershipEdge, AnnotationEdge } from '../types';

function computeOwnershipLevels(
  allNodes: EntityNode[],
  allEdges: OwnershipEdge[],
): Record<string, number> {
  const incoming = new Map<string, Set<string>>();
  const outgoing = new Map<string, Set<string>>();

  allNodes.forEach((node) => {
    incoming.set(node.id, new Set());
    outgoing.set(node.id, new Set());
  });

  allEdges.forEach((edge) => {
    if (!incoming.has(edge.target)) incoming.set(edge.target, new Set());
    if (!outgoing.has(edge.source)) outgoing.set(edge.source, new Set());
    incoming.get(edge.target)?.add(edge.source);
    outgoing.get(edge.source)?.add(edge.target);
  });

  const levelByNode: Record<string, number> = {};
  const queue: string[] = [];

  for (const [nodeId, parents] of incoming.entries()) {
    if (parents.size === 0) {
      levelByNode[nodeId] = 0;
      queue.push(nodeId);
    }
  }

  // For nodes that have no ownership incoming and were not in incoming map
  allNodes.forEach((node) => {
    if (levelByNode[node.id] === undefined) {
      levelByNode[node.id] = 0;
      queue.push(node.id);
    }
  });

  while (queue.length > 0) {
    const nodeId = queue.shift() as string;
    const nodeLevel = levelByNode[nodeId];
    const children = outgoing.get(nodeId) ?? new Set();
    children.forEach((childId) => {
      const nextLevel = nodeLevel + 1;
      if (levelByNode[childId] === undefined || nextLevel < levelByNode[childId]) {
        levelByNode[childId] = nextLevel;
        queue.push(childId);
      }
    });
  }

  return levelByNode;
}

export function useExpandCollapse(
  allNodes: EntityNode[],
  allEdges: OwnershipEdge[],
  allAnnotationEdges: AnnotationEdge[],
) {
  const levelByNode = useMemo(() => computeOwnershipLevels(allNodes, allEdges), [allNodes, allEdges]);
  const maxLevel = useMemo(() => {
    if (allNodes.length === 0) return 0;
    return Math.max(...allNodes.map((n) => levelByNode[n.id] ?? 0));
  }, [allNodes, levelByNode]);

  const [maxVisibleLevel, setMaxVisibleLevel] = useState(maxLevel);

  const visibleNodes = useMemo(
    () => allNodes.filter((n) => (levelByNode[n.id] ?? 0) <= maxVisibleLevel),
    [allNodes, levelByNode, maxVisibleLevel],
  );

  const visibleNodeIds = useMemo(
    () => new Set(visibleNodes.map((n) => n.id)),
    [visibleNodes],
  );

  const visibleEdges = useMemo(
    () => allEdges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)),
    [allEdges, visibleNodeIds],
  );

  const visibleAnnotationEdges = useMemo(
    () => allAnnotationEdges.filter((e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)),
    [allAnnotationEdges, visibleNodeIds],
  );

  const expandLevel = useCallback(() => {
    setMaxVisibleLevel((l) => Math.min(l + 1, maxLevel));
  }, [maxLevel]);

  const collapseLevel = useCallback(() => {
    setMaxVisibleLevel((l) => Math.max(l - 1, 0));
  }, []);

  const expandAll = useCallback(() => setMaxVisibleLevel(maxLevel), [maxLevel]);
  const collapseAll = useCallback(() => setMaxVisibleLevel(0), []);

  return {
    visibleNodes,
    visibleEdges,
    visibleAnnotationEdges,
    maxVisibleLevel,
    maxLevel,
    expandLevel,
    collapseLevel,
    expandAll,
    collapseAll,
  };
}
