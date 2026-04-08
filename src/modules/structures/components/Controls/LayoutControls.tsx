import { Panel } from '@xyflow/react';
import styles from './LayoutControls.module.css';

interface LayoutControlsProps {
  maxVisibleLevel: number;
  maxLevel: number;
  onExpandLevel: () => void;
  onCollapseLevel: () => void;
  onExpandAll: () => void;
  onCollapseAll: () => void;
  onFitView: () => void;
  onExportPptx: () => void;
}

export function LayoutControls(props: LayoutControlsProps) {
  return (
    <Panel position="top-left" className={styles.panel}>
      <div className={styles.group}>
        <span className={styles.levelLabel}>
          Level {props.maxVisibleLevel} / {props.maxLevel}
        </span>
        <button
          className={styles.button}
          onClick={props.onCollapseLevel}
          disabled={props.maxVisibleLevel <= 0}
        >
          Collapse
        </button>
        <button
          className={styles.button}
          onClick={props.onExpandLevel}
          disabled={props.maxVisibleLevel >= props.maxLevel}
        >
          Expand
        </button>
        <button className={styles.button} onClick={props.onCollapseAll}>
          Root Only
        </button>
        <button className={styles.button} onClick={props.onExpandAll}>
          Show All
        </button>
      </div>
      <div className={styles.divider} />
      <button className={styles.button} onClick={props.onFitView}>
        Fit to Screen
      </button>
      <div className={styles.divider} />
      <button className={styles.button} onClick={props.onExportPptx}>
        Export PPTX
      </button>
    </Panel>
  );
}
