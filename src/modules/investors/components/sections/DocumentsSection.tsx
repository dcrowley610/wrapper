import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

export function DocumentsSection({ investor }: { investor: InvestorRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Documents</h2>
      <p className={styles.sectionCopy}>
        W-8s, agreements, notices, and support packets for this investor.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {investor.name}</span>
        <table className={styles.capabilityTable}>
          <thead>
            <tr>
              <th>Document</th>
              <th>Type</th>
              <th>Updated</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{investor.w8FormType || 'W-8BEN'}</td>
              <td>Withholding Cert</td>
              <td>2025-11-01</td>
              <td>Active</td>
            </tr>
            <tr>
              <td>Subscription Agreement</td>
              <td>Agreement</td>
              <td>2024-06-15</td>
              <td>Final</td>
            </tr>
            <tr>
              <td>2025 K-1 Draft</td>
              <td>Tax Document</td>
              <td>2026-03-10</td>
              <td>Draft</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Documents module, filtered to this investor.
        </p>
      </div>
    </>
  );
}
