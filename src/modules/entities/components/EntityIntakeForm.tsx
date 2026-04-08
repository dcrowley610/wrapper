import { useState } from 'react';
import type { EntityRecord } from '../types/entity.types';
import styles from '../EntitiesModule.module.css';

type EntityIntakeFormProps = {
  onSubmit: (entity: EntityRecord) => void;
  onCancel: () => void;
};

const CATEGORY_OPTIONS = ['Fund Vehicle', 'Blocker', 'Operating Company', 'Holding Company', 'Third-Party'] as const;
const STATUS_OPTIONS = ['Active', 'Pending Review', 'Inactive'] as const;

export function EntityIntakeForm({ onSubmit, onCancel }: EntityIntakeFormProps) {
  const [name, setName] = useState('');
  const [legalName, setLegalName] = useState('');
  const [category, setCategory] = useState<string>(CATEGORY_OPTIONS[0]);
  const [jurisdiction, setJurisdiction] = useState('');
  const [status, setStatus] = useState<string>(STATUS_OPTIONS[0]);
  const [ownerTeam, setOwnerTeam] = useState('');
  const [taxClassification, setTaxClassification] = useState('');
  const [ein, setEin] = useState('');
  const [dateFormed, setDateFormed] = useState('');
  const [fiscalYearEnd, setFiscalYearEnd] = useState('');
  const [fatcaStatus, setFatcaStatus] = useState('');
  const [taxReportingStatus, setTaxReportingStatus] = useState('');
  const [checkTheBoxElection, setCheckTheBoxElection] = useState('');
  const [treatyCountry, setTreatyCountry] = useState('');
  const [stateFilingJurisdictions, setStateFilingJurisdictions] = useState('');
  const [formationType, setFormationType] = useState('');
  const [structureRole, setStructureRole] = useState('');
  const [structureSummary, setStructureSummary] = useState('');
  const [functionalCurrency, setFunctionalCurrency] = useState('');
  const [annualRevenue, setAnnualRevenue] = useState('');
  const [registeredAgent, setRegisteredAgent] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');

  function handleSubmit() {
    if (!name.trim()) return;
    const id = `entity-${Date.now()}`;
    const entity: EntityRecord = {
      id,
      name: name.trim(),
      legalName: legalName.trim() || name.trim(),
      category: category as EntityRecord['category'],
      jurisdiction: jurisdiction.trim(),
      status: status as EntityRecord['status'],
      taxClassification: taxClassification.trim(),
      ownerTeam: ownerTeam.trim(),
      scopeIds: [],
      structureSummary: structureSummary.trim(),
      requestCount: 0,
      documentCount: 0,
      openQuestions: 0,
      lastReviewDate: '',
      notes: notes.trim(),
      ein: ein.trim(),
      dateFormed: dateFormed.trim(),
      fiscalYearEnd: fiscalYearEnd.trim(),
      registeredAgent: registeredAgent.trim(),
      address: address.trim(),
      checkTheBoxElection: checkTheBoxElection.trim(),
      treatyCountry: treatyCountry.trim(),
      fatcaStatus: fatcaStatus.trim(),
      stateFilingJurisdictions: stateFilingJurisdictions.split(',').map((s) => s.trim()).filter(Boolean),
      structureRole: structureRole.trim(),
      formationType: formationType.trim(),
      functionalCurrency: functionalCurrency.trim(),
      taxReportingStatus: taxReportingStatus.trim(),
      annualRevenue: annualRevenue.trim(),
      context: { relatedEntityIds: [], relatedDealIds: [], relatedInvestorIds: [], relatedRequestIds: [] },
      activityLog: [],
      comments: [],
    };
    onSubmit(entity);
  }

  return (
    <div className={styles.editModal} style={{ margin: '10px 0', boxShadow: 'none', border: '1px solid #d9e7ef', width: '100%', maxWidth: '100%' }}>
      <h3 className={styles.editTitle}>New Entity</h3>
      <div className={styles.editForm}>
        <div>
          <label className={styles.fieldLabel}>Name</label>
          <input className={styles.input} value={name} onChange={(e) => setName(e.target.value)} placeholder="Entity name" autoFocus />
        </div>
        <div>
          <label className={styles.fieldLabel}>Legal Name</label>
          <input className={styles.input} value={legalName} onChange={(e) => setLegalName(e.target.value)} placeholder="Legal name" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Category</label>
          <select className={styles.select} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.fieldLabel}>Jurisdiction</label>
          <input className={styles.input} value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)} placeholder="e.g. Delaware" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Status</label>
          <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
            {STATUS_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        </div>
        <div>
          <label className={styles.fieldLabel}>Owner Team</label>
          <input className={styles.input} value={ownerTeam} onChange={(e) => setOwnerTeam(e.target.value)} placeholder="e.g. Tax Compliance" />
        </div>

        <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
          <strong style={{ fontSize: 13, color: '#345060' }}>Tax &amp; Compliance</strong>
        </div>
        <div>
          <label className={styles.fieldLabel}>Tax Classification</label>
          <input className={styles.input} value={taxClassification} onChange={(e) => setTaxClassification(e.target.value)} placeholder="e.g. Partnership" />
        </div>
        <div>
          <label className={styles.fieldLabel}>EIN</label>
          <input className={styles.input} value={ein} onChange={(e) => setEin(e.target.value)} placeholder="e.g. 12-3456789" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Date Formed</label>
          <input className={styles.input} value={dateFormed} onChange={(e) => setDateFormed(e.target.value)} placeholder="e.g. 2020-01-15" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Fiscal Year End</label>
          <input className={styles.input} value={fiscalYearEnd} onChange={(e) => setFiscalYearEnd(e.target.value)} placeholder="e.g. 12/31" />
        </div>
        <div>
          <label className={styles.fieldLabel}>FATCA Status</label>
          <input className={styles.input} value={fatcaStatus} onChange={(e) => setFatcaStatus(e.target.value)} placeholder="e.g. Reporting FI" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Tax Reporting Status</label>
          <input className={styles.input} value={taxReportingStatus} onChange={(e) => setTaxReportingStatus(e.target.value)} placeholder="e.g. Current" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Check-the-Box Election</label>
          <input className={styles.input} value={checkTheBoxElection} onChange={(e) => setCheckTheBoxElection(e.target.value)} placeholder="e.g. Disregarded entity" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Treaty Country</label>
          <input className={styles.input} value={treatyCountry} onChange={(e) => setTreatyCountry(e.target.value)} placeholder="e.g. Ireland" />
        </div>
        <div>
          <label className={styles.fieldLabel}>State Filing Jurisdictions</label>
          <input className={styles.input} value={stateFilingJurisdictions} onChange={(e) => setStateFilingJurisdictions(e.target.value)} placeholder="Comma-separated, e.g. DE, NY, CA" />
        </div>

        <div style={{ gridColumn: '1 / -1', borderTop: '1px solid #d9e7ef', paddingTop: 12, marginTop: 4 }}>
          <strong style={{ fontSize: 13, color: '#345060' }}>Organization</strong>
        </div>
        <div>
          <label className={styles.fieldLabel}>Formation Type</label>
          <input className={styles.input} value={formationType} onChange={(e) => setFormationType(e.target.value)} placeholder="e.g. LLC" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Structure Role</label>
          <input className={styles.input} value={structureRole} onChange={(e) => setStructureRole(e.target.value)} placeholder="e.g. Holding Company" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Structure Summary</label>
          <input className={styles.input} value={structureSummary} onChange={(e) => setStructureSummary(e.target.value)} placeholder="Brief description" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Functional Currency</label>
          <input className={styles.input} value={functionalCurrency} onChange={(e) => setFunctionalCurrency(e.target.value)} placeholder="e.g. USD" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Annual Revenue</label>
          <input className={styles.input} value={annualRevenue} onChange={(e) => setAnnualRevenue(e.target.value)} placeholder="e.g. $10M" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Registered Agent</label>
          <input className={styles.input} value={registeredAgent} onChange={(e) => setRegisteredAgent(e.target.value)} placeholder="Agent name" />
        </div>
        <div>
          <label className={styles.fieldLabel}>Address</label>
          <input className={styles.input} value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Entity address" />
        </div>

        <div className={styles.editFormFull}>
          <label className={styles.fieldLabel}>Notes</label>
          <textarea className={styles.editTextarea} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Additional notes..." />
        </div>

        <div className={styles.editActions}>
          <button className={styles.cancelBtn} onClick={onCancel} type="button">Cancel</button>
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!name.trim()} type="button">Save</button>
        </div>
      </div>
    </div>
  );
}
