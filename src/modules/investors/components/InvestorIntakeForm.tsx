import { useState } from 'react';
import type { InvestorRecord } from '../types/investor.types';
import styles from '../InvestorsModule.module.css';

type InvestorIntakeFormProps = {
  onSubmit: (investor: InvestorRecord) => void;
  onCancel: () => void;
};

const CLASS_OPTIONS = ['Institutional', 'Family Office', 'Individual', 'Feeder'] as const;
const STATUS_OPTIONS = ['Active', 'Watchlist', 'Offboarded'] as const;

export function InvestorIntakeForm({ onSubmit, onCancel }: InvestorIntakeFormProps) {
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [investorClass, setInvestorClass] = useState<string>(CLASS_OPTIONS[0]);
  const [domicile, setDomicile] = useState('');
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0]);
  const [serviceTeam, setServiceTeam] = useState('');

  function handleSubmit() {
    if (!name.trim()) return;
    const id = `investor-${Date.now()}`;
    const investor: InvestorRecord = {
      id,
      name: name.trim(),
      legalName: legalName.trim() || name.trim(),
      investorClass: investorClass as InvestorRecord['investorClass'],
      domicile: domicile.trim(),
      status: status as InvestorRecord['status'],
      withholdingProfile: '',
      serviceTeam: serviceTeam.trim(),
      scopeIds: [],
      commitment: '',
      openQuestions: 0,
      requestCount: 0,
      lastActivityDate: '',
      notes: '',
      contactName: '',
      contactEmail: '',
      taxIdType: '',
      taxIdLast4: '',
      entityType: '',
      withholdingRate: '',
      w8FormType: '',
      w8ExpirationDate: '',
      treatyClaimCountry: '',
      chapter3Status: '',
      chapter4Status: '',
      openQuestionsList: [],
      activityLog: [],
      documentCount: 0,
      lastReviewDate: '',
      capitalAccount: '',
      ownershipPercentage: '',
      investorType: '',
      allocationPercentage: '',
      taxExempt: '',
      kycStatus: '',
      context: { fundFamilyLabel: '', fundLabel: '' },
      comments: [],
    };
    onSubmit(investor);
  }

  return (
    <div className={styles.editModal} style={{ margin: '10px 0', boxShadow: 'none', border: '1px solid #d9e7ef', width: '100%', maxWidth: '100%' }}>
      <h3 className={styles.editTitle}>New Investor</h3>
      <div className={styles.editForm}>
        <div>
          <label className={styles.fieldLabel}>Name</label>
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Investor name" autoFocus />
        </div>
        <div>
          <label className={styles.fieldLabel}>Legal Name</label>
          <input className={styles.input} value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Legal name" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Class</label>
          <select className={styles.select} value={investorClass} onChange={(e) => setInvestorClass(e.target.value)}>
            {CLASS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.fieldLabel}>Domicile</label>
          <input className={styles.input} value={domicile} onChange={(e) => setDomicile(e.target.value)} placeholder="e.g. United States" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Status</label>
          <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.fieldLabel}>Service Team</label>
          <input className={styles.input} value={serviceTeam} onChange={(e) => setServiceTeam(e.target.value)} placeholder="e.g. Investor Relations" />
        </div>
        <div className={styles.editActions}>
          <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!name.trim()} type="button">Save</button>
        </div>
      </div>
    </div>
  );
}
