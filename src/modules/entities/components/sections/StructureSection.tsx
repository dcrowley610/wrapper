import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import type { EntityRecord } from '../../types';
import { entitiesService, ownershipService } from '../../services';
import { dealsService } from '../../../deals/services';
import styles from '../../EntitiesModule.module.css';

export function StructureSection({ entity }: { entity: EntityRecord }) {
  const navigate = useNavigate();
  const [selectedDealId, setSelectedDealId] = useState<string>('all');

  const allDeals = useMemo(() => dealsService.getAccessibleDeals(), []);
  const dealId = selectedDealId === 'all' ? undefined : selectedDealId;

  const directOwners = ownershipService.getDirectOwners(entity.id, dealId);
  const directChildren = ownershipService.getDirectChildren(entity.id, dealId);
  const allOwnership = ownershipService.computeOwnershipFor(entity.id, dealId);
  const indirectOwnership = allOwnership.filter((c) => c.relationshipKind === 'indirect');

  const resolveName = (id: string) => entitiesService.getAccessibleEntityById(id)?.name ?? id;
  const resolveDealName = (id: string) => {
    const deal = allDeals.find((d) => d.id === id);
    return deal?.name ?? id;
  };

  // Validation: group by (ownedEntityId, dealId)
  const ownershipValidation = useMemo(() => {
    const totals = new Map<string, number>();
    for (const rel of directOwners) {
      const key = `${rel.ownedEntityId}::${rel.dealId}`;
      totals.set(key, (totals.get(key) ?? 0) + rel.ownershipDecimal);
    }
    return totals;
  }, [directOwners]);

  return (
    <>
      <h2 className={styles.sectionTitle}>Structure context</h2>
      <p className={styles.sectionCopy}>
        This entity's ownership relationships within the organizational structure.
      </p>

      <label className={styles.filterField} style={{ marginBottom: 12, display: 'inline-block' }}>
        <span className={styles.fieldLabel}>Deal</span>
        <select
          className={styles.select}
          value={selectedDealId}
          onChange={(e) => setSelectedDealId(e.target.value)}
        >
          <option value="all">All deals</option>
          {allDeals.map((d) => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      </label>

      <dl className={styles.definitionList}>
        <dt>Structure Role</dt>
        <dd>{entity.structureRole}</dd>
      </dl>

      <h3 className={styles.sectionTitle} style={{ fontSize: '0.9rem', marginTop: 20 }}>Direct Owners</h3>
      {(() => {
        if (directOwners.length === 0) return null;
        // Show per-deal validation banners
        const entries = Array.from(ownershipValidation.entries());
        return entries.map(([compositeKey, total]) => {
          const [, ownerDealId] = compositeKey.split('::');
          const isComplete = Math.abs(total - 1) <= 0.001;
          return (
            <div key={compositeKey} style={{
              padding: '8px 12px',
              marginBottom: 8,
              background: isComplete ? '#d4edda' : '#fef3cd',
              border: `1px solid ${isComplete ? '#8cc9a0' : '#e6c964'}`,
              borderRadius: 6,
              fontSize: '0.82rem',
              color: isComplete ? '#1a5928' : '#6b5900',
            }}>
              {resolveName(entity.id)} ({resolveDealName(ownerDealId)}): <strong>{(total * 100).toFixed(1)}%</strong>
              {isComplete ? ' — fully owned' : ` — missing ${((1 - total) * 100).toFixed(1)}%`}
            </div>
          );
        });
      })()}
      {directOwners.length > 0 ? (
        <table className={styles.recordTable}>
          <thead>
            <tr>
              <th>Deal</th>
              <th>Owner</th>
              <th>Ownership %</th>
            </tr>
          </thead>
          <tbody>
            {directOwners.map((rel) => (
              <tr key={rel.id}>
                <td>{resolveDealName(rel.dealId)}</td>
                <td style={{ fontWeight: 600 }}>{resolveName(rel.ownerEntityId)}</td>
                <td>{(rel.ownershipDecimal * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ fontSize: '0.82rem', color: '#8a9ba8' }}>No direct owners — top-level entity</p>
      )}

      <h3 className={styles.sectionTitle} style={{ fontSize: '0.9rem', marginTop: 20 }}>Direct Subsidiaries</h3>
      {directChildren.length > 0 ? (
        <table className={styles.recordTable}>
          <thead>
            <tr>
              <th>Deal</th>
              <th>Entity</th>
              <th>Ownership %</th>
            </tr>
          </thead>
          <tbody>
            {directChildren.map((rel) => (
              <tr key={rel.id}>
                <td>{resolveDealName(rel.dealId)}</td>
                <td style={{ fontWeight: 600 }}>{resolveName(rel.ownedEntityId)}</td>
                <td>{(rel.ownershipDecimal * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ fontSize: '0.82rem', color: '#8a9ba8' }}>No subsidiaries</p>
      )}

      {indirectOwnership.length > 0 && (
        <>
          <h3 className={styles.sectionTitle} style={{ fontSize: '0.9rem', marginTop: 20 }}>Indirect Ownership</h3>
          <table className={styles.recordTable}>
            <thead>
              <tr>
                <th>Deal</th>
                <th>Owner</th>
                <th>Owned</th>
                <th>Effective %</th>
                <th>Path</th>
              </tr>
            </thead>
            <tbody>
              {indirectOwnership.map((rel, i) => (
                <tr key={`${rel.dealId}-${rel.ownerEntityId}-${rel.ownedEntityId}-${i}`}>
                  <td>{resolveDealName(rel.dealId)}</td>
                  <td>{resolveName(rel.ownerEntityId)}</td>
                  <td>{resolveName(rel.ownedEntityId)}</td>
                  <td>{(rel.computedOwnershipDecimal * 100).toFixed(1)}%</td>
                  <td style={{ fontSize: '0.8rem', color: '#587082' }}>
                    {rel.pathEntityIds.map(resolveName).join(' \u2192 ')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <div className={styles.placeholderBlock} style={{ marginTop: 20 }}>
        <p className={styles.placeholderTitle}>Structure Summary</p>
        <p className={styles.placeholderText}>{entity.structureSummary}</p>
      </div>
      <button className={styles.structureAction} onClick={() => navigate('/structures')} type="button">
        View full structure
      </button>
    </>
  );
}
