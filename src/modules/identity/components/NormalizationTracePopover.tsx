import { useState } from 'react';
import type { NormalizationTraceEntry } from '../types';
import styles from '../IdentityModule.module.css';

type NormalizationTracePopoverProps = {
  trace: NormalizationTraceEntry[];
};

export function NormalizationTracePopover({ trace }: NormalizationTracePopoverProps) {
  const [open, setOpen] = useState(false);

  if (trace.length === 0) return null;

  return (
    <>
      <button className={styles.traceToggle} onClick={() => setOpen(!open)} type="button">
        {open ? 'Hide' : 'Show'} normalization trace ({trace.length} steps)
      </button>
      {open && (
        <div className={styles.tracePanel}>
          {trace.map((entry, i) => (
            <div key={i} className={styles.traceStep}>
              <p className={styles.traceStepName}>{entry.step}</p>
              {entry.transformations.length > 0 ? (
                <p className={styles.traceStepDetail}>
                  {entry.transformations.join(' → ')}
                </p>
              ) : (
                <p className={styles.traceStepDetail}>No changes</p>
              )}
              <p className={styles.traceStepDetail}>
                &quot;{entry.input}&quot; → &quot;{entry.output}&quot;
              </p>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
