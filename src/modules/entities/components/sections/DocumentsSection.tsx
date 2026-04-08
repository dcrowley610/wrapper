import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

export function DocumentsSection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Documents</h2>
      <p className={styles.sectionCopy}>
        Document workspace for returns, workpapers, notices, governing docs, and evidence packets.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {entity.name}</span>
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
              <td>2025 Federal Return Draft</td>
              <td>Tax Return</td>
              <td>2026-03-10</td>
              <td>Draft</td>
            </tr>
            <tr>
              <td>Operating Agreement</td>
              <td>Governing Doc</td>
              <td>2025-12-01</td>
              <td>Final</td>
            </tr>
            <tr>
              <td>IRS Notice CP2000</td>
              <td>Notice</td>
              <td>2026-02-18</td>
              <td>Action Required</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Documents module, filtered to this entity.
        </p>
      </div>
    </>
  );
}
