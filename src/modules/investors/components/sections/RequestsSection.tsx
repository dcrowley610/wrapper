import type { InvestorRecord } from '../../types';
import styles from '../../InvestorsModule.module.css';

export function RequestsSection({ investor }: { investor: InvestorRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Requests</h2>
      <p className={styles.sectionCopy}>
        Investor-filtered workspace for open intake, assigned work, and due dates.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {investor.name}</span>
        <table className={styles.capabilityTable}>
          <thead>
            <tr>
              <th>Request</th>
              <th>Status</th>
              <th>Due</th>
              <th>Assigned To</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>K-1 package delivery</td>
              <td>In Progress</td>
              <td>2026-04-15</td>
              <td>Investor Tax</td>
            </tr>
            <tr>
              <td>Withholding cert follow-up</td>
              <td>Open</td>
              <td>2026-04-01</td>
              <td>Withholding Desk</td>
            </tr>
            <tr>
              <td>Capital account reconciliation</td>
              <td>Completed</td>
              <td>2026-03-15</td>
              <td>Fund Operations</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Requests module, filtered to this investor.
        </p>
      </div>
    </>
  );
}
