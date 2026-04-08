import type { ExtractedField } from '../../types';
import type { FieldAction } from '../../pages/DocumentReviewPage';
import { ExtractedFieldRow } from '../fields/ExtractedFieldRow';
import styles from '../../DocumentsModule.module.css';

type ExtractedFieldsSectionProps = {
  fields: ExtractedField[];
  dispatch: React.Dispatch<FieldAction>;
};

export function ExtractedFieldsSection({ fields, dispatch }: ExtractedFieldsSectionProps) {
  const confirmed = fields.filter((f) => f.status === 'confirmed').length;
  const overridden = fields.filter((f) => f.status === 'overridden').length;
  const pending = fields.filter((f) => f.status === 'pending').length;

  return (
    <>
      <h2 className={styles.sectionTitle}>Extracted fields</h2>
      <p className={styles.sectionCopy}>
        Review extracted values. Confirm accurate fields or override with corrections.
      </p>
      <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
        {pending > 0 && <span className={`${styles.fieldStatusBadge} ${styles.statusPending}`}>{pending} pending</span>}
        {confirmed > 0 && <span className={`${styles.fieldStatusBadge} ${styles.statusConfirmed}`}>{confirmed} confirmed</span>}
        {overridden > 0 && <span className={`${styles.fieldStatusBadge} ${styles.statusOverridden}`}>{overridden} overridden</span>}
      </div>
      {fields.map((field) => (
        <ExtractedFieldRow key={field.id} field={field} dispatch={dispatch} />
      ))}
    </>
  );
}
