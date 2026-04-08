import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { DealRecord, DealStatus, InvestmentType } from '../types';
import styles from '../DealsModule.module.css';

type DealEditModalProps = {
  deal: DealRecord;
  onSave: (id: string, updates: Partial<DealRecord>) => void;
  onCancel: () => void;
};

const INVESTMENT_TYPES: InvestmentType[] = ['Equity', 'Debt', 'Real Estate', 'Fund of Funds', 'Infrastructure'];
const STATUSES: DealStatus[] = ['Active', 'Pending Review', 'Closed'];

export function DealEditModal({ deal, onSave, onCancel }: DealEditModalProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [form, setForm] = useState({
    name: deal.name,
    owner: deal.owner,
    investmentType: deal.investmentType,
    taxYear: deal.taxYear,
    status: deal.status,
    taxableIncome: deal.taxableIncome,
    notes: deal.notes,
    closingDate: deal.closingDate,
    currency: deal.currency,
    geographicFocus: deal.geographicFocus,
    sector: deal.sector,
  });

  function handleSubmit() {
    if (!form.name.trim()) return;
    onSave(deal.id, form);
  }

  return createPortal(
    <div className={styles.editOverlay} onClick={onCancel}>
      <div className={`${styles.editModal} ${fullscreen ? styles.editModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editHeader}>
          <h3 className={styles.editTitle}>Edit deal — {deal.name}</h3>
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
            <label className={styles.fieldLabel}>Owner</label>
            <input className={styles.input} value={form.owner} onChange={(e) => setForm((f) => ({ ...f, owner: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Investment Type</label>
            <select className={styles.select} value={form.investmentType} onChange={(e) => setForm((f) => ({ ...f, investmentType: e.target.value as InvestmentType }))}>
              {INVESTMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Status</label>
            <select className={styles.select} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as DealStatus }))}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Tax Year</label>
            <input className={styles.input} value={form.taxYear} onChange={(e) => setForm((f) => ({ ...f, taxYear: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Taxable Income</label>
            <input className={styles.input} value={form.taxableIncome} onChange={(e) => setForm((f) => ({ ...f, taxableIncome: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Closing Date</label>
            <input type="date" className={styles.input} value={form.closingDate} onChange={(e) => setForm((f) => ({ ...f, closingDate: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Currency</label>
            <input className={styles.input} value={form.currency} onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Geographic Focus</label>
            <input className={styles.input} value={form.geographicFocus} onChange={(e) => setForm((f) => ({ ...f, geographicFocus: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Sector</label>
            <input className={styles.input} value={form.sector} onChange={(e) => setForm((f) => ({ ...f, sector: e.target.value }))} />
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
