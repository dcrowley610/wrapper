import { useState } from 'react';
import type { CreationMode, RequestFormState, RequestType, RequestInstance } from '../types';
import { OWNER_OPTIONS, FREQUENCY_OPTIONS, FREQUENCY_LABEL } from '../config';
import { SCOPE_DIMENSIONS } from '../../../platform/context/platformContext.types';
import { requestTypesService, requestsService, requestPlaybooksService } from '../services';
import styles from '../RequestsModule.module.css';

type RequestIntakeFormProps = {
  onSubmit: (form: RequestFormState) => void;
  onCancel: () => void;
};

const allPlaybooks = requestPlaybooksService.getAll();

const INITIAL_FORM: RequestFormState = {
  title: '',
  summary: '',
  owner: OWNER_OPTIONS[0],
  latestExpectedDate: '',
  playbookId: allPlaybooks[0]?.id ?? '',
  requestTypeId: '',
  fundId: '',
  taxYear: '',
  dueDate: '',
  requestor: '',
  frequency: 'ad-hoc',
  creationMode: 'blank',
};

export function RequestIntakeForm({ onSubmit, onCancel }: RequestIntakeFormProps) {
  const [form, setForm] = useState<RequestFormState>(INITIAL_FORM);
  const [creationMode, setCreationMode] = useState<CreationMode>('blank');

  const requestTypes = requestTypesService.getActiveRequestTypes().filter((t) => t.id !== 'RT-LEGACY');
  const allInstances = requestsService.getAllRequests();
  const playbooks = requestPlaybooksService.getAll();

  function handleModeChange(mode: CreationMode) {
    setCreationMode(mode);
    setForm({ ...INITIAL_FORM, creationMode: mode });
  }

  function handleTypeSelect(typeId: string) {
    const type = requestTypesService.getRequestTypeById(typeId);
    if (!type) return;
    const suggestedDue = form.fundId && form.taxYear
      ? requestsService.suggestDueDate(typeId, `${form.taxYear}-01-01`)
      : '';
    setForm((f) => ({
      ...f,
      requestTypeId: typeId,
      title: type.name,
      summary: type.description,
      owner: type.defaultOwner || f.owner,
      playbookId: type.playbookId || f.playbookId,
      frequency: type.defaultFrequency,
      dueDate: suggestedDue || f.dueDate,
    }));
  }

  function handlePriorSelect(priorId: string) {
    const prior = requestsService.getRequestById(priorId);
    if (!prior) return;
    setForm((f) => ({
      ...f,
      title: prior.title,
      summary: prior.summary,
      owner: prior.owner,
      playbookId: prior.playbookId ?? f.playbookId,
      requestTypeId: prior.requestTypeId ?? '',
      fundId: prior.fundId ?? '',
      frequency: prior.frequency,
      requestor: prior.requestor,
      creationMode: 'fromPrior',
    }));
  }

  function handleDuplicateSelect(sourceId: string) {
    const source = requestsService.getRequestById(sourceId);
    if (!source) return;
    setForm((f) => ({
      ...f,
      title: source.title,
      summary: source.summary,
      owner: source.owner,
      playbookId: source.playbookId ?? f.playbookId,
      latestExpectedDate: source.latestExpectedDate,
      requestTypeId: source.requestTypeId ?? '',
      fundId: source.fundId ?? '',
      taxYear: source.taxYear,
      frequency: source.frequency,
      requestor: source.requestor,
      creationMode: 'duplicate',
    }));
  }

  function handleSubmit() {
    if (!form.title.trim() || !form.summary.trim()) return;
    onSubmit({ ...form, creationMode });
    setForm(INITIAL_FORM);
    setCreationMode('blank');
  }

  return (
    <div className={styles.intakeForm}>
      {/* Creation mode selector */}
      <div className={styles.intakeFormFull}>
        <label className={styles.fieldLabel}>Create from</label>
        <div className={styles.creationModeSelector}>
          {(['blank', 'fromType', 'fromPrior', 'duplicate'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={`${styles.creationModeBtn} ${creationMode === mode ? styles.creationModeBtnActive : ''}`}
              onClick={() => handleModeChange(mode)}
            >
              {mode === 'blank' && 'Blank'}
              {mode === 'fromType' && 'From Process'}
              {mode === 'fromPrior' && 'From Prior'}
              {mode === 'duplicate' && 'Duplicate'}
            </button>
          ))}
        </div>
      </div>

      {/* Type picker (From Type mode) */}
      {creationMode === 'fromType' && (
        <div className={styles.intakeFormFull}>
          <label className={styles.fieldLabel}>Process</label>
          <select
            className={styles.select}
            value={form.requestTypeId}
            onChange={(e) => handleTypeSelect(e.target.value)}
          >
            <option value="">Select a process...</option>
            {requestTypes.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({FREQUENCY_LABEL[t.defaultFrequency]})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Prior instance picker (From Prior mode) */}
      {creationMode === 'fromPrior' && (
        <div className={styles.intakeFormFull}>
          <label className={styles.fieldLabel}>Prior period request</label>
          <select
            className={styles.select}
            value=""
            onChange={(e) => handlePriorSelect(e.target.value)}
          >
            <option value="">Select a prior request...</option>
            {allInstances.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.title} ({r.taxYear})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Duplicate picker */}
      {creationMode === 'duplicate' && (
        <div className={styles.intakeFormFull}>
          <label className={styles.fieldLabel}>Duplicate from</label>
          <select
            className={styles.select}
            value=""
            onChange={(e) => handleDuplicateSelect(e.target.value)}
          >
            <option value="">Select a request to duplicate...</option>
            {allInstances.map((r) => (
              <option key={r.id} value={r.id}>
                {r.id} — {r.title} ({r.taxYear})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Core fields */}
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
        <label className={styles.fieldLabel}>Fund</label>
        <select
          className={styles.select}
          value={form.fundId}
          onChange={(e) => setForm((f) => ({ ...f, fundId: e.target.value }))}
        >
          <option value="">No fund selected</option>
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
          <option value="">No year selected</option>
          {SCOPE_DIMENSIONS.taxYear.map((y) => (
            <option key={y.id} value={y.label}>{y.label}</option>
          ))}
        </select>
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
        <label className={styles.fieldLabel}>Expected Date</label>
        <input
          className={styles.input}
          type="date"
          value={form.latestExpectedDate}
          onChange={(e) => setForm((f) => ({ ...f, latestExpectedDate: e.target.value }))}
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
          placeholder="Who is requesting this?"
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
          Create request
        </button>
      </div>
    </div>
  );
}
