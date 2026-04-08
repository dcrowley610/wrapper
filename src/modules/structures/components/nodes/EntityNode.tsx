import { Handle, Position, type NodeProps, type Node } from '@xyflow/react';
import type { EntityData } from '../../types';
import { resolveClassification, resolveClassificationKey, resolveNodeColors } from '../../utils/entityStyles';
import { getClassificationDimensions } from '../../data/entityClassifications';
import { EntityShapeRenderer } from './EntityShapeRenderer';
import styles from './EntityNode.module.css';

type EntityNodeProps = NodeProps<Node<EntityData, 'entity'>>;

// Shapes where text needs to be constrained to a narrower inner area
const NARROW_TEXT_SHAPES = new Set(['partnership', 'asset']);

export function EntityNode({ data, selected }: EntityNodeProps) {
  const classification = resolveClassification(data);
  const classificationKey = resolveClassificationKey(data);
  const colors = resolveNodeColors(data);
  const dims = getClassificationDimensions(classificationKey);
  const isTriangle = classificationKey === 'partnership';
  const isNarrow = NARROW_TEXT_SHAPES.has(classificationKey);

  return (
    <div
      className={`${styles.node} ${selected ? styles.selected : ''}`}
      style={{ width: dims.width, height: dims.height }}
    >
      <div className={styles.shapeBackground}>
        <EntityShapeRenderer
          classificationKey={classificationKey}
          width={dims.width}
          height={dims.height}
          borderColor={colors.borderColor}
          fillColor={colors.fillColor}
        />
      </div>
      <Handle type="target" position={Position.Top} className={styles.handle} />
      <div
        className={`${styles.content} ${isTriangle ? styles.contentTriangle : ''}`}
      >
        <div className={`${styles.label} ${isNarrow ? styles.labelNarrow : ''}`}>
          {data.label}
        </div>
        <div className={`${styles.description} ${isNarrow ? styles.descriptionNarrow : ''}`}>
          {classification.description}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className={styles.handle} />
    </div>
  );
}
