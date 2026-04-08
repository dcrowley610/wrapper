import { memo, useCallback, useState } from 'react';
import type { ExtractedField } from '../../types';
import type { FieldAction } from '../../pages/DocumentReviewPage';
import styles from '../../DocumentsModule.module.css';

type ExtractedFieldRowProps = {
  field: ExtractedField;
  dispatch: React.Dispatch<FieldAction>;
};

function confidenceClass(confidence: number): string {
  if (confidence >= 0.9) return styles.confidenceHigh;
  if (confidence >= 0.75) return styles.confidenceMedium;
  return styles.confidenceLow;
}

function statusBadgeClass(status: ExtractedField['status']): string {
  switch (status) {
    case 'pending': return styles.statusPending;
    case 'confirmed': return styles.statusConfirmed;
    case 'overridden': return styles.statusOverridden;
  }
}

export const ExtractedFieldRow = memo(function ExtractedFieldRow({ field, dispatch }: ExtractedFieldRowProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [overrideValue, setOverrideValue] = useState('');
  const [explanation, setExplanation] = useState('');

  const handleConfirm = useCallback(() => {
    dispatch({ type: 'CONFIRM_FIELD', fieldId: field.id });
  }, [dispatch, field.id]);

  const handleOverrideSubmit = useCallback(() => {
    if (!overrideValue.trim()) return;
    dispatch({
      type: 'OVERRIDE_FIELD',
      fieldId: field.id,
      value: overrideValue.trim(),
      explanation: explanation.trim(),
    });
    setIsEditing(false);
    setOverrideValue('');
    setExplanation('');
  }, [dispatch, field.id, overrideValue, explanation]);

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setOverrideValue('');
    setExplanation('');
  }, []);

  return (
    <div className={styles.fieldRow}>
      <div className={styles.fieldRowTop}>
        <div className={`${styles.fieldConfidence} ${confidenceClass(field.confidence)}`} title={`${Math.round(field.confidence * 100)}% confidence`} />
        <span className={styles.fieldName}>{field.label}</span>
        {field.status === 'overridden' ? (
          <span className={styles.fieldValueOverridden}>{field.extractedValue}</span>
        ) : (
          <span className={styles.fieldValue}>{field.extractedValue}</span>
        )}
        <span className={`${styles.fieldStatusBadge} ${statusBadgeClass(field.status)}`}>
          {field.status}
        </span>
        {field.status === 'pending' && (
          <div className={styles.fieldActions}>
            <button className={styles.confirmBtn} onClick={handleConfirm} type="button">
              Confirm
            </button>
            <button className={styles.overrideBtn} onClick={() => setIsEditing(true)} type="button">
              Override
            </button>
          </div>
        )}
      </div>

      {field.status === 'overridden' && field.confirmedValue && (
        <div style={{ marginTop: 6, paddingLeft: 22 }}>
          <span className={styles.confirmedValue}>{field.confirmedValue}</span>
          {field.overrideExplanation && (
            <p className={styles.overrideExplanation}>{field.overrideExplanation}</p>
          )}
        </div>
      )}

      {isEditing && (
        <div className={styles.overrideForm}>
          <label className={styles.fieldLabel}>New value</label>
          <input
            className={styles.overrideInput}
            value={overrideValue}
            onChange={(e) => setOverrideValue(e.target.value)}
            placeholder={field.extractedValue}
          />
          <label className={styles.fieldLabel}>Explanation</label>
          <textarea
            className={styles.overrideTextarea}
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Why is this value being overridden?"
          />
          <div className={styles.overrideFormActions}>
            <button className={styles.overrideCancelBtn} onClick={handleCancel} type="button">
              Cancel
            </button>
            <button className={styles.overrideSaveBtn} onClick={handleOverrideSubmit} type="button">
              Save override
            </button>
          </div>
        </div>
      )}
    </div>
  );
});
