import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { processService } from '../services';
import { RUN_STATUS_CONFIG } from '../config';
import { StatusBadge } from './shared/StatusBadge';
import { ProgressBar } from './shared/ProgressBar';
import styles from '../RulesModule.module.css';

type ProcessCapturePanelProps = {
  parentType: 'request' | 'entity' | 'investor' | 'controversy' | 'document';
  parentId: string;
};

/**
 * Embeddable Process Capture panel for use inside any module's detail page.
 *
 * Usage:
 *   <ProcessCapturePanel parentType="request" parentId={request.id} />
 *
 * Future AI integration point: this panel could surface AI-suggested next steps,
 * process health scores, and automation recommendations.
 */
export function ProcessCapturePanel({ parentType, parentId }: ProcessCapturePanelProps) {
  const navigate = useNavigate();
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState('');

  const summaries = processService.getProcessSummariesByParent(parentType, parentId);
  const templates = processService.getActiveTemplates();

  return (
    <div>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelTitle}>Process Capture</h3>
        <button
          className={styles.startRunButton}
          onClick={() => setShowTemplatePicker(!showTemplatePicker)}
          type="button"
        >
          + Start Process
        </button>
      </div>

      {showTemplatePicker && (
        <div className={styles.templatePicker}>
          <div className={styles.templatePickerLabel}>Select a template</div>
          <select
            className={styles.templatePickerSelect}
            value={selectedTemplateId}
            onChange={(e) => setSelectedTemplateId(e.target.value)}
          >
            <option value="">Choose template...</option>
            {templates.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.defaultSteps.length} steps)
              </option>
            ))}
          </select>
          <div className={styles.templatePickerActions}>
            <button
              className={styles.backButton}
              onClick={() => { setShowTemplatePicker(false); setSelectedTemplateId(''); }}
              type="button"
            >
              Cancel
            </button>
            <button
              className={styles.startRunButton}
              disabled={!selectedTemplateId}
              type="button"
              onClick={() => {
                // Future: create a new process run from the selected template
                // For now, close the picker
                setShowTemplatePicker(false);
                setSelectedTemplateId('');
              }}
            >
              Create Run
            </button>
          </div>
        </div>
      )}

      {summaries.length === 0 && !showTemplatePicker && (
        <div className={styles.emptyState}>
          No process runs linked to this record. Click "Start Process" to begin.
        </div>
      )}

      <div className={styles.panelRunList}>
        {summaries.map((s) => {
          const hasExceptions = s.exceptionCount > 0;

          return (
            <div key={s.runId} className={styles.panelRunItem}>
              <div className={styles.panelRunHeader}>
                <h4 className={styles.panelRunName}>{s.runName}</h4>
                <StatusBadge status={s.status} configMap={RUN_STATUS_CONFIG} />
              </div>

              <div className={styles.panelRunMeta}>
                {s.templateName && <span>Template: {s.templateName}</span>}
                <span>Owner: {s.owner}</span>
                {s.dueDate && <span>Due: {s.dueDate}</span>}
              </div>

              <div className={styles.panelRunProgress}>
                <ProgressBar
                  completed={s.completedSteps}
                  total={s.totalSteps}
                  hasExceptions={hasExceptions}
                />
              </div>

              <div className={styles.panelRunFooter}>
                <span style={{ fontSize: '0.76rem', color: '#6a7f90' }}>
                  {s.currentStepTitle && <>Current: {s.currentStepTitle}</>}
                  {hasExceptions && (
                    <> &middot; <span className={styles.exceptionCount}>{s.exceptionCount} exception{s.exceptionCount > 1 ? 's' : ''}</span></>
                  )}
                </span>
                <button
                  className={styles.panelRunLink}
                  onClick={() => navigate(`/rules/process/${s.runId}`)}
                  type="button"
                >
                  View details &rarr;
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
