import { Link, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

type NavEntry = {
  key: string;
  label: string;
  path: string;
};

const NAV_ITEMS: NavEntry[] = [
  { key: 'home', label: 'Funds', path: '/' },
  { key: 'deals', label: 'Deals', path: '/deals' },
  { key: 'entities', label: 'Entities', path: '/entities' },
  { key: 'investors', label: 'Investors', path: '/investors' },
  { key: 'controversy', label: 'Controversy', path: '/controversy' },
  { key: 'requests', label: 'Requests', path: '/requests' },
  { key: 'documents', label: 'Documents', path: '/documents' },
  { key: 'calendar', label: 'Calendar', path: '/calendar' },
  { key: 'rules', label: 'Rules', path: '/rules' },
  { key: 'review', label: 'Review', path: '/review' },
  { key: 'reports', label: 'Reports', path: '/reports' },
  { key: 'admin', label: 'Admin', path: '/admin' },
];

export function Sidebar() {
  const location = useLocation();

  function isActive(path: string) {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>Tax Fund Platform</div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.key}
            to={item.path}
            className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
          >
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

    </aside>
  );
}
