import type { SourceObjectRecord } from '../types';
import styles from '../IdentityModule.module.css';

type SourceRecordCardSimpleProps = {
  source: SourceObjectRecord;
};

export function SourceRecordCardSimple({ source }: SourceRecordCardSimpleProps) {
  return (
    <div className={styles.sourceCard} style={{ padding: 10 }}>
      <p className={styles.sourceLabel}>Source</p>
      <p className={styles.sourceValue} style={{ fontWeight: 600 }}>{source.rawName}</p>
      <p style={{ color: '#6a7f90', fontSize: 11, margin: 0 }}>
        {source.sourceSystem.replace(/_/g, ' ')}
        {source.sourceFileName ? ` — ${source.sourceFileName}` : ''}
        &nbsp;&middot;&nbsp;{source.ingestedDate}
      </p>
    </div>
  );
}
