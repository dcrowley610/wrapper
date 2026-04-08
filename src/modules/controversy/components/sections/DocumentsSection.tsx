import type { ControversyRecord } from '../../types';
import styles from '../../ControversyModule.module.css';

export function DocumentsSection({ record }: { record: ControversyRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Documents</h2>
      <p className={styles.sectionCopy}>
        Notices, response letters, supporting workpapers, and evidence packets.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {record.name}</span>
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
              <td>Original Notice</td>
              <td>Notice</td>
              <td>{record.noticeDate}</td>
              <td>Received</td>
            </tr>
            <tr>
              <td>Response Letter — Draft</td>
              <td>Correspondence</td>
              <td>{record.lastActivityDate}</td>
              <td>In Progress</td>
            </tr>
            <tr>
              <td>Supporting Workpapers</td>
              <td>Workpaper</td>
              <td>{record.lastActivityDate}</td>
              <td>Complete</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Documents module, filtered to this matter.
        </p>
      </div>
    </>
  );
}
