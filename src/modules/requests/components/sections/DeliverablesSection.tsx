import { Fragment, lazy, Suspense, useRef, useState } from 'react';
import type { DeliverableInstance, DeliverableStatus, RequestComment, WorkflowRequest } from '../../types';
import type { DetailAction } from '../../pages/RequestDetailPage';
import { requestsService, deliverableTemplatesService } from '../../services';
import styles from '../../RequestsModule.module.css';

const DeliverableImport = lazy(() =>
  import('../DeliverableImport').then((m) => ({ default: m.DeliverableImport })),
);

const STATUS_OPTIONS: DeliverableStatus[] = ['not-started', 'pending', 'received', 'reviewed'];

function statusBadgeClass(status: DeliverableStatus): string {
  switch (status) {
    case 'not-started': return styles.docStatusPending;
    case 'pending': return styles.docStatusPending;
    case 'received': return styles.docStatusReceived;
    case 'reviewed': return styles.docStatusReviewed;
    default: return '';
  }
}

let deliverableCounter = 0;

/** Flatten deliverables into visual tree order (parent followed by children, recursively) */
function flattenTree(deliverables: DeliverableInstance[]): DeliverableInstance[] {
  const childrenOf = new Map<string | null, DeliverableInstance[]>();
  for (const d of deliverables) {
    const key = d.parentId ?? null;
    if (!childrenOf.has(key)) childrenOf.set(key, []);
    childrenOf.get(key)!.push(d);
  }
  for (const arr of childrenOf.values()) arr.sort((a, b) => a.order - b.order);

  const result: DeliverableInstance[] = [];
  function walk(parentId: string | null) {
    for (const child of childrenOf.get(parentId) ?? []) {
      result.push(child);
      walk(child.id);
    }
  }
  walk(null);
  return result;
}

/** Compute depth of a deliverable by walking parentId chains */
function computeDepthMap(deliverables: DeliverableInstance[]): Map<string, number> {
  const map = new Map<string, number>();
  const byId = new Map<string, DeliverableInstance>();
  for (const d of deliverables) byId.set(d.id, d);

  function getDepth(d: DeliverableInstance): number {
    if (map.has(d.id)) return map.get(d.id)!;
    if (!d.parentId) { map.set(d.id, 0); return 0; }
    const parent = byId.get(d.parentId);
    if (!parent) { map.set(d.id, 0); return 0; }
    const depth = getDepth(parent) + 1;
    map.set(d.id, depth);
    return depth;
  }

  for (const d of deliverables) getDepth(d);
  return map;
}

type Props = {
  request: WorkflowRequest;
  dispatch: React.Dispatch<DetailAction>;
};

export function DeliverablesSection({ request, dispatch }: Props) {
  const [showImport, setShowImport] = useState(false);
  const [editingIds, setEditingIds] = useState<Set<string>>(new Set());
  const [commentOpenIds, setCommentOpenIds] = useState<Set<string>>(new Set());
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentTexts, setCommentTexts] = useState<Record<string, string>>({});

  const depthMap = computeDepthMap(request.deliverables);

  function startEditing(id: string) {
    setEditingIds((prev) => new Set(prev).add(id));
  }

  function stopEditing(id: string) {
    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function editAll() {
    setEditingIds(new Set(request.deliverables.map((d) => d.id)));
  }

  function saveAll() {
    setEditingIds(new Set());
  }

  function handleImport(deliverables: DeliverableInstance[]) {
    for (const deliverable of deliverables) {
      dispatch({ type: 'ADD_DELIVERABLE', deliverable });
    }
    setEditingIds((prev) => {
      const next = new Set(prev);
      for (const d of deliverables) next.add(d.id);
      return next;
    });
    setShowImport(false);
  }

  const notStarted = request.deliverables.filter((d) => d.status === 'not-started').length;
  const pending = request.deliverables.filter((d) => d.status === 'pending').length;
  const received = request.deliverables.filter((d) => d.status === 'received').length;
  const reviewed = request.deliverables.filter((d) => d.status === 'reviewed').length;

  function handleAdd() {
    deliverableCounter += 1;
    const id = `dlv-new-${Date.now()}-${deliverableCounter}`;
    const deliverable: DeliverableInstance = {
      id,
      templateId: null,
      parentId: null,
      kind: 'line-item',
      title: '',
      order: request.deliverables.length + 1,
      dealName: '',
      entityName: '',
      status: 'not-started',
      dueDate: null,
      notes: '',
      fileLink: '',
      comments: [],
    };
    dispatch({ type: 'ADD_DELIVERABLE', deliverable });
    startEditing(id);
  }

  function handleAddChild(parentId: string) {
    deliverableCounter += 1;
    const id = `dlv-new-${Date.now()}-${deliverableCounter}`;
    const siblingCount = request.deliverables.filter((d) => d.parentId === parentId).length;
    const deliverable: DeliverableInstance = {
      id,
      templateId: null,
      parentId,
      kind: 'line-item',
      title: '',
      order: siblingCount + 1,
      dealName: '',
      entityName: '',
      status: 'not-started',
      dueDate: null,
      notes: '',
      fileLink: '',
      comments: [],
    };
    dispatch({ type: 'ADD_DELIVERABLE', deliverable });
    startEditing(id);
  }

  function handlePopulateFromTemplate() {
    if (!request.requestTypeId) return;
    const instances = deliverableTemplatesService.instantiateFromTemplates(request.requestTypeId);
    if (instances.length === 0) return;
    for (const inst of instances) {
      dispatch({ type: 'ADD_DELIVERABLE', deliverable: inst });
    }
    setEditingIds((prev) => {
      const next = new Set(prev);
      for (const d of instances) next.add(d.id);
      return next;
    });
  }

  function handleUpdate(id: string, field: keyof DeliverableInstance, value: string) {
    dispatch({ type: 'UPDATE_DELIVERABLE', id, field, value });
  }

  function handleRemove(id: string) {
    dispatch({ type: 'REMOVE_DELIVERABLE', id });
    setEditingIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function toggleComments(id: string) {
    setCommentOpenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function handleAddComment(deliverableId: string) {
    const text = (commentTexts[deliverableId] ?? '').trim();
    if (!commentAuthor.trim() || !text) return;
    dispatch({
      type: 'ADD_DELIVERABLE_COMMENT',
      deliverableId,
      comment: {
        id: crypto.randomUUID(),
        author: commentAuthor.trim(),
        text,
        timestamp: new Date().toISOString().slice(0, 16).replace('T', ' '),
      },
    });
    setCommentTexts((prev) => ({ ...prev, [deliverableId]: '' }));
  }

  function handleRollover() {
    if (!request.priorRequestInstanceId) return;
    const prior = requestsService.getRequestById(request.priorRequestInstanceId);
    if (!prior || prior.deliverables.length === 0) return;
    const rolled: DeliverableInstance[] = prior.deliverables.map((d) => {
      deliverableCounter += 1;
      return {
        ...d,
        id: `dlv-roll-${Date.now()}-${deliverableCounter}`,
        status: 'not-started' as DeliverableStatus,
        fileLink: '',
      };
    });
    dispatch({ type: 'ROLLOVER_DELIVERABLES', deliverables: rolled });
    setEditingIds((prev) => {
      const next = new Set(prev);
      for (const d of rolled) next.add(d.id);
      return next;
    });
  }

  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  function handleAttachFile(id: string, file: File) {
    // Revoke existing blob URL if present
    const existing = request.deliverables.find((d) => d.id === id);
    if (existing?.fileLink?.startsWith('blob:')) {
      URL.revokeObjectURL(existing.fileLink);
    }
    const url = URL.createObjectURL(file);
    dispatch({ type: 'ATTACH_FILE', id, fileLink: url, fileName: file.name });
  }

  function handleDetachFile(id: string, currentFileLink: string) {
    if (currentFileLink.startsWith('blob:')) {
      URL.revokeObjectURL(currentFileLink);
    }
    dispatch({ type: 'DETACH_FILE', id });
  }

  const hasEditableRows = request.deliverables.some((d) => editingIds.has(d.id));
  const hasReadonlyRows = request.deliverables.some((d) => !editingIds.has(d.id));

  const hasTemplates = request.requestTypeId
    ? deliverableTemplatesService.getByProcessId(request.requestTypeId).length > 0
    : false;

  return (
    <>
      <h2 className={styles.sectionTitle}>Deliverables</h2>
      <p className={styles.sectionCopy}>
        Track individual deliverable items for this request. Each row represents a specific output tied to a deal and entity.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, alignItems: 'center' }}>
        {notStarted > 0 && <span className={`${styles.docStatusBadge} ${styles.docStatusPending}`}>{notStarted} not started</span>}
        {pending > 0 && <span className={`${styles.docStatusBadge} ${styles.docStatusPending}`}>{pending} pending</span>}
        {received > 0 && <span className={`${styles.docStatusBadge} ${styles.docStatusReceived}`}>{received} received</span>}
        {reviewed > 0 && <span className={`${styles.docStatusBadge} ${styles.docStatusReviewed}`}>{reviewed} reviewed</span>}
        {request.deliverables.length > 0 && (
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
            {hasReadonlyRows && (
              <button className={styles.intakeToggleBtn} onClick={editAll} type="button">
                Edit All
              </button>
            )}
            {hasEditableRows && (
              <button className={styles.intakeToggleBtn} onClick={saveAll} type="button">
                Save All
              </button>
            )}
          </div>
        )}
      </div>
      {request.deliverables.length > 0 ? (
        <table className={styles.docTable}>
          <thead>
            <tr>
              <th>Title / Deal</th>
              <th>Entity</th>
              <th>Status</th>
              <th>Due</th>
              <th>Notes</th>
              <th>File</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {flattenTree(request.deliverables).map((dlv) => {
              const isEditing = editingIds.has(dlv.id);
              const depth = depthMap.get(dlv.id) ?? 0;
              const isSection = dlv.kind === 'section';
              const commentsOpen = commentOpenIds.has(dlv.id);
              const commentCount = (dlv.comments ?? []).length;

              const commentBtn = (
                <button
                  className={styles.actionBtn}
                  onClick={() => toggleComments(dlv.id)}
                  type="button"
                  title={commentsOpen ? 'Hide comments' : 'Comments'}
                  style={{ position: 'relative', ...(commentsOpen ? { color: '#1678a2' } : {}) }}
                >
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 3h14v8H5l-4 3V3z" />
                  </svg>
                  {commentCount > 0 && (
                    <span style={{ fontSize: '0.65rem', position: 'absolute', top: -2, right: -4, background: '#1678a2', color: '#fff', borderRadius: '50%', width: 14, height: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>
                      {commentCount}
                    </span>
                  )}
                </button>
              );

              const commentRow = commentsOpen ? (
                <tr key={`${dlv.id}-comments`}>
                  <td colSpan={7} style={{ background: '#f8fafb', padding: '10px 16px' }}>
                    <div style={{ paddingLeft: depth * 24 }}>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: 6, color: '#3a4f5c' }}>
                        Comments
                      </div>
                      {(dlv.comments ?? []).length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                          {dlv.comments.map((c) => (
                            <div key={c.id} style={{ fontSize: '0.82rem', lineHeight: 1.4 }}>
                              <span style={{ fontWeight: 600, color: '#1678a2' }}>{c.author}</span>
                              <span style={{ color: '#8a9ba8', marginLeft: 8, fontSize: '0.75rem' }}>{c.timestamp}</span>
                              <p style={{ margin: '2px 0 0' }}>{c.text}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div style={{ fontSize: '0.8rem', color: '#8a9ba8', marginBottom: 10 }}>No comments yet.</div>
                      )}
                      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                        <input
                          className={styles.input}
                          value={commentAuthor}
                          onChange={(e) => setCommentAuthor(e.target.value)}
                          placeholder="Your name"
                          style={{ width: 120 }}
                        />
                        <input
                          className={styles.input}
                          value={commentTexts[dlv.id] ?? ''}
                          onChange={(e) => setCommentTexts((prev) => ({ ...prev, [dlv.id]: e.target.value }))}
                          placeholder="Add a comment..."
                          style={{ flex: 1 }}
                          onKeyDown={(e) => { if (e.key === 'Enter') handleAddComment(dlv.id); }}
                        />
                        <button
                          className={styles.intakeToggleBtn}
                          onClick={() => handleAddComment(dlv.id)}
                          type="button"
                          disabled={!commentAuthor.trim() || !(commentTexts[dlv.id] ?? '').trim()}
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              ) : null;

              if (isEditing) {
                return (
                  <Fragment key={dlv.id}>
                    <tr>
                    <td>
                      <div style={{ paddingLeft: depth * 24 }}>
                        <input
                          className={styles.input}
                          value={dlv.title || dlv.dealName}
                          onChange={(e) => handleUpdate(dlv.id, dlv.title ? 'title' : 'dealName', e.target.value)}
                          placeholder={isSection ? 'Section title' : 'Deal name'}
                          style={{ minWidth: 100, fontWeight: isSection ? 600 : 400 }}
                        />
                      </div>
                    </td>
                    <td>
                      <input
                        className={styles.input}
                        value={dlv.entityName}
                        onChange={(e) => handleUpdate(dlv.id, 'entityName', e.target.value)}
                        placeholder="Entity name"
                        style={{ minWidth: 100 }}
                      />
                    </td>
                    <td>
                      <select
                        className={styles.select}
                        value={dlv.status}
                        onChange={(e) => handleUpdate(dlv.id, 'status', e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <input
                        className={styles.input}
                        type="date"
                        value={dlv.dueDate || ''}
                        onChange={(e) => handleUpdate(dlv.id, 'dueDate', e.target.value)}
                        style={{ minWidth: 110 }}
                      />
                    </td>
                    <td>
                      <input
                        className={styles.input}
                        value={dlv.notes}
                        onChange={(e) => handleUpdate(dlv.id, 'notes', e.target.value)}
                        placeholder="Notes"
                        style={{ minWidth: 120 }}
                      />
                    </td>
                    <td>
                      {dlv.fileLink ? (
                        <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <a href={dlv.fileLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1678a2', fontSize: '0.82rem' }}>
                            {dlv.fileName || 'Attached file'}
                          </a>
                          <button className={styles.actionBtn} onClick={() => handleDetachFile(dlv.id, dlv.fileLink)} type="button" title="Remove file" style={{ fontSize: '0.9rem', lineHeight: 1 }}>
                            &times;
                          </button>
                        </span>
                      ) : (
                        <>
                          <input
                            type="file"
                            ref={(el) => { fileInputRefs.current[dlv.id] = el; }}
                            style={{ display: 'none' }}
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleAttachFile(dlv.id, file);
                              e.target.value = '';
                            }}
                          />
                          <button className={styles.intakeToggleBtn} onClick={() => fileInputRefs.current[dlv.id]?.click()} type="button">
                            Attach
                          </button>
                        </>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionCell}>
                        <button className={styles.actionBtn} onClick={() => stopEditing(dlv.id)} type="button" title="Save">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 8.5l3.5 3.5L13 4" />
                          </svg>
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleRemove(dlv.id)} type="button" title="Delete">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                          </svg>
                        </button>
                        <button className={styles.actionBtn} onClick={() => handleAddChild(dlv.id)} type="button" title="Add sub-deliverable">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M6 3v6h6" /><path d="M10 7v4" /><path d="M8 9h4" />
                          </svg>
                        </button>
                        {commentBtn}
                      </div>
                    </td>
                  </tr>
                  {commentRow}
                  </Fragment>
                );
              }

              return (
                <Fragment key={dlv.id}>
                <tr style={isSection ? { fontWeight: 600, backgroundColor: '#f6f8fa' } : undefined}>
                  <td>
                    <div style={{ paddingLeft: depth * 24 }}>
                      {isSection && <span style={{ fontSize: '0.72rem', color: '#6a7f90', marginRight: 6, textTransform: 'uppercase', letterSpacing: '0.04em' }}>section</span>}
                      {dlv.title || dlv.dealName || '—'}
                    </div>
                  </td>
                  <td>{dlv.entityName || '—'}</td>
                  <td>
                    <span className={`${styles.docStatusBadge} ${statusBadgeClass(dlv.status)}`}>
                      {dlv.status}
                    </span>
                  </td>
                  <td>{dlv.dueDate || '—'}</td>
                  <td>{dlv.notes || '—'}</td>
                  <td>
                    {dlv.fileLink ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <a href={dlv.fileLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1678a2', fontSize: '0.82rem' }}>
                          {dlv.fileName || 'Attached file'}
                        </a>
                        <button className={styles.actionBtn} onClick={() => handleDetachFile(dlv.id, dlv.fileLink)} type="button" title="Remove file" style={{ fontSize: '0.9rem', lineHeight: 1 }}>
                          &times;
                        </button>
                      </span>
                    ) : (
                      <>
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[dlv.id] = el; }}
                          style={{ display: 'none' }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleAttachFile(dlv.id, file);
                            e.target.value = '';
                          }}
                        />
                        <button className={styles.intakeToggleBtn} onClick={() => fileInputRefs.current[dlv.id]?.click()} type="button">
                          Attach
                        </button>
                      </>
                    )}
                  </td>
                  <td>
                    <div className={styles.actionCell}>
                      <button className={styles.actionBtn} onClick={() => startEditing(dlv.id)} type="button" title="Edit">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                        </svg>
                      </button>
                      <button className={styles.actionBtn} onClick={() => handleRemove(dlv.id)} type="button" title="Delete">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                        </svg>
                      </button>
                      <button className={styles.actionBtn} onClick={() => handleAddChild(dlv.id)} type="button" title="Add sub-deliverable">
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M6 3v6h6" /><path d="M10 7v4" /><path d="M8 9h4" />
                        </svg>
                      </button>
                      {commentBtn}
                    </div>
                  </td>
                </tr>
                {commentRow}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className={styles.emptyState}>No deliverables added yet.</div>
      )}
      <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
        <button className={styles.intakeToggleBtn} onClick={handleAdd} type="button">
          + Add deliverable
        </button>
        {hasTemplates && (
          <button className={styles.intakeToggleBtn} onClick={handlePopulateFromTemplate} type="button">
            Populate from template
          </button>
        )}
        <button className={styles.intakeToggleBtn} onClick={() => setShowImport(true)} type="button">
          Import
        </button>
        {request.priorRequestInstanceId && (
          <button className={styles.intakeToggleBtn} onClick={handleRollover} type="button">
            Roll over from prior period
          </button>
        )}
      </div>
      {showImport && (
        <Suspense fallback={null}>
          <DeliverableImport onImport={handleImport} onCancel={() => setShowImport(false)} />
        </Suspense>
      )}
    </>
  );
}
