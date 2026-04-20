import type {
  MasterDomain,
  SourceObjectRecord,
  MasterRecord,
  MatchCandidate,
  ReconciliationTask,
  SourceSystem,
  AiRecommendation,
} from '../types';
import { normalize } from '../normalization';
import { generateCandidates, scoreCandidates, mockAiAdapter, resolvePolicy } from '../matching';
import type { ResolutionDecision, ScoredCandidate } from '../matching';
import { identityService } from './identity.service';
import { reconciliationService } from './reconciliation.service';

export type IngestResult = {
  autoMatched: number;
  tasksCreated: number;
  newMastersCreated: number;
  results: {
    sourceRecordId: string;
    action: 'auto_matched' | 'task_created' | 'new_master_created';
    masterId: string | null;
  }[];
};

function hasHardConflict(candidate: ScoredCandidate | undefined): boolean {
  if (!candidate) return false;
  return candidate.scoreComponents.some(
    (component) => component.factor === 'conflicting_ein' && component.weightedScore <= -100,
  );
}

function shouldInvokeAi(
  scored: ScoredCandidate[],
  decision: ResolutionDecision,
): { invoke: boolean; reason: string } {
  if (scored.length === 0) {
    return { invoke: false, reason: 'no_candidates' };
  }

  const top = scored[0];
  const second = scored.length > 1 ? scored[1] : null;
  const gap = second ? top.compositeScore - second.compositeScore : Number.POSITIVE_INFINITY;

  if (hasHardConflict(top)) {
    return { invoke: false, reason: 'hard_conflict' };
  }

  if (decision.action === 'auto_match') {
    return { invoke: false, reason: 'deterministic_auto_match' };
  }

  if (top.compositeScore < 70) {
    return { invoke: false, reason: 'likely_new_low_score' };
  }

  if (second && top.compositeScore >= 85 && gap >= 10) {
    return { invoke: false, reason: 'clear_deterministic_winner' };
  }

  if (!second && top.compositeScore >= 85) {
    return { invoke: false, reason: 'single_candidate_high_confidence' };
  }

  if (
    top.compositeScore >= 70 &&
    top.compositeScore < 95 &&
    (
      scored.length >= 2 ||
      decision.tier === 'review_required'
    )
  ) {
    return { invoke: true, reason: 'ambiguous_mid_band' };
  }

  return { invoke: false, reason: 'default_skip' };
}

export const identityOrchestrator = {
  /**
   * Ingest raw records, normalize, match, and resolve.
   * Returns summary of what happened.
   */
  ingestAndResolve(
    records: { rawName: string; rawAttributes: Record<string, string>; scopeIds?: string[] }[],
    domain: MasterDomain,
    sourceSystem: SourceSystem,
    sourceFileName: string,
    ingestedBy: string,
  ): IngestResult {
    const result: IngestResult = { autoMatched: 0, tasksCreated: 0, newMastersCreated: 0, results: [] };
    const now = new Date().toISOString();

    for (let i = 0; i < records.length; i++) {
      const record = records[i];
      const normResult = normalize(record.rawName);
      const scopeIds = record.scopeIds || [];

      // Create source record
      const sourceId = identityService.nextId('src');
      const sourceRecord: SourceObjectRecord = {
        id: sourceId,
        domain,
        sourceSystem,
        sourceFileName,
        sourceRowIndex: i,
        rawName: record.rawName,
        rawAttributes: record.rawAttributes,
        normalizedResult: normResult,
        status: 'pending',
        ingestedDate: now.slice(0, 10),
        ingestedBy,
      };
      identityService.addSourceRecord(sourceRecord);

      // Generate candidates
      const masters = identityService.getAllMasters(domain);
      const aliases = identityService.getAllAliases(domain);
      const blockingCandidates = generateCandidates(normResult, record.rawAttributes, masters, aliases);

      if (blockingCandidates.length === 0) {
        // No candidates at all → likely new, create task
        const taskId = reconciliationService.nextTaskId();
        const task: ReconciliationTask = {
          id: taskId,
          sourceRecordId: sourceId,
          domain,
          status: 'open',
          priority: 'low',
          candidateCount: 0,
          topCandidateScore: 0,
          topCandidateTier: 'likely_new',
          resolvedDate: '',
          resolvedBy: '',
          resolutionAction: '',
          resolutionMasterId: '',
          createdDate: now.slice(0, 10),
        };
        reconciliationService.addTask(task);
        reconciliationService.addHistory({
          id: reconciliationService.nextHistoryId(),
          taskId,
          actionType: 'task_created',
          actor: 'System',
          timestamp: now,
          metadata: { rawName: record.rawName, sourceFileName },
          description: `Task created: no matching candidates found for "${record.rawName}"`,
        });
        identityService.updateSourceRecord(sourceId, { status: 'pending' });
        result.tasksCreated++;
        result.results.push({ sourceRecordId: sourceId, action: 'task_created', masterId: null });
        continue;
      }

      // Score candidates
      const scored = scoreCandidates(normResult, record.rawAttributes, scopeIds, blockingCandidates, masters, aliases);
      const decision = resolvePolicy(scored);
      const aiGate = shouldInvokeAi(scored, decision);

      // AI adapter (mock), only invoked for ambiguous middle-band cases.
      let aiRecs: AiRecommendation[] = [];
      if (aiGate.invoke) {
        const masterNames = new Map(masters.map((m) => [m.id, m.canonicalName]));
        aiRecs = mockAiAdapter.recommend(record.rawName, scored, masterNames);
      }

      // Create match candidates
      for (const sc of scored) {
        const aiRec = aiRecs.find((a) => a.candidateMasterId === sc.masterId);
        const candidate: MatchCandidate = {
          id: reconciliationService.nextCandidateId(),
          sourceRecordId: sourceId,
          candidateMasterId: sc.masterId,
          compositeScore: sc.compositeScore,
          tier: decision.tier,
          scoreComponents: sc.scoreComponents,
          aiScore: aiRec?.score ?? null,
          aiExplanation: aiRec?.explanation ?? null,
          status: 'pending',
        };
        reconciliationService.addCandidate(candidate);
      }

      if (decision.action === 'auto_match' && decision.selectedMasterId) {
        // Auto-match: create xwalk + alias
        const masterId = decision.selectedMasterId;
        identityService.addXwalk({
          id: identityService.nextId('xw'),
          sourceRecordId: sourceId,
          masterId,
          domain,
          status: 'approved',
          approvedDate: now.slice(0, 10),
          approvedBy: 'System (auto-match)',
          expiredDate: '',
          createdDate: now.slice(0, 10),
        });
        identityService.addAlias({
          id: identityService.nextId('alias'),
          masterId,
          domain,
          aliasName: record.rawName,
          normalizedAliasName: normResult.normalizedNameFull,
          source: `auto-match from ${sourceSystem}`,
          createdDate: now.slice(0, 10),
          createdBy: 'System',
          isActive: true,
        });
        identityService.updateSourceRecord(sourceId, { status: 'matched' });
        result.autoMatched++;
        result.results.push({ sourceRecordId: sourceId, action: 'auto_matched', masterId });
      } else {
        // Create review task
        const taskId = reconciliationService.nextTaskId();
        const task: ReconciliationTask = {
          id: taskId,
          sourceRecordId: sourceId,
          domain,
          status: 'open',
          priority: decision.priority,
          candidateCount: scored.length,
          topCandidateScore: scored[0]?.compositeScore || 0,
          topCandidateTier: decision.tier,
          resolvedDate: '',
          resolvedBy: '',
          resolutionAction: '',
          resolutionMasterId: '',
          createdDate: now.slice(0, 10),
        };
        reconciliationService.addTask(task);
        reconciliationService.addHistory({
          id: reconciliationService.nextHistoryId(),
          taskId,
          actionType: 'task_created',
          actor: 'System',
          timestamp: now,
          metadata: {
            rawName: record.rawName,
            topScore: String(scored[0]?.compositeScore || 0),
            aiInvoked: String(aiGate.invoke),
            aiGateReason: aiGate.reason,
          },
          description: `Task created for "${record.rawName}" — top score ${scored[0]?.compositeScore || 0} (${decision.tier})`,
        });
        result.tasksCreated++;
        result.results.push({ sourceRecordId: sourceId, action: 'task_created', masterId: null });
      }
    }

    return result;
  },

  /**
   * Confirm a match: accept candidate, create xwalk + alias, resolve task, update source record.
   */
  confirmMatch(taskId: string, candidateId: string, actor: string): void {
    const task = reconciliationService.getTaskById(taskId);
    if (!task) return;
    const candidates = reconciliationService.getCandidatesForTask(taskId);
    const candidate = candidates.find((c) => c.id === candidateId);
    if (!candidate) return;
    const source = identityService.getSourceRecordById(task.sourceRecordId);
    if (!source) return;

    const now = new Date().toISOString();

    // Accept candidate
    reconciliationService.updateCandidate(candidateId, { status: 'accepted' });

    // Reject others
    for (const c of candidates) {
      if (c.id !== candidateId) {
        reconciliationService.updateCandidate(c.id, { status: 'rejected' });
      }
    }

    // Create xwalk
    identityService.addXwalk({
      id: identityService.nextId('xw'),
      sourceRecordId: source.id,
      masterId: candidate.candidateMasterId,
      domain: task.domain,
      status: 'approved',
      approvedDate: now.slice(0, 10),
      approvedBy: actor,
      expiredDate: '',
      createdDate: now.slice(0, 10),
    });

    // Add alias
    identityService.addAlias({
      id: identityService.nextId('alias'),
      masterId: candidate.candidateMasterId,
      domain: task.domain,
      aliasName: source.rawName,
      normalizedAliasName: source.normalizedResult?.normalizedNameFull || '',
      source: `confirmed by ${actor}`,
      createdDate: now.slice(0, 10),
      createdBy: actor,
      isActive: true,
    });

    // Update source record
    identityService.updateSourceRecord(source.id, { status: 'matched' });

    // Resolve task
    reconciliationService.updateTask(taskId, {
      status: 'resolved',
      resolvedDate: now.slice(0, 10),
      resolvedBy: actor,
      resolutionAction: 'confirmed_match',
      resolutionMasterId: candidate.candidateMasterId,
    });

    // History
    reconciliationService.addHistory({
      id: reconciliationService.nextHistoryId(),
      taskId,
      actionType: 'candidate_accepted',
      actor,
      timestamp: now,
      metadata: { candidateMasterId: candidate.candidateMasterId, score: String(candidate.compositeScore) },
      description: `Confirmed match to "${identityService.getMasterById(candidate.candidateMasterId)?.canonicalName}" (score ${candidate.compositeScore})`,
    });
  },

  /**
   * Create a new master from a source record.
   */
  createNewMaster(taskId: string, actor: string): string | null {
    const task = reconciliationService.getTaskById(taskId);
    if (!task) return null;
    const source = identityService.getSourceRecordById(task.sourceRecordId);
    if (!source) return null;

    const now = new Date().toISOString();
    const normResult = source.normalizedResult || normalize(source.rawName);
    const attrs = source.rawAttributes;

    let master: MasterRecord;
    const base = {
      status: 'active' as const,
      canonicalName: source.rawName,
      normalizedName: normResult.normalizedNameFull,
      createdDate: now.slice(0, 10),
      createdBy: actor,
      lastModifiedDate: now.slice(0, 10),
      lastModifiedBy: actor,
      scopeIds: [] as string[],
    };

    if (task.domain === 'entity') {
      master = {
        id: identityService.nextId('me'),
        domain: 'entity',
        ...base,
        legalName: attrs['legalName'] || source.rawName,
        jurisdiction: attrs['jurisdiction'] || '',
        ein: attrs['ein'] || '',
        category: attrs['category'] || '',
        taxClassification: attrs['taxClassification'] || '',
      };
    } else if (task.domain === 'investor') {
      master = {
        id: identityService.nextId('mi'),
        domain: 'investor',
        ...base,
        legalName: attrs['legalName'] || source.rawName,
        investorClass: attrs['investorClass'] || '',
        domicile: attrs['domicile'] || '',
        taxIdType: attrs['taxIdType'] || '',
        taxIdLast4: attrs['taxIdLast4'] || '',
      };
    } else {
      master = {
        id: identityService.nextId('md'),
        domain: 'deal',
        ...base,
        investmentType: attrs['investmentType'] || '',
        sector: attrs['sector'] || '',
        geographicFocus: attrs['geographicFocus'] || '',
        closingDate: attrs['closingDate'] || '',
      };
    }

    identityService.addMaster(master);

    // Xwalk
    identityService.addXwalk({
      id: identityService.nextId('xw'),
      sourceRecordId: source.id,
      masterId: master.id,
      domain: task.domain,
      status: 'approved',
      approvedDate: now.slice(0, 10),
      approvedBy: actor,
      expiredDate: '',
      createdDate: now.slice(0, 10),
    });

    // Alias
    identityService.addAlias({
      id: identityService.nextId('alias'),
      masterId: master.id,
      domain: task.domain,
      aliasName: source.rawName,
      normalizedAliasName: normResult.normalizedNameFull,
      source: `new master created by ${actor}`,
      createdDate: now.slice(0, 10),
      createdBy: actor,
      isActive: true,
    });

    // Update source
    identityService.updateSourceRecord(source.id, { status: 'new_master_created' });

    // Reject all candidates
    const candidates = reconciliationService.getCandidatesForTask(taskId);
    for (const c of candidates) {
      reconciliationService.updateCandidate(c.id, { status: 'rejected' });
    }

    // Resolve task
    reconciliationService.updateTask(taskId, {
      status: 'resolved',
      resolvedDate: now.slice(0, 10),
      resolvedBy: actor,
      resolutionAction: 'new_master_created',
      resolutionMasterId: master.id,
    });

    // History
    reconciliationService.addHistory({
      id: reconciliationService.nextHistoryId(),
      taskId,
      actionType: 'new_master_created',
      actor,
      timestamp: now,
      metadata: { newMasterId: master.id, rawName: source.rawName },
      description: `Created new master record "${source.rawName}" (${master.id})`,
    });

    return master.id;
  },

  /**
   * Reject a specific candidate.
   */
  rejectCandidate(taskId: string, candidateId: string, actor: string): void {
    const task = reconciliationService.getTaskById(taskId);
    if (!task) return;

    reconciliationService.updateCandidate(candidateId, { status: 'rejected' });

    const candidates = reconciliationService.getCandidatesForTask(taskId);
    const remaining = candidates.filter((c) => c.status === 'pending' && c.id !== candidateId);

    reconciliationService.addHistory({
      id: reconciliationService.nextHistoryId(),
      taskId,
      actionType: 'candidate_rejected',
      actor,
      timestamp: new Date().toISOString(),
      metadata: { candidateId },
      description: `Rejected candidate match. ${remaining.length} candidate(s) remaining.`,
    });

    // Update task counts
    reconciliationService.updateTask(taskId, {
      candidateCount: remaining.length,
      topCandidateScore: remaining[0]?.compositeScore || 0,
    });
  },

  /**
   * Defer a task with a reason.
   */
  deferTask(taskId: string, actor: string, reason: string): void {
    reconciliationService.updateTask(taskId, { status: 'deferred' });
    reconciliationService.addHistory({
      id: reconciliationService.nextHistoryId(),
      taskId,
      actionType: 'task_deferred',
      actor,
      timestamp: new Date().toISOString(),
      metadata: { reason },
      description: `Task deferred: ${reason}`,
    });
  },
};
