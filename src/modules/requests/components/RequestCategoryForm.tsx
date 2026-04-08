import { useState } from 'react';
import type { RequestCategoryFormState } from '../types';
import { DOMAIN_OPTIONS } from '../config';
import styles from '../RequestsModule.module.css';

type RequestCategoryFormProps = {
  initial?: Partial<RequestCategoryFormState>;
  onSubmit: (form: RequestCategoryFormState) => void;
  onCancel: () => void;
  submitLabel?: string;
};

const EMPTY_FORM: RequestCategoryFormState = {
  name: '',
  description: '',
  domain: '',
};

export function RequestCategoryForm({ initial, onSubmit, onCancel, submitLabel = 'Create category' }: RequestCategoryFormProps) {
  const [form, setForm] = useState<RequestCategoryFormState>({ ...EMPTY_FORM, ...initial });

  function handleSubmit() {
    if (!form.name.trim()) return;
    onSubmit(form);
  }

  return (
    <div className={styles.intakeForm}>
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Category name</label>
        <input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Annual Schedule K-1 Prep" />
      </div>
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Description</label>
        <textarea className={styles.intakeTextarea} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe what this category covers..." />
      </div>
      <div>
        <label className={styles.fieldLabel}>Domain</label>
        <select className={styles.select} value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value }))}>
          <option value="">Select domain...</option>
          {DOMAIN_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div className={styles.intakeActions}>
        <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
        <button className={styles.submitBtn} onClick={handleSubmit} type="button" disabled={!form.name.trim()}>{submitLabel}</button>
      </div>
    </div>
  );
}
