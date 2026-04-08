import { useState } from 'react';
import type { DealRecord } from '../types/deal.types';
import styles from '../DealsModule.module.css';

type DealIntakeFormProps = {
  onSubmit: (deal: DealRecord) => void;
  onCancel: () => void;
};

const INVESTMENT_TYPE_OPTIONS = ['Equity', 'Debt', 'Real Estate', 'Fund of Funds', 'Infrastructure'] as const;
const STATUS_OPTIONS = ['Active', 'Pending Review', 'Closed'] as const;

export function DealIntakeForm({ onSubmit, onCancel }: DealIntakeFormProps) {
  const [name, setName] = useState('');
  const [owner, setOwner] = useState('');
  const [investmentType, setInvestmentType] = useState<string>(INVESTMENT_TYPE_OPTIONS[0]);
  const [taxYear, setTaxYear] = useState('');
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0]);

  function handleSubmit() {
    if (!name.trim()) return;
    const id = `deal-${Date.now()}`;
    const deal: DealRecord = {
      id,
      name: name.trim(),
      owner: owner.trim(),
      investmentType: investmentType as DealRecord['investmentType'],
      taxableIncome: '',
      taxYear: taxYear.trim(),
      status: status as DealRecord['status'],
      linkedEntityIds: [],
      scopeIds: [],
      requestCount: 0,
      documentCount: 0,
      openQuestions: 0,
      lastReviewDate: '',
      notes: '',
      closingDate: '',
      currency: '',
      geographicFocus: '',
      sector: '',
      activityLog: [],
      context: { relatedEntityIds: [], relatedDealIds: [], relatedInvestorIds: [], relatedRequestIds: [] },
      comments: [],
    };
    onSubmit(deal);
  }

  return (
    <div className={styles.editModal} style={{ margin: '10px 0', boxShadow: 'none', border: '1px solid #d9e7ef', width: '100%', maxWidth: '100%' }}>
      <h3 className={styles.editTitle}>New Deal</h3>
      <div className={styles.editForm}>
        <div>
          <label className={styles.fieldLabel}>Name</label>
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Deal name" autoFocus />
        </div>
        <div>
          <label className={styles.fieldLabel}>Owner</label>
          <input className={styles.input} value={owner} onChange={(e) => setOwner(e.target.value)} placeholder="e.g. John Smith" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Investment Type</label>
          <select className={styles.select} value={investmentType} onChange={(e) => setInvestmentType(e.target.value)}>
            {INVESTMENT_TYPE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.fieldLabel}>Tax Year</label>
          <input className={styles.input} value={taxYear} onChange={(e) => setTaxYear(e.target.value)} placeholder="e.g. 2025" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Status</label>
          <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div className={styles.editActions}>
          <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!name.trim()} type="button">Save</button>
        </div>
      </div>
    </div>
  );
}
