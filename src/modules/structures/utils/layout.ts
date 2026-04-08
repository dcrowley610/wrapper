import dagre from '@dagrejs/dagre';
import { Position } from '@xyflow/react';
import type { EntityNode, OwnershipEdge } from '../types';
import type { Edge } from '@xyflow/react';
import { resolveClassificationKey } from './entityStyles';
import { getClassificationDimensions } from '../data/entityClassifications';

function getNodeDimensions(node: EntityNode): { width: number; height: number } {
  const key = resolveClassificationKey(node.data);
  return getClassificationDimensions(key);
}

export function getLayoutedElements(
  nodes: EntityNode[],
  edges: (OwnershipEdge | Edge)[],
  direction: 'TB' | 'LR' = 'TB',
): { nodes: EntityNode[]; edges: (OwnershipEdge | Edge)[] } {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: direction,
    nodesep: 80,
    ranksep: 120,
    marginx: 40,
    marginy: 40,
  });

  nodes.forEach((node) => {
    const dim = getNodeDimensions(node);
    g.setNode(node.id, { width: dim.width, height: dim.height });
  });

  edges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });

  dagre.layout(g);

  const isHorizontal = direction === 'LR';

  const layoutedNodes: EntityNode[] = nodes.map((node) => {
    const pos = g.node(node.id);
    const dim = getNodeDimensions(node);
    return {
      ...node,
      targetPosition: isHorizontal ? Position.Left : Position.Top,
      sourcePosition: isHorizontal ? Position.Right : Position.Bottom,
      position: {
        x: pos.x - dim.width / 2,
        y: pos.y - dim.height / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
}
