import type { ReconciliationTask, SourceObjectRecord } from '../types';
import styles from '../IdentityModule.module.css';

type TaskListSectionProps = {
  tasks: ReconciliationTask[];
  sourceRecords: Map<string, SourceObjectRecord>;
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
};

function domainBadgeClass(domain: string): string {
  if (domain === 'entity') return styles.badgeEntity;
  if (domain === 'investor') return styles.badgeInvestor;
  return styles.badgeDeal;
}

function tierBadgeClass(tier: string): string {
  if (tier === 'auto_match') return styles.badgeAutoMatch;
  if (tier === 'suggested') return styles.badgeSuggested;
  if (tier === 'review_required') return styles.badgeReview;
  return styles.badgeLikelyNew;
}

function priorityBadgeClass(priority: string): string {
  if (priority === 'high') return styles.badgeHigh;
  if (priority === 'medium') return styles.badgeMedium;
  return styles.badgeLow;
}

function statusBadgeClass(status: string): string {
  if (status === 'resolved') return styles.badgeResolved;
  if (status === 'deferred') return styles.badgeDeferred;
  return styles.badgeOpen;
}

function scoreClass(score: number): string {
  if (score >= 85) return styles.scoreHigh;
  if (score >= 70) return styles.scoreMedium;
  return styles.scoreLow;
}

export function TaskListSection({ tasks, sourceRecords, selectedTaskId, onSelectTask }: TaskListSectionProps) {
  if (tasks.length === 0) {
    return <div className={styles.emptyState}>No reconciliation tasks match your filters.</div>;
  }

  return (
    <div>
      {tasks.map((task) => {
        const source = sourceRecords.get(task.sourceRecordId);
        const isActive = task.id === selectedTaskId;
        return (
          <div
            key={task.id}
            className={`${styles.taskCard} ${isActive ? styles.taskCardActive : ''}`}
            onClick={() => onSelectTask(task.id)}
          >
            <p className={styles.taskName}>{source?.rawName || task.sourceRecordId}</p>
            <div className={styles.taskMeta}>
              <span className={`${styles.badge} ${domainBadgeClass(task.domain)}`}>{task.domain}</span>
              <span className={`${styles.badge} ${statusBadgeClass(task.status)}`}>{task.status.replace('_', ' ')}</span>
              <span className={`${styles.badge} ${priorityBadgeClass(task.priority)}`}>{task.priority}</span>
              {task.topCandidateScore > 0 && (
                <span className={`${styles.scoreChip} ${scoreClass(task.topCandidateScore)}`}>
                  {task.topCandidateScore}
                </span>
              )}
              <span className={`${styles.badge} ${tierBadgeClass(task.topCandidateTier)}`}>
                {task.topCandidateTier.replace(/_/g, ' ')}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
