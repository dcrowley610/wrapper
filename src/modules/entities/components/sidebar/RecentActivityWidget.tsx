import { useState } from 'react';
import type { EntityRecord } from '../../types';
import styles from '../../EntitiesModule.module.css';

const COLLAPSED_COUNT = 5;

export function RecentActivityWidget({ entity }: { entity: EntityRecord }) {
  const [expanded, setExpanded] = useState(false);
  const entries = entity.activityLog;
  const visible = expanded ? entries : entries.slice(0, COLLAPSED_COUNT);
  const hasMore = entries.length > COLLAPSED_COUNT;

  return (
    <div className={styles.sidePanel}>
      <h3 className={styles.sidePanelTitle}>Recent activity</h3>
      <div className={styles.activityTimeline}>
        {visible.map((entry, i) => (
          <div key={i} className={styles.activityEntry}>
            <div className={styles.activityDate}>{entry.date}</div>
            <div className={styles.activityAction}>{entry.action}</div>
            <div className={styles.activityActor}>{entry.actor}</div>
          </div>
        ))}
      </div>
      {hasMore && (
        <button
          className={styles.widgetToggle}
          onClick={() => setExpanded((prev) => !prev)}
          type="button"
        >
          {expanded ? 'Show less' : `Show all (${entries.length})`}
        </button>
      )}
    </div>
  );
}
