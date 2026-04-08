import { Link, useLocation } from 'react-router-dom';
import { ScopePicker } from '../ScopePicker/ScopePicker';
import styles from './TopBar.module.css';

const MODULE_LABELS: Record<string, string> = {
  entities: 'Entities',
  investors: 'Investors',
  controversy: 'Controversy',
  requests: 'Requests',
  documents: 'Documents',
  workflow: 'Workflow',
  calendar: 'Calendar',
  rules: 'Rules',
  review: 'Review',
  reports: 'Reports',
  structures: 'Structures',
};

export function TopBar() {
  const location = useLocation();

  const segments = location.pathname.split('/').filter(Boolean);
  const moduleKey = segments[0] ?? '';
  const moduleLabel = MODULE_LABELS[moduleKey];

  return (
    <div className={styles.topBar}>
      <div className={styles.breadcrumbs}>
        <Link to="/" className={styles.breadcrumbLink}>
          Funds
        </Link>
        {moduleLabel && (
          <>
            <span className={styles.breadcrumbSeparator}>/</span>
            {segments.length > 1 ? (
              <Link to={`/${moduleKey}`} className={styles.breadcrumbLink}>
                {moduleLabel}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{moduleLabel}</span>
            )}
          </>
        )}
        {segments.length > 1 && (
          <>
            <span className={styles.breadcrumbSeparator}>/</span>
            <span className={styles.breadcrumbCurrent}>Detail</span>
          </>
        )}
      </div>
      <ScopePicker />
    </div>
  );
}
