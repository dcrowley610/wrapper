import type { Edge, Node } from '@xyflow/react';
import type { EntityData } from '../../types';

export type {
  EntityClassification,
  EntityData,
  EntityType,
} from '../../types';

export type JurisdictionFill = {
  label: string;
  fillColor: string;
};

export type BorderOverlay = {
  label: string;
  borderColor: string;
};

export type ConnectionStyle = {
  label: string;
  description: string;
  lineColor: string;
  lineStyle: 'solid' | 'dashed';
  [key: string]: unknown;
};

export type AnnotationEdgeData = {
  connectionStyleKey: string;
  label?: string;
  [key: string]: unknown;
};

export type OwnershipEdgeData = {
  dealId?: string;
  ownershipPercent: number;
  ownershipType?: 'direct' | 'indirect' | 'beneficial';
  votingPercent?: number;
  [key: string]: unknown;
};

export type EntityNode = Node<EntityData, 'entity'>;
export type OwnershipEdge = Edge<OwnershipEdgeData>;
export type AnnotationEdge = Edge<AnnotationEdgeData>;
