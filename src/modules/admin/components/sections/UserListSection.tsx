import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminService } from '../../services';
import { UserCard } from '../UserCard';
import styles from '../../AdminModule.module.css';

export function UserListSection() {
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');

  const users = useMemo(() => {
    const all = adminService.getUsers();
    if (searchValue.trim().length === 0) return all;
    const q = searchValue.toLowerCase();
    return all.filter(
      (u) =>
        `${u.name} ${u.email} ${u.title}`.toLowerCase().includes(q)
    );
  }, [searchValue]);

  return (
    <>
      <h2 className={styles.sectionTitle}>Users</h2>
      <p className={styles.sectionCopy}>
        Platform users and their group memberships. Click a user to view details.
      </p>

      <div className={styles.toolbar}>
        <div className={styles.searchWrap}>
          <label className={styles.fieldLabel} htmlFor="user-search">
            Search users
          </label>
          <input
            id="user-search"
            className={styles.input}
            placeholder="Search by name, email, or title"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
      </div>

      {users.length > 0 ? (
        <table className={styles.dataTable}>
          <thead>
            <tr>
              <th>User</th>
              <th>Title</th>
              <th>Status</th>
              <th>Groups</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <UserCard key={user.id} user={user} onOpen={(id) => navigate(`/admin/users/${id}`)} />
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.emptyState}>No users match this search.</div>
      )}
    </>
  );
}
