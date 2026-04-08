import styles from '../../RulesModule.module.css';

type StatusBadgeProps = {
  status: string;
  configMap: Record<string, { label: string; colorClass: string }>;
};

export function StatusBadge({ status, configMap }: StatusBadgeProps) {
  const config = configMap[status];
  if (!config) return <span className={styles.statusBadge}>{status}</span>;

  return (
    <span className={`${styles.statusBadge} ${styles[config.colorClass] ?? ''}`}>
      {config.label}
    </span>
  );
}
