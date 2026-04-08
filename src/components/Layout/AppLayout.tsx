import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { PlatformProvider } from '../../platform/context';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import styles from './AppLayout.module.css';

export function AppLayout() {
  return (
    <PlatformProvider>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.main}>
          <TopBar />
          <div className={styles.content}>
            <Suspense fallback={<div className={styles.loader}>Loading module...</div>}>
              <Outlet />
            </Suspense>
          </div>
        </div>
      </div>
    </PlatformProvider>
  );
}
