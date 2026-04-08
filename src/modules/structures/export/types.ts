export interface StructureChartScene {
  title: string;
  nodes: SceneNode[];
  connectors: SceneConnector[];
  bounds: { x: number; y: number; width: number; height: number };
}

export interface SceneNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  classificationKey: string;
  fillColor: string;
  borderColor: string;
  label: string;
  description: string;
}

export interface SceneConnector {
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  kind: 'ownership' | 'annotation';
  lineColor: string;
  lineWidth: number;
  lineDash: 'solid' | 'dashed';
  label?: string;
}
