import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  type NodeMouseHandler,
  type Edge,
} from '@xyflow/react';
import { nodeTypes } from '../nodes/nodeTypes';
import { edgeTypes } from '../edges/edgeTypes';
import { getLayoutedElements } from '../../utils/layout';
import { LayoutControls } from '../Controls/LayoutControls';
import { Legend } from '../Legend/Legend';
import type { EntityNode, OwnershipEdge, AnnotationEdge, EntityData } from '../../types';
import { buildScene } from '../../export';
import styles from './Graph.module.css';

interface GraphProps {
  initialNodes: EntityNode[];
  initialEdges: OwnershipEdge[];
  initialAnnotationEdges: AnnotationEdge[];
  maxVisibleLevel: number;
  maxLevel: number;
  onExpandLevel: () => void;
  onCollapseLevel: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onNodeSelect: (data: EntityData) => void;
}

function GraphInner({
  initialNodes,
  initialEdges,
  initialAnnotationEdges,
  onNodeSelect,
  ...controlProps
}: GraphProps) {
  const { fitView } = useReactFlow();

  const allEdges = useMemo(
    () => [...initialEdges, ...initialAnnotationEdges] as Edge[],
    [initialEdges, initialAnnotationEdges],
  );

  const layoutSignature = useMemo(() => {
    const nodeIds = initialNodes.map((node) => node.id).join('|');
    const edgeIds = allEdges.map((edge) => edge.id).join('|');
    return `${nodeIds}::${edgeIds}`;
  }, [initialNodes, allEdges]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(initialNodes, allEdges),
    [initialNodes, allEdges],
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);
  const lastAppliedLayoutSignature = useRef<string | null>(null);

  useEffect(() => {
    if (lastAppliedLayoutSignature.current === layoutSignature) {
      return;
    }

    lastAppliedLayoutSignature.current = layoutSignature;
    setNodes(layoutedNodes);
    setEdges(layoutedEdges as Edge[]);
    window.requestAnimationFrame(() => fitView({ padding: 0.12 }));
  }, [layoutSignature, layoutedNodes, layoutedEdges, setNodes, setEdges, fitView]);

  const handleNodeClick: NodeMouseHandler = useCallback(
    (_event, node) => {
      onNodeSelect(node.data as EntityData);
    },
    [onNodeSelect],
  );

  const handleExportPptx = useCallback(async () => {
    const title = window.prompt('Enter a title for the export (leave blank for none):', '') ?? '';
    const scene = buildScene(nodes as EntityNode[], initialEdges, initialAnnotationEdges, title);
    const filename = title.trim()
      ? `${title.replace(/\s+/g, '')}.pptx`
      : 'structure-chart.pptx';
    const { generateAndDownloadPptx } = await import('../../export/generatePptx');
    await generateAndDownloadPptx(scene, filename);
  }, [nodes, initialEdges, initialAnnotationEdges]);

  return (
    <div className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        fitView
        minZoom={0.1}
        maxZoom={2}
        defaultEdgeOptions={{ type: 'ownership' }}
      >
        <Controls position="bottom-left" />
        <Background variant={BackgroundVariant.Dots} gap={20} color="#e2e8f0" />
        <LayoutControls
          maxVisibleLevel={controlProps.maxVisibleLevel}
          maxLevel={controlProps.maxLevel}
          onExpandLevel={controlProps.onExpandLevel}
          onCollapseLevel={controlProps.onCollapseLevel}
          onExpandAll={controlProps.onExpandAll}
          onCollapseAll={controlProps.onCollapseAll}
          onFitView={() => fitView({ padding: 0.12 })}
          onExportPptx={handleExportPptx}
        />
        <Legend />
      </ReactFlow>
    </div>
  );
}

export function Graph(props: GraphProps) {
  return (
    <ReactFlowProvider>
      <GraphInner {...props} />
    </ReactFlowProvider>
  );
}
