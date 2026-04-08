import styles from '../../RulesModule.module.css';

type ProgressBarProps = {
  completed: number;
  total: number;
  hasExceptions?: boolean;
  showLabel?: boolean;
};

export function ProgressBar({ completed, total, hasExceptions = false, showLabel = true }: ProgressBarProps) {
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div>
      <div className={styles.progressBarTrack}>
        <div
          className={`${styles.progressBarFill} ${hasExceptions ? styles.progressBarFillException : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <div className={styles.progressLabel}>
          {completed}/{total} steps ({pct}%)
        </div>
      )}
    </div>
  );
}
