import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { EntityRecord, EntityCategory, EntityStatus } from '../types';
import styles from '../EntitiesModule.module.css';

type EntityEditModalProps = {
  entity: EntityRecord;
  onSave: (id: string, updates: Partial<EntityRecord>) => void;
  onCancel: () => void;
};

const CATEGORIES: EntityCategory[] = ['Fund Vehicle', 'Blocker', 'Operating Company', 'Holding Company', 'Third-Party'];
const STATUSES: EntityStatus[] = ['Active', 'Pending Review', 'Inactive'];

export function EntityEditModal({ entity, onSave, onCancel }: EntityEditModalProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [form, setForm] = useState({
    name: entity.name,
    legalName: entity.legalName,
    category: entity.category,
    jurisdiction: entity.jurisdiction,
    status: entity.status,
    taxClassification: entity.taxClassification,
    ownerTeam: entity.ownerTeam,
    notes: entity.notes,
    ein: entity.ein,
    dateFormed: entity.dateFormed,
    fiscalYearEnd: entity.fiscalYearEnd,
    registeredAgent: entity.registeredAgent,
    address: entity.address,
    checkTheBoxElection: entity.checkTheBoxElection,
    treatyCountry: entity.treatyCountry,
    fatcaStatus: entity.fatcaStatus,
    stateFilingJurisdictions: entity.stateFilingJurisdictions.join(', '),
    structureRole: entity.structureRole,
    formationType: entity.formationType,
    functionalCurrency: entity.functionalCurrency,
    taxReportingStatus: entity.taxReportingStatus,
    annualRevenue: entity.annualRevenue,
    structureSummary: entity.structureSummary,
  });

  function handleSubmit() {
    if (!form.name.trim()) return;
    const { stateFilingJurisdictions: sfjStr, ...rest } = form;
    onSave(entity.id, {
      ...rest,
      stateFilingJurisdictions: sfjStr.split(',').map((s) => s.trim()).filter(Boolean),
    });
  }

  return createPortal(
    <div className={styles.editOverlay} onClick={onCancel}>
      <div className={`${styles.editModal} ${fullscreen ? styles.editModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editHeader}>
          <h3 className={styles.editTitle}>Edit entity — {entity.name}</h3>
          <div className={styles.editHeaderActions}>
            <button
              className={styles.iconBtn}
              onClick={() => setFullscreen((f) => !f)}
              type="button"
              title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
            >
              {fullscreen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="10,2 10,6 14,6" />
                  <polyline points="6,14 6,10 2,10" />
                  <polyline points="14,10 10,10 10,14" />
                  <polyline points="2,6 6,6 6,2" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="2,6 2,2 6,2" />
                  <polyline points="10,2 14,2 14,6" />
                  <polyline points="14,10 14,14 10,14" />
                  <polyline points="6,14 2,14 2,10" />
                </svg>
              )}
            </button>
            <button className={styles.iconBtn} onClick={onCancel} type="button" title="Close without saving">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="4" y1="4" x2="12" y2="12" />
                <line x1="12" y1="4" x2="4" y2="12" />
              </svg>
            </button>
          </div>
        </div>
        <div className={styles.editForm}>
          <div>
            <label className={styles.fieldLabel}>Name</label>
            <input className={styles.input} value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Legal Name</label>
            <input className={styles.input} value={form.legalName} onChange={(e) => setForm((f) => ({ ...f, legalName: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Category</label>
            <select className={styles.select} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as EntityCategory }))}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Status</label>
            <select className={styles.select} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as EntityStatus }))}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Jurisdiction</label>
            <input className={styles.input} value={form.jurisdiction} onChange={(e) => setForm((f) => ({ ...f, jurisdiction: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Tax Classification</label>
            <input className={styles.input} value={form.taxClassification} onChange={(e) => setForm((f) => ({ ...f, taxClassification: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Owner Team</label>
            <input className={styles.input} value={form.ownerTeam} onChange={(e) => setForm((f) => ({ ...f, ownerTeam: e.target.value }))} />
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
            <strong style={{ fontSize: 13, color: '#345060' }}>Tax &amp; Compliance</strong>
          </div>
          <div>
            <label className={styles.fieldLabel}>EIN</label>
            <input className={styles.input} value={form.ein} onChange={(e) => setForm((f) => ({ ...f, ein: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Date Formed</label>
            <input className={styles.input} value={form.dateFormed} onChange={(e) => setForm((f) => ({ ...f, dateFormed: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Fiscal Year End</label>
            <input className={styles.input} value={form.fiscalYearEnd} onChange={(e) => setForm((f) => ({ ...f, fiscalYearEnd: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>FATCA Status</label>
            <input className={styles.input} value={form.fatcaStatus} onChange={(e) => setForm((f) => ({ ...f, fatcaStatus: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Tax Reporting Status</label>
            <input className={styles.input} value={form.taxReportingStatus} onChange={(e) => setForm((f) => ({ ...f, taxReportingStatus: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Check-the-Box Election</label>
            <input className={styles.input} value={form.checkTheBoxElection} onChange={(e) => setForm((f) => ({ ...f, checkTheBoxElection: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Treaty Country</label>
            <input className={styles.input} value={form.treatyCountry} onChange={(e) => setForm((f) => ({ ...f, treatyCountry: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>State Filing Jurisdictions</label>
            <input className={styles.input} value={form.stateFilingJurisdictions} onChange={(e) => setForm((f) => ({ ...f, stateFilingJurisdictions: e.target.value }))} placeholder="Comma-separated" />
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
            <strong style={{ fontSize: 13, color: '#345060' }}>Organization</strong>
          </div>
          <div>
            <label className={styles.fieldLabel}>Formation Type</label>
            <input className={styles.input} value={form.formationType} onChange={(e) => setForm((f) => ({ ...f, formationType: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Structure Role</label>
            <input className={styles.input} value={form.structureRole} onChange={(e) => setForm((f) => ({ ...f, structureRole: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Structure Summary</label>
            <input className={styles.input} value={form.structureSummary} onChange={(e) => setForm((f) => ({ ...f, structureSummary: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Functional Currency</label>
            <input className={styles.input} value={form.functionalCurrency} onChange={(e) => setForm((f) => ({ ...f, functionalCurrency: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Annual Revenue</label>
            <input className={styles.input} value={form.annualRevenue} onChange={(e) => setForm((f) => ({ ...f, annualRevenue: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Registered Agent</label>
            <input className={styles.input} value={form.registeredAgent} onChange={(e) => setForm((f) => ({ ...f, registeredAgent: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Address</label>
            <input className={styles.input} value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
          </div>

          <div className={styles.editFormFull}>
            <label className={styles.fieldLabel}>Notes</label>
            <textarea className={styles.editTextarea} value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
          </div>
          <div className={styles.editActions}>
            <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
            <button className={styles.submitBtn} onClick={handleSubmit} type="button" disabled={!form.name.trim()}>Save changes</button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
