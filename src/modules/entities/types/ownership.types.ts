export type OwnershipRelationship = {
  id: string;
  dealId: string;
  ownerEntityId: string;
  ownedEntityId: string;
  ownershipDecimal: number; // 0.0–1.0
  effectiveDate?: string;
  notes?: string;
};

export type ComputedOwnership = {
  dealId: string;
  ownerEntityId: string;
  ownedEntityId: string;
  relationshipKind: 'direct' | 'indirect';
  pathEntityIds: string[];
  computedOwnershipDecimal: number;
};
