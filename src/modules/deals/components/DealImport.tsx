import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DealRecord } from '../types/deal.types';
import styles from '../DealsModule.module.css';

type DealImportProps = {
  onImport: (deals: DealRecord[]) => void;
  onCancel: () => void;
};

const INVESTMENT_TYPE_OPTIONS = ['Equity', 'Debt', 'Real Estate', 'Fund of Funds', 'Infrastructure'];
const STATUS_OPTIONS = ['Active', 'Pending Review', 'Closed'];

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

function parseRows(raw: Record<string, unknown>[]): DealRecord[] {
  const results: DealRecord[] = [];
  for (const row of raw) {
    const norm: Record<string, string> = {};
    for (const [key, val] of Object.entries(row)) {
      norm[normalizeHeader(key)] = String(val ?? '').trim();
    }
    const name = norm['name'] ?? '';
    if (!name) continue;

    results.push({
      id: `deal-${Date.now()}-${results.length}`,
      name,
      owner: norm['owner'] ?? '',
      investmentType: (closestMatch(norm['investmenttype'] ?? norm['type'] ?? '', INVESTMENT_TYPE_OPTIONS) ?? 'Equity') as DealRecord['investmentType'],
      taxableIncome: '',
      taxYear: norm['taxyear'] ?? norm['year'] ?? '',
      status: (closestMatch(norm['status'] ?? '', STATUS_OPTIONS) ?? 'Active') as DealRecord['status'],
      linkedEntityIds: [],
      scopeIds: [],
      requestCount: 0,
      documentCount: 0,
      openQuestions: 0,
      lastReviewDate: '',
      notes: '',
      closingDate: norm['closingdate'] ?? '',
      currency: norm['currency'] ?? '',
      geographicFocus: norm['geographicfocus'] ?? norm['geography'] ?? '',
      sector: norm['sector'] ?? '',
      activityLog: [],
      context: { fundFamilyLabel: '', fundLabel: '' },
      comments: [],
    });
  }
  return results;
}

export function DealImport({ onImport, onCancel }: DealImportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<DealRecord[]>([]);
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
        const deals = parseRows(raw);
        if (deals.length === 0) { setError('No valid rows found. Ensure there is a "name" column.'); return; }
        setParsed(deals);
      } else {
        setIsParsingExcel(true);
        const xlsx = await import('xlsx');
        const buffer = await file.arrayBuffer();
        const wb = xlsx.read(buffer, { type: 'array' });
        const sheet = wb.Sheets[wb.SheetNames[0]];
        const raw = xlsx.utils.sheet_to_json(sheet) as Record<string, unknown>[];
        const deals = parseRows(raw);
        if (deals.length === 0) { setError('No valid rows found. Ensure there is a "name" column.'); return; }
        setParsed(deals);
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
        <h2 className={styles.importTitle}>Import deals</h2>
        <p className={styles.importSubtitle}>
          Upload a CSV or Excel file with columns: name (required), owner, investmentType, taxYear, status.
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
              {parsed.length} deal{parsed.length === 1 ? '' : 's'} found in <strong>{fileName}</strong>
            </p>
            <table className={styles.importPreviewTable}>
              <thead>
                <tr><th>Name</th><th>Owner</th><th>Type</th><th>Status</th></tr>
              </thead>
              <tbody>
                {parsed.map((row, i) => (
                  <tr key={i}><td>{row.name}</td><td>{row.owner || '—'}</td><td>{row.investmentType}</td><td>{row.status}</td></tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className={styles.importActions}>
          <button className={styles.importBtnSecondary} onClick={onCancel} type="button">Cancel</button>
          {parsed.length > 0 && (
            <button className={styles.importBtn} onClick={() => onImport(parsed)} type="button">
              Import {parsed.length} deal{parsed.length === 1 ? '' : 's'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
