import { OWNER_OPTIONS } from '../../config';
import { requestPlaybooksService } from '../../services';
import styles from '../../RequestsModule.module.css';

type AssignmentWidgetProps = {
  owner: string;
  playbookId: string | null;
  onOwnerChange: (owner: string) => void;
};

export function AssignmentWidget({ owner, playbookId, onOwnerChange }: AssignmentWidgetProps) {
  const playbookName = playbookId
    ? (requestPlaybooksService.getById(playbookId)?.name ?? playbookId)
    : 'None';

  return (
    <div className={styles.sidePanel}>
      <h3 className={styles.sidePanelTitle}>Assignment</h3>
      <div className={styles.assignmentRow}>
        <label className={styles.fieldLabel}>Owner</label>
        <select
          className={styles.assignmentSelect}
          value={owner}
          onChange={(e) => onOwnerChange(e.target.value)}
        >
          {OWNER_OPTIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
      <dl className={styles.definitionList}>
        <dt>Playbook</dt>
        <dd>{playbookName}</dd>
      </dl>
    </div>
  );
}
