import type { DocumentRecord } from '../types';
import styles from '../DocumentsModule.module.css';

type DocumentViewerProps = {
  document: DocumentRecord;
};

const MOCK_EXCEL_DATA = [
  { partner: 'Northlight Pension Trust', allocation: '22.4%', income: '$4,132,800', taxExempt: '$275,520', ftc: '$64,400' },
  { partner: 'Meridian Family Office', allocation: '18.1%', income: '$3,339,450', taxExempt: '$222,630', ftc: '$52,037' },
  { partner: 'Blue Harbor Feeder SPC', allocation: '31.2%', income: '$5,756,400', taxExempt: '$383,760', ftc: '$89,700' },
  { partner: 'Alex Rivera', allocation: '8.5%', income: '$1,568,250', taxExempt: '$104,550', ftc: '$24,437' },
  { partner: 'Other Partners (43)', allocation: '19.77%', income: '$3,647,100', taxExempt: '$243,540', ftc: '$56,926' },
];

export function DocumentViewer({ document }: DocumentViewerProps) {
  if (document.documentType === 'Excel') {
    return (
      <div>
        <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className={styles.pill}>{document.documentType}</span>
          <span style={{ fontWeight: 700, color: '#345060' }}>{document.fileName}</span>
        </div>
        <table className={styles.mockExcelGrid}>
          <thead>
            <tr>
              <th>Partner</th>
              <th>Allocation %</th>
              <th>Net Income</th>
              <th>Tax-Exempt</th>
              <th>FTC</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_EXCEL_DATA.map((row, i) => (
              <tr key={i}>
                <td>{row.partner}</td>
                <td>{row.allocation}</td>
                <td>{row.income}</td>
                <td>{row.taxExempt}</td>
                <td>{row.ftc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className={styles.mockViewer}>
      <div className={styles.mockViewerIcon}>PDF</div>
      <div className={styles.mockViewerFileName}>{document.fileName}</div>
      <div className={styles.mockViewerLabel}>
        Document preview — viewer integration pending
      </div>
    </div>
  );
}
