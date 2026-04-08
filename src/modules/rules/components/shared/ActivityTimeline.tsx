import type { ProcessEvent } from '../../types';
import styles from '../../RulesModule.module.css';

type ActivityTimelineProps = {
  events: ProcessEvent[];
};

export function ActivityTimeline({ events }: ActivityTimelineProps) {
  if (events.length === 0) {
    return <div className={styles.emptyState}>No activity recorded yet.</div>;
  }

  const sorted = [...events].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );

  return (
    <div className={styles.activityTimeline}>
      {sorted.map((evt) => (
        <div key={evt.id} className={styles.activityEntry}>
          <div className={styles.activityDate}>
            {new Date(evt.timestamp).toLocaleDateString()} &middot;{' '}
            {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className={styles.activityAction}>{evt.description}</div>
          <div className={styles.activityActor}>{evt.actor}</div>
        </div>
      ))}
    </div>
  );
}
