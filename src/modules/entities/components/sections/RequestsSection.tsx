import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

export function RequestsSection({ entity }: { entity: EntityRecord }) {
  return (
    <>
      <h2 className={styles.sectionTitle}>Requests</h2>
      <p className={styles.sectionCopy}>
        Filtered request list for this entity, showing open intake, assigned work, and due dates.
      </p>
      <div className={styles.capabilityPlaceholder}>
        <span className={styles.capabilityScopeBadge}>Filtered to: {entity.name}</span>
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
              <td>Year-end return preparation</td>
              <td>In Progress</td>
              <td>2026-04-15</td>
              <td>Sarah Chen</td>
            </tr>
            <tr>
              <td>State composite filing — NY</td>
              <td>Open</td>
              <td>2026-05-01</td>
              <td>James Park</td>
            </tr>
            <tr>
              <td>Notice response — IRS CP2000</td>
              <td>Pending Review</td>
              <td>2026-03-28</td>
              <td>David Kim</td>
            </tr>
          </tbody>
        </table>
        <p className={styles.capabilityFooter}>
          This section will connect to the shared Requests module, filtered to this entity.
        </p>
      </div>
    </>
  );
}
