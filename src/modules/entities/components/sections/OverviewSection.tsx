import type { EntityRecord } from '../../types';
import { SummarySection } from './SummarySection';
import { AssociationsSection } from './AssociationsSection';
import { ReviewSection } from './ReviewSection';
import { identityService } from '../../../identity/services';
import styles from '../../EntitiesModule.module.css';

type OverviewSectionProps = {
  entity: EntityRecord;
  onEdit?: () => void;
};

export function OverviewSection({ entity, onEdit }: OverviewSectionProps) {
  const masterId = identityService.getMasterIdForDomainRecord(entity.id);
  const aliases = masterId ? identityService.getAliasesForMaster(masterId) : [];

  return (
    <>
      {onEdit && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button className={styles.submitBtn} onClick={onEdit} type="button">Edit</button>
        </div>
      )}
      <SummarySection entity={entity} />
      {aliases.length > 0 && (
        <div className={styles.placeholderBlock} style={{ marginTop: 14 }}>
          <h3 className={styles.placeholderTitle}>Known Aliases</h3>
          <ul className={styles.sideList}>
            {aliases.map((alias) => (
              <li key={alias.id}>
                {alias.aliasName}
                <span style={{ color: '#8a9baa', marginLeft: 8 }}>— {alias.source}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <div className={styles.sectionDivider} />
      <AssociationsSection entity={entity} />
      <div className={styles.sectionDivider} />
      <ReviewSection entity={entity} />
    </>
  );
}
