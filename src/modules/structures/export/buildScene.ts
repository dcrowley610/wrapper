import type { EntityNode, OwnershipEdge, AnnotationEdge } from '../types';
import type { StructureChartScene, SceneNode, SceneConnector } from './types';
import { resolveClassificationKey, resolveNodeColors, resolveClassification } from '../utils/entityStyles';
import { getClassificationDimensions } from '../data/entityClassifications';
import { getConnectionStyle } from '../data/annotationStyles';

const BOUNDS_PADDING = 20;

export function buildScene(
  nodes: EntityNode[],
  ownershipEdges: OwnershipEdge[],
  annotationEdges: AnnotationEdge[],
  title: string,
): StructureChartScene {
  const nodeMap = new Map<string, SceneNode>();

  const sceneNodes: SceneNode[] = nodes.map((node) => {
    const classificationKey = resolveClassificationKey(node.data);
    const dims = getClassificationDimensions(classificationKey);
    const colors = resolveNodeColors(node.data);
    const classification = resolveClassification(node.data);

    const sceneNode: SceneNode = {
      id: node.id,
      x: node.position.x,
      y: node.position.y,
      width: dims.width,
      height: dims.height,
      classificationKey,
      fillColor: colors.fillColor,
      borderColor: colors.borderColor,
      label: node.data.label,
      description: classification.description,
    };

    nodeMap.set(node.id, sceneNode);
    return sceneNode;
  });

  validateSceneNodes(sceneNodes);

  const connectors: SceneConnector[] = [];

  for (const edge of ownershipEdges) {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (!source || !target) continue;

    const percent = edge.data?.ownershipPercent ?? 0;

    connectors.push({
      id: edge.id,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      sourceX: source.x + source.width / 2,
      sourceY: source.y + source.height,
      targetX: target.x + target.width / 2,
      targetY: target.y,
      kind: 'ownership',
      lineColor: '#334155',
      lineWidth: percent >= 50 ? 2.5 : 1.5,
      lineDash: 'solid',
      label: `${percent}%`,
    });
  }

  for (const edge of annotationEdges) {
    const source = nodeMap.get(edge.source);
    const target = nodeMap.get(edge.target);
    if (!source || !target) continue;

    const style = edge.data?.connectionStyleKey
      ? getConnectionStyle(edge.data.connectionStyleKey)
      : undefined;

    connectors.push({
      id: edge.id,
      sourceNodeId: edge.source,
      targetNodeId: edge.target,
      sourceX: source.x + source.width / 2,
      sourceY: source.y + source.height,
      targetX: target.x + target.width / 2,
      targetY: target.y,
      kind: 'annotation',
      lineColor: style?.lineColor ?? '#94a3b8',
      lineWidth: 1.5,
      lineDash: style?.lineStyle === 'dashed' ? 'dashed' : 'solid',
      label: edge.data?.label,
    });
  }

  const bounds = computeBounds(sceneNodes);

  return { title, nodes: sceneNodes, connectors, bounds };
}

// ── Node position guardrails ──

const MAX_COORD = 20000; // generous limit in chart-unit pixels

function validateSceneNodes(nodes: SceneNode[]): void {
  if (nodes.length === 0) return;

  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  let violations = 0;

  for (const node of nodes) {
    const issues: string[] = [];

    // Check finite
    if (!Number.isFinite(node.x)) { issues.push(`x=${node.x}→0`); node.x = 0; }
    if (!Number.isFinite(node.y)) { issues.push(`y=${node.y}→0`); node.y = 0; }
    if (!Number.isFinite(node.width) || node.width <= 0) { issues.push(`width=${node.width}→200`); node.width = 200; }
    if (!Number.isFinite(node.height) || node.height <= 0) { issues.push(`height=${node.height}→80`); node.height = 80; }

    // Clamp to range
    if (Math.abs(node.x) > MAX_COORD) { issues.push(`x=${node.x}→clamped`); node.x = Math.sign(node.x) * MAX_COORD; }
    if (Math.abs(node.y) > MAX_COORD) { issues.push(`y=${node.y}→clamped`); node.y = Math.sign(node.y) * MAX_COORD; }
    if (node.width > MAX_COORD) { issues.push(`width=${node.width}→clamped`); node.width = MAX_COORD; }
    if (node.height > MAX_COORD) { issues.push(`height=${node.height}→clamped`); node.height = MAX_COORD; }

    if (issues.length > 0) {
      violations++;
      console.warn(
        `[PPTX scene] Node position violation: id="${node.id}" label="${node.label}" | ` +
        `pos(${node.x},${node.y}) size(${node.width}x${node.height}) | fixes: ${issues.join(', ')}`,
      );
    }

    // Track min/max
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
  }

  console.info(
    `[PPTX scene] ${nodes.length} nodes | ` +
    `x: [${Math.round(minX)}, ${Math.round(maxX)}] | ` +
    `y: [${Math.round(minY)}, ${Math.round(maxY)}] | ` +
    `violations: ${violations}`,
  );
}

function computeBounds(nodes: SceneNode[]) {
  if (nodes.length === 0) {
    return { x: 0, y: 0, width: 400, height: 300 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  for (const n of nodes) {
    minX = Math.min(minX, n.x);
    minY = Math.min(minY, n.y);
    maxX = Math.max(maxX, n.x + n.width);
    maxY = Math.max(maxY, n.y + n.height);
  }

  return {
    x: minX - BOUNDS_PADDING,
    y: minY - BOUNDS_PADDING,
    width: maxX - minX + 2 * BOUNDS_PADDING,
    height: maxY - minY + 2 * BOUNDS_PADDING,
  };
}
