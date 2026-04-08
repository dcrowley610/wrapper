import { useState } from 'react';
import { createPortal } from 'react-dom';
import type { InvestorRecord, InvestorClass, InvestorStatus } from '../types';
import styles from '../InvestorsModule.module.css';

type InvestorEditModalProps = {
  investor: InvestorRecord;
  onSave: (id: string, updates: Partial<InvestorRecord>) => void;
  onCancel: () => void;
};

const CLASSES: InvestorClass[] = ['Institutional', 'Family Office', 'Individual', 'Feeder'];
const STATUSES: InvestorStatus[] = ['Active', 'Watchlist', 'Offboarded'];

export function InvestorEditModal({ investor, onSave, onCancel }: InvestorEditModalProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [form, setForm] = useState({
    name: investor.name,
    legalName: investor.legalName,
    investorClass: investor.investorClass,
    domicile: investor.domicile,
    status: investor.status,
    withholdingProfile: investor.withholdingProfile,
    serviceTeam: investor.serviceTeam,
    commitment: investor.commitment,
    notes: investor.notes,
    contactName: investor.contactName,
    contactEmail: investor.contactEmail,
    taxIdType: investor.taxIdType,
    taxIdLast4: investor.taxIdLast4,
    entityType: investor.entityType,
    withholdingRate: investor.withholdingRate,
    w8FormType: investor.w8FormType,
    w8ExpirationDate: investor.w8ExpirationDate,
    treatyClaimCountry: investor.treatyClaimCountry,
    chapter3Status: investor.chapter3Status,
    chapter4Status: investor.chapter4Status,
    capitalAccount: investor.capitalAccount,
    ownershipPercentage: investor.ownershipPercentage,
    investorType: investor.investorType,
    allocationPercentage: investor.allocationPercentage,
    taxExempt: investor.taxExempt === 'true' || investor.taxExempt === 'Yes',
    kycStatus: investor.kycStatus,
  });

  function handleSubmit() {
    if (!form.name.trim()) return;
    const { taxExempt, ...rest } = form;
    onSave(investor.id, {
      ...rest,
      taxExempt: taxExempt ? 'true' : 'false',
    });
  }

  return createPortal(
    <div className={styles.editOverlay} onClick={onCancel}>
      <div className={`${styles.editModal} ${fullscreen ? styles.editModalFullscreen : ''}`} onClick={(e) => e.stopPropagation()}>
        <div className={styles.editHeader}>
          <h3 className={styles.editTitle}>Edit investor — {investor.name}</h3>
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
            <label className={styles.fieldLabel}>Class</label>
            <select className={styles.select} value={form.investorClass} onChange={(e) => setForm((f) => ({ ...f, investorClass: e.target.value as InvestorClass }))}>
              {CLASSES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Status</label>
            <select className={styles.select} value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as InvestorStatus }))}>
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className={styles.fieldLabel}>Investor Type</label>
            <input className={styles.input} value={form.investorType} onChange={(e) => setForm((f) => ({ ...f, investorType: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Entity Type</label>
            <input className={styles.input} value={form.entityType} onChange={(e) => setForm((f) => ({ ...f, entityType: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Domicile</label>
            <input className={styles.input} value={form.domicile} onChange={(e) => setForm((f) => ({ ...f, domicile: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Service Team</label>
            <input className={styles.input} value={form.serviceTeam} onChange={(e) => setForm((f) => ({ ...f, serviceTeam: e.target.value }))} />
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
            <strong style={{ fontSize: 13, color: '#345060' }}>Contact</strong>
          </div>
          <div>
            <label className={styles.fieldLabel}>Contact Name</label>
            <input className={styles.input} value={form.contactName} onChange={(e) => setForm((f) => ({ ...f, contactName: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Contact Email</label>
            <input className={styles.input} value={form.contactEmail} onChange={(e) => setForm((f) => ({ ...f, contactEmail: e.target.value }))} />
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
            <strong style={{ fontSize: 13, color: '#345060' }}>Tax &amp; Withholding</strong>
          </div>
          <div>
            <label className={styles.fieldLabel}>Tax ID Type</label>
            <input className={styles.input} value={form.taxIdType} onChange={(e) => setForm((f) => ({ ...f, taxIdType: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Tax ID Last 4</label>
            <input className={styles.input} value={form.taxIdLast4} onChange={(e) => setForm((f) => ({ ...f, taxIdLast4: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Withholding Profile</label>
            <input className={styles.input} value={form.withholdingProfile} onChange={(e) => setForm((f) => ({ ...f, withholdingProfile: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Withholding Rate</label>
            <input className={styles.input} value={form.withholdingRate} onChange={(e) => setForm((f) => ({ ...f, withholdingRate: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>W-8 Form Type</label>
            <input className={styles.input} value={form.w8FormType} onChange={(e) => setForm((f) => ({ ...f, w8FormType: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>W-8 Expiration Date</label>
            <input type="date" className={styles.input} value={form.w8ExpirationDate} onChange={(e) => setForm((f) => ({ ...f, w8ExpirationDate: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Treaty Claim Country</label>
            <input className={styles.input} value={form.treatyClaimCountry} onChange={(e) => setForm((f) => ({ ...f, treatyClaimCountry: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>
              <input type="checkbox" checked={form.taxExempt} onChange={(e) => setForm((f) => ({ ...f, taxExempt: e.target.checked }))} />
              {' '}Tax Exempt
            </label>
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
            <strong style={{ fontSize: 13, color: '#345060' }}>Capital &amp; Ownership</strong>
          </div>
          <div>
            <label className={styles.fieldLabel}>Commitment</label>
            <input className={styles.input} value={form.commitment} onChange={(e) => setForm((f) => ({ ...f, commitment: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Capital Account</label>
            <input className={styles.input} value={form.capitalAccount} onChange={(e) => setForm((f) => ({ ...f, capitalAccount: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Ownership %</label>
            <input className={styles.input} value={form.ownershipPercentage} onChange={(e) => setForm((f) => ({ ...f, ownershipPercentage: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Allocation %</label>
            <input className={styles.input} value={form.allocationPercentage} onChange={(e) => setForm((f) => ({ ...f, allocationPercentage: e.target.value }))} />
          </div>

          <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
            <strong style={{ fontSize: 13, color: '#345060' }}>Compliance</strong>
          </div>
          <div>
            <label className={styles.fieldLabel}>Chapter 3 Status</label>
            <input className={styles.input} value={form.chapter3Status} onChange={(e) => setForm((f) => ({ ...f, chapter3Status: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>Chapter 4 Status</label>
            <input className={styles.input} value={form.chapter4Status} onChange={(e) => setForm((f) => ({ ...f, chapter4Status: e.target.value }))} />
          </div>
          <div>
            <label className={styles.fieldLabel}>KYC Status</label>
            <input className={styles.input} value={form.kycStatus} onChange={(e) => setForm((f) => ({ ...f, kycStatus: e.target.value }))} />
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
