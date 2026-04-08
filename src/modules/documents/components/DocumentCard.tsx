import { memo } from 'react';
import type { DocumentRecord } from '../types';
import styles from '../DocumentsModule.module.css';

type DocumentCardProps = {
  document: DocumentRecord;
  onOpen: (id: string) => void;
};

export const DocumentCard = memo(function DocumentCard({ document, onOpen }: DocumentCardProps) {
  return (
    <button className={styles.recordCard} onClick={() => onOpen(document.id)} type="button">
      <div className={styles.recordHeader}>
        <div>
          <h3 className={styles.recordTitle}>{document.title}</h3>
          <p className={styles.recordSubtitle}>{document.fileName}</p>
        </div>
        <span className={styles.recordStatus}>{document.status}</span>
      </div>
      <p className={styles.recordSummary}>
        {document.entityName} &middot; {document.taxYear} &middot; {document.extractedFields.length} fields extracted
      </p>
      <div className={styles.recordMeta}>
        <span>{document.category}</span>
        <span>{document.documentType}</span>
        <span>Uploaded {document.uploadDate}</span>
      </div>
    </button>
  );
});
