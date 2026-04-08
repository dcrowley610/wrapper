import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { DeliverableInstance, DeliverableStatus } from '../types';
import styles from '../RequestsModule.module.css';

type DeliverableImportProps = {
  onImport: (deliverables: DeliverableInstance[]) => void;
  onCancel: () => void;
};

const STATUS_OPTIONS: DeliverableStatus[] = ['not-started', 'pending', 'received', 'reviewed'];

function normalizeHeader(h: string): string {
  return h.trim().toLowerCase().replace(/[\s_-]+/g, '');
}

function closestStatus(value: string): DeliverableStatus {
  const lower = value.trim().toLowerCase().replace(/[\s_-]+/g, '');
  const match = STATUS_OPTIONS.find((s) => s.replace('-', '') === lower || s === lower);
  return match ?? 'not-started';
}

let importCounter = 0;

function parseRows(raw: Record<string, unknown>[]): DeliverableInstance[] {
  const results: DeliverableInstance[] = [];

  for (const row of raw) {
    const norm: Record<string, string> = {};
    for (const [key, val] of Object.entries(row)) {
      norm[normalizeHeader(key)] = String(val ?? '').trim();
    }

    const dealName = norm['dealname'] ?? norm['deal'] ?? '';
    const entityName = norm['entityname'] ?? norm['entity'] ?? '';

    // Skip comment/instruction rows and rows where both deal and entity are empty
    if (!dealName && !entityName) continue;
    if (dealName.startsWith('#') || entityName.startsWith('#')) continue;

    importCounter += 1;

    results.push({
      id: `dlv-imp-${Date.now()}-${importCounter}`,
      templateId: null,
      parentId: null,
      kind: 'line-item',
      title: dealName || entityName,
      order: results.length + 1,
      dealName,
      entityName,
      status: closestStatus(norm['status'] ?? ''),
      dueDate: norm['duedate'] ?? norm['due'] ?? null,
      notes: norm['notes'] ?? '',
      fileLink: norm['filelink'] ?? norm['link'] ?? norm['file'] ?? '',
      comments: [],
    });
  }

  return results;
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];

  const headers = lines[0].split(',').map((h) => h.replace(/^"|"$/g, '').trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (const ch of lines[i]) {
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? '';
    });
    rows.push(row);
  }

  return rows;
}

export function DeliverableImport({ onImport, onCancel }: DeliverableImportProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [parsed, setParsed] = useState<DeliverableInstance[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isParsingExcel, setIsParsingExcel] = useState(false);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setError(null);
    setFileName(file.name);
    setIsParsingExcel(false);

    const ext = file.name.split('.').pop()?.toLowerCase();
    const reader = new FileReader();

    if (ext === 'csv') {
      reader.onload = (ev) => {
        try {
          const text = ev.target?.result as string;
          const raw = parseCsv(text);
          const rows = parseRows(raw);
          if (rows.length === 0) {
            setError('No valid rows found. Ensure the file has "dealName" and/or "entityName" columns with at least one non-empty value.');
            setParsed([]);
          } else {
            setParsed(rows);
          }
        } catch {
          setError('Failed to parse CSV file.');
          setParsed([]);
        }
      };
      reader.readAsText(file);
    } else if (ext === 'xlsx' || ext === 'xls') {
      setIsParsingExcel(true);
      const XLSX = await import('xlsx');

      reader.onload = (ev) => {
        try {
          const data = new Uint8Array(ev.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const raw = XLSX.utils.sheet_to_json<Record<string, unknown>>(firstSheet);
          const rows = parseRows(raw);
          if (rows.length === 0) {
            setError('No valid rows found. Ensure the sheet has "dealName" and/or "entityName" columns with at least one non-empty value.');
            setParsed([]);
          } else {
            setParsed(rows);
          }
        } catch {
          setError('Failed to parse Excel file.');
          setParsed([]);
        } finally {
          setIsParsingExcel(false);
        }
      };

      reader.onerror = () => {
        setError('Failed to read Excel file.');
        setParsed([]);
        setIsParsingExcel(false);
      };

      reader.readAsArrayBuffer(file);
    } else {
      setError('Unsupported file type. Please use .csv, .xlsx, or .xls.');
      setParsed([]);
    }
  }

  return createPortal(
    <div className={styles.importOverlay} onClick={onCancel}>
      <div className={styles.importModal} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.importTitle}>Import deliverables</h2>
        <p className={styles.importSubtitle}>
          Upload a CSV or Excel file with columns: dealName (or deal), entityName (or entity), status, dueDate (or due), notes, fileLink (or link, file).
        </p>

        <input
          ref={fileRef}
          type="file"
          accept=".csv,.xlsx,.xls"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {parsed.length === 0 && (
          <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <button
              className={styles.importBtn}
              onClick={() => fileRef.current?.click()}
              type="button"
            >
              Choose file
            </button>
            <a
              href="/deliverable-import-template.csv"
              download="deliverable-import-template.csv"
              style={{ fontSize: 13, color: '#1678a2', fontWeight: 600, textDecoration: 'none' }}
            >
              Download template
            </a>
            {fileName && <span style={{ fontSize: 13, color: '#6a7f90' }}>{fileName}</span>}
          </div>
        )}

        {isParsingExcel && (
          <div className={styles.importSubtitle}>Loading Excel parser and reading workbook...</div>
        )}

        {error && <div className={styles.importError}>{error}</div>}

        {parsed.length > 0 && (
          <>
            <p style={{ fontSize: 13, color: '#345060', marginBottom: 10 }}>
              {parsed.length} deliverable{parsed.length === 1 ? '' : 's'} found in <strong>{fileName}</strong>
            </p>
            <table className={styles.importPreviewTable}>
              <thead>
                <tr>
                  <th>Deal</th>
                  <th>Entity</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Notes</th>
                  <th>File</th>
                </tr>
              </thead>
              <tbody>
                {parsed.map((row, i) => (
                  <tr key={i}>
                    <td>{row.dealName || '—'}</td>
                    <td>{row.entityName || '—'}</td>
                    <td>{row.status}</td>
                    <td>{row.dueDate || '—'}</td>
                    <td>{row.notes || '—'}</td>
                    <td>{row.fileLink || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className={styles.importActions}>
          <button className={styles.importBtnSecondary} onClick={onCancel} type="button">
            Cancel
          </button>
          {parsed.length > 0 && (
            <button
              className={styles.importBtn}
              onClick={() => onImport(parsed)}
              type="button"
            >
              Import {parsed.length} deliverable{parsed.length === 1 ? '' : 's'}
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
