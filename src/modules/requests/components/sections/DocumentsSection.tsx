import type { WorkflowRequest } from '../../types';
import styles from '../../RequestsModule.module.css';

function statusBadgeClass(status: string): string {
  switch (status) {
    case 'not-started': return styles.docStatusPending;
    case 'pending': return styles.docStatusPending;
    case 'received': return styles.docStatusReceived;
    case 'reviewed': return styles.docStatusReviewed;
    default: return '';
  }
}

type UnifiedDoc = {
  id: string;
  title: string;
  status: string;
  dueDate: string | null;
  source: 'required' | 'deliverable';
  fileLink?: string;
};

export function DocumentsSection({ request }: { request: WorkflowRequest }) {
  const requiredDocs: UnifiedDoc[] = request.requiredDocuments.map((d) => ({
    id: d.id,
    title: d.title,
    status: d.status,
    dueDate: d.dueDate,
    source: 'required',
  }));

  const deliverableDocs: UnifiedDoc[] = request.deliverables
    .filter((d) => d.fileLink)
    .map((d) => ({
      id: `dlv-doc-${d.id}`,
      title: d.fileName || d.title || d.dealName || 'Attached file',
      status: d.status,
      dueDate: d.dueDate,
      source: 'deliverable',
      fileLink: d.fileLink,
    }));

  const allDocs = [...requiredDocs, ...deliverableDocs];

  const pending = allDocs.filter((d) => d.status === 'pending' || d.status === 'not-started').length;
  const received = allDocs.filter((d) => d.status === 'received').length;
  const reviewed = allDocs.filter((d) => d.status === 'reviewed').length;

  return (
    <>
      <h2 className={styles.sectionTitle}>Documents</h2>
      <p className={styles.sectionCopy}>
        All documents for this request — both required documents and files attached to deliverables.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {pending > 0 && <span className={`${styles.docStatusBadge} ${styles.docStatusPending}`}>{pending} pending</span>}
        {received > 0 && <span className={`${styles.docStatusBadge} ${styles.docStatusReceived}`}>{received} received</span>}
        {reviewed > 0 && <span className={`${styles.docStatusBadge} ${styles.docStatusReviewed}`}>{reviewed} reviewed</span>}
      </div>
      {allDocs.length > 0 ? (
        <table className={styles.docTable}>
          <thead>
            <tr>
              <th>Document</th>
              <th>Source</th>
              <th>Status</th>
              <th>Due</th>
            </tr>
          </thead>
          <tbody>
            {allDocs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  {doc.fileLink ? (
                    <a href={doc.fileLink} target="_blank" rel="noopener noreferrer" style={{ color: '#1678a2' }}>
                      {doc.title}
                    </a>
                  ) : (
                    doc.title
                  )}
                </td>
                <td>
                  <span style={{
                    fontSize: '0.75rem',
                    color: doc.source === 'deliverable' ? '#6a7f90' : '#3a4f5c',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                  }}>
                    {doc.source === 'deliverable' ? 'Deliverable' : 'Required'}
                  </span>
                </td>
                <td>
                  <span className={`${styles.docStatusBadge} ${statusBadgeClass(doc.status)}`}>
                    {doc.status}
                  </span>
                </td>
                <td>{doc.dueDate || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.emptyState}>No documents for this request.</div>
      )}
    </>
  );
}
