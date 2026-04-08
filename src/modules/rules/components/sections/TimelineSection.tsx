import type { ProcessRun } from '../../types';
import { processService } from '../../services';
import { ActivityTimeline } from '../shared/ActivityTimeline';
import styles from '../../RulesModule.module.css';

type TimelineSectionProps = {
  run: ProcessRun;
};

export function TimelineSection({ run }: TimelineSectionProps) {
  const events = processService.getEventsByRunId(run.id);

  return (
    <div>
      <h3 className={styles.sectionTitle}>Activity Timeline</h3>
      <p className={styles.sectionCopy}>
        Chronological record of all actions taken on this process run.
      </p>
      <ActivityTimeline events={events} />
    </div>
  );
}
