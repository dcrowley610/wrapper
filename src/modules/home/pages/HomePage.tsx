import { Fragment, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePlatformContext } from '../../../platform/context';
import { fundsService } from '../services/funds.service';
import { entitiesService } from '../../entities/services/entities.service';
import { dealsService } from '../../deals/services/deals.service';
import { useFundsVersion } from '../hooks/useFundsVersion';
import { useEntitiesVersion } from '../../entities/hooks/useEntitiesVersion';
import { useDealsVersion } from '../../deals/hooks/useDealsVersion';
import { RecordCommentModal } from '../../../components/RecordCommentModal/RecordCommentModal';
import styles from '../HomeModule.module.css';

import type { EntityRecord } from '../../entities/types/entity.types';

type SortKey = 'fundFamily' | 'fund' | 'entities' | 'deals';
type SortDir = 'asc' | 'desc';
type FormMode = 'none' | 'addFamily' | 'addFund' | 'editFamily' | 'editFund';

const CATEGORY_ORDER: EntityRecord['category'][] = ['Fund Vehicle', 'Holding Company', 'Blocker', 'Operating Company', 'Third-Party'];

function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export default function HomePage() {
  const navigate = useNavigate();
  const { setScopeSelection, scopeSelection } = usePlatformContext();
  const [sortKey, setSortKey] = useState<SortKey>('fundFamily');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const fundsVersion = useFundsVersion();
  const entitiesVersion = useEntitiesVersion();
  const dealsVersion = useDealsVersion();

  const [expandedFundId, setExpandedFundId] = useState<string | null>(null);

  // Form state
  const [formMode, setFormMode] = useState<FormMode>('none');
  const [editTargetId, setEditTargetId] = useState<string | null>(null);
  const [commentTargetId, setCommentTargetId] = useState<string | null>(null);
  const [commentTargetType, setCommentTargetType] = useState<'fund' | 'family'>('fund');
  const [familyName, setFamilyName] = useState('');
  const [familyShortName, setFamilyShortName] = useState('');
  const [familyDesc, setFamilyDesc] = useState('');
  const [fundName, setFundName] = useState('');
  const [fundShortName, setFundShortName] = useState('');
  const [fundFamilyId, setFundFamilyId] = useState('');

  const families = fundsService.getFundFamilies();
  const funds = fundsService.getFunds();

  const rows = useMemo(() => {
    const allEntities = entitiesService.getAccessibleEntities();
    const allDeals = dealsService.getAccessibleDeals();

    const mapped = funds.map((fund) => {
      const family = families.find((ff) => ff.id === fund.fundFamilyId);
      const fundDealIds = allDeals.filter(d => d.scopeIds.includes(fund.scopeId)).map(d => d.id);
      const fundEntities = allEntities.filter(e =>
        e.associatedFundIds.includes(fund.id) ||
        e.associatedDealIds.some(did => fundDealIds.includes(did))
      );
      fundEntities.sort((a, b) => {
        const ai = CATEGORY_ORDER.indexOf(a.category);
        const bi = CATEGORY_ORDER.indexOf(b.category);
        return ai - bi;
      });
      return {
        id: fund.id,
        fundFamily: family?.name ?? '',
        fundFamilyId: fund.fundFamilyId,
        fund: fund.name,
        fundShortName: fund.shortNameFund,
        scopeId: fund.scopeId,
        entityCount: fundEntities.length,
        entities: fundEntities,
        dealCount: allDeals.filter(d => d.scopeIds.includes(fund.scopeId)).length,
      };
    });

    mapped.sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'fundFamily':
          cmp = a.fundFamily.localeCompare(b.fundFamily);
          break;
        case 'fund':
          cmp = a.fund.localeCompare(b.fund);
          break;
        case 'entities':
          cmp = a.entityCount - b.entityCount;
          break;
        case 'deals':
          cmp = a.dealCount - b.dealCount;
          break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return mapped;
  }, [funds, families, sortKey, sortDir, fundsVersion, entitiesVersion, dealsVersion]);

  function closeForm() {
    setFormMode('none');
    setEditTargetId(null);
    setFamilyName('');
    setFamilyShortName('');
    setFamilyDesc('');
    setFundName('');
    setFundShortName('');
    setFundFamilyId('');
  }

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  }

  function handleFundClick(scopeId: string) {
    setScopeSelection({ ...scopeSelection, fundIds: [scopeId] });
  }

  function sortIndicator(key: SortKey) {
    if (sortKey !== key) return '';
    return sortDir === 'asc' ? ' \u25B2' : ' \u25BC';
  }

  function handleDeleteFund(id: string) {
    if (window.confirm('Delete this fund?')) {
      fundsService.deleteFund(id);
    }
  }

  function handleFundComment(id: string) {
    setCommentTargetId(id);
    setCommentTargetType('fund');
  }

  function handleDeleteFamily(id: string) {
    if (window.confirm('Delete this fund family?')) {
      fundsService.deleteFundFamily(id);
    }
  }

  function handleFamilyComment(id: string) {
    setCommentTargetId(id);
    setCommentTargetType('family');
  }

  // Add handlers
  function startAddFamily() {
    closeForm();
    setFormMode('addFamily');
  }

  function startAddFund() {
    closeForm();
    setFormMode('addFund');
    if (families.length > 0) setFundFamilyId(families[0].id);
  }

  function handleSaveAddFamily() {
    const id = slugify(familyName);
    if (!id || !familyName.trim()) return;
    fundsService.addFundFamily({
      id,
      name: familyName.trim(),
      shortName: familyShortName.trim(),
      description: familyDesc.trim(),
      comments: [],
    });
    closeForm();
  }

  function handleSaveAddFund() {
    const id = slugify(fundName);
    if (!id || !fundName.trim() || !fundFamilyId) return;
    fundsService.addFund({
      id,
      name: fundName.trim(),
      shortNameFund: fundShortName.trim(),
      fundFamilyId,
      scopeId: id,
      comments: [],
    });
    closeForm();
  }

  // Edit handlers
  function startEditFund(fundId: string) {
    const fund = funds.find((f) => f.id === fundId);
    if (!fund) return;
    closeForm();
    setFormMode('editFund');
    setEditTargetId(fundId);
    setFundName(fund.name);
    setFundShortName(fund.shortNameFund);
    setFundFamilyId(fund.fundFamilyId);
  }

  function startEditFamily(familyId: string) {
    const family = families.find((ff) => ff.id === familyId);
    if (!family) return;
    closeForm();
    setFormMode('editFamily');
    setEditTargetId(familyId);
    setFamilyName(family.name);
    setFamilyShortName(family.shortName);
    setFamilyDesc(family.description);
  }

  function handleSaveEditFund() {
    if (!editTargetId || !fundName.trim() || !fundFamilyId) return;
    fundsService.updateFund(editTargetId, {
      name: fundName.trim(),
      shortNameFund: fundShortName.trim(),
      fundFamilyId,
    });
    closeForm();
  }

  function handleSaveEditFamily() {
    if (!editTargetId || !familyName.trim()) return;
    fundsService.updateFundFamily(editTargetId, {
      name: familyName.trim(),
      shortName: familyShortName.trim(),
      description: familyDesc.trim(),
    });
    closeForm();
  }

  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCard}>
          <div className={styles.eyebrow}>Funds</div>
          <h1 className={styles.title}>Fund families and funds at a glance.</h1>
          <p className={styles.lead}>
            Click a fund to set the global scope filter for downstream views.
          </p>
        </div>
      </section>

      <section className={styles.workspace}>

        <div className={styles.addActions}>
          <button className={styles.addButton} onClick={startAddFamily} type="button">
            + Fund Family
          </button>
          <button className={styles.addButton} onClick={startAddFund} type="button">
            + Fund
          </button>
        </div>

        {/* Add / Edit Fund Family form */}
        {(formMode === 'addFamily' || formMode === 'editFamily') && (
          <div className={styles.addForm}>
            <h3 className={styles.addFormTitle}>
              {formMode === 'addFamily' ? 'New Fund Family' : 'Edit Fund Family'}
            </h3>
            <div className={styles.addFormField}>
              <span className={styles.addFormLabel}>Name</span>
              <input
                className={styles.addFormInput}
                value={familyName}
                onChange={(e) => setFamilyName(e.target.value)}
                placeholder="e.g. Brookfield Infrastructure Partners"
                autoFocus
              />
            </div>
            <div className={styles.addFormField}>
              <span className={styles.addFormLabel}>Short Name</span>
              <input
                className={styles.addFormInput}
                value={familyShortName}
                onChange={(e) => setFamilyShortName(e.target.value)}
                placeholder="e.g. BIP"
              />
            </div>
            <div className={styles.addFormField}>
              <span className={styles.addFormLabel}>Description</span>
              <input
                className={styles.addFormInput}
                value={familyDesc}
                onChange={(e) => setFamilyDesc(e.target.value)}
                placeholder="Brief description of this fund family"
              />
            </div>
            <div className={styles.addFormActions}>
              <button
                className={styles.saveButton}
                onClick={formMode === 'addFamily' ? handleSaveAddFamily : handleSaveEditFamily}
                disabled={!familyName.trim()}
                type="button"
              >
                Save
              </button>
              <button className={styles.cancelButton} onClick={closeForm} type="button">
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Add / Edit Fund form */}
        {(formMode === 'addFund' || formMode === 'editFund') && (
          <div className={styles.addForm}>
            <h3 className={styles.addFormTitle}>
              {formMode === 'addFund' ? 'New Fund' : 'Edit Fund'}
            </h3>
            <div className={styles.addFormField}>
              <span className={styles.addFormLabel}>Fund Family</span>
              <select
                className={styles.addFormSelect}
                value={fundFamilyId}
                onChange={(e) => setFundFamilyId(e.target.value)}
              >
                {families.map((ff) => (
                  <option key={ff.id} value={ff.id}>{ff.name}</option>
                ))}
              </select>
            </div>
            <div className={styles.addFormField}>
              <span className={styles.addFormLabel}>Fund Name</span>
              <input
                className={styles.addFormInput}
                value={fundName}
                onChange={(e) => setFundName(e.target.value)}
                placeholder="e.g. BREP XI"
                autoFocus
              />
            </div>
            <div className={styles.addFormField}>
              <span className={styles.addFormLabel}>Fund Short Name</span>
              <input
                className={styles.addFormInput}
                value={fundShortName}
                onChange={(e) => setFundShortName(e.target.value)}
                placeholder="e.g. BREP IX"
              />
            </div>
            <div className={styles.addFormActions}>
              <button
                className={styles.saveButton}
                onClick={formMode === 'addFund' ? handleSaveAddFund : handleSaveEditFund}
                disabled={!fundName.trim() || !fundFamilyId}
                type="button"
              >
                Save
              </button>
              <button className={styles.cancelButton} onClick={closeForm} type="button">
                Cancel
              </button>
            </div>
          </div>
        )}

        <table className={styles.fundTable}>
          <thead>
            <tr>
              <th style={{ width: 28 }}></th>
              <th className={styles.sortableHeader} onClick={() => handleSort('fundFamily')}>
                Fund Family{sortIndicator('fundFamily')}
              </th>
              <th className={styles.sortableHeader} onClick={() => handleSort('fund')}>
                Fund{sortIndicator('fund')}
              </th>
              <th className={styles.sortableHeader} onClick={() => handleSort('entities')}>
                Entities{sortIndicator('entities')}
              </th>
              <th className={styles.sortableHeader} onClick={() => handleSort('deals')}>
                Deals{sortIndicator('deals')}
              </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const isExpanded = expandedFundId === row.id;
              return (
                <Fragment key={row.scopeId}>
                  <tr
                    className={`${styles.fundTableRow} ${scopeSelection.fundIds.length === 1 && scopeSelection.fundIds[0] === row.scopeId ? styles.activeFundRow : ''}`}
                    onClick={() => handleFundClick(row.scopeId)}
                  >
                    <td style={{ width: 28, padding: '3px 4px' }}>
                      {row.entityCount > 0 && (
                        <button
                          className={styles.chevronBtn}
                          onClick={(e) => { e.stopPropagation(); setExpandedFundId(isExpanded ? null : row.id); }}
                          type="button"
                          title={isExpanded ? 'Collapse entities' : 'Expand entities'}
                        >
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: isExpanded ? 'rotate(90deg)' : 'none', transition: 'transform 150ms' }}>
                            <path d="M6 4l4 4-4 4" />
                          </svg>
                        </button>
                      )}
                    </td>
                    <td>{row.fundFamily}</td>
                    <td>
                      <div>{row.fund}</div>
                      {row.fundShortName && <div style={{ fontSize: 10, color: '#6a7f90', marginTop: 2 }}>{row.fundShortName}</div>}
                    </td>
                    <td className={styles.countCell}>
                      <button
                        className={styles.countLink}
                        onClick={(e) => { e.stopPropagation(); handleFundClick(row.scopeId); navigate('/entities'); }}
                        type="button"
                      >
                        {row.entityCount}
                      </button>
                    </td>
                    <td className={styles.countCell}>
                      <button
                        className={styles.countLink}
                        onClick={(e) => { e.stopPropagation(); handleFundClick(row.scopeId); navigate('/deals'); }}
                        type="button"
                      >
                        {row.dealCount}
                      </button>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionCell}>
                        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); startEditFund(row.id); }} type="button" title="Edit fund">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                          </svg>
                        </button>
                        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleDeleteFund(row.id); }} type="button" title="Delete fund">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                          </svg>
                        </button>
                        <button className={styles.actionBtn} onClick={(e) => { e.stopPropagation(); handleFundComment(row.id); }} type="button" title="View comments">
                          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M2 2h12v9H5l-3 3V2z" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr className={styles.expandedRow}>
                      <td colSpan={6} style={{ padding: 0 }}>
                        <div className={styles.expandedContent}>
                          {row.entities.map((ent) => (
                            <div key={ent.id} className={styles.entityItem}>
                              <button
                                className={styles.entityLink}
                                onClick={() => navigate(`/entities/${ent.id}`)}
                                type="button"
                              >
                                {ent.name}
                              </button>
                              <span className={`${styles.categoryBadge} ${styles[`category${ent.category.replace(/[\s-]/g, '')}`]}`}>
                                {ent.category}
                              </span>
                              <span className={`${styles.statusDot} ${ent.status === 'Active' ? styles.statusActive : ent.status === 'Pending Review' ? styles.statusPending : styles.statusInactive}`} />
                              <span className={styles.entityStatus}>{ent.status}</span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>

        {scopeSelection.fundIds.length === 1 && (
          <p className={styles.scopeConfirmation}>
            Scope set to <strong>{rows.find((r) => r.scopeId === scopeSelection.fundIds[0])?.fund ?? scopeSelection.fundIds[0]}</strong> — all views are now filtered to this fund.
          </p>
        )}

        {/* Fund Family management */}
        <div className={styles.familySection}>
          <h3 className={styles.sectionTitle}>Manage Fund Families</h3>
          <div className={styles.familyList}>
            {families.map((ff) => (
              <div key={ff.id} className={styles.familyListItem}>
                <div className={styles.familyInfo}>
                  <h4>{ff.name}</h4>
                  {ff.shortName && <p>{ff.shortName}</p>}
                  <p>{ff.description}</p>
                </div>
                <div className={styles.actionCell}>
                  <button className={styles.actionBtn} onClick={() => startEditFamily(ff.id)} type="button" title="Edit family">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M11.5 1.5l3 3L5 14H2v-3L11.5 1.5z" />
                    </svg>
                  </button>
                  <button className={styles.actionBtn} onClick={() => handleDeleteFamily(ff.id)} type="button" title="Delete family">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 4h12M5.5 4V2.5h5V4M6 7v5M10 7v5M3.5 4l.5 10h8l.5-10" />
                    </svg>
                  </button>
                  <button className={styles.actionBtn} onClick={() => handleFamilyComment(ff.id)} type="button" title="View comments">
                    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 2h12v9H5l-3 3V2z" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {commentTargetId && (() => {
        if (commentTargetType === 'fund') {
          const fund = funds.find((f) => f.id === commentTargetId);
          if (!fund) return null;
          return (
            <RecordCommentModal
              title={`Comments — ${fund.name}`}
              comments={fund.comments}
              onAddComment={(comment) => fundsService.addFundComment(commentTargetId, comment)}
              onClose={() => setCommentTargetId(null)}
            />
          );
        } else {
          const family = families.find((ff) => ff.id === commentTargetId);
          if (!family) return null;
          return (
            <RecordCommentModal
              title={`Comments — ${family.name}`}
              comments={family.comments}
              onAddComment={(comment) => fundsService.addFundFamilyComment(commentTargetId, comment)}
              onClose={() => setCommentTargetId(null)}
            />
          );
        }
      })()}
    </div>
  );
}
