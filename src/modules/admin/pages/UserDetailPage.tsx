import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminService } from '../services';
import type { UserStatus } from '../types';
import styles from '../AdminModule.module.css';

export function UserDetailPage() {
  const { userId } = useParams();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [version, setVersion] = useState(0);
  const [draftName, setDraftName] = useState('');
  const [draftEmail, setDraftEmail] = useState('');
  const [draftTitle, setDraftTitle] = useState('');
  const [draftStatus, setDraftStatus] = useState<UserStatus>('Active');
  const [draftGroupIds, setDraftGroupIds] = useState<string[]>([]);

  // Re-read on version change to pick up mutations
  void version;
  const user = userId ? adminService.getUserById(userId) : undefined;

  if (!user) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>User not found.</div>
      </div>
    );
  }

  const groups = adminService.getGroupsForUser(user.id);
  const allGroups = adminService.getGroups();
  const fundGroups = groups.filter((g) => g.type === 'fund-access');
  const roleGroups = groups.filter((g) => g.type === 'role');

  function startEditing() {
    setDraftName(user!.name);
    setDraftEmail(user!.email);
    setDraftTitle(user!.title);
    setDraftStatus(user!.status);
    setDraftGroupIds([...user!.groupIds]);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function saveChanges() {
    adminService.updateUser(user!.id, {
      name: draftName,
      email: draftEmail,
      title: draftTitle,
      status: draftStatus,
    });
    adminService.setUserGroups(user!.id, draftGroupIds);
    setEditing(false);
    setVersion((v) => v + 1);
  }

  function toggleGroup(groupId: string) {
    setDraftGroupIds((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.detailHero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className={styles.backButton} onClick={() => navigate('/admin/users')} type="button">
            Back to users
          </button>
          {!editing ? (
            <button className={styles.editButton} onClick={startEditing} type="button">
              Edit
            </button>
          ) : (
            <div className={styles.editActions}>
              <button className={styles.cancelButton} onClick={cancelEditing} type="button">
                Cancel
              </button>
              <button className={styles.saveButton} onClick={saveChanges} type="button">
                Save
              </button>
            </div>
          )}
        </div>
        <div className={styles.detailHeroCard}>
          <div className={styles.detailHeader}>
            <div>
              <div className={styles.eyebrow}>User</div>
              {editing ? (
                <input
                  className={styles.editInput}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  style={{ marginTop: 10, fontSize: '1.4rem', fontWeight: 700 }}
                />
              ) : (
                <h1 className={styles.detailTitle}>{user.name}</h1>
              )}
              {editing ? (
                <input
                  className={styles.editInput}
                  value={draftTitle}
                  onChange={(e) => setDraftTitle(e.target.value)}
                  style={{ marginTop: 6 }}
                  placeholder="Title"
                />
              ) : (
                <p className={styles.detailSubtitle}>{user.title}</p>
              )}
              {!editing && (
                <div className={styles.headerPills}>
                  {roleGroups.map((g) => (
                    <span key={g.id} className={`${styles.pill} ${styles.pillRole}`}>{g.roleLabel}</span>
                  ))}
                </div>
              )}
            </div>
            {editing ? (
              <select
                className={styles.editSelect}
                value={draftStatus}
                onChange={(e) => setDraftStatus(e.target.value as UserStatus)}
                style={{ width: 'auto' }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            ) : (
              <span className={`${styles.statusPill} ${user.status === 'Inactive' ? styles.statusInactive : ''}`}>
                {user.status}
              </span>
            )}
          </div>
        </div>
      </section>

      <section className={styles.detailWorkspace}>
        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            <h2 className={styles.sectionTitle}>User details</h2>
            {editing ? (
              <div style={{ marginTop: 14 }}>
                <div className={styles.editFieldGroup}>
                  <span className={styles.editFieldLabel}>Email</span>
                  <input
                    className={styles.editInput}
                    value={draftEmail}
                    onChange={(e) => setDraftEmail(e.target.value)}
                  />
                </div>
                <div className={styles.editFieldGroup}>
                  <span className={styles.editFieldLabel}>Title</span>
                  <input
                    className={styles.editInput}
                    value={draftTitle}
                    onChange={(e) => setDraftTitle(e.target.value)}
                  />
                </div>
                <div className={styles.editFieldGroup}>
                  <span className={styles.editFieldLabel}>Status</span>
                  <select
                    className={styles.editSelect}
                    value={draftStatus}
                    onChange={(e) => setDraftStatus(e.target.value as UserStatus)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
            ) : (
              <dl className={styles.definitionList}>
                <dt>Email</dt>
                <dd>{user.email}</dd>
                <dt>Title</dt>
                <dd>{user.title}</dd>
                <dt>Status</dt>
                <dd>{user.status}</dd>
              </dl>
            )}

            <h2 className={styles.sectionTitle} style={{ marginTop: 28 }}>Group memberships</h2>

            {editing ? (
              <>
                <p className={styles.sectionCopy}>
                  Check or uncheck groups to update this user's memberships.
                </p>
                <div className={styles.checkboxList}>
                  {allGroups.map((g) => (
                    <div key={g.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        id={`group-${g.id}`}
                        checked={draftGroupIds.includes(g.id)}
                        onChange={() => toggleGroup(g.id)}
                      />
                      <label htmlFor={`group-${g.id}`}>
                        <div className={styles.checkboxItemName}>{g.name}</div>
                        <div className={styles.checkboxItemDesc}>
                          {g.type === 'role' ? `Role: ${g.roleLabel}` : `Fund: ${g.fundIds.join(', ')}`}
                        </div>
                      </label>
                      <span className={`${styles.groupPill} ${g.type === 'role' ? styles.pillRole : styles.pillFund}`}>
                        {g.type === 'role' ? 'Role' : 'Fund'}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className={styles.sectionCopy}>
                  This user belongs to {groups.length} group(s). Click a group to view its details.
                </p>
                {groups.length > 0 ? (
                  <div className={styles.memberList}>
                    {groups.map((g) => (
                      <div
                        key={g.id}
                        className={styles.memberCard}
                        onClick={() => navigate(`/admin/groups/${g.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/admin/groups/${g.id}`)}
                      >
                        <div className={styles.memberInfo}>
                          <h4>{g.name}</h4>
                          <p>{g.description}</p>
                        </div>
                        <span className={`${styles.groupPill} ${g.type === 'role' ? styles.pillRole : styles.pillFund}`}>
                          {g.type === 'role' ? 'Role' : 'Fund Access'}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>This user is not in any groups.</div>
                )}
              </>
            )}
          </div>

          <aside className={styles.sideStack}>
            <div className={styles.sidePanel}>
              <h3 className={styles.sidePanelTitle}>Fund access</h3>
              <p className={styles.sectionCopy}>
                Funds this user can access through their fund-access groups.
              </p>
              {fundGroups.length > 0 ? (
                <div className={styles.fundAccessList}>
                  {fundGroups.map((g) => (
                    <div key={g.id} className={styles.fundAccessItem}>
                      <h4>{g.name.replace(' Access', '')}</h4>
                      <p>via {g.name}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyState}>No fund access groups assigned.</div>
              )}
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}
