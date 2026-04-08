import type { ExecutionMethod, RequestInstance } from '../../types';
import type { DetailAction } from '../../pages/RequestDetailPage';
import { FULFILLMENT_METHOD_OPTIONS } from '../../config';
import styles from '../../RequestsModule.module.css';

type ExecutionMethodSectionProps = {
  request: RequestInstance;
  dispatch: React.Dispatch<DetailAction>;
};

export function ExecutionMethodSection({ request, dispatch }: ExecutionMethodSectionProps) {
  const method = request.executionMethod;

  function updateField(field: keyof ExecutionMethod, value: string) {
    const current: ExecutionMethod = method ?? {
      fulfillmentMethod: 'other',
      sourceSystem: '',
      executionNotes: '',
      stepSummary: '',
      methodEffectiveness: '',
      issuesEncountered: '',
    };
    dispatch({
      type: 'SET_EXECUTION_METHOD',
      executionMethod: { ...current, [field]: value },
    });
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Execution method</h2>
      <p className={styles.sectionCopy}>
        Capture how this request was (or is being) fulfilled. This data enables cross-period learning and future AI recommendations.
      </p>

      <div className={styles.executionForm}>
        <div className={styles.executionField}>
          <label className={styles.fieldLabel}>Fulfillment method</label>
          <select
            className={styles.select}
            value={method?.fulfillmentMethod ?? ''}
            onChange={(e) => updateField('fulfillmentMethod', e.target.value)}
          >
            <option value="">Select method...</option>
            {FULFILLMENT_METHOD_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>{o.label}</option>
            ))}
          </select>
        </div>

        <div className={styles.executionField}>
          <label className={styles.fieldLabel}>Source system / provider</label>
          <input
            className={styles.input}
            placeholder="e.g., Fund administrator portal, Investran, email"
            value={method?.sourceSystem ?? ''}
            onChange={(e) => updateField('sourceSystem', e.target.value)}
          />
        </div>

        <div className={styles.executionFieldFull}>
          <label className={styles.fieldLabel}>Execution notes</label>
          <textarea
            className={styles.intakeTextarea}
            placeholder="Describe how the request was fulfilled..."
            value={method?.executionNotes ?? ''}
            onChange={(e) => updateField('executionNotes', e.target.value)}
          />
        </div>

        <div className={styles.executionFieldFull}>
          <label className={styles.fieldLabel}>Step summary</label>
          <textarea
            className={styles.intakeTextarea}
            placeholder="List the key steps taken (e.g., 1. Retrieved data from portal. 2. Validated against prior year...)"
            value={method?.stepSummary ?? ''}
            onChange={(e) => updateField('stepSummary', e.target.value)}
          />
        </div>

        <div className={styles.executionField}>
          <label className={styles.fieldLabel}>Method effectiveness</label>
          <input
            className={styles.input}
            placeholder="e.g., Excellent, Adequate, Needs improvement"
            value={method?.methodEffectiveness ?? ''}
            onChange={(e) => updateField('methodEffectiveness', e.target.value)}
          />
        </div>

        <div className={styles.executionFieldFull}>
          <label className={styles.fieldLabel}>Issues encountered</label>
          <textarea
            className={styles.intakeTextarea}
            placeholder="Any issues, delays, or blockers..."
            value={method?.issuesEncountered ?? ''}
            onChange={(e) => updateField('issuesEncountered', e.target.value)}
          />
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 className={styles.sectionTitle} style={{ fontSize: '0.92rem' }}>Completion summary</h3>
        <textarea
          className={styles.intakeTextarea}
          placeholder="Summary of the outcome and deliverables..."
          value={request.completionSummary ?? ''}
          onChange={(e) => dispatch({ type: 'SET_COMPLETION_SUMMARY', completionSummary: e.target.value })}
        />
      </div>
    </>
  );
}
