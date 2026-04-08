import { useState, useMemo } from 'react';
import { usePlatformContext } from '../../../platform/context';
import { dealsService } from '../../deals/services';
import { Graph } from '../components/Graph/Graph';
import { SidePanel } from '../components/SidePanel/SidePanel';
import { useExpandCollapse } from '../hooks/useExpandCollapse';
import { structuresApi } from '../services';
import type { EntityData } from '../types';
import styles from './StructuresPage.module.css';

export default function StructuresPage() {
  const { scopeSelection } = usePlatformContext();
  // Use JSON key to force re-mount when scope selection changes
  const scopeKey = JSON.stringify(scopeSelection);
  return <ScopedStructuresPage key={scopeKey} />;
}

function ScopedStructuresPage() {
  const { scopeSelection } = usePlatformContext();
  const [selectedEntity, setSelectedEntity] = useState<EntityData | null>(null);
  const [selectedDealId, setSelectedDealId] = useState<string>('all');

  const allDeals = useMemo(() => dealsService.getAccessibleDeals(), []);
  const dealId = selectedDealId === 'all' ? undefined : selectedDealId;
  const structureGraph = structuresApi.loadStructureGraph(scopeSelection, dealId);

  const {
    visibleNodes,
    visibleEdges,
    visibleAnnotationEdges,
    maxVisibleLevel,
    maxLevel,
    expandLevel,
    collapseLevel,
    expandAll,
    collapseAll,
  } = useExpandCollapse(
    structureGraph.nodes,
    structureGraph.ownershipEdges,
    structureGraph.annotationEdges,
  );

  return (
    <div className={styles.app}>
      <div className={styles.graphContainer}>
        <div style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
          <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#3a4f5c' }}>
            Deal
            <select
              style={{
                marginLeft: 6,
                padding: '4px 8px',
                fontSize: '0.82rem',
                borderRadius: 4,
                border: '1px solid #c5cfd6',
              }}
              value={selectedDealId}
              onChange={(e) => setSelectedDealId(e.target.value)}
            >
              <option value="all">All deals</option>
              {allDeals.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </label>
        </div>
        <Graph
          initialNodes={visibleNodes}
          initialEdges={visibleEdges}
          initialAnnotationEdges={visibleAnnotationEdges}
          maxVisibleLevel={maxVisibleLevel}
          maxLevel={maxLevel}
          onExpandLevel={expandLevel}
          onCollapseLevel={collapseLevel}
          onExpandAll={expandAll}
          onCollapseAll={collapseAll}
          onNodeSelect={setSelectedEntity}
        />
      </div>
      <SidePanel
        entity={selectedEntity}
        onClose={() => setSelectedEntity(null)}
      />
    </div>
  );
}
