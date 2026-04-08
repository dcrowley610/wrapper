import { useState } from 'react';
import type { DealRecord } from '../../types';
import styles from '../../DealsModule.module.css';

export function RecentActivityWidget({ deal }: { deal: DealRecord }) {
  const [expanded, setExpanded] = useState(false);
  const visibleEntries = expanded ? deal.activityLog : deal.activityLog.slice(0, 3);

  return (
    <div className={styles.sidePanel}>
      <div className={styles.widgetHeader}>
        <h3 className={styles.sidePanelTitle}>Recent activity</h3>
      </div>

      <div className={styles.activityTimeline}>
        {visibleEntries.map((entry, i) => (
          <div key={i} className={styles.activityEntry}>
            <div className={styles.activityDate}>{entry.date}</div>
            <div className={styles.activityAction}>{entry.action}</div>
            <div className={styles.activityActor}>{entry.actor}</div>
          </div>
        ))}
      </div>

      {deal.activityLog.length > 3 && (
        <button
          className={styles.widgetToggle}
          onClick={() => setExpanded(!expanded)}
          type="button"
        >
          {expanded ? 'Show less' : `Show all ${deal.activityLog.length} entries`}
        </button>
      )}
    </div>
  );
}
