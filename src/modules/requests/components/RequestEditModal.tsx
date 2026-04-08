import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { RequestFormState, WorkflowRequest } from '../types';
import { OWNER_OPTIONS, FREQUENCY_OPTIONS } from '../config';
import { SCOPE_DIMENSIONS } from '../../../platform/context/platformContext.types';
import { requestPlaybooksService } from '../services';
import styles from '../RequestsModule.module.css';

type RequestEditModalProps = {
  request: WorkflowRequest;
  onSave: (requestId: string, form: RequestFormState) => void;
  onCancel: () => void;
};

export function RequestEditModal({ request, onSave, onCancel }: RequestEditModalProps) {
  const playbooks = requestPlaybooksService.getAll();

  const [form, setForm] = useState<RequestFormState>({
    title: request.title,
    summary: request.summary,
    owner: request.owner,
    latestExpectedDate: request.latestExpectedDate,
    playbookId: request.playbookId ?? '',
    requestTypeId: request.requestTypeId ?? '',
    fundId: request.fundId ?? '',
    taxYear: request.taxYear ?? '',
    dueDate: request.dueDate ?? '',
    requestor: request.requestor ?? '',
    frequency: request.frequency ?? 'ad-hoc',
    creationMode: 'blank',
  });

  function handleSubmit() {
    if (!form.title.trim() || !form.summary.trim()) return;
    onSave(request.id, form);
  }

  return createPortal(
    <div className={styles.importOverlay} onClick={onCancel}>
      <div className={styles.importModal} onClick={(e) => e.stopPropagation()}>
        <h3 className={styles.importTitle}>Edit request {request.id}</h3>
        <p className={styles.importSubtitle}>Update the fields below and save your changes.</p>

        {request.templateSnapshot && (
          <div className={styles.snapshotNotice}>
            Template: {request.templateSnapshot.typeName} (snapshotted {request.templateSnapshot.snapshotDate})
          </div>
        )}

        <div className={styles.intakeForm}>
          <div>
            <label className={styles.fieldLabel}>Title</label>
            <input
              className={styles.input}
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              placeholder="Request title"
            />
          </div>
          <div>
            <label className={styles.fieldLabel}>Expected Date</label>
            <input
              className={styles.input}
              type="date"
              value={form.latestExpectedDate}
              onChange={(e) => setForm((f) => ({ ...f, latestExpectedDate: e.target.value }))}
            />
          </div>
          <div>
            <label className={styles.fieldLabel}>Due Date</label>
            <input
              className={styles.input}
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
            />
          </div>
          <div>
            <label className={styles.fieldLabel}>Owner</label>
            <select
              className={styles.select}
              value={form.owner}
              onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))}
            >
              {OWNER_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Fund</label>
            <select
              className={styles.select}
              value={form.fundId}
              onChange={(e) => setForm((f) => ({ ...f, fundId: e.target.value }))}
            >
              <option value="">No fund</option>
              {SCOPE_DIMENSIONS.fund.map((f) => (
                <option key={f.id} value={f.id}>{f.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Tax Year</label>
            <select
              className={styles.select}
              value={form.taxYear}
              onChange={(e) => setForm((f) => ({ ...f, taxYear: e.target.value }))}
            >
              <option value="">No year</option>
              {SCOPE_DIMENSIONS.taxYear.map((y) => (
                <option key={y.id} value={y.label}>{y.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Frequency</label>
            <select
              className={styles.select}
              value={form.frequency}
              onChange={(e) => setForm((f) => ({ ...f, frequency: e.target.value as any }))}
            >
              {FREQUENCY_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Requestor</label>
            <input
              className={styles.input}
              value={form.requestor}
              onChange={(e) => setForm((f) => ({ ...f, requestor: e.target.value }))}
              placeholder="Who is requesting?"
            />
          </div>
          <div className={styles.intakeFormFull}>
            <label className={styles.fieldLabel}>Playbook</label>
            <select
              className={styles.select}
              value={form.playbookId}
              onChange={(e) => setForm((f) => ({ ...f, playbookId: e.target.value }))}
            >
              {playbooks.map((pb) => <option key={pb.id} value={pb.id}>{pb.name}</option>)}
            </select>
          </div>
          <div className={styles.intakeFormFull}>
            <label className={styles.fieldLabel}>Summary</label>
            <textarea
              className={styles.intakeTextarea}
              value={form.summary}
              onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
              placeholder="Describe the request..."
            />
          </div>
          <div className={styles.intakeActions}>
            <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
            <button className={styles.submitBtn} onClick={handleSubmit} type="button" disabled={!form.title.trim() || !form.summary.trim()}>
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
