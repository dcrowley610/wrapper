export type MatchTier = 'auto_match' | 'suggested' | 'review_required' | 'likely_new';
export type CandidateStatus = 'pending' | 'accepted' | 'rejected';

export type ScoreComponent = {
  factor: string;
  weight: number;
  rawScore: number;
  weightedScore: number;
  explanation: string;
};

export type MatchCandidate = {
  id: string;
  sourceRecordId: string;
  candidateMasterId: string;
  compositeScore: number;
  tier: MatchTier;
  scoreComponents: ScoreComponent[];
  aiScore: number | null;
  aiExplanation: string | null;
  status: CandidateStatus;
};

export type AiRecommendation = {
  candidateMasterId: string;
  score: number;
  explanation: string;
};
