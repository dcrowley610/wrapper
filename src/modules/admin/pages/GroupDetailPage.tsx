import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { adminService } from '../services';
import styles from '../AdminModule.module.css';

export function GroupDetailPage() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [editing, setEditing] = useState(false);
  const [version, setVersion] = useState(0);
  const [draftName, setDraftName] = useState('');
  const [draftDesc, setDraftDesc] = useState('');
  const [draftMemberIds, setDraftMemberIds] = useState<string[]>([]);

  // Re-read on version change to pick up mutations
  void version;
  const group = groupId ? adminService.getGroupById(groupId) : undefined;

  if (!group) {
    return (
      <div className={styles.page}>
        <div className={styles.emptyState}>Group not found.</div>
      </div>
    );
  }

  const members = adminService.getUsersByGroup(group.id);
  const allUsers = adminService.getUsers();

  function startEditing() {
    setDraftName(group!.name);
    setDraftDesc(group!.description);
    setDraftMemberIds([...group!.memberIds]);
    setEditing(true);
  }

  function cancelEditing() {
    setEditing(false);
  }

  function saveChanges() {
    adminService.updateGroup(group!.id, {
      name: draftName,
      description: draftDesc,
    });
    adminService.setGroupMembers(group!.id, draftMemberIds);
    setEditing(false);
    setVersion((v) => v + 1);
  }

  function toggleMember(userId: string) {
    setDraftMemberIds((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  }

  return (
    <div className={styles.page}>
      <section className={styles.detailHero}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className={styles.backButton} onClick={() => navigate('/admin/groups')} type="button">
            Back to groups
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
              <div className={styles.eyebrow}>Group</div>
              {editing ? (
                <input
                  className={styles.editInput}
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  style={{ marginTop: 10, fontSize: '1.4rem', fontWeight: 700 }}
                />
              ) : (
                <h1 className={styles.detailTitle}>{group.name}</h1>
              )}
              {editing ? (
                <textarea
                  className={styles.editTextarea}
                  value={draftDesc}
                  onChange={(e) => setDraftDesc(e.target.value)}
                  style={{ marginTop: 6 }}
                />
              ) : (
                <p className={styles.detailSubtitle}>{group.description}</p>
              )}
              {!editing && (
                <div className={styles.headerPills}>
                  <span className={`${styles.pill} ${group.type === 'role' ? styles.pillRole : styles.pillFund}`}>
                    {group.type === 'role' ? 'Role' : 'Fund Access'}
                  </span>
                  {group.roleLabel && (
                    <span className={`${styles.pill} ${styles.pillRole}`}>{group.roleLabel}</span>
                  )}
                </div>
              )}
            </div>
            <span className={styles.memberCount}>
              {editing ? draftMemberIds.length : members.length} members
            </span>
          </div>
        </div>
      </section>

      <section className={styles.detailWorkspace}>
        <div className={styles.detailGrid}>
          <div className={styles.detailPanel}>
            <h2 className={styles.sectionTitle}>Members</h2>

            {editing ? (
              <>
                <p className={styles.sectionCopy}>
                  Check or uncheck users to update this group's membership.
                </p>
                <div className={styles.checkboxList}>
                  {allUsers.map((u) => (
                    <div key={u.id} className={styles.checkboxItem}>
                      <input
                        type="checkbox"
                        id={`member-${u.id}`}
                        checked={draftMemberIds.includes(u.id)}
                        onChange={() => toggleMember(u.id)}
                      />
                      <label htmlFor={`member-${u.id}`}>
                        <div className={styles.checkboxItemName}>{u.name}</div>
                        <div className={styles.checkboxItemDesc}>
                          {u.title} &middot; {u.email}
                        </div>
                      </label>
                      <span className={`${styles.statusPill} ${u.status === 'Inactive' ? styles.statusInactive : ''}`}>
                        {u.status}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <p className={styles.sectionCopy}>
                  Users in this group. Click a user to view their profile.
                </p>
                {members.length > 0 ? (
                  <div className={styles.memberList}>
                    {members.map((u) => (
                      <div
                        key={u.id}
                        className={styles.memberCard}
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => e.key === 'Enter' && navigate(`/admin/users/${u.id}`)}
                      >
                        <div className={styles.memberInfo}>
                          <h4>{u.name}</h4>
                          <p>{u.title} &middot; {u.email}</p>
                        </div>
                        <span className={`${styles.statusPill} ${u.status === 'Inactive' ? styles.statusInactive : ''}`}>
                          {u.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>No members in this group yet.</div>
                )}
              </>
            )}
          </div>

          {group.type === 'fund-access' && group.fundIds.length > 0 && (
            <aside className={styles.sideStack}>
              <div className={styles.sidePanel}>
                <h3 className={styles.sidePanelTitle}>Fund access granted</h3>
                <p className={styles.sectionCopy}>
                  Members of this group can access the following funds.
                </p>
                <div className={styles.fundAccessList}>
                  {group.fundIds.map((fundId) => (
                    <div key={fundId} className={styles.fundAccessItem}>
                      <h4>{fundId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}</h4>
                      <p>Scope ID: {fundId}</p>
                    </div>
                  ))}
                </div>
              </div>
            </aside>
          )}
        </div>
      </section>
    </div>
  );
}
