import type { LinkedRecord } from '../../types';
import { LinkedRecordChip } from '../shared/LinkedRecordChip';
import styles from '../../RulesModule.module.css';

type LinkedRecordWidgetProps = {
  record: LinkedRecord;
};

export function LinkedRecordWidget({ record }: LinkedRecordWidgetProps) {
  return (
    <div className={styles.sidePanel}>
      <h4 className={styles.sidePanelTitle}>Linked Record</h4>
      <div style={{ marginTop: 8 }}>
        <LinkedRecordChip record={record} />
      </div>
    </div>
  );
}
