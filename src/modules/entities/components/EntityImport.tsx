import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { EntityRecord } from '../types/entity.types';
import styles from '../EntitiesModule.module.css';

type EntityImportProps = {
  onImport: (entities: EntityRecord[]) => void;
  onCancel: () => void;
};

const CATEGORY_OPTIONS = ['Fund Vehicle', 'Blocker', 'Investment Level', 'Holding Company', 'Third-Party'];
const STATUS_OPTIONS = ['Active', 'Pending Review', 'Inactive'];

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function closestMatch(value: string, options: string[]): string | undefined {
  const lower = value.trim().toLowerCase();
  return options.find((o) => o.toLowerCase() === lower);
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(',').map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { row[h] = values[i] ?? ''; });
    return row;
  });
}

function parseRows(raw: Record<string, unknown>[]): EntityRecord[] {
  const results: EntityRecord[] = [];
  for (const row of raw) {
    const norm: Record<string, string> = {};
    for (const [key, val] of Object.entries(row)) {
      norm[normalizeHeader(key)] = String(val ?? '').trim();
    }
    const name = norm['name'] ?? '';
    if (!name) continue;

    const sfjRaw = norm['statefilingjurisdictions'] ?? norm['statefiling'] ?? '';
    const stateFilingJurisdictions = sfjRaw ? sfjRaw.split(/[;,]/).map((s: string) => s.trim()).filter(Boolean) : [];

    results.push({
      id: `entity-${Date.now()}-${results.length}`,
      name,
      legalName: norm['legalname'] ?? name,
      category: (closestMatch(norm['category'] ?? '', CATEGORY_OPTIONS) ?? 'Fund Vehicle') as EntityRecord['category'],
      jurisdiction: norm['jurisdiction'] ?? '',
      status: (closestMatch(norm['status'] ?? '', STATUS_OPTIONS) ?? 'Active') as EntityRecord['status'],
      taxClassification: norm['taxclassification'] ?? norm['taxclass'] ?? '',
      ownerTeam: norm['ownerteam'] ?? norm['owner'] ?? '',
      scopeIds: [],
      associatedFundIds: [],
      associatedDealIds: [],
      structureSummary: norm['structuresummary'] ?? '',
      requestCount: 0,
      documentCount: 0,
      openQuestions: 0,
      lastReviewDate: '',
      notes: norm['notes'] ?? '',
      ein: norm['ein'] ?? '',
      dateFormed: norm['dateformed'] ?? norm['formed'] ?? '',
      fiscalYearEnd: norm['fiscalyearend'] ?? norm['yearend'] ?? norm['fye'] ?? '',
      registeredAgent: norm['registeredagent'] ?? norm['agent'] ?? '',
      address: norm['address'] ?? '',
      checkTheBoxElection: norm['checktheboxelection'] ?? norm['ctb'] ?? '',
      treatyCountry: norm['treatycountry'] ?? norm['treaty'] ?? '',
      fatcaStatus: norm['fatcastatus'] ?? norm['fatca'] ?? '',
      stateFilingJurisdictions,
      structureRole: norm['structurerole'] ?? norm['role'] ?? '',
      formationType: norm['formationtype'] ?? norm['formation'] ?? '',
      functionalCurrency: norm['functionalcurrency'] ?? norm['currency'] ?? '',
      taxReportingStatus: norm['taxreportingstatus'] ?? norm['taxreporting'] ?? '',
      annualRevenue: norm['annualrevenue'] ?? norm['revenue'] ?? '',
      context: { fundFamilyLabel: '', fundLabel: '' },
      activityLog: [],
      comments: [],
    });
  }
  return results;
}

export function EntityImport({ onImport, onCancel }: EntityImportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<EntityRecord[]>([]);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [isParsingExcel, setIsParsingExcel] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setError('');
    setParsed([]);

    try {
      if (file.name.endsWith('.csv')) {
        const text = await file.text();
        const raw = parseCsv(text);
        const entities = parseRows(raw);
        if (entities.length === 0) { setError('No valid rows found. Ensure there is a "name" column.'); return; }
        setParsed(entities);
      } else {
        setIsParsingExcel(true);
        const xlsx = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const wb = xlsx.read(buffer, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const raw = xlsx.utils.sheet_to_json(sheet) as Record<string, unknown>[];
        const entities = parseRows(raw);
        if (entities.length === 0) { setError('No valid rows found. Ensure there is a "name" column.'); return; }
        setParsed(entities);
        setIsParsingExcel(false);
      }
    } catch {
      setError('Failed to parse file.');
      setIsParsingExcel(false);
    }
  }

  return createPortal(
    <div className={styles.importOverlay} onClick={onCancel}>
      <div className={styles.importModal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.importTitle}>Import entities</h2>
        <p className={styles.importSubtitle}>
          Upload a CSV or Excel file with columns: name (required), legalName, category, jurisdiction, status, ownerTeam, ein, dateFormed, fiscalYearEnd, taxClassification, formationType, functionalCurrency, and more.
        </p>

        <input ref={fileRef} type="file" accept=".csv,.xlsx,.xls" style={{ display: 'none' }} onChange={handleFileChange} />

        {parsed.length === 0 && (
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className={styles.importBtn} onClick={() => fileRef.current?.click()} type="button">Choose file</button>
            {fileName && <span style={{ fontSize: 13, color: '#6a7f90' }}>{fileName}</span>}
          </div>
        )}

        {isParsingExcel && <div className={styles.importSubtitle}>Loading Excel parser...</div>}
        {error && <div className={styles.importError}>{error}</div>}

        {parsed.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: '#345060', marginBottom: 10 }}>
              {parsed.length} entit{parsed.length === 1 ? 'y' : 'ies'} found in <strong>{fileName}</strong>
            </p>
            <table className={styles.importPreviewTable}>
              <thead>
                <tr><th>Name</th><th>Category</th><th>Jurisdiction</th><th>Status</th><th>EIN</th></tr>
              </thead>
              <tbody>
                {parsed.map((row, i) => (
                  <tr key={i}><td>{row.name}</td><td>{row.category}</td><td>{row.jurisdiction || '—'}</td><td>{row.status}</td><td>{row.ein || '—'}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className={styles.importActions}>
          <button className={styles.importBtnSecondary} onClick={onCancel} type="button">Cancel</button>
          {parsed.length > 0 && (
            <button className={styles.importBtn} onClick={() => onImport(parsed)} type="button">
              Import {parsed.length} entit{parsed.length === 1 ? 'y' : 'ies'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
