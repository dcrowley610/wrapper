import { useState } from 'react';
import type { RequestProcessFormState } from '../types';
import {
  OWNER_OPTIONS, FREQUENCY_OPTIONS,
  RECURRENCE_DRIVERS, PRIORITY_OPTIONS, STANDARDIZATION_OPTIONS,
  DOMAIN_OPTIONS,
} from '../config';
import { requestCategoriesService, requestPlaybooksService } from '../services';
import styles from '../RequestsModule.module.css';

type RequestProcessFormProps = {
  initial?: Partial<RequestProcessFormState>;
  onSubmit: (form: RequestProcessFormState) => void;
  onCancel: () => void;
  submitLabel?: string;
};

/** Backward-compat alias */
export type RequestTypeFormProps = RequestProcessFormProps;

const allPlaybooks = requestPlaybooksService.getAll();

const EMPTY_FORM: RequestProcessFormState = {
  name: '',
  description: '',
  domain: '',
  categoryId: '',
  defaultFrequency: 'annual',
  recurrenceDriver: '',
  defaultDueOffsetDays: 30,
  defaultPriority: 'Medium',
  defaultOwner: OWNER_OPTIONS[0],
  playbookId: allPlaybooks[0]?.id ?? '',
  defaultInstructions: '',
  defaultExpectedOutput: '',
  riskNotes: '',
  tags: '',
  standardizationLevel: 'global',
};

export function RequestProcessForm({ initial, onSubmit, onCancel, submitLabel = 'Create process' }: RequestProcessFormProps) {
  const [form, setForm] = useState<RequestProcessFormState>({ ...EMPTY_FORM, ...initial });

  const categories = form.domain
    ? requestCategoriesService.getByDomain(form.domain)
    : requestCategoriesService.getAll();

  const playbooks = requestPlaybooksService.getAll();

  function handleSubmit() {
    if (!form.name.trim()) return;
    onSubmit(form);
  }

  return (
    <div className={styles.intakeForm}>
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Name</label>
        <input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g., Obtain Schedule K-1s from investments" />
      </div>
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Description</label>
        <textarea className={styles.intakeTextarea} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} placeholder="Describe what this process covers..." />
      </div>

      {/* Domain + Category dropdowns */}
      <div>
        <label className={styles.fieldLabel}>Domain</label>
        <select className={styles.select} value={form.domain} onChange={(e) => setForm((f) => ({ ...f, domain: e.target.value, categoryId: '' }))}>
          <option value="">Select domain...</option>
          {DOMAIN_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.fieldLabel}>Category</label>
        <select className={styles.select} value={form.categoryId} onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}>
          <option value="">Select category...</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      <div>
        <label className={styles.fieldLabel}>Frequency</label>
        <select className={styles.select} value={form.defaultFrequency} onChange={(e) => setForm((f) => ({ ...f, defaultFrequency: e.target.value as any }))}>
          {FREQUENCY_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.fieldLabel}>Recurrence driver</label>
        <select className={styles.select} value={form.recurrenceDriver} onChange={(e) => setForm((f) => ({ ...f, recurrenceDriver: e.target.value }))}>
          <option value="">Select driver...</option>
          {RECURRENCE_DRIVERS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.fieldLabel}>Default due offset (days)</label>
        <input className={styles.input} type="number" value={form.defaultDueOffsetDays} onChange={(e) => setForm((f) => ({ ...f, defaultDueOffsetDays: parseInt(e.target.value) || 0 }))} />
      </div>
      <div>
        <label className={styles.fieldLabel}>Default priority</label>
        <select className={styles.select} value={form.defaultPriority} onChange={(e) => setForm((f) => ({ ...f, defaultPriority: e.target.value }))}>
          {PRIORITY_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.fieldLabel}>Default owner</label>
        <select className={styles.select} value={form.defaultOwner} onChange={(e) => setForm((f) => ({ ...f, defaultOwner: e.target.value }))}>
          {OWNER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.fieldLabel}>Playbook</label>
        <select className={styles.select} value={form.playbookId} onChange={(e) => setForm((f) => ({ ...f, playbookId: e.target.value }))}>
          {playbooks.map((pb) => <option key={pb.id} value={pb.id}>{pb.name}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.fieldLabel}>Standardization level</label>
        <select className={styles.select} value={form.standardizationLevel} onChange={(e) => setForm((f) => ({ ...f, standardizationLevel: e.target.value as any }))}>
          {STANDARDIZATION_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
        </select>
      </div>
      <div>
        <label className={styles.fieldLabel}>Tags (comma-separated)</label>
        <input className={styles.input} value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="e.g., k-1, investments, collection" />
      </div>
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Default instructions</label>
        <textarea className={styles.intakeTextarea} value={form.defaultInstructions} onChange={(e) => setForm((f) => ({ ...f, defaultInstructions: e.target.value }))} placeholder="Step-by-step instructions for fulfilling this process..." />
      </div>
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Default expected output</label>
        <textarea className={styles.intakeTextarea} value={form.defaultExpectedOutput} onChange={(e) => setForm((f) => ({ ...f, defaultExpectedOutput: e.target.value }))} placeholder="What should be delivered when complete?" />
      </div>
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Risk notes</label>
        <textarea className={styles.intakeTextarea} value={form.riskNotes} onChange={(e) => setForm((f) => ({ ...f, riskNotes: e.target.value }))} placeholder="Key risks or considerations..." />
      </div>
      <div className={styles.intakeActions}>
        <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
        <button className={styles.submitBtn} onClick={handleSubmit} type="button" disabled={!form.name.trim()}>{submitLabel}</button>
      </div>
    </div>
  );
}

/** Backward-compat alias */
export const RequestTypeForm = RequestProcessForm;
