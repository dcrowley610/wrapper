import type { RequestProcess } from '../types';
import { formatTaxonomyBreadcrumb, FREQUENCY_LABEL } from '../config';
import { requestsService } from '../services';
import styles from '../RequestsModule.module.css';

type RequestProcessCardProps = {
  requestType: RequestProcess;
  onClick: () => void;
};

/** Backward-compat alias */
export type RequestTypeCardProps = RequestProcessCardProps;

export function RequestProcessCard({ requestType, onClick }: RequestProcessCardProps) {
  const breadcrumb = formatTaxonomyBreadcrumb(requestType.taxonomy);
  const instanceCount = requestsService.getRequestsByTypeId(requestType.id).length;

  return (
    <div className={styles.typeCard} onClick={onClick} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') onClick(); }}>
      <div className={styles.typeCardHeader}>
        <h3 className={styles.typeCardName}>{requestType.name}</h3>
        <span className={`${styles.frequencyBadge} ${styles[`freq_${requestType.defaultFrequency.replace('-', '_')}`] ?? ''}`}>
          {FREQUENCY_LABEL[requestType.defaultFrequency]}
        </span>
      </div>
      <p className={styles.typeCardDescription}>{requestType.description}</p>
      {breadcrumb && (
        <div className={styles.taxonomyBreadcrumb}>{breadcrumb}</div>
      )}
      <div className={styles.typeCardFooter}>
        <span className={styles.typeCardMeta}>{instanceCount} instance{instanceCount !== 1 ? 's' : ''}</span>
        <span className={styles.typeCardMeta}>{requestType.standardizationLevel}</span>
        {requestType.tags.length > 0 && (
          <span className={styles.typeCardMeta}>
            {requestType.tags.slice(0, 3).join(', ')}
          </span>
        )}
      </div>
    </div>
  );
}

/** Backward-compat alias */
export const RequestTypeCard = RequestProcessCard;
