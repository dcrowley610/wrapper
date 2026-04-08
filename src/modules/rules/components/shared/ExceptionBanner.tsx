import styles from '../../RulesModule.module.css';

type ExceptionBannerProps = {
  reason: string;
};

export function ExceptionBanner({ reason }: ExceptionBannerProps) {
  return (
    <div className={styles.exceptionBanner}>
      <div className={styles.exceptionLabel}>Exception</div>
      {reason}
    </div>
  );
}
