import {
  BaseEdge,
  EdgeLabelRenderer,
  getSmoothStepPath,
  type EdgeProps,
  type Edge,
} from '@xyflow/react';
import type { OwnershipEdgeData } from '../../types';
import styles from './OwnershipEdge.module.css';

type OwnershipEdgeProps = EdgeProps<Edge<OwnershipEdgeData>>;

export function OwnershipEdge(props: OwnershipEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data } = props;

  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  const percent = data?.ownershipPercent ?? 0;
  const label = `${percent}%`;

  return (
    <>
      <BaseEdge
        id={props.id}
        path={edgePath}
        style={{
          stroke: '#334155',
          strokeWidth: percent >= 50 ? 2.5 : 1.5,
        }}
        markerEnd={props.markerEnd}
      />
      <EdgeLabelRenderer>
        <div
          className={`nodrag nopan ${styles.label}`}
          style={{
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
        >
          {label}
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
