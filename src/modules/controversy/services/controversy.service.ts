import type { ScopeSelection } from '../../../platform/context';
import { matchesScope } from '../../../platform/context';
import type { ControversyRecord } from '../types';

const CONTROVERSY_RECORDS: ControversyRecord[] = [
  {
    id: 'irs-cp2000-atlas',
    name: 'IRS CP2000 — Atlas Master Fund',
    category: 'Notice',
    status: 'Pending Response',
    priority: 'High',
    issuingAuthority: 'IRS — Automated Underreporter',
    noticeDate: '2026-02-10',
    responseDeadline: '2026-04-11',
    assignedTeam: 'Fund Tax',
    assignedTo: 'Sarah Chen',
    scopeIds: ['bip-i', 'tax-year-2026', 'tax-year-2024'],
    summary:
      'Proposed adjustment to Schedule K-1 reporting for TY 2024. IRS asserts underreported interest income of $1.2M based on third-party 1099 matching.',
    amountAtIssue: '$1,200,000',
    taxYearsAffected: ['2024'],
    issueType: 'Income underreporting — interest',
    statuteOfLimitations: '2028-04-15',
    linkedEntities: [
      { id: 'atlas-master-fund', label: 'Atlas Master Fund', module: 'entities' },
    ],
    linkedInvestors: [
      { id: 'northlight-pension', label: 'Northlight Pension Trust', module: 'investors' },
    ],
    documentCount: 6,
    openQuestions: 2,
    lastActivityDate: '2026-03-20',
    notes:
      'Mismatch likely due to timing difference on accrued interest. Supporting workpapers have been prepared; response letter is in draft.',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Master Fund',
      parentContextLabel: 'Federal notice — underreporter program',
    },
    activityLog: [
      { date: '2026-03-20', action: 'Response letter draft completed', actor: 'Sarah Chen' },
      { date: '2026-03-15', action: 'Supporting workpapers compiled', actor: 'James Park' },
      { date: '2026-03-05', action: 'Notice reviewed and classified', actor: 'Sarah Chen' },
      { date: '2026-02-12', action: 'Notice received and logged', actor: 'System' },
    ],
  },
  {
    id: 'ny-dtf-audit-smith',
    name: 'NY DTF Audit — Smith Real Estate LLC',
    category: 'Audit',
    status: 'In Progress',
    priority: 'Critical',
    issuingAuthority: 'New York Department of Taxation and Finance',
    noticeDate: '2025-11-15',
    responseDeadline: '2026-05-15',
    assignedTeam: 'Tax Operations',
    assignedTo: 'David Kim',
    scopeIds: ['bip-i', 'fed-state-compliance', 'tax-year-2026', 'tax-year-2024'],
    summary:
      'Full scope audit of NY source income and apportionment for TY 2023–2024. Examiner has requested property schedules, rent rolls, and allocation methodologies.',
    amountAtIssue: '$3,400,000',
    taxYearsAffected: ['2023', '2024'],
    issueType: 'Apportionment and sourcing — real property income',
    statuteOfLimitations: '2027-10-15',
    linkedEntities: [
      { id: 'smith-real-estate-llc', label: 'Smith Real Estate LLC', module: 'entities' },
      { id: 'drip-ventures-inc', label: 'Drip Ventures Inc', module: 'entities' },
    ],
    linkedInvestors: [],
    documentCount: 14,
    openQuestions: 4,
    lastActivityDate: '2026-03-18',
    notes:
      'Examiner has been cooperative but thorough. Second IDR received March 12. Focus on whether management fee income is properly sourced to NY.',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Domestic Holdings',
      parentContextLabel: 'State audit — full scope',
    },
    activityLog: [
      { date: '2026-03-18', action: 'IDR #2 response submitted', actor: 'David Kim' },
      { date: '2026-03-12', action: 'IDR #2 received from examiner', actor: 'System' },
      { date: '2026-02-20', action: 'IDR #1 response submitted with supporting docs', actor: 'David Kim' },
      { date: '2026-01-15', action: 'Opening conference with NY DTF examiner', actor: 'David Kim' },
      { date: '2025-11-18', action: 'Audit engagement letter received', actor: 'System' },
    ],
  },
  {
    id: 'ca-ftb-exam-drip',
    name: 'CA FTB Exam — Drip Ventures Inc',
    category: 'Exam',
    status: 'Open',
    priority: 'Medium',
    issuingAuthority: 'California Franchise Tax Board',
    noticeDate: '2026-01-22',
    responseDeadline: '2026-04-22',
    assignedTeam: 'Portfolio Reporting',
    assignedTo: 'Maria Lopez',
    scopeIds: ['fed-state-compliance', 'tax-year-2026', 'bip-i', 'tax-year-2024'],
    summary:
      'Limited scope exam focused on R&D credit claimed on 2024 CA return. FTB requests documentation of qualified research activities and expenditures.',
    amountAtIssue: '$450,000',
    taxYearsAffected: ['2024'],
    issueType: 'R&D credit substantiation',
    statuteOfLimitations: '2028-04-15',
    linkedEntities: [
      { id: 'drip-ventures-inc', label: 'Drip Ventures Inc', module: 'entities' },
    ],
    linkedInvestors: [],
    documentCount: 5,
    openQuestions: 3,
    lastActivityDate: '2026-03-14',
    notes:
      'Need to compile contemporaneous documentation of R&D activities. Engineering team has been contacted for project logs.',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Domestic Holdings',
      parentContextLabel: 'State exam — limited scope',
    },
    activityLog: [
      { date: '2026-03-14', action: 'Engineering project logs requested', actor: 'Maria Lopez' },
      { date: '2026-03-01', action: 'R&D credit workpapers pulled from prior year', actor: 'James Park' },
      { date: '2026-02-05', action: 'Exam scope reviewed with counsel', actor: 'Maria Lopez' },
      { date: '2026-01-24', action: 'Exam notice received and logged', actor: 'System' },
    ],
  },
  {
    id: 'lux-transfer-pricing',
    name: 'Luxembourg Transfer Pricing Review — Atlas Blocker Lux',
    category: 'Audit',
    status: 'Pending Response',
    priority: 'High',
    issuingAuthority: 'Administration des Contributions Directes — Luxembourg',
    noticeDate: '2025-12-05',
    responseDeadline: '2026-06-05',
    assignedTeam: 'International Tax',
    assignedTo: 'Sarah Chen',
    scopeIds: ['bx-infra-i', 'tax-year-2026'],
    summary:
      'Transfer pricing review of management fees and intercompany loan arrangements between Atlas Blocker Lux and Atlas Master Fund for TY 2023.',
    amountAtIssue: '$2,100,000',
    taxYearsAffected: ['2023'],
    issueType: 'Transfer pricing — management fees and intercompany loans',
    statuteOfLimitations: '2028-12-31',
    linkedEntities: [
      { id: 'atlas-blocker-lux', label: 'Atlas Blocker Lux', module: 'entities' },
      { id: 'atlas-master-fund', label: 'Atlas Master Fund', module: 'entities' },
    ],
    linkedInvestors: [
      { id: 'blue-harbor-feeder', label: 'Blue Harbor Feeder SPC', module: 'investors' },
    ],
    documentCount: 9,
    openQuestions: 3,
    lastActivityDate: '2026-03-16',
    notes:
      'Luxembourg authorities have requested the TP documentation file and benchmarking study. Local counsel engaged to prepare formal response.',
    context: {
      fundFamilyLabel: 'Atlas Opportunistic Platform',
      fundLabel: 'Atlas Lux Blocker Sleeve',
      parentContextLabel: 'International review — transfer pricing',
    },
    activityLog: [
      { date: '2026-03-16', action: 'Benchmarking study draft received from advisors', actor: 'Sarah Chen' },
      { date: '2026-03-02', action: 'TP documentation file compiled', actor: 'James Park' },
      { date: '2026-02-10', action: 'Local counsel engaged for Luxembourg response', actor: 'Sarah Chen' },
      { date: '2025-12-08', action: 'Review notice received and translated', actor: 'System' },
    ],
  },
];

export const controversyService = {
  getScopedControversies(selection: ScopeSelection): ControversyRecord[] {
    return CONTROVERSY_RECORDS.filter((record) => matchesScope(record.scopeIds, selection));
  },

  getAccessibleControversyById(id: string): ControversyRecord | undefined {
    return CONTROVERSY_RECORDS.find((record) => record.id === id);
  },
};
