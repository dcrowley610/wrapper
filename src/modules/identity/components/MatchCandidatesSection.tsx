import { useState } from 'react';
import type { MatchCandidate, MasterRecord } from '../types';
import { ScoreBreakdownCard } from './ScoreBreakdownCard';
import styles from '../IdentityModule.module.css';

type MatchCandidatesSectionProps = {
  candidates: MatchCandidate[];
  masters: Map<string, MasterRecord>;
  onSelectCandidate: (candidateId: string) => void;
  selectedCandidateId: string | null;
};

function scoreClass(score: number): string {
  if (score >= 85) return styles.scoreHigh;
  if (score >= 70) return styles.scoreMedium;
  return styles.scoreLow;
}

function tierBadgeClass(tier: string): string {
  if (tier === 'auto_match') return styles.badgeAutoMatch;
  if (tier === 'suggested') return styles.badgeSuggested;
  if (tier === 'review_required') return styles.badgeReview;
  return styles.badgeLikelyNew;
}

export function MatchCandidatesSection({
  candidates,
  masters,
  onSelectCandidate,
  selectedCandidateId,
}: MatchCandidatesSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const pendingCandidates = candidates.filter((c) => c.status === 'pending');
  const rejectedCandidates = candidates.filter((c) => c.status === 'rejected');

  if (candidates.length === 0) {
    return (
      <div className={styles.sourceCard}>
        <h3 className={styles.sectionTitle}>Match Candidates</h3>
        <p className={styles.sectionCopy}>No candidates found. Consider creating a new master record.</p>
      </div>
    );
  }

  function renderCandidate(candidate: MatchCandidate) {
    const master = masters.get(candidate.candidateMasterId);
    const isExpanded = expandedId === candidate.id;
    const isSelected = selectedCandidateId === candidate.id;

    return (
      <div
        key={candidate.id}
        className={styles.candidateCard}
        style={isSelected ? { borderColor: '#1678a2', boxShadow: '0 0 0 2px rgba(22, 120, 162, 0.15)' } : undefined}
      >
        <div className={styles.candidateHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <button
              type="button"
              className={styles.btnSecondary}
              onClick={() => onSelectCandidate(candidate.id)}
              style={{ padding: '3px 8px', fontSize: 10 }}
            >
              {isSelected ? 'Selected' : 'Select'}
            </button>
            <p className={styles.candidateName}>{master?.canonicalName || candidate.candidateMasterId}</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span className={`${styles.scoreChip} ${scoreClass(candidate.compositeScore)}`}>
              {candidate.compositeScore}
            </span>
            <span className={`${styles.badge} ${tierBadgeClass(candidate.tier)}`}>
              {candidate.tier.replace(/_/g, ' ')}
            </span>
            {candidate.status === 'rejected' && (
              <span className={`${styles.badge} ${styles.badgeHigh}`}>rejected</span>
            )}
          </div>
        </div>

        {master && (
          <p style={{ color: '#6a7f90', fontSize: 11, margin: '4px 0 0' }}>
            {master.domain} &middot; {master.normalizedName}
          </p>
        )}

        <button
          className={styles.traceToggle}
          onClick={() => setExpandedId(isExpanded ? null : candidate.id)}
          type="button"
        >
          {isExpanded ? 'Hide' : 'Show'} score breakdown
        </button>

        {isExpanded && (
          <>
            <ScoreBreakdownCard
              components={candidate.scoreComponents}
              compositeScore={candidate.compositeScore}
            />
            {candidate.aiScore !== null && (
              <div className={styles.aiSection}>
                <p className={styles.aiLabel}>AI Analysis (score: {candidate.aiScore})</p>
                <p style={{ margin: 0 }}>{candidate.aiExplanation}</p>
              </div>
            )}
          </>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className={styles.sectionTitle}>
        Match Candidates ({pendingCandidates.length} pending{rejectedCandidates.length > 0 ? `, ${rejectedCandidates.length} rejected` : ''})
      </h3>
      {pendingCandidates.map(renderCandidate)}
      {rejectedCandidates.length > 0 && (
        <>
          <p className={styles.fieldLabel} style={{ marginTop: 12 }}>Rejected</p>
          {rejectedCandidates.map(renderCandidate)}
        </>
      )}
    </div>
  );
}
