import { useNavigate, useLocation } from 'react-router-dom';
import { SectionNav } from '../../../components/ModulePage/SectionNav';
import { ADMIN_SECTIONS } from '../config';
import type { AdminSectionKey } from '../config';
import { UserListSection } from '../components/sections/UserListSection';
import { GroupListSection } from '../components/sections/GroupListSection';
import styles from '../AdminModule.module.css';

const VALID_SECTIONS: AdminSectionKey[] = ['users', 'groups'];

function renderSection(section: AdminSectionKey) {
  switch (section) {
    case 'users':
      return <UserListSection />;
    case 'groups':
      return <GroupListSection />;
  }
}

export function AdminPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const segment = location.pathname.split('/').filter(Boolean)[1] as AdminSectionKey | undefined;
  const activeSection = segment && VALID_SECTIONS.includes(segment) ? segment : 'users';

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.eyebrow}>Admin</div>
          <h1 className={styles.title}>Users, groups, and platform access management.</h1>
        </div>
      </section>

      <section className={styles.workspace}>
        <SectionNav
          sections={ADMIN_SECTIONS}
          activeSection={activeSection}
          onSelect={(key) => navigate(`/admin/${key}`)}
          accentColor="#475569"
        />

        {renderSection(activeSection)}
      </section>
    </div>
  );
}
