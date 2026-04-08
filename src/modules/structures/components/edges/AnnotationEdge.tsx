import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';
import type { AnnotationEdgeData } from '../../types';
import { getConnectionStyle } from '../../data/annotationStyles';
import styles from './AnnotationEdge.module.css';

type AnnotationEdgeProps = EdgeProps<Edge<AnnotationEdgeData>>;

export function AnnotationEdge(props: AnnotationEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const connection = data?.connectionStyleKey
    ? getConnectionStyle(data.connectionStyleKey)
    : undefined;

  const lineColor = connection?.lineColor ?? '#94a3b8';
  const isDashed = connection?.lineStyle === 'dashed';

  return (
    <>
      <BaseEdge
        id={props.id}
        path={edgePath}
        style={{
          stroke: lineColor,
          strokeWidth: 1.5,
          strokeDasharray: isDashed ? '6 3' : undefined,
        }}
        markerEnd={props.markerEnd}
      />
      {data?.label && (
        <EdgeLabelRenderer>
          <div
            className={`nodrag nopan ${styles.label}`}
            style={{
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            }}
          >
            {data.label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
