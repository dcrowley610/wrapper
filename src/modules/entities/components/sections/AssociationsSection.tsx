import { useNavigate } from 'react-router-dom';
import type { EntityRecord } from '../../types';
import { fundsService } from '../../../home/services/funds.service';
import { dealsService } from '../../../deals/services/deals.service';
import styles from '../../EntitiesModule.module.css';

type AssociationsSectionProps = {
  entity: EntityRecord;
};

export function AssociationsSection({ entity }: AssociationsSectionProps) {
  const navigate = useNavigate();
  const allFunds = fundsService.getFunds();
  const allDeals = dealsService.getAccessibleDeals();

  const associatedFunds = (entity.associatedFundIds ?? [])
    .map((id) => allFunds.find((f) => f.id === id))
    .filter(Boolean);

  const associatedDeals = (entity.associatedDealIds ?? [])
    .map((id) => allDeals.find((d) => d.id === id))
    .filter(Boolean);

  const reverseLinkedDeals = allDeals.filter(
    (d) => d.linkedEntityIds.includes(entity.id) && !entity.associatedDealIds?.includes(d.id),
  );

  const hasAny = associatedFunds.length > 0 || associatedDeals.length > 0 || reverseLinkedDeals.length > 0;

  if (!hasAny) return null;

  return (
    <div className={styles.associationBlock}>
      <h3 className={styles.placeholderTitle}>Associations</h3>

      {associatedFunds.length > 0 && (
        <div className={styles.associationGroup}>
          <p className={styles.miniMetricLabel}>Associated Funds</p>
          {associatedFunds.map((fund) => (
            <div key={fund!.id} className={styles.associationItem}>
              <button
                className={styles.associationLink}
                onClick={() => navigate('/')}
                type="button"
              >
                {fund!.name}
              </button>
              <span>&middot;</span>
              <span>{fund!.shortNameFund || fund!.id}</span>
            </div>
          ))}
        </div>
      )}

      {associatedDeals.length > 0 && (
        <div className={styles.associationGroup}>
          <p className={styles.miniMetricLabel}>Associated Deals</p>
          {associatedDeals.map((deal) => (
            <div key={deal!.id} className={styles.associationItem}>
              <button
                className={styles.associationLink}
                onClick={() => navigate(`/deals/${deal!.id}`)}
                type="button"
              >
                {deal!.name}
              </button>
              <span>&middot;</span>
              <span>{deal!.investmentType} &middot; {deal!.status}</span>
            </div>
          ))}
        </div>
      )}

      {reverseLinkedDeals.length > 0 && (
        <div className={styles.associationGroup}>
          <p className={styles.miniMetricLabel}>Deals Linking This Entity</p>
          {reverseLinkedDeals.map((deal) => (
            <div key={deal.id} className={styles.associationItem}>
              <button
                className={styles.associationLink}
                onClick={() => navigate(`/deals/${deal.id}`)}
                type="button"
              >
                {deal.name}
              </button>
              <span>&middot;</span>
              <span>{deal.investmentType} &middot; {deal.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
