import { useState } from 'react';
import { Panel } from '@xyflow/react';
import { getAllClassifications } from '../../data/entityClassifications';
import { getAllJurisdictionFills, getAllBorderOverlays, getAllConnectionStyles } from '../../data/annotationStyles';
import { EntityShapeRenderer } from '../nodes/EntityShapeRenderer';
import styles from './Legend.module.css';

const LEGEND_SWATCH_SIZES: Record<string, { w: number; h: number }> = {
  partnership: { w: 28, h: 24 },
  asset: { w: 32, h: 20 },
};
const DEFAULT_SWATCH = { w: 32, h: 22 };

export function Legend() {
  const [collapsed, setCollapsed] = useState(true);
  const classifications = getAllClassifications();
  const jurisdictionFills = getAllJurisdictionFills();
  const borderOverlays = getAllBorderOverlays();
  const connectionStyles = getAllConnectionStyles();

  const hasJurisdictions = Object.keys(jurisdictionFills).length > 0;
  const hasBorderOverlays = Object.keys(borderOverlays).length > 0;
  const hasConnections = Object.keys(connectionStyles).length > 0;

  return (
    <Panel position="bottom-right" className={styles.panel}>
      <button
        className={styles.toggle}
        onClick={() => setCollapsed((c) => !c)}
      >
        Legend {collapsed ? '+' : '-'}
      </button>
      {!collapsed && (
        <div className={styles.content}>
          {/* Section 1: Fixed Entity Types */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Entity Types</h4>
            {Object.entries(classifications).map(([key, cls]) => {
              const size = LEGEND_SWATCH_SIZES[key] ?? DEFAULT_SWATCH;
              return (
                <div key={key} className={styles.item}>
                  <div className={styles.swatchWrap}>
                    <EntityShapeRenderer
                      classificationKey={key}
                      width={size.w}
                      height={size.h}
                      borderColor="#1e293b"
                      fillColor="white"
                    />
                  </div>
                  <span className={styles.description}>{cls.label}</span>
                </div>
              );
            })}
          </div>

          <div className={styles.divider} />

          {/* Section 2: Fixed Ownership */}
          <div className={styles.section}>
            <h4 className={styles.sectionTitle}>Ownership</h4>
            <div className={styles.item}>
              <svg className={styles.lineSwatch} viewBox="0 0 32 8">
                <line x1="0" y1="4" x2="32" y2="4" stroke="#334155" strokeWidth="2" />
              </svg>
              <span className={styles.description}>Ownership connection</span>
            </div>
          </div>

          {/* Section 3: Jurisdiction Colors */}
          {hasJurisdictions && (
            <>
              <div className={styles.divider} />
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Jurisdiction</h4>
                <div className={styles.item}>
                  <div className={styles.jurisdictionSwatch} style={{ backgroundColor: 'white' }} />
                  <span className={styles.description}>US (default)</span>
                </div>
                {Object.entries(jurisdictionFills).map(([key, jf]) => (
                  <div key={key} className={styles.item}>
                    <div className={styles.jurisdictionSwatch} style={{ backgroundColor: jf.fillColor }} />
                    <span className={styles.description}>{jf.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Section 4: Border Overlays */}
          {hasBorderOverlays && (
            <>
              <div className={styles.divider} />
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Border Overlays</h4>
                {Object.entries(borderOverlays).map(([key, bo]) => (
                  <div key={key} className={styles.item}>
                    <div
                      className={styles.borderSwatch}
                      style={{ borderColor: bo.borderColor }}
                    />
                    <span className={styles.description}>{bo.label}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Section 5: Additional Connections */}
          {hasConnections && (
            <>
              <div className={styles.divider} />
              <div className={styles.section}>
                <h4 className={styles.sectionTitle}>Additional Connections</h4>
                {Object.entries(connectionStyles).map(([key, cs]) => (
                  <div key={key} className={styles.item}>
                    <svg className={styles.lineSwatch} viewBox="0 0 32 8">
                      <line
                        x1="0"
                        y1="4"
                        x2="32"
                        y2="4"
                        stroke={cs.lineColor}
                        strokeWidth="2"
                        strokeDasharray={cs.lineStyle === 'dashed' ? '4 2' : undefined}
                      />
                    </svg>
                    <span className={styles.description}>{cs.description}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </Panel>
  );
}
