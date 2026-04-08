import type { ScopeSelection } from '../../../platform/context';
import { matchesScope } from '../../../platform/context';
import type { DocumentRecord } from '../types';

const DOCUMENT_RECORDS: DocumentRecord[] = [
  {
    id: 'k1-atlas-master-2026',
    title: 'K-1 Draft — Atlas Master Fund',
    fileName: 'K1_AtlasMasterFund_2025_Draft.pdf',
    documentType: 'PDF',
    status: 'In Review',
    category: 'K-1',
    entityName: 'Atlas Master Fund',
    entityId: 'atlas-master-fund',
    uploadedBy: 'Sarah Chen',
    uploadDate: '2026-03-10',
    taxYear: '2025',
    scopeIds: ['atlas-master-fund', 'tax-year-2026', 'tax-year-2025'],
    extractedFields: [
      { id: 'k1-f1', label: 'Partner Name', extractedValue: 'Atlas Master Fund LP', confirmedValue: null, status: 'pending', confidence: 0.98, overrideExplanation: null },
      { id: 'k1-f2', label: 'TIN', extractedValue: '98-7654321', confirmedValue: null, status: 'pending', confidence: 0.95, overrideExplanation: null },
      { id: 'k1-f3', label: 'Ordinary Business Income', extractedValue: '$2,450,000', confirmedValue: null, status: 'pending', confidence: 0.91, overrideExplanation: null },
      { id: 'k1-f4', label: 'Net Rental Income', extractedValue: '$180,000', confirmedValue: null, status: 'pending', confidence: 0.88, overrideExplanation: null },
      { id: 'k1-f5', label: 'Interest Income', extractedValue: '$67,500', confirmedValue: null, status: 'pending', confidence: 0.94, overrideExplanation: null },
      { id: 'k1-f6', label: 'Guaranteed Payments', extractedValue: '$350,000', confirmedValue: null, status: 'pending', confidence: 0.72, overrideExplanation: null },
      { id: 'k1-f7', label: 'Capital Account (Beginning)', extractedValue: '$12,800,000', confirmedValue: null, status: 'pending', confidence: 0.96, overrideExplanation: null },
      { id: 'k1-f8', label: 'Capital Account (Ending)', extractedValue: '$15,847,500', confirmedValue: null, status: 'pending', confidence: 0.85, overrideExplanation: null },
    ],
    linkedEntities: [
      { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity', linkedDate: '2026-03-10' },
    ],
    triggeredRules: [
      { ruleId: 'r1', ruleName: 'Partner TIN validation', description: 'Verify extracted TIN matches entity records. TIN format valid, cross-reference pending.', severity: 'warning', fieldId: 'k1-f2' },
      { ruleId: 'r2', ruleName: 'Capital account reconciliation', description: 'Beginning balance + allocations should equal ending balance. Difference of $2,500 detected.', severity: 'error', fieldId: 'k1-f8' },
    ],
    comments: [
      { id: 'c1', author: 'Sarah Chen', text: 'Draft received from fund admin. Needs review of guaranteed payments line — amount looks higher than expected.', timestamp: '2026-03-10 09:15', fieldId: null },
      { id: 'c2', author: 'David Kim', text: 'Confirmed with fund admin that guaranteed payments include Q4 catch-up. Amount is correct.', timestamp: '2026-03-11 14:30', fieldId: 'k1-f6' },
    ],
  },
  {
    id: 'w8ben-cayman-feeder',
    title: 'W-8BEN — Cayman Feeder LP',
    fileName: 'W8BEN_CaymanFeederLP_2025.pdf',
    documentType: 'PDF',
    status: 'Pending Review',
    category: 'W-8BEN',
    entityName: 'Atlas Blocker Lux',
    entityId: 'atlas-blocker-lux',
    uploadedBy: 'James Park',
    uploadDate: '2026-02-28',
    taxYear: '2025',
    scopeIds: ['atlas-blocker-lux', 'tax-year-2026', 'fed-state-compliance'],
    extractedFields: [
      { id: 'w8-f1', label: 'Beneficial Owner Name', extractedValue: 'Cayman Feeder LP', confirmedValue: null, status: 'pending', confidence: 0.97, overrideExplanation: null },
      { id: 'w8-f2', label: 'Country of Citizenship', extractedValue: 'Cayman Islands', confirmedValue: null, status: 'pending', confidence: 0.99, overrideExplanation: null },
      { id: 'w8-f3', label: 'Foreign TIN', extractedValue: 'CI-2025-88431', confirmedValue: null, status: 'pending', confidence: 0.82, overrideExplanation: null },
      { id: 'w8-f4', label: 'Treaty Country', extractedValue: 'N/A', confirmedValue: null, status: 'pending', confidence: 0.90, overrideExplanation: null },
      { id: 'w8-f5', label: 'Treaty Article', extractedValue: 'N/A', confirmedValue: null, status: 'pending', confidence: 0.90, overrideExplanation: null },
      { id: 'w8-f6', label: 'Withholding Rate', extractedValue: '30%', confirmedValue: null, status: 'pending', confidence: 0.93, overrideExplanation: null },
    ],
    linkedEntities: [
      { entityId: 'atlas-blocker-lux', entityName: 'Atlas Blocker Lux', entityType: 'Entity', linkedDate: '2026-02-28' },
    ],
    triggeredRules: [
      { ruleId: 'r3', ruleName: 'Treaty rate validation', description: 'No treaty benefit available for Cayman Islands entities. Default 30% withholding rate applies.', severity: 'info', fieldId: 'w8-f6' },
      { ruleId: 'r4', ruleName: 'FATCA status check', description: 'Cayman Feeder LP classified as Non-Participating FFI. Requires additional FATCA documentation.', severity: 'warning', fieldId: null },
    ],
    comments: [
      { id: 'c3', author: 'James Park', text: 'Received from investor relations. Need to verify FATCA classification before processing.', timestamp: '2026-02-28 11:00', fieldId: null },
    ],
  },
  {
    id: 'notice-ny-smith-re',
    title: 'NY DTF Notice — Smith Real Estate',
    fileName: 'NYS_DTF_Notice_SmithRE_2025.pdf',
    documentType: 'PDF',
    status: 'Flagged',
    category: 'Notice',
    entityName: 'Smith Real Estate LLC',
    entityId: 'smith-real-estate-llc',
    uploadedBy: 'David Kim',
    uploadDate: '2026-03-15',
    taxYear: '2024',
    scopeIds: ['atlas-master-fund', 'tax-year-2026', 'fed-state-compliance', 'tax-year-2024'],
    extractedFields: [
      { id: 'ny-f1', label: 'Notice Number', extractedValue: 'DTF-2026-0042871', confirmedValue: null, status: 'pending', confidence: 0.99, overrideExplanation: null },
      { id: 'ny-f2', label: 'Entity Name', extractedValue: 'Smith Real Estate LLC', confirmedValue: null, status: 'pending', confidence: 0.97, overrideExplanation: null },
      { id: 'ny-f3', label: 'Tax Period', extractedValue: '2024-01-01 to 2024-12-31', confirmedValue: null, status: 'pending', confidence: 0.95, overrideExplanation: null },
      { id: 'ny-f4', label: 'Amount Due', extractedValue: '$34,250.00', confirmedValue: null, status: 'pending', confidence: 0.88, overrideExplanation: null },
      { id: 'ny-f5', label: 'Due Date', extractedValue: '2026-04-30', confirmedValue: null, status: 'pending', confidence: 0.92, overrideExplanation: null },
      { id: 'ny-f6', label: 'Penalty Amount', extractedValue: '$1,712.50', confirmedValue: null, status: 'pending', confidence: 0.78, overrideExplanation: null },
    ],
    linkedEntities: [
      { entityId: 'smith-real-estate-llc', entityName: 'Smith Real Estate LLC', entityType: 'Entity', linkedDate: '2026-03-15' },
    ],
    triggeredRules: [
      { ruleId: 'r5', ruleName: 'Notice response deadline', description: 'Response due within 45 days of notice date. Deadline: 2026-04-30. 32 days remaining.', severity: 'warning', fieldId: 'ny-f5' },
      { ruleId: 'r6', ruleName: 'Penalty abatement eligibility', description: 'First-time penalty abatement may apply. Entity has clean compliance history for prior 3 years.', severity: 'info', fieldId: 'ny-f6' },
    ],
    comments: [
      { id: 'c4', author: 'David Kim', text: 'Flagged for immediate review — response deadline approaching. Need to verify amount due against our records.', timestamp: '2026-03-15 08:45', fieldId: null },
      { id: 'c5', author: 'Sarah Chen', text: 'Amount Due looks correct per our filing records. Penalty may be abatable — checking compliance history.', timestamp: '2026-03-16 10:20', fieldId: 'ny-f4' },
    ],
  },
  {
    id: 'allocation-schedule-2026',
    title: 'Investor Allocation Schedule',
    fileName: 'InvestorAllocation_AtlasMaster_2025.xlsx',
    documentType: 'Excel',
    status: 'Pending Review',
    category: 'Allocation',
    entityName: 'Atlas Master Fund',
    entityId: 'atlas-master-fund',
    uploadedBy: 'Fund Operations',
    uploadDate: '2026-03-08',
    taxYear: '2025',
    scopeIds: ['atlas-master-fund', 'tax-year-2026', 'tax-year-2025'],
    extractedFields: [
      { id: 'alloc-f1', label: 'Total Partners', extractedValue: '47', confirmedValue: null, status: 'pending', confidence: 0.99, overrideExplanation: null },
      { id: 'alloc-f2', label: 'Total Allocation %', extractedValue: '99.97%', confirmedValue: null, status: 'pending', confidence: 0.95, overrideExplanation: null },
      { id: 'alloc-f3', label: 'Net Income', extractedValue: '$18,450,000', confirmedValue: null, status: 'pending', confidence: 0.93, overrideExplanation: null },
      { id: 'alloc-f4', label: 'Tax-Exempt Income', extractedValue: '$1,230,000', confirmedValue: null, status: 'pending', confidence: 0.89, overrideExplanation: null },
      { id: 'alloc-f5', label: 'Foreign Tax Credit', extractedValue: '$287,500', confirmedValue: null, status: 'pending', confidence: 0.91, overrideExplanation: null },
    ],
    linkedEntities: [
      { entityId: 'atlas-master-fund', entityName: 'Atlas Master Fund', entityType: 'Entity', linkedDate: '2026-03-08' },
    ],
    triggeredRules: [
      { ruleId: 'r7', ruleName: 'Allocation % reconciliation', description: 'Total allocation must equal 100%. Current total: 99.97%. Rounding difference of 0.03% detected.', severity: 'warning', fieldId: 'alloc-f2' },
    ],
    comments: [],
  },
];

export const documentsService = {
  getAllDocuments(): DocumentRecord[] {
    return DOCUMENT_RECORDS;
  },

  getScopedDocuments(selection: ScopeSelection): DocumentRecord[] {
    return DOCUMENT_RECORDS.filter((doc) => matchesScope(doc.scopeIds, selection));
  },

  getDocumentById(id: string): DocumentRecord | undefined {
    return DOCUMENT_RECORDS.find((doc) => doc.id === id);
  },
};
