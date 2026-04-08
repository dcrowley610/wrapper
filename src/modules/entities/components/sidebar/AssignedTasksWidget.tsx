import styles from '../../EntitiesModule.module.css';

type Task = {
  title: string;
  assignee: string;
  due: string;
  status: string;
};

const MOCK_TASKS: Task[] = [
  { title: 'Prepare K-1 allocations', assignee: 'Sarah Chen', due: '2026-04-15', status: 'In Progress' },
  { title: 'File NY composite return', assignee: 'James Park', due: '2026-05-01', status: 'Open' },
  { title: 'Review IRS CP2000 response', assignee: 'David Kim', due: '2026-03-28', status: 'Pending Review' },
];

export function AssignedTasksWidget() {
  return (
    <div className={styles.sidePanel}>
      <h3 className={styles.sidePanelTitle}>Assigned tasks</h3>
      <div className={styles.taskList}>
        {MOCK_TASKS.map((task, i) => (
          <div key={i} className={styles.taskItem}>
            <div className={styles.taskTitle}>{task.title}</div>
            <div className={styles.taskMeta}>
              {task.assignee} &middot; Due {task.due}
            </div>
            <span className={styles.taskStatus}>{task.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
