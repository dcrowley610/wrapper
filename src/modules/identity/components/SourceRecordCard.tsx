import type { SourceObjectRecord } from '../types';
import { NormalizationTracePopover } from './NormalizationTracePopover';
import styles from '../IdentityModule.module.css';

type SourceRecordCardProps = {
  source: SourceObjectRecord;
};

export function SourceRecordCard({ source }: SourceRecordCardProps) {
  return (
    <div className={styles.sourceCard}>
      <h3 className={styles.sectionTitle}>Source Record</h3>
      <p className={styles.sourceLabel}>Raw Name</p>
      <p className={styles.sourceValue} style={{ fontWeight: 700, fontSize: 14 }}>{source.rawName}</p>

      <p className={styles.sourceLabel}>Source</p>
      <p className={styles.sourceValue}>
        {source.sourceSystem.replace(/_/g, ' ')}
        {source.sourceFileName ? ` — ${source.sourceFileName}` : ''}
        {source.sourceRowIndex > 0 ? ` (row ${source.sourceRowIndex})` : ''}
      </p>

      <p className={styles.sourceLabel}>Ingested</p>
      <p className={styles.sourceValue}>{source.ingestedDate} by {source.ingestedBy}</p>

      {Object.keys(source.rawAttributes).length > 0 && (
        <>
          <p className={styles.sourceLabel}>Raw Attributes</p>
          <dl className={styles.attrGrid}>
            {Object.entries(source.rawAttributes).map(([key, val]) => (
              <span key={key} style={{ display: 'contents' }}>
                <dt>{key}</dt>
                <dd>{val}</dd>
              </span>
            ))}
          </dl>
        </>
      )}

      {source.normalizedResult && (
        <>
          <p className={styles.sourceLabel} style={{ marginTop: 10 }}>Normalized</p>
          <p className={styles.sourceValue}>{source.normalizedResult.normalizedNameFull}</p>
          <NormalizationTracePopover trace={source.normalizedResult.trace} />
        </>
      )}
    </div>
  );
}
