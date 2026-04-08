import type { DeliverableTemplate, DeliverableInstance } from '../types';

const TEMPLATE_RECORDS: DeliverableTemplate[] = [
  // RT-006: Obtain Schedule K-1s — Blackstone package
  { id: 'DT-001', processId: 'RT-006', parentId: null, kind: 'section', title: 'Blackstone package', order: 1 },
  { id: 'DT-002', processId: 'RT-006', parentId: 'DT-001', kind: 'line-item', title: 'K-1 received', order: 1 },
  { id: 'DT-003', processId: 'RT-006', parentId: 'DT-001', kind: 'line-item', title: 'Reviewed', order: 2 },
  { id: 'DT-004', processId: 'RT-006', parentId: 'DT-001', kind: 'line-item', title: 'Follow-up questions', order: 3 },
  { id: 'DT-005', processId: 'RT-006', parentId: 'DT-001', kind: 'line-item', title: 'Final loaded to workpapers', order: 4 },
  // RT-006: Obtain Schedule K-1s — Apollo package
  { id: 'DT-006', processId: 'RT-006', parentId: null, kind: 'section', title: 'Apollo package', order: 2 },
  { id: 'DT-007', processId: 'RT-006', parentId: 'DT-006', kind: 'line-item', title: 'K-1 received', order: 1 },
  { id: 'DT-008', processId: 'RT-006', parentId: 'DT-006', kind: 'line-item', title: 'Reviewed', order: 2 },
  { id: 'DT-009', processId: 'RT-006', parentId: 'DT-006', kind: 'line-item', title: 'Follow-up questions', order: 3 },
  { id: 'DT-010', processId: 'RT-006', parentId: 'DT-006', kind: 'line-item', title: 'Final loaded to workpapers', order: 4 },
];

let instanceCounter = 0;

export const deliverableTemplatesService = {
  getByProcessId(processId: string): DeliverableTemplate[] {
    return TEMPLATE_RECORDS.filter((t) => t.processId === processId);
  },

  getById(id: string): DeliverableTemplate | undefined {
    return TEMPLATE_RECORDS.find((t) => t.id === id);
  },

  getChildren(parentId: string): DeliverableTemplate[] {
    return TEMPLATE_RECORDS.filter((t) => t.parentId === parentId);
  },

  instantiateFromTemplates(processId: string): DeliverableInstance[] {
    const templates = TEMPLATE_RECORDS.filter((t) => t.processId === processId);
    if (templates.length === 0) return [];

    // Build ID mapping: template ID -> new instance ID
    const idMap = new Map<string, string>();
    for (const tmpl of templates) {
      instanceCounter += 1;
      idMap.set(tmpl.id, `dlv-tmpl-${Date.now()}-${instanceCounter}`);
    }

    return templates.map((tmpl) => ({
      id: idMap.get(tmpl.id)!,
      templateId: tmpl.id,
      parentId: tmpl.parentId ? (idMap.get(tmpl.parentId) ?? null) : null,
      kind: tmpl.kind,
      title: tmpl.title,
      order: tmpl.order,
      dealName: '',
      entityName: '',
      status: 'not-started' as const,
      dueDate: null,
      notes: '',
      fileLink: '',
      comments: [],
    }));
  },
};
