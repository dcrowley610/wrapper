import type { EntityRecord } from '../../types';
import { AttributesSection } from './AttributesSection';
import { RulesSection } from './RulesSection';
import styles from '../../EntitiesModule.module.css';

export function TaxAttributesSection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <AttributesSection entity={entity} />
      <div className={styles.sectionDivider} />
      <RulesSection entity={entity} />
    </>
  );
}
